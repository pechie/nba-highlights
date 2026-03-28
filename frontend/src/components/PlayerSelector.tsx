import type { Game, Player } from '../api'

interface Props { players: Player[]; game: Game; onSelect: (player: Player) => void }

function PlayerColumn({ team, teamId, players, onSelect }: { team: string; teamId: number; players: Player[]; onSelect: (player: Player) => void }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 px-1">
        <img src={`https://cdn.nba.com/logos/nba/${teamId}/global/L/logo.svg`} alt={team} className="w-5 h-5" />
        <span className="text-xs font-semibold text-[#6E6E73] uppercase tracking-wider">{team}</span>
      </div>
      <div className="flex flex-col divide-y divide-[#F2F2F7] border border-[#D2D2D7] rounded-xl overflow-hidden">
        {players.map((player) => (
          <button
            key={player.player_id}
            onClick={() => onSelect(player)}
            className="flex items-center gap-3 px-3 py-3 bg-white hover:bg-[#F5F5F7] transition-colors text-left"
          >
            <img
              src={`https://cdn.nba.com/headshots/nba/latest/260x190/${player.player_id}.png`}
              alt={player.name}
              className="w-9 h-7 object-cover rounded-md bg-[#F2F2F7] flex-shrink-0"
              onError={(e) => { (e.target as HTMLImageElement).style.visibility = 'hidden' }}
            />
            {player.jersey && (
              <span className="text-xs font-semibold text-[#6E6E73] w-5 text-right flex-shrink-0">
                #{player.jersey}
              </span>
            )}
            <span className="text-sm font-medium text-[#1D1D1F]">{player.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default function PlayerSelector({ players, game, onSelect }: Props) {
  const homePlayers = players.filter((p) => p.team === game.home_team)
  const awayPlayers = players.filter((p) => p.team === game.away_team)
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm font-medium text-[#6E6E73]">Players</p>
      <div className="grid grid-cols-2 gap-4">
        <PlayerColumn team={game.home_team} teamId={game.home_team_id} players={homePlayers} onSelect={onSelect} />
        <PlayerColumn team={game.away_team} teamId={game.away_team_id} players={awayPlayers} onSelect={onSelect} />
      </div>
    </div>
  )
}
