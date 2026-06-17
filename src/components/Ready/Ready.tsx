import GameStatus from "../../shared/GameStatus.js";
import Player from "../../shared/Player.js";
import "./Ready.css"

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

    let displayText = "";
    if (hostName === null) {
        displayText = "There is no host. Something went wrong, please reload";
    }
    else if (someoneUnready) {
        displayText = "Waiting for all players to be ready";
    }
    else if (!selfIsHost) {
        displayText = `Waiting for ${hostName} to start the game`
    }
    else {
        displayText = "Start game"
    }

    return (
        <div className="game-ui">
            {selfIsHost &&
                <>
                    <form
                        className="game-ui"
                        onSubmit={(event) => {
                            event.preventDefault();
                            startGame();
                        }}
                    >
                        <button disabled={someoneUnready}>
                            {displayText}
                        </button>
                    </form>
                    <p className="centered">- or -</p>
                </>
            }
            {!selfIsHost &&
                <>
                    <p className="centered small">{displayText}</p>
                    <p className="centered">--</p>
                </>
            }

            <button
                onClick={() => unready()}
            >
                Unready
            </button>
        </div>
    );
}
