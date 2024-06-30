import {useEffect} from 'react'
import io from 'socket.io-client'

export default function Game() {
    useEffect(() => {
        const socket = io('http://localhost:3001')
        return () => {
            socket.disconnect()
        }
    }, [])
    return <div>Game</div>
}
