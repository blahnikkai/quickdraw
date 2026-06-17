import Player from "../../shared/Player.js";
import "./Winner.css"

export default function Waiting({
    winner,
    readyUp,
    spectate,
}: {
    winner: Player | null | undefined;
    readyUp: () => void;
    spectate: () => void;
}) {
    return (
        <div className="game-ui">
            <form
                className="game-ui"
                onSubmit={(event) => {
                    event.preventDefault();
                    readyUp();
                }}
            >
                <p className="winner-display">
                    {winner !== undefined &&
                        (winner !== null ? winner.name + " won the game!" : "Nobody won!")}
                </p>
                <button>Ready Up</button>
            </form>
            <p>- or -</p>
            <button
                onClick={() => spectate()}
            >
                Spectate
            </button>
        </div>
    );
}
