import Player from '../../shared/Player.js';

export default function Guess({
    phrase,
    player,
    extra_classname,
}: {
    phrase: string,
    player: Player,
    extra_classname: string,
}) {
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
    const [guessBeforePhrase, guessContainingPhrase, guessAfterPhrase] = splitOnCorrectPart(player.partialGuess, phrase);
    const lastGuessEmpty = player.lastGuessStatus == null
    const partialGuessEmpty = player.partialGuess === ""

    return (
        <>
            {
                !lastGuessEmpty && partialGuessEmpty &&
                <div
                    className={extra_classname + " " + player.lastGuessStatus}
                >
                    {player.lastGuess}
                </div>
            }
            {
                !partialGuessEmpty &&
                <div className={extra_classname + " partial-guess"}>
                    {guessBeforePhrase}<span className="correct-part">{guessContainingPhrase}</span>{guessAfterPhrase}
                </div>
            }
        </>
    )
}
