import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import PlayerSelector from './PlayerSelector'
import type { Player } from '../api'

const players: Player[] = [
  { player_id: 1629029, name: 'Shai Gilgeous-Alexander', team: 'OKC' },
  { player_id: 1628384, name: 'Jayson Tatum', team: 'BOS' },
]

describe('PlayerSelector', () => {
  it('renders all player names', () => {
    render(<PlayerSelector players={players} onSelect={vi.fn()} />)
    expect(screen.getByText('Shai Gilgeous-Alexander')).toBeDefined()
    expect(screen.getByText('Jayson Tatum')).toBeDefined()
  })

  it('calls onSelect with the clicked player', () => {
    const onSelect = vi.fn()
    render(<PlayerSelector players={players} onSelect={onSelect} />)
    fireEvent.click(screen.getByText('Shai Gilgeous-Alexander'))
    expect(onSelect).toHaveBeenCalledWith(players[0])
  })
})
