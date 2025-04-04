import "./PlayerInfo.css";
import Player from "../../../server/Player";
import GameStatus from "../../GameStatus";

export default function PlayerInfo({
    playerInfo,
    gameStatus,
}: {
    playerInfo: Player[];
    gameStatus: GameStatus;
}) {
    return (
        <div className="players">
            {playerInfo
                .filter(
                    (player) =>
                        player.playerStatus === GameStatus.PLAYING ||
                        player.playerStatus === GameStatus.READY
                )
                .map((player) => {
                    return (
                        <div
                            className={`player ${player.dying ? " dying" : ""}${
                                player.dead ? " dead" : ""
                            }`}
                        >
                            <div>{player.name}</div>
                            {gameStatus === GameStatus.PLAYING && (
                                <div>{player.lives}</div>
                            )}
                            <div
                                className={
                                    player.lastGuessStatus &&
                                    "last-guess " + player.lastGuessStatus
                                }
                            >
                                {player.lastGuess}
                            </div>
                        </div>
                    );
                })}
        </div>
    );
}
