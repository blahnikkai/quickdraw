import io from 'socket.io-client'
import { useParams } from 'react-router-dom'
import { useEffect, useRef } from 'react'

export default function Play() {
    const { gid } = useParams()
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
            
        </main>
    )
}
