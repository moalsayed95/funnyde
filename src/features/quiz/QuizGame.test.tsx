/**
 * QuizGame Component Tests
 * 
 * This file contains tests for the QuizGame component, which is the main game container
 * handling the core quiz functionality including:
 * - Displaying words
 * - Handling article selection
 * - Managing score
 * - Providing feedback
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { QuizGame } from './QuizGame'

// Mock the localStorage
const localStorageMock = {
  getItem: vi.fn(() => '0'),
  setItem: vi.fn(),
}
Object.defineProperty(window, 'localStorage', { value: localStorageMock })

describe('QuizGame', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    localStorageMock.getItem.mockReturnValue('0')
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('should render the quiz interface', () => {
    render(<QuizGame />)
    
    // Check if the basic elements are rendered
    expect(screen.getByTestId('question-text')).toBeInTheDocument()
    expect(screen.getByTestId('article-buttons')).toBeInTheDocument()
    expect(screen.getByTestId('score-display')).toBeInTheDocument()
  })

  it('should display article buttons', () => {
    render(<QuizGame />)
    
    // Check if all three article buttons are present
    const buttons = screen.getAllByRole('button').filter(button => 
      ['der', 'die', 'das'].includes(button.textContent?.toLowerCase() || '')
    )
    expect(buttons).toHaveLength(3)
    expect(buttons[0]).toHaveTextContent(/^der$/i)
    expect(buttons[1]).toHaveTextContent(/^die$/i)
    expect(buttons[2]).toHaveTextContent(/^das$/i)
  })

  it('should show feedback when an article is selected', () => {
    render(<QuizGame />)
    
    // Click on an article button (der)
    const buttons = screen.getAllByRole('button').filter(button => 
      ['der', 'die', 'das'].includes(button.textContent?.toLowerCase() || '')
    )
    fireEvent.click(buttons[0])
    
    // Check if feedback is displayed immediately
    expect(screen.getByTestId('feedback-message')).toBeInTheDocument()
  })

  it('should update score when correct article is selected', () => {
    render(<QuizGame />)
    
    // Get initial score
    const initialScoreElement = screen.getByTestId('current-score')
    const initialScore = Number(initialScoreElement.textContent)
    
    // Find and click the correct article button
    const correctArticle = screen.getByTestId('correct-article')
    fireEvent.click(correctArticle)
    
    // Check if score updates immediately
    const newScore = Number(screen.getByTestId('current-score').textContent)
    expect(newScore).toBe(initialScore + 1)

    // Advance timer to trigger word change
    vi.advanceTimersByTime(2000)
  })
}) 