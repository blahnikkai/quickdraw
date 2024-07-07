import io from 'socket.io-client'
import { useParams } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'

export default function Play() {
    const { gid } = useParams()
    const [word, setWord] = useState('')
    const socketRef = useRef(null)

    useEffect(() => {
        socketRef.current = io(':3001')
        socketRef.current.emit('join', gid)
        return () => {
            socketRef.current.disconnect()
        }
    }, [])

    return (
        <main>
            <div>Word placeholder</div>
            <form onSubmit={(event) => event.preventDefault()}>
                <input
                    onChange={(event) => setWord(event.target.value)}
                    value={word}
                />
            </form>
        </main>
    )
}
