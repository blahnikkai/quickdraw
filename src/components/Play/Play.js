import io from 'socket.io-client'
import {useParams} from 'react-router-dom'
import {useEffect, useRef, useState} from 'react'
import './Play.css'

export default function Play() {
    const {gid} = useParams()
    const [roomExists, setRoomExists] = useState(undefined)
    const [name, setName] = useState('Player')
    const [lives, setLives] = useState(undefined)
    const [guess, setGuess] = useState('')
    const [phrase, setPhrase] = useState('')
    const [status, setStatus] = useState('')
    const [playingRound, setPlayingRound] = useState(false)
    const [playingGame, setPlayingGame] = useState(false)
    const [playerInfo, setPlayerInfo] = useState([])
    const socketRef = useRef(null)

    const handleEndRound = () => {
        setPlayingRound(false)
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

        socketRef.current.on('room joined', () => {
            setRoomExists(true)
        })
        socketRef.current.on('room dne', () => {
            setRoomExists(false)
        })

        socketRef.current.on('game started', () => {
            setPlayingGame(true)
        })

        socketRef.current.on('start round', (newPhrase) => {
            setStatus('')
            setGuess('')
            setPhrase(newPhrase)
            setPlayingRound(true)
        })

        socketRef.current.on('guess checked', (result) => {
            setStatus(result)
        })

        socketRef.current.on('end round', () => {
            handleEndRound()
        })

        socketRef.current.on('update player info', (newPlayerInfo) => {
            setPlayerInfo(newPlayerInfo)
        })

        return () => {
            socketRef.current.disconnect()
        }
    }, [])

    return (
        <main>

            {roomExists === undefined && <div>
                Loading
            </div>}

            {roomExists === true &&
                <div>
                    <ul className='game-ui player-info'>
                        {playerInfo.map((player) => {
                            return <li>
                                {player.name} {player.lastGuess} {player.lives}
                            </li>
                        })}
                    </ul>
                    
                    {!playingGame &&
                    <div className='game-ui'>
                        <input
                            onChange={
                                (event) => {
                                    const newName = event.target.value
                                    setName(newName)
                                    socketRef.current.emit('change name', gid, newName)
                                }
                            }
                            value={name}
                        />
                        <button
                            onClick={
                                () => {
                                    socketRef.current.emit('start game', gid)
                                }
                            }
                        >
                            Start Game
                        </button>
                    </div>}
                    {playingGame &&
                    <div className='game-ui'>
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
                                disabled={!playingRound}
                            />
                        </form>
                    </div>}
                </div>
            }

            {roomExists === false && <div>
                Room {gid} does not exist.
            </div>}
        </main>
    )
}
