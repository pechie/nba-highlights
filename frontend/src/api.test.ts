import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchGames, fetchPlayers, fetchStatTypes, compileHighlights } from './api'

beforeEach(() => vi.resetAllMocks())

describe('fetchGames', () => {
  it('calls /api/games with date and returns json', async () => {
    const data = [{ game_id: '001', home_team: 'OKC', away_team: 'BOS', label: 'OKC vs BOS', status: 'Final' }]
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({ ok: true, json: async () => data } as Response)
    const result = await fetchGames('2025-03-01')
    expect(fetch).toHaveBeenCalledWith('/api/games?date=2025-03-01')
    expect(result).toEqual(data)
  })
})

describe('fetchPlayers', () => {
  it('calls /api/games/{id}/players', async () => {
    const data = [{ player_id: 1629029, name: 'SGA', team: 'OKC' }]
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({ ok: true, json: async () => data } as Response)
    const result = await fetchPlayers('0022501054')
    expect(fetch).toHaveBeenCalledWith('/api/games/0022501054/players')
    expect(result).toEqual(data)
  })
})

describe('fetchStatTypes', () => {
  it('calls /api/games/{id}/players/{pid}/stat-types', async () => {
    const data = [{ id: 'FGM', label: 'Made Field Goals' }]
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({ ok: true, json: async () => data } as Response)
    const result = await fetchStatTypes('0022501054', 1629029)
    expect(fetch).toHaveBeenCalledWith('/api/games/0022501054/players/1629029/stat-types')
    expect(result).toEqual(data)
  })
})

describe('compileHighlights', () => {
  it('POSTs and returns a blob URL', async () => {
    const blob = new Blob([new Uint8Array([0])], { type: 'video/mp4' })
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({ ok: true, blob: async () => blob } as Response)
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:fake')
    const result = await compileHighlights('0022501054', 1629029, ['FGM'], 'high')
    expect(fetch).toHaveBeenCalledWith('/api/highlights/compile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ game_id: '0022501054', player_id: 1629029, stat_types: ['FGM'], quality: 'high' }),
    })
    expect(result).toBe('blob:fake')
  })
})
