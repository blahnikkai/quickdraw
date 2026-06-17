import { io, Socket } from "socket.io-client";
import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Game.css";
import explosionSound from '/assets/sounds/explosion.wav';
import goodSound from '/assets/sounds/good.wav';
import hurtSound from '/assets/sounds/hurt.wav';
import { getSocketIOOptions } from "../Home/Home.js";
import Players from "../PlayerInfo/PlayerInfo.js";
import Waiting from "../Waiting/Waiting.js";
import Playing from "../Playing/Playing.js";
import Nickname from "../Nickname/Nickname.js";
import Player from "../../shared/Player.js";
import GameStatus from "../../shared/GameStatus.js";
import Difficulty from "../../shared/Difficulty.js";
import Ready from "../Ready/Ready.js";
import Nav from "../Nav/Nav.js";
import Spectators from "../Spectators/Spectators.js";
import GuessStatus from "../../shared/GuessStatus.js";

export default function Game() {
    const navigate = useNavigate();
    const { gid } = useParams();
    const [roomExists, setRoomExists] = useState<boolean>(true);
    const [phrase, setPhrase] = useState("");
    const [roundActive, setRoundActive] = useState(false);

    const [selfPlayerInfo, setSelfPlayerInfo] = useState<Player | undefined>(undefined);
    const gameStatus = selfPlayerInfo?.gameStatus ?? GameStatus.NICKNAME;
    
    const [playerInfo, setPlayerInfo] = useState<Player[]>([]);
    const host = playerInfo.find((player) => player.host)
    
    const [guess, setGuess] = useState("");
    const [winner, setWinner] = useState<Player | undefined | null>(undefined);

    const [showingSettings, setShowingSettings] = useState(false);
    const [debugInfo, setDebugInfo] = useState("");

    const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.DYNAMIC);
    const [roundTime, setRoundTime] = useState(0);
    const [startingLives, setStartingLives] = useState(0);

    const socketRef = useRef<Socket>(undefined);
    const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined);
    const startTimeRef = useRef<number>(undefined);
    const endTimeRef = useRef<number>(undefined);
    const [timeProgress, setTimeProgress] = useState(0);

    const updateTimeProgress = () => {
        if (startTimeRef.current === undefined || endTimeRef.current === undefined) {
            return;
        }
        const curTime = Date.now();
        const timeProgress =
            (curTime - startTimeRef.current) /
            (endTimeRef.current - startTimeRef.current);
        setTimeProgress(timeProgress);
    };

    const submitName = (name: string) =>
        socketRef.current?.emit("submit name", gid, name);
    const readyUp = () =>
        socketRef.current?.emit("change game status", gid, GameStatus.READY);
    const spectate = () =>
        socketRef.current?.emit("change game status", gid, GameStatus.SPECTATING_WAITING);
    const unready = () =>
        socketRef.current?.emit("change game status", gid, GameStatus.WAITING);
    const startGame = () => socketRef.current?.emit("start game", gid);
    const submitGuess = () => {
        socketRef.current?.emit("submit guess", gid, guess.toLowerCase());
        setGuess("");
    }
    const updateSettings = (
        difficulty: Difficulty,
        roundTime: number,
        startingLives: number
    ) => {
        socketRef.current?.emit(
            "update settings",
            gid,
            difficulty,
            roundTime,
            startingLives
        );
    };

    useEffect(() => {
        socketRef.current = io(import.meta.env.VITE_BACKEND_URL, getSocketIOOptions());

        socketRef.current.emit("join", gid);

        socketRef.current.on("room joined", () => {
            setRoomExists(true);
        });
        socketRef.current.on("room dne", () => {
            setRoomExists(false);
        });

        const explosionAudio = new Audio(explosionSound);
        explosionAudio.volume = 0.2;
        socketRef.current.on("game ended", (winner: Player) => {
            explosionAudio.play();
            setWinner(winner);
        });

        socketRef.current.on(
            "start round",
            (newPhrase: string, start: number, end: number) => {
                setRoundActive(true);
                setGuess("");
                setPhrase(newPhrase);
                setTimeProgress(0);
                startTimeRef.current = start;
                endTimeRef.current = end;
                intervalRef.current = setInterval(updateTimeProgress, 300);
            }
        );

        socketRef.current.on("end round", () => {
            setRoundActive(false);
            clearInterval(intervalRef.current);
        });

        const goodAudio = new Audio(goodSound);
        goodAudio.volume = 0.5;
        const hurtAudio = new Audio(hurtSound);
        hurtAudio.volume = 0.5;
        socketRef.current.on(
            "update player info",
            (newPlayerInfo: Player[]) => {
                setPlayerInfo(newPlayerInfo);
                const newSelf = newPlayerInfo.find(
                    (player: Player) => player.socketId === socketRef.current?.id
                );
                if (newSelf === undefined) {
                    return;
                }
                setSelfPlayerInfo(newSelf);
                if (newSelf.lastGuessStatus === GuessStatus.VALID && selfPlayerInfo?.lastGuessStatus !== GuessStatus.VALID) {
                    goodAudio.play();
                }
                if (newSelf.dying && !selfPlayerInfo?.dying) {
                    hurtAudio.play();
                }
            }
        );

        socketRef.current.on("update phrase", (newPhrase: string) => {
            setPhrase(newPhrase);
        });

        socketRef.current.on("update debug info", (newDebugInfo: string) => {
            setDebugInfo(newDebugInfo);
        });

        socketRef.current.on(
            "broadcast settings change",
            (
                difficulty: Difficulty,
                roundTime: number,
                startingLives: number
            ) => {
                setDifficulty(difficulty);
                setRoundTime(roundTime);
                setStartingLives(startingLives);
            }
        );

        return () => {
            socketRef.current?.disconnect();
            clearInterval(intervalRef.current);
        };
    }, []);

    return (
        <div className="game-root">
            {roomExists &&
                <Nav
                    gameStatus={gameStatus}
                    showingSettings={showingSettings}
                    setShowingSettings={setShowingSettings}
                    difficulty={difficulty}
                    setDifficulty={setDifficulty}
                    roundTime={roundTime}
                    setRoundTime={setRoundTime}
                    startingLives={startingLives}
                    setStartingLives={setStartingLives}
                    updateSettings={updateSettings}
                    viewOnly={!(selfPlayerInfo?.host)}
                />
            }
            <main>
                {roomExists === undefined && <div>Loading</div>}

                {roomExists === false && (
                    <div className="room room-dne">
                        <div>Room {gid} does not exist.</div>
                        <button
                            className="go-home-btn"
                            onClick={() => {
                                navigate("/");
                            }}
                        >
                            Go to Homepage
                        </button>
                    </div>
                )}

                {roomExists === true && (
                    <div className="room room-exists">
                        {gameStatus !== GameStatus.NICKNAME &&
                            <>
                                <Players
                                    playerInfo={playerInfo}
                                    selfPlayerInfo={undefined}
                                />
                                <Spectators
                                    playerInfo={playerInfo}
                                />
                            </>
                        }

                        <div className="center-info">
                            {gameStatus === GameStatus.NICKNAME && (
                                <Nickname submitName={submitName} />
                            )}

                            {gameStatus === GameStatus.WAITING && (
                                <Waiting winner={winner} readyUp={readyUp} spectate={spectate} />
                            )}

                            {gameStatus === GameStatus.READY && (
                                <Ready
                                    startGame={startGame}
                                    hostName={
                                        host ? host.name : null
                                    }
                                    selfIsHost={selfPlayerInfo ? selfPlayerInfo.host : false}
                                    playerInfo={playerInfo}
                                    unready={unready}
                                />
                            )}

                            {gameStatus === GameStatus.SPECTATING_WAITING && (
                                <button onClick={() => unready()}>Join game</button>
                            )}

                            {(gameStatus === GameStatus.PLAYING ||
                                gameStatus === GameStatus.SPECTATING_PLAYING) && (
                                    <div>
                                        <div className="phrase-container">
                                            <div className="phrase">{phrase}</div>
                                            <div className="debug-info">{debugInfo}</div>
                                        </div>
                                        <div className="timer-container">
                                            <div
                                                className={(selfPlayerInfo?.lastGuessStatus === GuessStatus.VALID ? "valid-timer-bar" : "invalid-timer-bar") + " timer-bar"}
                                                style={{ width: `${100 * (1 - timeProgress)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                )}

                            {gameStatus === GameStatus.PLAYING && selfPlayerInfo && (
                                <Playing
                                    selfPlayerInfo={selfPlayerInfo}
                                    guess={guess}
                                    setGuess={setGuess}
                                    submitGuess={submitGuess}
                                    roundActive={roundActive}
                                />
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
