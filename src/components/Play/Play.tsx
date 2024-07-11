import { io, Socket } from 'socket.io-client'
import { useParams } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import './Play.css'
import PlayerInfo from '../PlayerInfo/PlayerInfo'
import Pregame from '../Pregame/Pregame'
import Ingame from '../Ingame/Ingame'
import Postgame from '../Postgame/Postgame'
import Player from '../../../server/Player'

export default function Play() {
    const { gid } = useParams()
    const [roomExists, setRoomExists] = useState(undefined)
    const [phrase, setPhrase] = useState('')
    const [playingRound, setPlayingRound] = useState(false)
    const [gameStatus, setGameStatus] = useState('waiting')

    const [guess, setGuess] = useState('')

    const [selfPlayerInfo, setSelfPlayerInfo] = useState(undefined)
    const [playerInfo, setPlayerInfo] = useState([])
    const [winner, setWinner] = useState(undefined)

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
            setGameStatus('playing')
        })

        socketRef.current.on('game ended', (winner: Player) => {
            setGameStatus('ended')
            setWinner(winner)
        })

        socketRef.current.on('start round', (newPhrase: string) => {
            setGuess('')
            setPhrase(newPhrase)
            setPlayingRound(true)
        })

        socketRef.current.on('end round', () => {
            handleEndRound()
        })

        socketRef.current.on('new game', () => {
            setGameStatus('waiting')
        })

        socketRef.current.on('update player info', (newPlayerInfo: Player[]) => {
            setPlayerInfo(newPlayerInfo)
            const newSelf = newPlayerInfo.find((player: Player) => player.socketId === socketRef.current.id)
            setSelfPlayerInfo(newSelf)
            if (newSelf.dead) {
                setPlayingRound(false)
            }
            if (newSelf.status === 'valid') {
                setPlayingRound(false)
                setGuess('')
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
                    {gameStatus !== 'ended' &&
                        <PlayerInfo
                            playerInfo={playerInfo}
                            gameStatus={gameStatus}
                        />
                    }

                    {gameStatus === 'waiting' &&
                        <Pregame
                            socket={socketRef.current}
                            name={selfPlayerInfo?.name}
                            gid={gid}
                        />
                    }

                    {gameStatus === 'playing' &&
                        <Ingame
                            guess={guess}
                            setGuess={setGuess}
                            gid={gid}
                            socket={socketRef.current}
                            phrase={phrase}
                            lives={selfPlayerInfo?.lives}
                            status={selfPlayerInfo?.status}
                            playingRound={playingRound}
                            lastGuess={selfPlayerInfo?.lastGuess}
                        />
                    }

                    {gameStatus === 'ended' &&
                        <Postgame
                            gid={gid}
                            winnerName={winner?.name}
                            socket={socketRef.current}
                        />
                    }
                </div>
            }
        </main>
    )
}
