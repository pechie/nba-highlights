import { useState } from 'react'
import DatePicker from './DatePicker'
import GameSelector from './GameSelector'
import PlayerSelector from './PlayerSelector'
import StatTypeSelector from './StatTypeSelector'
import VideoPlayer from './VideoPlayer'
import { fetchGames, fetchPlayers, fetchStatTypes, compileHighlights } from '../api'
import type { Game, Player, StatType } from '../api'

type Step = 'date' | 'game' | 'player' | 'stats' | 'video'

const STEP_LABELS: Record<Step, string> = {
  date: 'Choose Date',
  game: 'Choose Game',
  player: 'Choose Player',
  stats: 'Choose Stats',
  video: 'Highlight Reel',
}

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

  async function handleStatConfirm(selected: string[], quality: string) {
    setError(null)
    setStep('video')
    setLoading(true)
    try {
      setVideoSrc(await compileHighlights(selectedGame!.game_id, selectedPlayer!.player_id, selected, quality))
    } catch (e) { setError((e as Error).message) }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <div className="w-full max-w-lg sm:max-w-2xl md:max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8 flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-[#1D1D1F]">NBA Highlights</h1>
          <p className="mt-1 text-[#6E6E73] text-sm">{STEP_LABELS[step]}</p>
        </div>

        {error && (
          <div className="bg-[#FFF2F2] border border-[#FFD0D0] rounded-xl px-4 py-3 text-sm text-[#C00]">
            {error}
          </div>
        )}

        {loading && step !== 'video' && (
          <div className="flex items-center gap-2 text-sm text-[#6E6E73]">
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Loading…
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-[#D2D2D7] overflow-hidden">
          <div className="p-6">
            {step === 'date' && <DatePicker onSelect={handleDateSelect} />}
            {step === 'game' && <GameSelector games={games} onSelect={handleGameSelect} />}
            {step === 'player' && <PlayerSelector players={players} game={selectedGame!} onSelect={handlePlayerSelect} />}
            {step === 'stats' && <StatTypeSelector statTypes={statTypes} onConfirm={handleStatConfirm} />}
            {step === 'video' && <VideoPlayer src={videoSrc} loading={loading} />}
          </div>
        </div>
      </div>
    </div>
  )
}
