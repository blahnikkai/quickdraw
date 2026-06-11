import Player from "../../shared/Player.js";

export default function Ready({
    startGame,
    selfIsHost,
    hostName,
}: {
    startGame: () => void;
    selfIsHost: boolean;
    hostName: string | null;
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
                {hostName === null && "There is no host. Something went wrong, please reload."}
                {hostName !== null &&
                    (selfIsHost
                        ? "Start Game"
                        : `Waiting for ${hostName} to start the game`
                    )
                }
            </button>
        </form>
    );
}
