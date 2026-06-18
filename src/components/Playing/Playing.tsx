import "./Playing.css";
import Player from "../../shared/Player.js";
import GuessStatus from "../../shared/GuessStatus.js";
import GameStatus from "../../shared/GameStatus.js";
import { useEffect, useState, useRef } from "react";

export default function Playing({
    selfPlayerInfo,
    guess,
    setGuess,
    submitGuess,
    roundActive,
}: {
    selfPlayerInfo: Player;
    guess: string;
    setGuess: CallableFunction;
    submitGuess: () => void;
    roundActive: boolean;
}) {
    const [inputDisabled, setInputDisabled] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const splitOnCorrectPart = (partialGuess: string, phrase: string): string[] => {
        const index = partialGuess.indexOf(phrase);
        if (index === -1) {
            return [partialGuess, "", ""]
        }
        const p1 = partialGuess.substring(0, index);
        const p2 = partialGuess.substring(index, index + phrase.length);
        const p3 = partialGuess.substring(index + phrase.length);
        return [p1, p2, p3];
    }
    const [guessBeforePhrase, guessContainingPhrase, guessAfterPhrase] = splitOnCorrectPart(guess, "wh");

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
    }, [inputDisabled])

    return (
        <div className="game-ui">
            <p
                className={
                    "last-guess self-last-guess " +
                    selfPlayerInfo?.lastGuessStatus
                }
            >
                {guessBeforePhrase}<span className="correct-part">{guessContainingPhrase}</span>{guessAfterPhrase}
            </p>
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
