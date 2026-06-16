import "./PlayerInfo.css";
import Player from "../../shared/Player.js";
import GameStatus from "../../shared/GameStatus.js";
import { FaCrown } from "@react-icons/all-files/fa/FaCrown.js";

export default function Players({
    playerInfo,
    selfPlayerInfo,
}: {
    playerInfo: Player[];
    selfPlayerInfo: Player | undefined;
}) {
    const allowableGameStatuses = [
        GameStatus.PLAYING,
        GameStatus.READY,
        GameStatus.WAITING,
    ]
    return (
        <div className="players">
            {playerInfo
                .filter((player) =>
                    allowableGameStatuses.includes(player.gameStatus) && player.socketId !== selfPlayerInfo?.socketId
                )
                .map((player) => {
                    const playerIsInWaitingRoom: boolean = [
                        GameStatus.READY,
                        GameStatus.WAITING,
                    ].includes(player.gameStatus);
                    const gameStatusStr: string = playerIsInWaitingRoom
                        ? player.gameStatus
                        : "";

                    return (
                        <div
                            key={player.socketId}
                            className="player"
                        >
                            <div className={`player-stats ${player.dying ? " dying" : ""}${player.dead ? " dead" : ""}`}>
                                <div>
                                    {/* {player.host ? <FaCrown size={1} /> : ""} */}
                                    {player.name}
                                </div>
                                <div
                                    className={`player-game-status ${gameStatusStr.toLowerCase()}`}
                                >
                                    {gameStatusStr}
                                </div>
                                <div>
                                    {player.gameStatus == GameStatus.PLAYING &&
                                        player.lives}
                                </div>
                            </div>
                            <div className="guess-container">
                                <div
                                    className={
                                        player.lastGuessStatus != null ? "other-guess last-guess " + player.lastGuessStatus : ""
                                    }
                                >
                                    {player.lastGuess}
                                </div>
                                <img src="/assets/images/speech_bubble.svg" height="50" width="100" className={player.lastGuessStatus == null ? "invisible" : "speech-bubble"}></img>
                            </div>
                        </div>
                    );
                })}
        </div>
    );
}
