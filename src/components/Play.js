import io from 'socket.io-client'
import {useParams} from 'react-router-dom'
import {useEffect, useRef, useState} from 'react'

export default function Play() {
    const {gid} = useParams()
    const [guess, setGuess] = useState('')
    const [phrase, setPhrase] = useState('')
    const [status, setStatus] = useState('')
    const socketRef = useRef(null)

    useEffect(() => {
        socketRef.current = io(':3001')
        
        socketRef.current.emit('join', gid)
        
        socketRef.current.on('new phrase', (newPhrase) => {
            setPhrase(newPhrase)
        })

        socketRef.current.on('valid guess', () => {
            setStatus('valid')
        })

        socketRef.current.on('invalid guess', () => {
            setStatus('invalid')
        })

        socketRef.current.on('used guess', () => {
            setStatus('used')
        })

        return () => {
            socketRef.current.disconnect()
        }
    }, [])

    return (
        <main>
            <div>{phrase}</div>
            <div>{status}</div>
            <form 
                onSubmit={
                    (event) => {
                        event.preventDefault()
                        socketRef.current.emit('submit guess', gid, guess)
                    }
                }>
                <input
                    onChange={(event) => setGuess(event.target.value)}
                    value={guess}
                />
            </form>
            <button onClick={() => socketRef.current.emit('start game', gid)}>Start Game</button>
        </main>
    )
}
