import { useState } from 'react'
import type { StatType } from '../api'

interface Props { statTypes: StatType[]; onConfirm: (selected: string[]) => void }

export default function StatTypeSelector({ statTypes, onConfirm }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set())

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <div className="flex flex-col gap-3">
      <label className="font-semibold">Select stat types</label>
      {statTypes.map((stat) => (
        <label key={stat.id} className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={selected.has(stat.id)}
            onChange={() => toggle(stat.id)}
            className="w-4 h-4"
          />
          {stat.label}
        </label>
      ))}
      <button
        onClick={() => { if (selected.size > 0) onConfirm([...selected]) }}
        className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Generate Highlights
      </button>
    </div>
  )
}
