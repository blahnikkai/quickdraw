import Difficulty, { strToDifficulty } from "../../Difficulty";

export default function Settings({
    roundTime,
    setRoundTime,
    difficulty,
    setDifficulty,
    startingLives,
    setStartingLives,
}: {
    roundTime: number;
    setRoundTime: (newRoundTime: number) => void;
    difficulty: Difficulty;
    setDifficulty: (newDifficulty: Difficulty) => void;
    startingLives: number;
    setStartingLives: (newStartingLives: number) => void;
}) {
    return (
        <form className="game-ui">
            <select
                name="difficulty"
                onChange={(event) => {
                    const convertedDifficulty = strToDifficulty(
                        event.target.value
                    );
                    console.log(convertedDifficulty);
                    setDifficulty(convertedDifficulty);
                }}
                value={Difficulty[difficulty]}
            >
                <option value="dynamic">Dynamic</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
            </select>
            <input
                type="number"
                value={roundTime}
                onChange={(event) => setRoundTime(parseInt(event.target.value))}
            ></input>
            <input
                type="number"
                value={startingLives}
                onChange={(event) => setStartingLives(parseInt(event.target.value))}
            ></input>
        </form>
    );
}
