interface Props { src: string | null; loading: boolean }

export default function VideoPlayer({ src, loading }: Props) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-48 border rounded bg-gray-50">
        <p className="text-gray-500 animate-pulse">Compiling highlight reel...</p>
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
      className="w-full rounded border"
    />
  )
}
