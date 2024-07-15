import { Socket } from 'socket.io-client'
import './Playing.css'
import Player from '../../../server/Player'

export default function Playing(
    { selfPlayerInfo, guess, setGuess, gid, socket, phrase, playingRound, timeProgress }:
        { selfPlayerInfo: Player, guess: string, setGuess: CallableFunction, gid: string, socket: Socket, phrase: string, playingRound: boolean, timeProgress: number }
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
            <div className='timer-bar' style={{ width: `${100 * (1 - timeProgress)}%` }}></div>
        </div>
    )
}