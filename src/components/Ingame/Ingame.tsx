import { Socket } from 'socket.io-client'

export default function Ingame(
    { guess, setGuess, gid, socket, phrase, lives, status, playingRound }:
        { guess: string, setGuess: CallableFunction, gid: string, socket: Socket, phrase: string, lives: number, status: string, playingRound: boolean }
) {
    return (
        <div className='game-ui'>
            <div>{phrase}</div>
            <div>Lives: {lives}</div>
            <div>{status}</div>
            <form
                onSubmit={
                    (event) => {
                        event.preventDefault()
                        socket.emit('submit guess', gid, guess)
                    }
                }>
                <input
                    value={guess}
                    onChange={(event) => setGuess(event.target.value)}
                    disabled={!playingRound}
                />
            </form>
        </div>
    )
}