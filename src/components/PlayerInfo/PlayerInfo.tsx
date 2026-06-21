import "./PlayerInfo.css";
import Player from "../../shared/Player.js";
import GameStatus from "../../shared/GameStatus.js";
import { FaCrown } from "@react-icons/all-files/fa/FaCrown.js";

export default function Players({
    playerInfo,
    selfPlayerInfo,
    phrase,
    splitOnCorrectPart
}: {
    playerInfo: Player[];
    selfPlayerInfo: Player | undefined;
    phrase: string;
    splitOnCorrectPart: (arg0: string, arg1: string) => string[];
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
                    const [guessBeforePhrase, guessContainingPhrase, guessAfterPhrase] = splitOnCorrectPart(player.partialGuess, phrase);
                    const lastGuessEmpty = player.lastGuessStatus == null
                    const partialGuessEmpty = player.partialGuess === ""

                    return (
                        <div
                            key={player.socketId}
                            className="player"
                        >
                            <div className={`player-stats ${player.dying ? " dying" : ""}${player.dead ? " dead" : ""}`}>
                                <div className="player-name">
                                    {player.host ? <FaCrown size={16} className="crown" /> : ""} {player.name} 
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
                                <div className={"guess-text-container" + (lastGuessEmpty && partialGuessEmpty ? " invisible" : "")}>
                                    {!lastGuessEmpty && partialGuessEmpty && <div
                                        className={
                                            "side-guess " + player.lastGuessStatus
                                        }
                                    >
                                        {player.lastGuess}
                                    </div>}
                                    {!partialGuessEmpty && <div className="side-guess partial-guess">
                                        {guessBeforePhrase}<span className="correct-part">{guessContainingPhrase}</span>{guessAfterPhrase}
                                    </div>}
                                </div>
                                <img src="/assets/images/speech_bubble_point.svg" height="25" width="50" className={lastGuessEmpty && partialGuessEmpty ? "invisible" : "speech-bubble"}></img>
                            </div>
                        </div>
                    );
                })}
        </div>
    );
}
