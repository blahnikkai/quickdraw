import Player from "../../../server/Player";

export default function Waiting({
    winner,
    readyUp,
}: {
    winner: Player;
    readyUp: () => void;
}) {
    return (
        <div className="game-ui">
            {winner &&
                (winner.name ? winner.name + " won the game!" : "Nobody won!")}
            <button onClick={() => readyUp()}>Ready Up</button>
        </div>
    );
}
