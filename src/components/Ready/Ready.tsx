import Player from "../../../server/Player";

export default function Ready({
    startGame,
    selfIsHost,
    hostName,
}: {
    startGame: () => void;
    selfIsHost: boolean;
    hostName: string;
}) {
    return (
        <form
            className="game-ui"
            onSubmit={(event) => {
                event.preventDefault();
                startGame();
            }}
        >
            <button disabled={!selfIsHost}>
                {selfIsHost
                    ? "Start Game"
                    : `Waiting for ${hostName} to start the game`}
            </button>
        </form>
    );
}
