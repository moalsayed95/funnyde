import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Dashboard } from './Dashboard'

const renderWithRouter = (component: React.ReactNode) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('Dashboard', () => {
  it('should render the dashboard with header and cards', () => {
    renderWithRouter(<Dashboard />)
    
    // Check header content
    expect(screen.getByText('FunnyDe - German Learning')).toBeInTheDocument()
    expect(screen.getByText(/Interactive and fun ways to learn German/)).toBeInTheDocument()
    
    // Check if feature card is rendered
    expect(screen.getByText('Article Quiz')).toBeInTheDocument()
    expect(screen.getByText(/Practice German articles/)).toBeInTheDocument()
  })

  it('should render cards as navigation links', () => {
    renderWithRouter(<Dashboard />)
    
    // Check if the Article Quiz card is a link
    const quizCard = screen.getByText('Article Quiz').closest('a')
    expect(quizCard).toHaveAttribute('href', '/quiz')
  })
}) 