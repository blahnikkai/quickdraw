import "./PlayerInfo.css";
import Player from "../../../server/Player";
import GameStatus from "../../GameStatus";

export default function PlayerInfo({
    playerInfo,
    allowableGameStatuses,
}: {
    playerInfo: Player[];
    allowableGameStatuses: GameStatus[];
}) {
    return (
        <div className="players">
            {playerInfo
                .filter((player) =>
                    allowableGameStatuses.includes(player.gameStatus)
                )
                .map((player) => {
                    
                    const playerIsInWaitingRoom: boolean = [
                        GameStatus.READY,
                        GameStatus.WAITING,
                    ].includes(player.gameStatus);
                    const gameStatusStr: string = playerIsInWaitingRoom ? player.gameStatus : "";

                    return (
                        <div
                            className={`player ${player.dying ? " dying" : ""}${
                                player.dead ? " dead" : ""
                            }`}
                        >
                            <div>{player.name}</div>
                            <div className={`player-game-status ${gameStatusStr.toLowerCase()}`}>
                                {gameStatusStr}
                            </div>
                            <div>
                                {player.gameStatus == GameStatus.PLAYING &&
                                    player.lives}
                            </div>
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
