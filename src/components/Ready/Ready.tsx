import { Socket } from 'socket.io-client';

export default function Ready({ socket, gid }: { socket: Socket, gid: string }) {
    return (
        <div className='game-ui'>
            <button
                onClick={() => socket.emit('start game', gid)}
            >
                Start Game
            </button>
        </div>
    )
}
