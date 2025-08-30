import Player from "../../shared/Player";

export default function Waiting({
    winner,
    readyUp,
}: {
    winner: Player;
    readyUp: () => void;
}) {
    return (
        <form
            className="game-ui"
            onSubmit={(event) => {
                event.preventDefault();
                readyUp();
            }}
        >
            {winner &&
                (winner.name ? winner.name + " won the game!" : "Nobody won!")}
            <button>Ready Up</button>
        </form>
    );
}
