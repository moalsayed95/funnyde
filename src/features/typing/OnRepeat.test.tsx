import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { OnRepeat } from './OnRepeat'

const renderWithRouter = (component: React.ReactNode) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('OnRepeat', () => {
  it('should render the main dashboard with categories', () => {
    renderWithRouter(<OnRepeat />)
    
    // Check header content
    expect(screen.getByText('On Repeat')).toBeInTheDocument()
    expect(screen.getByText(/Practice typing German text/)).toBeInTheDocument()
    
    // Check if categories are rendered
    expect(screen.getByText('Emails')).toBeInTheDocument()
    expect(screen.getByText('Complaints')).toBeInTheDocument()
  })

  it('should navigate to category exercises when clicking a category', () => {
    renderWithRouter(<OnRepeat />)
    
    // Click on the Emails category
    fireEvent.click(screen.getByText('Emails'))
    
    // Check if exercises are displayed
    expect(screen.getByText('Business Email')).toBeInTheDocument()
    expect(screen.getByText('Friendly Email')).toBeInTheDocument()
  })

  it('should navigate back to categories when clicking back button', () => {
    renderWithRouter(<OnRepeat />)
    
    // Navigate to a category
    fireEvent.click(screen.getByText('Emails'))
    
    // Click back button
    fireEvent.click(screen.getByText('← Back to Categories'))
    
    // Check if we're back to categories
    expect(screen.getByText('On Repeat')).toBeInTheDocument()
  })

  it('should navigate back to dashboard when clicking back button on main view', () => {
    const navigate = vi.fn()
    vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom')
      return {
        ...actual,
        useNavigate: () => navigate
      }
    })

    renderWithRouter(<OnRepeat />)
    
    // Click back button
    fireEvent.click(screen.getByText('← Back to Dashboard'))
    
    // Check if navigate was called with correct path
    expect(navigate).toHaveBeenCalledWith('/')
  })
}) 