import "./Spectators.css"
import Player from "../../shared/Player.js";
import GameStatus from "../../shared/GameStatus.js";

export default function Spectators({
    playerInfo,
}: {
    playerInfo: Player[];
}) {
    const allowableGameStatuses = [
        GameStatus.SPECTATING_WAITING,
        GameStatus.SPECTATING_PLAYING,
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
                            {player.name}
                        </div>
                    );
                })}
        </div>
    );
}
