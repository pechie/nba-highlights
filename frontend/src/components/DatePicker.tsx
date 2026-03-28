import { useState } from 'react'

interface Props { onSelect: (date: string) => void }

export default function DatePicker({ onSelect }: Props) {
  const [date, setDate] = useState('')
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="date-input" className="text-sm font-medium text-[#6E6E73]">Date</label>
        <input
          id="date-input"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border border-[#D2D2D7] rounded-xl px-4 py-3 text-[#1D1D1F] bg-white focus:outline-none focus:ring-2 focus:ring-[#0071E3] focus:border-transparent transition-shadow"
        />
      </div>
      <button
        onClick={() => { if (date) onSelect(date) }}
        disabled={!date}
        className="w-full bg-[#0071E3] disabled:bg-[#D2D2D7] text-white font-medium py-3 rounded-full hover:bg-[#0077ED] transition-colors"
      >
        Find Games
      </button>
    </div>
  )
}
