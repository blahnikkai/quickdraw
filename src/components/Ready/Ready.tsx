export default function Ready({ startGame }: { startGame: () => void }) {
    return (
        <div className='game-ui'>
            <button
                onClick={() => startGame()}
            >
                Start Game
            </button>
        </div>
    )
}
