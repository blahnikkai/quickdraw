import io from 'socket.io-client'
import {useParams} from 'react-router-dom'
import {useEffect, useRef, useState} from 'react'

export default function Play() {
    const {gid} = useParams()
    const [lives, setLives] = useState(10)
    const [guess, setGuess] = useState('')
    const [phrase, setPhrase] = useState('')
    const [status, setStatus] = useState('a')
    const socketRef = useRef(null)

    const handleEndRound = () => {
        setStatus((prevStatus) => {
            setLives((prevLives) => {
                if (prevStatus !== 'valid') {
                    return prevLives - 1
                }
                return prevLives
            })
            return prevStatus
        })
    }

    useEffect(() => {
        socketRef.current = io(':3001')

        socketRef.current.emit('join', gid)

        socketRef.current.on('new phrase', (newPhrase) => {
            setStatus('')
            setGuess('')
            setPhrase(newPhrase)
        })

        socketRef.current.on('valid guess', () => {
            setStatus('valid')
            setGuess('')
        })

        socketRef.current.on('invalid guess', () => {
            setStatus('invalid')
        })

        socketRef.current.on('used guess', () => {
            setStatus('used')
        })

        socketRef.current.on('end round', () => {
            handleEndRound()
        })

        return () => {
            socketRef.current.disconnect()
        }
    }, [])

    return (
        <main>
            <div>Lives: {lives}</div>
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
                    value={guess}
                    onChange={(event) => setGuess(event.target.value)}
                    disabled={status === 'valid'}
                />
            </form>
            <button onClick={() => socketRef.current.emit('start game', gid)}>Start Game</button>
        </main>
    )
}
