import type { Game } from '../api'

interface Props { games: Game[]; onSelect: (game: Game) => void }

export default function GameSelector({ games, onSelect }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-semibold">Select a game</label>
      {games.map((game) => (
        <button
          key={game.game_id}
          onClick={() => onSelect(game)}
          className="text-left border rounded px-4 py-3 hover:bg-blue-50 hover:border-blue-400"
        >
          <span className="font-medium">{game.label}</span>
          <span className="ml-2 text-sm text-gray-500">{game.status}</span>
        </button>
      ))}
    </div>
  )
}
