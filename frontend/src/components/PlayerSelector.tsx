import type { Player } from '../api'

interface Props { players: Player[]; onSelect: (player: Player) => void }

export default function PlayerSelector({ players, onSelect }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-semibold">Select a player</label>
      {players.map((player) => (
        <button
          key={player.player_id}
          onClick={() => onSelect(player)}
          className="text-left border rounded px-4 py-3 hover:bg-blue-50 hover:border-blue-400"
        >
          <span className="font-medium">{player.name}</span>
          <span className="ml-2 text-sm text-gray-500">{player.team}</span>
        </button>
      ))}
    </div>
  )
}
