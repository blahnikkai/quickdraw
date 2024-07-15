import io from 'socket.io-client'
import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Home() {
    const navigate = useNavigate()
    const socketRef = useRef(null)

    useEffect(() => {
        socketRef.current = io(':3001')
        socketRef.current.on('game created', (gid) => {
            navigate(`/game/${gid}`)
        })
        return () => {
            socketRef.current.disconnect()
        }
    }, [])
    
    return (
        <main>
            Home
            <button
                onClick={() => {
                    socketRef.current.emit('create game')
                }}
            >
                New Game
            </button>
        </main>
    )
}
