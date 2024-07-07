import io from 'socket.io-client'
import {useParams} from 'react-router-dom'
import {useEffect, useRef, useState} from 'react'

export default function Play() {
    const {gid} = useParams()
    const [word, setWord] = useState('')
    const [phrase, setPhrase] = useState('')
    const socketRef = useRef(null)

    useEffect(() => {
        socketRef.current = io(':3001')
        socketRef.current.emit('join', gid)
        socketRef.current.on('new phrase', (newPhrase) => {
            setPhrase(newPhrase)
        })
        return () => {
            socketRef.current.disconnect()
        }
    }, [])

    return (
        <main>
            <div>{phrase}</div>
            <form onSubmit={(event) => event.preventDefault()}>
                <input
                    onChange={(event) => setWord(event.target.value)}
                    value={word}
                />
            </form>
            <button onClick={() => socketRef.current.emit('start game', gid)}>Start Game</button>
        </main>
    )
}
