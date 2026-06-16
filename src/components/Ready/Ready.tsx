import GameStatus from "../../shared/GameStatus.js";
import Player from "../../shared/Player.js";

export default function Ready({
    startGame,
    selfIsHost,
    hostName,
    playerInfo,
    unready,
}: {
    startGame: () => void;
    selfIsHost: boolean;
    hostName: string | null;
    playerInfo: Player[];
    unready: () => void;
}) {
    const someoneUnready = playerInfo.some((player: Player) => player.gameStatus === GameStatus.WAITING);
    const buttonDisabled = !selfIsHost || someoneUnready || hostName === null;

    let buttonText = "";
    if (hostName === null) {
        buttonText = "There is no host. Something went wrong, please reload";
    }
    else if (someoneUnready) {
        buttonText = "Waiting for all players to be ready";
    }
    else if (!selfIsHost) {
        buttonText = `Waiting for ${hostName} to start the game`
    }
    else {
        buttonText = "Start game"
    }

    return (
        <div className="game-ui">
            <form
                className="game-ui"
                onSubmit={(event) => {
                    event.preventDefault();
                    startGame();
                }}
            >
                <button disabled={buttonDisabled}>
                    {buttonText}
                </button>
            </form>
            <button
                onClick={() => unready()}
            >
                Unready
            </button>
        </div>
    );
}
