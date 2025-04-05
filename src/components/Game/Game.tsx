import { io, Socket } from "socket.io-client";
import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import "./Game.css";
import PlayerInfo from "../PlayerInfo/PlayerInfo";
import Waiting from "../Waiting/Waiting";
import Playing from "../Playing/Playing";
import Nickname from "../Nickname/Nickname";
import Player from "../../../server/Player";
import GameStatus from "../../GameStatus";
import GuessStatus from "../../GuessStatus";
import Ready from "../Ready/Ready";

export default function Game() {
    const { gid } = useParams();
    const [roomExists, setRoomExists] = useState<boolean>(undefined);
    const [phrase, setPhrase] = useState("");
    const [gameStatus, setGameStatus] = useState(GameStatus.NICKNAME);

    const startTimeRef = useRef<number>(undefined);
    const endTimeRef = useRef<number>(undefined);
    const [timeProgress, setTimeProgress] = useState(0);

    const [selfPlayerInfo, setSelfPlayerInfo] = useState<Player>(undefined);
    const selfPlayerInfoRef = useRef<Player>(undefined);
    const [playerInfo, setPlayerInfo] = useState([]);
    const [winner, setWinner] = useState<Player>(undefined);

    const [guess, setGuess] = useState("");

    const socketRef = useRef<Socket>(undefined);

    const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined);

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

        const intervalId = intervalRef.current;

        return () => {
            socketRef.current.disconnect();
            clearInterval(intervalId);
        };
    }, []);

    return (
        <main>
            {roomExists === undefined && <div>Loading</div>}

            {roomExists === false && <div>Room {gid} does not exist.</div>}

            {roomExists === true && (
                <div className="room-exists">
                    {gameStatus !== GameStatus.NICKNAME && (
                        <div>
                            <PlayerInfo
                                playerInfo={playerInfo}
                                allowableGameStatuses={[
                                    GameStatus.WAITING,
                                    GameStatus.SPECTATING,
                                ]}
                            />
                            <PlayerInfo
                                playerInfo={playerInfo}
                                allowableGameStatuses={[
                                    GameStatus.READY,
                                    GameStatus.PLAYING,
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
                        <Ready startGame={startGame} />
                    )}

                    <div className="phrase">
                        {(gameStatus == GameStatus.PLAYING ||
                            gameStatus == GameStatus.SPECTATING) &&
                            phrase}
                    </div>

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
    );
}
