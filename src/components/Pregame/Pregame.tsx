import { Socket } from 'socket.io-client'
import './Pregame.css'

export default function Pregame({ socket, name, gid }: { socket: Socket, name: string, gid: string }) {
    return (
        <div className='game-ui'>
            <label className='nickname'>
                Enter a nickname:
                <input
                    className='nickname'
                    onChange={(event) => socket.emit('change name', gid, event.target.value)}
                    value={name}
                />
            </label>
            <button
                onClick={() => socket.emit('start game', gid)}
            >
                Start Game
            </button>
        </div>
    )
}
