import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import StatTypeSelector from './StatTypeSelector'
import type { StatType } from '../api'

const statTypes: StatType[] = [
  { id: 'FGM', label: 'Made Field Goals' },
  { id: 'AST', label: 'Assists' },
]

describe('StatTypeSelector', () => {
  it('renders checkboxes for each stat type', () => {
    render(<StatTypeSelector statTypes={statTypes} onConfirm={vi.fn()} />)
    expect(screen.getByLabelText('Made Field Goals')).toBeDefined()
    expect(screen.getByLabelText('Assists')).toBeDefined()
  })

  it('calls onConfirm with selected stat ids', () => {
    const onConfirm = vi.fn()
    render(<StatTypeSelector statTypes={statTypes} onConfirm={onConfirm} />)
    fireEvent.click(screen.getByLabelText('Made Field Goals'))
    fireEvent.click(screen.getByRole('button', { name: /generate/i }))
    expect(onConfirm).toHaveBeenCalledWith(['FGM'])
  })

  it('does not call onConfirm when nothing selected', () => {
    const onConfirm = vi.fn()
    render(<StatTypeSelector statTypes={statTypes} onConfirm={onConfirm} />)
    fireEvent.click(screen.getByRole('button', { name: /generate/i }))
    expect(onConfirm).not.toHaveBeenCalled()
  })
})
