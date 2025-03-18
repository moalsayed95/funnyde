/**
 * Main App Component
 * 
 * This is the root component of our application that sets up the main layout
 * and includes the Dashboard component.
 */

import { Dashboard } from './features/dashboard/Dashboard'
import { QuizGame } from './features/quiz/QuizGame'
import { OnRepeat } from './features/typing/OnRepeat'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import styled, { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background: linear-gradient(135deg, #f0f9ff 0%, #e6f6fe 100%);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    min-height: 100vh;
    color: #1f2937;
  }

  * {
    box-sizing: border-box;
  }

  ::selection {
    background-color: #bfdbfe;
    color: #1e40af;
  }
`

const AppContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0) 100%);
    pointer-events: none;
  }
`

function App() {
  return (
    <Router>
      <GlobalStyle />
      <AppContainer>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/quiz" element={<QuizGame />} />
          <Route path="/typing" element={<OnRepeat />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppContainer>
    </Router>
  )
}

export default App
