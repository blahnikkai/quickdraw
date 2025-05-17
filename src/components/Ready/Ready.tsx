export default function Ready({ startGame }: { startGame: () => void }) {
    return (
        <form 
            className="game-ui"
            onSubmit={(event) => {
                event.preventDefault();
                startGame();
            }}
        >
            <button>Start Game</button>
        </form>
    );
}
