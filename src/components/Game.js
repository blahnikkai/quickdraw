import io from 'socket.io-client'

export default function Game() {
    const socket = io('http://localhost:3001')
    socket.emit('join', '4001')
    return <div>Game</div>
}
