import { io, Socket } from "socket.io-client";
import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Game.css";
import { getSocketIOOptions } from "../Home/Home.js";
import PlayerInfo from "../PlayerInfo/PlayerInfo.js";
import Waiting from "../Waiting/Waiting.js";
import Playing from "../Playing/Playing.js";
import Nickname from "../Nickname/Nickname.js";
import Player from "../../shared/Player.js";
import GameStatus from "../../shared/GameStatus.js";
import Difficulty from "../../shared/Difficulty.js";
import Ready from "../Ready/Ready.js";
import Nav from "../Nav/Nav.js";

export default function Game() {
    const navigate = useNavigate();
    const { gid } = useParams();
    const [roomExists, setRoomExists] = useState<boolean>(true);
    const [phrase, setPhrase] = useState("");
    const [roundActive, setRoundActive] = useState(false);

    const selfPlayerInfoRef = useRef<Player>(undefined);
    const [selfPlayerInfo, setSelfPlayerInfo] = useState<Player | undefined>(undefined);
    const [gameStatus, setGameStatus] = useState(GameStatus.NICKNAME);
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

        socketRef.current.on("game ended", (winner: Player) => {
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
                setGameStatus(newSelf.gameStatus);
                // Can be deleted?
                selfPlayerInfoRef.current = newSelf;
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
                        {gameStatus !== GameStatus.NICKNAME && (
                            <div className="active-info">
                                <PlayerInfo
                                    playerInfo={playerInfo}
                                    selfPlayerInfo={undefined}
                                    allowableGameStatuses={[
                                        GameStatus.PLAYING,
                                        GameStatus.READY,
                                        GameStatus.WAITING,
                                    ]}
                                />
                            </div>
                        )}

                        <div className="vert-info">
                            {gameStatus === GameStatus.NICKNAME && (
                                <Nickname submitName={submitName} />
                            )}

                            {gameStatus === GameStatus.WAITING && (
                                <Waiting winner={winner} readyUp={readyUp} />
                            )}

                            {gameStatus === GameStatus.READY && (
                                <Ready
                                    startGame={startGame}
                                    hostName={
                                        host ? host.name : null
                                    }
                                    selfIsHost={selfPlayerInfo ? selfPlayerInfo.host : false}
                                />
                            )}

                            {(gameStatus === GameStatus.PLAYING ||
                                gameStatus === GameStatus.SPECTATING) && (
                                    <div className="phrase-container">
                                        <div className="phrase">{phrase}</div>
                                        <div className="debug-info">{debugInfo}</div>
                                    </div>
                                )}

                            {gameStatus === GameStatus.PLAYING && selfPlayerInfo && (
                                <Playing
                                    selfPlayerInfo={selfPlayerInfo}
                                    guess={guess}
                                    setGuess={setGuess}
                                    timeProgress={timeProgress}
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
