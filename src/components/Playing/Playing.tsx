import "./Playing.css";
import Player from "../../../server/Player";
import GuessStatus from "../../GuessStatus";
import GameStatus from "../../GameStatus";

export default function Playing({
    selfPlayerInfo,
    guess,
    setGuess,
    timeProgress,
    submitGuess,
}: {
    selfPlayerInfo: Player;
    guess: string;
    setGuess: CallableFunction;
    timeProgress: number;
    submitGuess: () => void;
}) {
    return (
        <div className="game-ui ingame">
            <div>Lives: {selfPlayerInfo?.lives}</div>
            <div className={"last-guess " + selfPlayerInfo?.lastGuessStatus}>
                {selfPlayerInfo?.lastGuess}
            </div>
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    if(selfPlayerInfo?.lastGuessStatus != GuessStatus.VALID) {
                        submitGuess();
                    }
                }}
            >
                <input
                    value={guess}
                    onChange={(event) => setGuess(event.target.value)}
                    disabled={selfPlayerInfo.gameStatus != GameStatus.PLAYING}
                />
            </form>
            <div
                className="timer-bar"
                style={{ width: `${100 * (1 - timeProgress)}%` }}
            ></div>
        </div>
    );
}
