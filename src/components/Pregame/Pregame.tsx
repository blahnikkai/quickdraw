import { Socket } from 'socket.io-client'

export default function Pregame({ socket, name, gid }: { socket: Socket, name: string, gid: string }) {
    return (
        <div className='game-ui'>
            <input
                onChange={(event) => socket.emit('change name', gid, event.target.value)}
                value={name}
            />
            <button
                onClick={() => socket.emit('start game', gid)}
            >
                Start Game
            </button>
        </div>
    )
}
