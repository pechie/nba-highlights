import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import VideoPlayer from './VideoPlayer'

describe('VideoPlayer', () => {
  it('renders video element with provided src', () => {
    render(<VideoPlayer src="blob:http://localhost/fake" loading={false} />)
    const video = screen.getByTestId('highlight-video') as HTMLVideoElement
    expect(video.src).toBe('blob:http://localhost/fake')
  })

  it('shows compiling message when loading', () => {
    render(<VideoPlayer src={null} loading={true} />)
    expect(screen.getByText(/compiling/i)).toBeDefined()
  })

  it('renders nothing when not loading and no src', () => {
    const { container } = render(<VideoPlayer src={null} loading={false} />)
    expect(container.firstChild).toBeNull()
  })
})
