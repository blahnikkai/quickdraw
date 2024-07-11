import { Socket } from 'socket.io-client'
import './Ingame.css'

export default function Ingame(
    { guess, setGuess, gid, socket, phrase, lives, status, playingRound, lastGuess }:
        { guess: string, setGuess: CallableFunction, gid: string, socket: Socket, phrase: string, lives: number, status: string, playingRound: boolean, lastGuess: string }
) {
    return (
        <div className='game-ui ingame'>
            <div>{phrase}</div>
            <div>Lives: {lives}</div>
            <div className={'status ' + status}>{lastGuess}</div>
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