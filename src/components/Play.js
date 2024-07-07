import io from 'socket.io-client'
import {useParams} from 'react-router-dom'
import {useEffect, useRef, useState} from 'react'

export default function Play() {
    const {gid} = useParams()
    const [roomExists, setRoomExists] = useState(undefined)
    const [lives, setLives] = useState(10)
    const [guess, setGuess] = useState('')
    const [phrase, setPhrase] = useState('')
    const [status, setStatus] = useState('')
    const [playing, setPlaying] = useState(false)
    const socketRef = useRef(null)

    const handleEndRound = () => {
        setPlaying(false)
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

    const handleBeforeUnload = () => {
        socketRef.current.emit('leave', gid)
    }

    useEffect(() => {
        socketRef.current = io(':3001')

        socketRef.current.emit('join', gid)

        socketRef.current.on('room joined', () => {
            setRoomExists(true)
        })
        socketRef.current.on('room dne', () => {
            setRoomExists(false)
        })

        socketRef.current.on('new phrase', (newPhrase) => {
            setStatus('')
            setGuess('')
            setPhrase(newPhrase)
            setPlaying(true)
        })

        socketRef.current.on('valid guess', () => {
            setStatus('valid')
            setGuess('')
            setPlaying(false)
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

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            handleBeforeUnload()
            window.removeEventListener('beforeunload', handleBeforeUnload);
        }
    }, [])

    return (
        <main>

            {roomExists === undefined && <div>
                Loading
            </div>}

            {roomExists === true && <div>
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
                        disabled={!playing}
                    />
                </form>
                <button onClick={() => socketRef.current.emit('start game', gid)}>Start Game</button>
            </div>}

            {roomExists === false && <div>
                Room {gid} does not exist.
            </div>}
        </main>
    )
}
