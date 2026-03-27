export interface Game {
  game_id: string
  home_team: string
  away_team: string
  label: string
  status: string
}

export interface Player {
  player_id: number
  name: string
  team: string
}

export interface StatType {
  id: string
  label: string
}

async function checkOk(res: Response): Promise<Response> {
  if (!res.ok) throw new Error(`API error ${res.status}: ${await res.text()}`)
  return res
}

export async function fetchGames(date: string): Promise<Game[]> {
  return (await checkOk(await fetch(`/api/games?date=${date}`))).json()
}

export async function fetchPlayers(gameId: string): Promise<Player[]> {
  return (await checkOk(await fetch(`/api/games/${gameId}/players`))).json()
}

export async function fetchStatTypes(gameId: string, playerId: number): Promise<StatType[]> {
  return (await checkOk(await fetch(`/api/games/${gameId}/players/${playerId}/stat-types`))).json()
}

export async function compileHighlights(
  gameId: string,
  playerId: number,
  statTypes: string[]
): Promise<string> {
  const res = await checkOk(await fetch('/api/highlights/compile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ game_id: gameId, player_id: playerId, stat_types: statTypes }),
  }))
  return URL.createObjectURL(await res.blob())
}
