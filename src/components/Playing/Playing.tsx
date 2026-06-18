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
    phrase,
    splitOnCorrectPart,
}: {
    selfPlayerInfo: Player;
    guess: string;
    setGuess: CallableFunction;
    submitGuess: () => void;
    roundActive: boolean;
    phrase: string;
    splitOnCorrectPart: (partialGuess: string, phrase: string) => string[];
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

    const [guessBeforePhrase, guessContainingPhrase, guessAfterPhrase] = splitOnCorrectPart(selfPlayerInfo.partialGuess, phrase);
    const lastGuessEmpty = selfPlayerInfo.lastGuessStatus == null
    const partialGuessEmpty = selfPlayerInfo.partialGuess === ""

    return (
        <div className="game-ui">
            <div className={"guess-text-container" + (lastGuessEmpty && partialGuessEmpty ? " invisible" : "")}>
                {!lastGuessEmpty && partialGuessEmpty && <div
                    className={
                        "other-guess " + selfPlayerInfo.lastGuessStatus
                    }
                >
                    {selfPlayerInfo.lastGuess}
                </div>}
                {!partialGuessEmpty && <div className="other-guess partial-guess">
                    {guessBeforePhrase}<span className="correct-part">{guessContainingPhrase}</span>{guessAfterPhrase}
                </div>}
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
