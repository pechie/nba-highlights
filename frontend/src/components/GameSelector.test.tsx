import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import GameSelector from './GameSelector'
import type { Game } from '../api'

const games: Game[] = [
  { game_id: '001', home_team: 'OKC', away_team: 'BOS', label: 'OKC vs BOS', status: 'Final' },
  { game_id: '002', home_team: 'LAL', away_team: 'GSW', label: 'LAL vs GSW', status: 'Final' },
]

describe('GameSelector', () => {
  it('renders all game labels', () => {
    render(<GameSelector games={games} onSelect={vi.fn()} />)
    expect(screen.getByText('OKC vs BOS')).toBeDefined()
    expect(screen.getByText('LAL vs GSW')).toBeDefined()
  })

  it('calls onSelect with the clicked game', () => {
    const onSelect = vi.fn()
    render(<GameSelector games={games} onSelect={onSelect} />)
    fireEvent.click(screen.getByText('OKC vs BOS'))
    expect(onSelect).toHaveBeenCalledWith(games[0])
  })
})
