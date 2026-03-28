import { useState } from 'react'
import type { StatType } from '../api'

interface Props { statTypes: StatType[]; onConfirm: (selected: string[], quality: string) => void }

const QUALITY_OPTIONS = [
  { id: 'low', label: 'Low' },
  { id: 'medium', label: 'Medium' },
  { id: 'high', label: 'High' },
]

export default function StatTypeSelector({ statTypes, onConfirm }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [quality, setQuality] = useState('high')

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium text-[#6E6E73]">Stat Types</p>
        <div className="flex flex-col divide-y divide-[#F2F2F7] border border-[#D2D2D7] rounded-xl overflow-hidden">
          {statTypes.map((stat) => (
            <button
              key={stat.id}
              onClick={() => toggle(stat.id)}
              className="flex items-center justify-between px-4 py-4 bg-white hover:bg-[#F5F5F7] transition-colors text-left"
            >
              <span className="text-sm font-medium text-[#1D1D1F]">{stat.label}</span>
              <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
                selected.has(stat.id) ? 'bg-[#0071E3] border-[#0071E3]' : 'border-[#D2D2D7]'
              }`}>
                {selected.has(stat.id) && (
                  <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium text-[#6E6E73]">Video Quality</p>
        <div className="flex gap-2">
          {QUALITY_OPTIONS.map((option) => (
            <button
              key={option.id}
              onClick={() => setQuality(option.id)}
              className={`flex-1 py-2.5 rounded-full text-sm font-medium border transition-colors ${
                quality === option.id
                  ? 'bg-[#0071E3] border-[#0071E3] text-white'
                  : 'bg-white border-[#D2D2D7] text-[#1D1D1F] hover:bg-[#F5F5F7]'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => { if (selected.size > 0) onConfirm([...selected], quality) }}
        disabled={selected.size === 0}
        className="w-full bg-[#0071E3] disabled:bg-[#D2D2D7] text-white font-medium py-3 rounded-full hover:bg-[#0077ED] transition-colors"
      >
        Generate Highlights
      </button>
    </div>
  )
}
