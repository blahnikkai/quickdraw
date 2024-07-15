import { useState } from 'react'
import { Socket } from 'socket.io-client'

export default function Nickname({ socket, gid }: { socket: Socket, gid: string }) {
    const [name, setName] = useState('')
    return (
        <form
            className='game-ui'
            onSubmit={(event) => {
                event.preventDefault()
                socket.emit('submit name', gid, name)
            }}>
            <label className='nickname'>
                Enter a nickname:
                <input
                    className='nickname'
                    onChange={(event) => setName(event.target.value)}
                    defaultValue={name}
                />
            </label>
            <button>Join Game</button>
        </form>
    )
}
