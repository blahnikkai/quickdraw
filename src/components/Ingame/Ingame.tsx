import { Socket } from 'socket.io-client'
import './Ingame.css'
import Player from '../../../server/Player'
import GuessStatus from '../../GuessStatus'

export default function Ingame(
    { selfPlayerInfo, guess, setGuess, gid, socket, phrase, playingRound }:
        { selfPlayerInfo: Player, guess: string, setGuess: CallableFunction, gid: string, socket: Socket, phrase: string, playingRound: boolean }
) {
    return (
        <div className='game-ui ingame'>
            <div>{phrase}</div>
            <div>Lives: {selfPlayerInfo?.lives}</div>
            <div className={'last-guess ' + selfPlayerInfo?.lastGuessStatus}>{selfPlayerInfo?.lastGuess}</div>
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