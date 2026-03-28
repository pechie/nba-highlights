import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import StatTypeSelector from './StatTypeSelector'
import type { StatType } from '../api'

const statTypes: StatType[] = [
  { id: 'FGM', label: 'Made Field Goals' },
  { id: 'AST', label: 'Assists' },
]

describe('StatTypeSelector', () => {
  it('renders stat types and quality options', () => {
    render(<StatTypeSelector statTypes={statTypes} onConfirm={vi.fn()} />)
    expect(screen.getByText('Made Field Goals')).toBeDefined()
    expect(screen.getByText('Assists')).toBeDefined()
    expect(screen.getByRole('button', { name: 'Low' })).toBeDefined()
    expect(screen.getByRole('button', { name: 'Medium' })).toBeDefined()
    expect(screen.getByRole('button', { name: 'High' })).toBeDefined()
  })

  it('calls onConfirm with selected stat ids and default quality', () => {
    const onConfirm = vi.fn()
    render(<StatTypeSelector statTypes={statTypes} onConfirm={onConfirm} />)
    fireEvent.click(screen.getByText('Made Field Goals'))
    fireEvent.click(screen.getByRole('button', { name: /generate/i }))
    expect(onConfirm).toHaveBeenCalledWith(['FGM'], 'high')
  })

  it('calls onConfirm with selected quality', () => {
    const onConfirm = vi.fn()
    render(<StatTypeSelector statTypes={statTypes} onConfirm={onConfirm} />)
    fireEvent.click(screen.getByText('Made Field Goals'))
    fireEvent.click(screen.getByRole('button', { name: 'Low' }))
    fireEvent.click(screen.getByRole('button', { name: /generate/i }))
    expect(onConfirm).toHaveBeenCalledWith(['FGM'], 'low')
  })

  it('does not call onConfirm when nothing selected', () => {
    const onConfirm = vi.fn()
    render(<StatTypeSelector statTypes={statTypes} onConfirm={onConfirm} />)
    fireEvent.click(screen.getByRole('button', { name: /generate/i }))
    expect(onConfirm).not.toHaveBeenCalled()
  })
})
