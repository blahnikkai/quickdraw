import "./Spectators.css"
import Player from "../../shared/Player.js";
import GameStatus from "../../shared/GameStatus.js";

export default function Spectators({
    playerInfo,
}: {
    playerInfo: Player[];
}) {
    const allowableGameStatuses = [
        GameStatus.SPECTATING,
    ]
    return (
        <div className="spectators">
            {playerInfo
                .filter((player) =>
                    allowableGameStatuses.includes(player.gameStatus)
                )
                .map((player) => {
                    return (
                        <div
                            key={player.socketId}
                            className="spectator"
                        >
                            <div>
                                {player.name}
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
