import { useState } from 'react'
import DatePicker from './DatePicker'
import GameSelector from './GameSelector'
import PlayerSelector from './PlayerSelector'
import StatTypeSelector from './StatTypeSelector'
import VideoPlayer from './VideoPlayer'
import { fetchGames, fetchPlayers, fetchStatTypes, compileHighlights } from '../api'
import type { Game, Player, StatType } from '../api'

type Step = 'date' | 'game' | 'player' | 'stats' | 'video'

export default function HighlightWizard() {
  const [step, setStep] = useState<Step>('date')
  const [games, setGames] = useState<Game[]>([])
  const [players, setPlayers] = useState<Player[]>([])
  const [statTypes, setStatTypes] = useState<StatType[]>([])
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
  const [videoSrc, setVideoSrc] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleDateSelect(date: string) {
    setError(null)
    setLoading(true)
    try {
      const result = await fetchGames(date)
      if (result.length === 0) { setError('No games found for this date.'); return }
      setGames(result)
      setStep('game')
    } catch (e) { setError((e as Error).message) }
    finally { setLoading(false) }
  }

  async function handleGameSelect(game: Game) {
    setError(null)
    setSelectedGame(game)
    setLoading(true)
    try {
      setPlayers(await fetchPlayers(game.game_id))
      setStep('player')
    } catch (e) { setError((e as Error).message) }
    finally { setLoading(false) }
  }

  async function handlePlayerSelect(player: Player) {
    setError(null)
    setSelectedPlayer(player)
    setLoading(true)
    try {
      setStatTypes(await fetchStatTypes(selectedGame!.game_id, player.player_id))
      setStep('stats')
    } catch (e) { setError((e as Error).message) }
    finally { setLoading(false) }
  }

  async function handleStatConfirm(selected: string[]) {
    setError(null)
    setStep('video')
    setLoading(true)
    try {
      setVideoSrc(await compileHighlights(selectedGame!.game_id, selectedPlayer!.player_id, selected))
    } catch (e) { setError((e as Error).message) }
    finally { setLoading(false) }
  }

  return (
    <div className="max-w-xl mx-auto py-10 px-4 flex flex-col gap-8">
      <h1 className="text-2xl font-bold">NBA Highlight Reel Generator</h1>
      {error && (
        <p className="text-red-600 bg-red-50 border border-red-200 rounded px-4 py-2">{error}</p>
      )}
      {loading && step !== 'video' && <p className="text-gray-500">Loading...</p>}
      {step === 'date' && <DatePicker onSelect={handleDateSelect} />}
      {step === 'game' && <GameSelector games={games} onSelect={handleGameSelect} />}
      {step === 'player' && <PlayerSelector players={players} onSelect={handlePlayerSelect} />}
      {step === 'stats' && <StatTypeSelector statTypes={statTypes} onConfirm={handleStatConfirm} />}
      {step === 'video' && <VideoPlayer src={videoSrc} loading={loading} />}
    </div>
  )
}
