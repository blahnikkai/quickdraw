import { io, Socket } from 'socket.io-client'
import { useParams } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import './Play.css'
import PlayerInfo from '../PlayerInfo/PlayerInfo'
import Pregame from '../Pregame/Pregame'
import Ingame from '../Ingame/Ingame'
import Player from '../../../server/Player'

export default function Play() {
    const { gid } = useParams()
    const [roomExists, setRoomExists] = useState(undefined)
    const [phrase, setPhrase] = useState('')
    const [playingRound, setPlayingRound] = useState(false)
    const [playingGame, setPlayingGame] = useState(false)

    const [guess, setGuess] = useState('')

    const [selfPlayerInfo, setSelfPlayerInfo] = useState(undefined)
    const [playerInfo, setPlayerInfo] = useState([])

    const socketRef = useRef<Socket>(undefined)

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

        socketRef.current.on('update player info', (newPlayerInfo: Player[]) => {
            setPlayerInfo(newPlayerInfo)
            const newSelf = newPlayerInfo.find((player: Player) => player.socketId === socketRef.current.id)
            setSelfPlayerInfo(newSelf)
            if (newSelf.dead) {
                setPlayingRound(false)
            }
        })

        return () => {
            socketRef.current.disconnect()
        }
    }, [])

    return (
        <main>

            {roomExists === undefined && 
                <div>
                    Loading
                </div>
            }

            {roomExists === false && 
                <div>
                    Room {gid} does not exist.
                </div>
            }

            {roomExists === true &&
                <div>
                    <PlayerInfo
                        playerInfo={playerInfo}
                        playingGame={playingGame}
                    />

                    {!playingGame &&
                        <Pregame
                            socket={socketRef.current}
                            name={selfPlayerInfo?.name}
                            gid={gid}
                        />
                    }

                    {playingGame &&
                        <Ingame
                            guess={guess}
                            setGuess={setGuess}
                            gid={gid}
                            socket={socketRef.current}
                            phrase={phrase}
                            lives={selfPlayerInfo?.lives}
                            status={selfPlayerInfo?.status}
                            playingRound={playingRound}
                        />
                    }
                </div>
            }
        </main>
    )
}
