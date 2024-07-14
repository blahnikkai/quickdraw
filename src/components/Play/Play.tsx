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

    const startTimeRef = useRef<number>(12)
    const endTimeRef = useRef<number>(14)
    const [timeProgress, setTimeProgress] = useState(0)

    const [selfPlayerInfo, setSelfPlayerInfo] = useState<Player>(undefined)
    const [playerInfo, setPlayerInfo] = useState([])
    const [winner, setWinner] = useState(undefined)

    const [guess, setGuess] = useState('')

    const socketRef = useRef<Socket>(undefined)

    const intervalRef = useRef(undefined)

    const updateTimeProgress = () => {
        const curTime = Date.now()
        const timeProgress = (curTime - startTimeRef.current) / (endTimeRef.current - startTimeRef.current)
        setTimeProgress(timeProgress)
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

        socketRef.current.on('start round', (newPhrase: string, start: number, end: number) => {
            setGuess('')
            setPhrase(newPhrase)
            setPlayingRound(!selfPlayerInfo?.dead)
            startTimeRef.current = start
            endTimeRef.current = end
            console.log(`start time to ${start}`)
            console.log(`end time to ${end}`)

            intervalRef.current = setInterval(updateTimeProgress, 300)
        })

        socketRef.current.on('end round', () => {
            setPlayingRound(false)
            clearInterval(intervalRef.current)
        })

        socketRef.current.on('new game', () => {
            setGameStatus(GameStatus.WAITING)
        })

        socketRef.current.on('update player info', (newPlayerInfo: Player[]) => {
            setPlayerInfo(newPlayerInfo)
            const newSelf = newPlayerInfo.find((player: Player) => player.socketId === socketRef.current.id)
            setSelfPlayerInfo(newSelf)
            if (newSelf.lastGuessStatus === GuessStatus.VALID) {
                clearInterval(intervalRef.current)
                setPlayingRound(false)
                setGuess('')
            }
        })
        
        const intervalId = intervalRef.current

        return () => {
            socketRef.current.disconnect()
            clearInterval(intervalId)
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
                            playingRound={playingRound}
                            timeProgress={timeProgress}
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
