import "./Playing.css";
import Player from "../../../server/Player";
import GuessStatus from "../../GuessStatus";

export default function Playing({
    selfPlayerInfo,
    guess,
    setGuess,
    phrase,
    timeProgress,
    submitGuess,
}: {
    selfPlayerInfo: Player;
    guess: string;
    setGuess: CallableFunction;
    phrase: string;
    timeProgress: number;
    submitGuess: () => void;
}) {
    return (
        <div className="game-ui ingame">
            <div>{phrase}</div>
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
                    disabled={selfPlayerInfo.dead}
                />
            </form>
            <div
                className="timer-bar"
                style={{ width: `${100 * (1 - timeProgress)}%` }}
            ></div>
        </div>
    );
}
