import "./Playing.css";
import Player from "../../shared/Player";
import GuessStatus from "../../shared/GuessStatus";
import GameStatus from "../../shared/GameStatus";

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
            <div className={"last-guess self-last-guess " + selfPlayerInfo?.lastGuessStatus}>
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
                    className="guess-input"
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
