import { Socket } from 'socket.io-client'
import './Waiting.css'
import GameStatus from '../../GameStatus'
import Player from '../../../server/Player'

export default function Waiting({ socket, gid, winner }: { socket: Socket, gid: string, winner: Player }) {
    return (
        <div className='game-ui'>
            {winner && (winner.name ? winner.name + " won the game!" : "Nobody won!")}
            <button
                onClick={() => socket.emit('change game status', gid, GameStatus.READY)}
            >
                Ready Up
            </button>
        </div>
    )
}
