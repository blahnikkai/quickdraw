import { useEffect } from 'react'
import io from 'socket.io-client'
import { useParams } from 'react-router-dom'
import { useState, useRef } from 'react'

export default function Game() {
    const { gid } = useParams()
    const socketRef = useRef(null)

    const [addingMsg, setAddingMsg] = useState('')
    const [pastMsgs, setPastMsgs] = useState([])

    useEffect(() => {
        socketRef.current = io(':3001')
        socketRef.current.emit('join', gid)
        socketRef.current.on('receive message', (newMsg) => {
            setPastMsgs((pastMsgs) => [...pastMsgs, newMsg])
        })
        return () => {
            socketRef.current.disconnect()
        }
    }, [])

    return (
        <main>
            <div>Send a message</div>
            <form
                onSubmit={(event) => {
                    event.preventDefault()
                    socketRef.current.emit('send message', addingMsg, gid)
                    setAddingMsg('')
                }}
            >
                <input
                    value={addingMsg}
                    onChange={(event) => setAddingMsg(event.target.value)}
                ></input>
            </form>
            <ul>
                {pastMsgs.map((pastMsg, i) => <li key={i}>{pastMsg}</li>)}
            </ul>
        </main>
    )
}
