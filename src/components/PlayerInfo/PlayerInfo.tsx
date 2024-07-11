import './PlayerInfo.css'
import Player from '../../../server/Player'
import GameStatus from '../../GameStatus'

export default function PlayerInfo({ playerInfo, gameStatus }: { playerInfo: Player[], gameStatus: GameStatus }) {
    return (
        <div className='players'>
            {playerInfo.map((player) => {
                return <div className={`player ${player.dying ? ' dying' : ''}${player.dead ? ' dead' : ''}`}>
                    <div>{player.name}</div>
                    {gameStatus !== GameStatus.WAITING && <div>{player.lives}</div>}
                    <div className={player.status}>{player.lastGuess}</div>
                </div>
            })}
        </div>
    )
}
