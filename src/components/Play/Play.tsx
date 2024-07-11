import { io, Socket } from 'socket.io-client'
import { useParams } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import './Play.css'
import PlayerInfo from '../PlayerInfo/PlayerInfo'
import Pregame from '../Pregame/Pregame'
import Ingame from '../Ingame/Ingame'
import Postgame from '../Postgame/Postgame'
import Player from '../../../server/Player'
import GameStatus from '../../GameStatus'
import GuessStatus from '../../GuessStatus'

export default function Play() {
    const { gid } = useParams()
    const [roomExists, setRoomExists] = useState(undefined)
    const [phrase, setPhrase] = useState('')
    const [playingRound, setPlayingRound] = useState(false)
    const [gameStatus, setGameStatus] = useState(GameStatus.WAITING)

    const [guess, setGuess] = useState('')

    const [selfPlayerInfo, setSelfPlayerInfo] = useState<Player>(undefined)
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
            setGameStatus(GameStatus.PLAYING)
        })

        socketRef.current.on('game ended', (winner: Player) => {
            setGameStatus(GameStatus.DONE)
            setWinner(winner)
        })

        socketRef.current.on('start round', (newPhrase: string) => {
            setGuess('')
            setPhrase(newPhrase)
            setPlayingRound(!selfPlayerInfo?.dead)
        })

        socketRef.current.on('end round', () => {
            handleEndRound()
        })

        socketRef.current.on('new game', () => {
            setGameStatus(GameStatus.WAITING)
        })

        socketRef.current.on('update player info', (newPlayerInfo: Player[]) => {
            setPlayerInfo(newPlayerInfo)
            const newSelf = newPlayerInfo.find((player: Player) => player.socketId === socketRef.current.id)
            setSelfPlayerInfo(newSelf)
            if (newSelf.lastGuessStatus === GuessStatus.VALID) {
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
                    {gameStatus !== GameStatus.DONE &&
                        <PlayerInfo
                            playerInfo={playerInfo}
                            gameStatus={gameStatus}
                        />
                    }

                    {gameStatus === GameStatus.WAITING &&
                        <Pregame
                            socket={socketRef.current}
                            name={selfPlayerInfo?.name}
                            gid={gid}
                        />
                    }

                    {gameStatus === GameStatus.PLAYING &&
                        <Ingame
                            selfPlayerInfo={selfPlayerInfo}
                            guess={guess}
                            setGuess={setGuess}
                            gid={gid}
                            socket={socketRef.current}
                            phrase={phrase}
                            playingRound={playingRound && !selfPlayerInfo?.dead}
                        />
                    }

                    {gameStatus === GameStatus.DONE &&
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
