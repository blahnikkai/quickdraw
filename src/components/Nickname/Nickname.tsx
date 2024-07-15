import { useState } from 'react'

export default function Nickname({ socket, gid }) {
    const [name, setName] = useState('')
    return (
        <div>
            <form onSubmit={(event) => {
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
        </div>
    )
}
