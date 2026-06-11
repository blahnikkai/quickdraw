import Player from "../../shared/Player.js";

export default function Waiting({
    winner,
    readyUp,
}: {
    winner: Player | null | undefined;
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
            {winner !== undefined &&
                (winner !== null ? winner.name + " won the game!" : "Nobody won!")}
            <button>Ready Up</button>
        </form>
    );
}
