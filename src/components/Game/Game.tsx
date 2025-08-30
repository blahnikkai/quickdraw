import { io, Socket } from "socket.io-client";
import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Game.css";
import PlayerInfo from "../PlayerInfo/PlayerInfo";
import Waiting from "../Waiting/Waiting";
import Playing from "../Playing/Playing";
import Nickname from "../Nickname/Nickname";
import Player from "../../shared/Player";
import GameStatus from "../../shared/GameStatus";
import GuessStatus from "../../shared/GuessStatus";
import Difficulty from "../../shared/Difficulty";
import Ready from "../Ready/Ready";
import CopyLinkButton from "../CopyLinkButton/CopyLinkButton";
import Settings from "../Settings/Settings";
import ShowSettingsButton from "../ShowSettingsButton/ShowSettingsButton";
import HomeButton from "../HomeButton/HomeButton";

export default function Game() {
    const navigate = useNavigate();
    const { gid } = useParams();
    const [roomExists, setRoomExists] = useState<boolean>(undefined);
    const [phrase, setPhrase] = useState("");

    const selfPlayerInfoRef = useRef<Player>(undefined);
    const [selfPlayerInfo, setSelfPlayerInfo] = useState<Player>(undefined);
    const [gameStatus, setGameStatus] = useState(GameStatus.NICKNAME);
    const [playerInfo, setPlayerInfo] = useState([]);
    const [guess, setGuess] = useState("");
    const [winner, setWinner] = useState<Player>(undefined);

    const [showingSettings, setShowingSettings] = useState(false);
    const [debugInfo, setDebugInfo] = useState("");

    const [difficulty, setDifficulty] = useState<Difficulty>(
        Difficulty.DYNAMIC
    );
    const [roundTime, setRoundTime] = useState(0);
    const [startingLives, setStartingLives] = useState(0);

    const socketRef = useRef<Socket>(undefined);
    const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined);
    const startTimeRef = useRef<number>(undefined);
    const endTimeRef = useRef<number>(undefined);
    const [timeProgress, setTimeProgress] = useState(0);

    const updateTimeProgress = () => {
        const curTime = Date.now();
        const timeProgress =
            (curTime - startTimeRef.current) /
            (endTimeRef.current - startTimeRef.current);
        setTimeProgress(timeProgress);
    };

    const submitName = (name: string) =>
        socketRef.current.emit("submit name", gid, name);
    const readyUp = () =>
        socketRef.current.emit("change game status", gid, GameStatus.READY);
    const startGame = () => socketRef.current.emit("start game", gid);
    const submitGuess = () =>
        socketRef.current.emit("submit guess", gid, guess);
    const updateSettings = (
        difficulty: Difficulty,
        roundTime: number,
        startingLives: number
    ) => {
        socketRef.current.emit(
            "update settings",
            gid,
            difficulty,
            roundTime,
            startingLives
        );
    };

    useEffect(() => {
        socketRef.current = io(":3001");

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
                setGuess("");
                setPhrase(newPhrase);
                setTimeProgress(0);
                if (!selfPlayerInfoRef.current.dead) {
                    startTimeRef.current = start;
                    endTimeRef.current = end;
                    intervalRef.current = setInterval(updateTimeProgress, 300);
                }
            }
        );

        socketRef.current.on("end round", () => {
            clearInterval(intervalRef.current);
        });

        socketRef.current.on(
            "update player info",
            (newPlayerInfo: Player[]) => {
                setPlayerInfo(newPlayerInfo);
                const newSelf = newPlayerInfo.find(
                    (player: Player) => player.socketId === socketRef.current.id
                );
                setSelfPlayerInfo(newSelf);
                setGameStatus(newSelf.gameStatus);
                selfPlayerInfoRef.current = newSelf;
                if (newSelf.lastGuessStatus === GuessStatus.VALID) {
                    clearInterval(intervalRef.current);
                    setGuess("");
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

        const intervalId = intervalRef.current;

        return () => {
            socketRef.current.disconnect();
            clearInterval(intervalId);
        };
    }, []);

    return (
        <div className="game-root">
            {roomExists && (
                <nav>
                    <HomeButton />
                    <CopyLinkButton />
                    {[GameStatus.WAITING, GameStatus.READY].includes(
                        gameStatus
                    ) && (
                        <ShowSettingsButton
                            showingSettings={showingSettings}
                            setShowingSettings={setShowingSettings}
                        />
                    )}
                    {[GameStatus.WAITING, GameStatus.READY].includes(
                        gameStatus
                    ) &&
                        showingSettings && (
                            <Settings
                                difficulty={difficulty}
                                setDifficulty={setDifficulty}
                                roundTime={roundTime}
                                setRoundTime={setRoundTime}
                                startingLives={startingLives}
                                setStartingLives={setStartingLives}
                                updateSettings={updateSettings}
                                viewOnly={!selfPlayerInfo.host}
                            />
                        )}
                </nav>
            )}
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
                    <div className="room">
                        {gameStatus !== GameStatus.NICKNAME && (
                            <div>
                                <PlayerInfo
                                    playerInfo={playerInfo}
                                    allowableGameStatuses={[
                                        GameStatus.SPECTATING,
                                    ]}
                                />
                                <PlayerInfo
                                    playerInfo={playerInfo}
                                    allowableGameStatuses={[
                                        GameStatus.PLAYING,
                                        GameStatus.READY,
                                        GameStatus.WAITING,
                                    ]}
                                />
                            </div>
                        )}

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
                                    playerInfo.find((player) => player.host)
                                        .name
                                }
                                selfIsHost={selfPlayerInfo.host}
                            />
                        )}

                        {(gameStatus === GameStatus.PLAYING ||
                            gameStatus === GameStatus.SPECTATING) && (
                            <div>
                                <div className="phrase">{phrase}</div>
                                <div>{debugInfo}</div>
                            </div>
                        )}

                        {gameStatus === GameStatus.PLAYING && (
                            <Playing
                                selfPlayerInfo={selfPlayerInfo}
                                guess={guess}
                                setGuess={setGuess}
                                timeProgress={timeProgress}
                                submitGuess={submitGuess}
                            />
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
