import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TypingInterface } from './TypingInterface'

const mockExercise = {
  id: 'test-1',
  title: 'Test Exercise',
  description: 'A test exercise for typing practice',
  category: 'test',
  text: 'Hallo Welt',
  difficulty: 'beginner' as const
}

describe('TypingInterface', () => {
  it('should render the exercise title and description', () => {
    render(<TypingInterface exercise={mockExercise} />)
    
    expect(screen.getByText('Test Exercise')).toBeInTheDocument()
    expect(screen.getByText('A test exercise for typing practice')).toBeInTheDocument()
  })

  it('should display the text to type', () => {
    render(<TypingInterface exercise={mockExercise} />)
    
    expect(screen.getByText('Hallo Welt')).toBeInTheDocument()
  })

  it('should highlight current character when typing', () => {
    render(<TypingInterface exercise={mockExercise} />)
    
    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, { target: { value: 'H' } })
    
    const characters = screen.getAllByText(/[a-zA-Z]/)
    expect(characters[0]).toHaveStyle({ backgroundColor: '#dbeafe' })
  })

  it('should show mistakes in red', () => {
    render(<TypingInterface exercise={mockExercise} />)
    
    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, { target: { value: 'X' } })
    
    const characters = screen.getAllByText(/[a-zA-Z]/)
    expect(characters[0]).toHaveStyle({ color: '#ef4444' })
  })

  it('should show completion message when text is fully typed', () => {
    render(<TypingInterface exercise={mockExercise} />)
    
    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, { target: { value: 'Hallo Welt' } })
    
    expect(screen.getByText('Exercise Complete! 🎉')).toBeInTheDocument()
  })

  it('should calculate and display typing statistics', () => {
    vi.useFakeTimers()
    
    render(<TypingInterface exercise={mockExercise} />)
    
    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, { target: { value: 'Hallo Welt' } })
    
    // Advance time by 1 second
    vi.advanceTimersByTime(1000)
    
    expect(screen.getByText('Words per Minute')).toBeInTheDocument()
    expect(screen.getByText('Accuracy')).toBeInTheDocument()
    expect(screen.getByText('Mistakes')).toBeInTheDocument()
    
    vi.useRealTimers()
  })

  it('should allow restarting the exercise', () => {
    render(<TypingInterface exercise={mockExercise} />)
    
    // Complete the exercise
    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, { target: { value: 'Hallo Welt' } })
    
    // Click restart button
    fireEvent.click(screen.getByText('Try Again'))
    
    // Check if textarea is empty and focused
    expect(textarea).toHaveValue('')
    expect(textarea).toHaveFocus()
  })
}) 