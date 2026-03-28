import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import PlayerSelector from './PlayerSelector'
import type { Game, Player } from '../api'

const players: Player[] = [
  { player_id: 1629029, name: 'Shai Gilgeous-Alexander', team: 'OKC', jersey: '2' },
  { player_id: 1628384, name: 'Jayson Tatum', team: 'BOS', jersey: '0' },
]

const game: Game = {
  game_id: '001', home_team: 'OKC', away_team: 'BOS',
  home_team_id: 1610612760, away_team_id: 1610612738,
  home_pts: 110, away_pts: 105, home_record: '55-16', away_record: '42-29',
  status: 'Final', winner: 'OKC', label: 'OKC vs BOS',
}

describe('PlayerSelector', () => {
  it('renders all player names under their team columns', () => {
    render(<PlayerSelector players={players} game={game} onSelect={vi.fn()} />)
    expect(screen.getByText('Shai Gilgeous-Alexander')).toBeDefined()
    expect(screen.getByText('Jayson Tatum')).toBeDefined()
    expect(screen.getByText('OKC')).toBeDefined()
    expect(screen.getByText('BOS')).toBeDefined()
  })

  it('calls onSelect with the clicked player', () => {
    const onSelect = vi.fn()
    render(<PlayerSelector players={players} game={game} onSelect={onSelect} />)
    fireEvent.click(screen.getByText('Shai Gilgeous-Alexander'))
    expect(onSelect).toHaveBeenCalledWith(players[0])
  })
})
