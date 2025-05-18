import Difficulty, { strToDifficulty } from "../../Difficulty";
import { useState } from "react";

export default function Settings({
    roundTime,
    setRoundTime,
    difficulty,
    setDifficulty,
    startingLives,
    setStartingLives,
    updateSettings,
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
}) {

    return (
        <form className="game-ui">
            <select
                name="difficulty"
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
            <input
                type="number"
                value={roundTime}
                onChange={(event) => {
                    const newRoundTime = parseInt(event.target.value);
                    setRoundTime(newRoundTime);
                    updateSettings(difficulty, newRoundTime, startingLives);
                }}
            ></input>
            <input
                type="number"
                value={startingLives}
                onChange={(event) => {
                    const newStartingLives = parseInt(event.target.value);
                    setStartingLives(newStartingLives);
                    updateSettings(difficulty, roundTime, newStartingLives);
                }}
            ></input>
        </form>
    );
}
