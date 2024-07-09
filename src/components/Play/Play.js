import io from 'socket.io-client'
import {useParams} from 'react-router-dom'
import {useEffect, useRef, useState} from 'react'
import './Play.css'

export default function Play() {
    const {gid} = useParams()
    const [roomExists, setRoomExists] = useState(undefined)
    const [phrase, setPhrase] = useState('')
    const [playingRound, setPlayingRound] = useState(false)
    const [playingGame, setPlayingGame] = useState(false)

    // const [name, setName] = useState('Player')
    // const [lives, setLives] = useState(undefined)
    const [guess, setGuess] = useState('')
    // const [status, setStatus] = useState('')

    const [selfPlayerInfo, setSelfPlayerInfo] = useState(undefined)
    const [playerInfo, setPlayerInfo] = useState([])

    const socketRef = useRef(null)

    const handleEndRound = () => {
        setPlayingRound(false)
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
            setGuess('')
            setPhrase(newPhrase)
            setPlayingRound(true)
        })

        socketRef.current.on('end round', () => {
            handleEndRound()
        })

        socketRef.current.on('update player info', (newPlayerInfo) => {
            setPlayerInfo(newPlayerInfo)
            setSelfPlayerInfo(newPlayerInfo.find((player) => player.socketId === socketRef.current.id))
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
                <div className=''>
                    <div className='players'>
                        {playerInfo.map((player) => {
                            return <div className='player'>
                                <div>{player.name}</div>
                                <div>{player.lives}</div>
                                <div className={player.status}>{player.lastGuess}</div>
                            </div>
                        })}
                    </div>

                    {!playingGame &&
                        <div className='game-ui'>
                            <input
                                onChange={
                                    (event) => {
                                        const newName = event.target.value
                                        socketRef.current.emit('change name', gid, newName)
                                    }
                                }
                                value={selfPlayerInfo?.name}
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
                            <div>{phrase}</div>
                            <div>Lives: {selfPlayerInfo?.lives}</div>
                            <div>{selfPlayerInfo?.status}</div>
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
