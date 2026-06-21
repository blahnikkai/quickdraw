import "./Playing.css";
import Player from "../../shared/Player.js";
import GuessStatus from "../../shared/GuessStatus.js";
import GameStatus from "../../shared/GameStatus.js";
import { useEffect, useState, useRef } from "react";
import Guess from "../Guess/Guess.js";

export default function Playing({
    selfPlayerInfo,
    guess,
    setGuess,
    submitGuess,
    roundActive,
    phrase,
}: {
    selfPlayerInfo: Player;
    guess: string;
    setGuess: CallableFunction;
    submitGuess: () => void;
    roundActive: boolean;
    phrase: string;
}) {
    const [inputDisabled, setInputDisabled] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const newInputDisabled =
            !roundActive ||
            selfPlayerInfo.gameStatus != GameStatus.PLAYING ||
            selfPlayerInfo.lastGuessStatus === GuessStatus.VALID ||
            selfPlayerInfo.lives === 0;
        setInputDisabled(newInputDisabled);
    }, [roundActive, selfPlayerInfo]);

    useEffect(() => {
        if (!inputDisabled) {
            inputRef.current?.focus();
        }
    }, [inputDisabled]);

    return (
        <div className="game-ui">
            <div className="self-guess">
                <Guess
                    phrase={phrase}
                    player={selfPlayerInfo}
                    extra_classname=""
                />
            </div>
            <div className="life-cnt">{selfPlayerInfo?.lives} lives</div>
            <form
                className="guess-form"
                onSubmit={(event) => {
                    event.preventDefault();
                    if (selfPlayerInfo?.lastGuessStatus != GuessStatus.VALID) {
                        submitGuess();
                    }
                }}
            >
                <input
                    ref={inputRef}
                    autoFocus
                    className="guess-input"
                    value={guess}
                    onChange={(event) => setGuess(event.target.value)}
                    disabled={inputDisabled}
                />
            </form>
        </div>
    );
}
