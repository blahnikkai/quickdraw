import { Socket } from 'socket.io-client'

export default function Postgame({gid, winnerName, socket}: {gid: string, winnerName: string, socket: Socket}) {
    return (
        <div className='game-ui'>
            {winnerName ? winnerName + " won the game!" : "Nobody won!"}
            <button
                onClick={() => socket.emit('play again', gid)}
            >
                Play again
            </button>
        </div>
    )
}