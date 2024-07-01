import { useEffect } from 'react'
import io from 'socket.io-client'
import { useParams } from 'react-router-dom'

export default function Game() {
    const { gid } = useParams()
    console.log('huh')
    useEffect(() => {
        const socket = io(':3001')
        socket.emit('join', gid)
        return () => {
            socket.disconnect()
        }
    }, [gid])

    return <div>Game</div>
}
