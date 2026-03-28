import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import GameSelector from './GameSelector'
import type { Game } from '../api'

const games: Game[] = [
  { game_id: '001', home_team: 'OKC', away_team: 'BOS', home_team_id: 1610612760, away_team_id: 1610612738, home_pts: 110, away_pts: 105, home_record: '55-16', away_record: '42-29', status: 'Final', winner: 'OKC', label: 'OKC vs BOS' },
  { game_id: '002', home_team: 'LAL', away_team: 'GSW', home_team_id: 1610612747, away_team_id: 1610612744, home_pts: 98, away_pts: 112, home_record: '40-31', away_record: '35-36', status: 'Final', winner: 'GSW', label: 'LAL vs GSW' },
]

describe('GameSelector', () => {
  it('renders all game labels', () => {
    render(<GameSelector games={games} onSelect={vi.fn()} />)
    expect(screen.getByText('OKC')).toBeDefined()
    expect(screen.getByText('BOS')).toBeDefined()
    expect(screen.getByText('110–105')).toBeDefined()
    expect(screen.getByText('LAL')).toBeDefined()
    expect(screen.getByText('GSW')).toBeDefined()
    expect(screen.getByText('98–112')).toBeDefined()
  })

  it('calls onSelect with the clicked game', () => {
    const onSelect = vi.fn()
    render(<GameSelector games={games} onSelect={onSelect} />)
    fireEvent.click(screen.getAllByRole('button')[0])
    expect(onSelect).toHaveBeenCalledWith(games[0])
  })
})
