import Player from '../../../server/Player'
import './PlayerInfo.css'

export default function PlayerInfo({ playerInfo, gameStatus }: { playerInfo: Player[], gameStatus: string }) {
    return (
        <div className='players'>
            {playerInfo.map((player) => {
                return <div className={`player ${player.dying ? ' dying' : ''}${player.dead ? ' dead' : ''}`}>
                    <div>{player.name}</div>
                    {gameStatus !== 'waiting' && <div>{player.lives}</div>}
                    <div className={player.status}>{player.lastGuess}</div>
                </div>
            })}
        </div>
    )
}
