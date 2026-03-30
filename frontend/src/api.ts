export interface Game {
  game_id: string
  home_team: string
  away_team: string
  home_team_id: number
  away_team_id: number
  home_pts: number
  away_pts: number
  home_record: string
  away_record: string
  status: string
  winner: string
  label: string
}

export interface Player {
  player_id: number
  name: string
  team: string
  jersey: string
}

export interface StatType {
  id: string
  label: string
}

const API_BASE = import.meta.env.VITE_API_BASE ?? '/api'

async function checkOk(res: Response): Promise<Response> {
  if (!res.ok) throw new Error(`API error ${res.status}: ${await res.text()}`)
  return res
}

export async function fetchGames(date: string): Promise<Game[]> {
  return (await checkOk(await fetch(`${API_BASE}/games?date=${date}`))).json()
}

export async function fetchPlayers(gameId: string): Promise<Player[]> {
  return (await checkOk(await fetch(`${API_BASE}/games/${gameId}/players`))).json()
}

export async function fetchStatTypes(gameId: string, playerId: number): Promise<StatType[]> {
  return (await checkOk(await fetch(`${API_BASE}/games/${gameId}/players/${playerId}/stat-types`))).json()
}

export async function compileHighlights(
  gameId: string,
  playerId: number,
  statTypes: string[],
  quality: string
): Promise<string> {
  const res = await checkOk(await fetch(`${API_BASE}/highlights/compile`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ game_id: gameId, player_id: playerId, stat_types: statTypes, quality }),
  }))
  return URL.createObjectURL(await res.blob())
}
