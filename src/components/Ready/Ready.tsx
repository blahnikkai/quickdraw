export default function Ready({socket, gid}) {
    return (
        <button onClick={() => socket.emit('start game', gid)}>Start Game</button>
    )
}
