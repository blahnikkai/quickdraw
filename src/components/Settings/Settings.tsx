import Difficulty, { strToDifficulty } from "../../Difficulty";
import "./Settings.css";

export default function Settings({
    roundTime,
    setRoundTime,
    difficulty,
    setDifficulty,
    startingLives,
    setStartingLives,
    updateSettings,
    viewOnly,
}: {
    roundTime: number;
    setRoundTime: (newRoundTime: number) => void;
    difficulty: Difficulty;
    setDifficulty: (newDifficulty: Difficulty) => void;
    startingLives: number;
    setStartingLives: (newStartingLives: number) => void;
    updateSettings: (
        difficulty: Difficulty,
        roundTime: number,
        startingLives: number
    ) => void;
    viewOnly: boolean;
}) {
    return (
        <form className="game-ui settings">
            <div className="form-group">
                <label htmlFor="difficulty" className="settings-label">
                    Difficulty
                </label>
                <select
                    name="difficulty"
                    disabled={viewOnly}
                    value={difficulty}
                    onChange={(event) => {
                        const newDifficulty = strToDifficulty(
                            event.target.value
                        );
                        setDifficulty(newDifficulty);
                        updateSettings(newDifficulty, roundTime, startingLives);
                    }}
                >
                    <option value="dynamic">Dynamic</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="round-time" className="settings-label">
                    Round Time
                </label>
                <input
                    type="number"
                    name="round-time"
                    className="settings-input"
                    disabled={viewOnly}
                    value={roundTime}
                    onChange={(event) => {
                        const newRoundTime = parseInt(event.target.value);
                        setRoundTime(newRoundTime);
                        updateSettings(difficulty, newRoundTime, startingLives);
                    }}
                ></input>
            </div>
            <div className="form-group">
                <label htmlFor="starting-lives" className="settings-label">
                    Starting Lives
                </label>
                <input
                    type="number"
                    name="starting-lives"
                    className="settings-input"
                    disabled={viewOnly}
                    value={startingLives}
                    onChange={(event) => {
                        const newStartingLives = parseInt(event.target.value);
                        setStartingLives(newStartingLives);
                        updateSettings(difficulty, roundTime, newStartingLives);
                    }}
                ></input>
            </div>
        </form>
    );
}
