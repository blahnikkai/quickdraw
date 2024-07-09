import Player from '../../../server/Player'
import './PlayerInfo.css'

export default function PlayerInfo({ playerInfo, playingGame }: { playerInfo: Player[], playingGame: boolean }) {
    return (
        <div className='players'>
            {playerInfo.map((player) => {
                return <div className={`player ${player.dying ? ' dying' : ''}${player.dead ? ' dead' : ''}`}>
                    <div>{player.name}</div>
                    {playingGame && <div>{player.lives}</div>}
                    <div className={player.status}>{player.lastGuess}</div>
                </div>
            })}
        </div>
    )
}