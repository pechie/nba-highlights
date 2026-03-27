import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import DatePicker from './DatePicker'

describe('DatePicker', () => {
  it('calls onSelect with the date when submitted', () => {
    const onSelect = vi.fn()
    render(<DatePicker onSelect={onSelect} />)
    fireEvent.change(screen.getByLabelText(/select a date/i), { target: { value: '2025-03-01' } })
    fireEvent.click(screen.getByRole('button', { name: /find games/i }))
    expect(onSelect).toHaveBeenCalledWith('2025-03-01')
  })

  it('does not call onSelect when input is empty', () => {
    const onSelect = vi.fn()
    render(<DatePicker onSelect={onSelect} />)
    fireEvent.click(screen.getByRole('button', { name: /find games/i }))
    expect(onSelect).not.toHaveBeenCalled()
  })
})
