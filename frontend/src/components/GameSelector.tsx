import type { Game } from '../api'

interface Props { games: Game[]; onSelect: (game: Game) => void }

function TeamInfo({ tricode, teamId, record }: { tricode: string; teamId: number; record: string }) {
  return (
    <div className={`flex flex-col items-center gap-1 w-24 flex-shrink-0`}>
      <img
        src={`https://cdn.nba.com/logos/nba/${teamId}/global/L/logo.svg`}
        alt={tricode}
        className="w-12 h-12"
      />
      <span className="text-sm font-semibold text-[#1D1D1F]">{tricode}</span>
      <span className="text-xs text-[#6E6E73]">{record}</span>
    </div>
  )
}

export default function GameSelector({ games, onSelect }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-medium text-[#6E6E73]">Games</p>
      <div className="flex flex-col divide-y divide-[#F2F2F7] border border-[#D2D2D7] rounded-xl overflow-hidden">
        {games.map((game) => {
          const homeWon = game.winner === game.home_team
          const awayWon = game.winner === game.away_team
          const isOver = game.winner !== ''
          return (
            <button
              key={game.game_id}
              onClick={() => onSelect(game)}
              className="flex items-center gap-4 px-5 py-4 bg-white hover:bg-[#F5F5F7] transition-colors"
            >
              <TeamInfo tricode={game.home_team} teamId={game.home_team_id} record={game.home_record}  />
              <div className="flex-1 flex items-center justify-center gap-3">
                <span className={`text-3xl tabular-nums ${homeWon ? 'font-bold text-[#1D1D1F]' : isOver ? 'font-light text-[#6E6E73]' : 'font-semibold text-[#1D1D1F]'}`}>
                  {game.home_pts}
                </span>
                <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest text-[#6E6E73] leading-none">
                  {homeWon && <span className="text-[#1D1D1F]">◀</span>}
                  <span>{game.status}</span>
                  {awayWon && <span className="text-[#1D1D1F]">▶</span>}
                </div>
                <span className={`text-3xl tabular-nums ${awayWon ? 'font-bold text-[#1D1D1F]' : isOver ? 'font-light text-[#6E6E73]' : 'font-semibold text-[#1D1D1F]'}`}>
                  {game.away_pts}
                </span>
              </div>
              <TeamInfo tricode={game.away_team} teamId={game.away_team_id} record={game.away_record}  />
            </button>
          )
        })}
      </div>
    </div>
  )
}
