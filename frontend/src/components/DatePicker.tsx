import { useState } from 'react'

interface Props { onSelect: (date: string) => void }

export default function DatePicker({ onSelect }: Props) {
  const [date, setDate] = useState('')
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="date-input" className="font-semibold">Select a date</label>
      <input
        id="date-input"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="border rounded px-3 py-2"
      />
      <button
        onClick={() => { if (date) onSelect(date) }}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Find Games
      </button>
    </div>
  )
}
