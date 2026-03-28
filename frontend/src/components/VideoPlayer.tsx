interface Props { src: string | null; loading: boolean }

export default function VideoPlayer({ src, loading }: Props) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-12">
        <svg className="animate-spin w-8 h-8 text-[#0071E3]" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        <p className="text-sm text-[#6E6E73]">Compiling highlight reel…</p>
      </div>
    )
  }
  if (!src) return null
  return (
    <video
      data-testid="highlight-video"
      src={src}
      controls
      autoPlay
      className="w-full rounded-xl"
    />
  )
}
