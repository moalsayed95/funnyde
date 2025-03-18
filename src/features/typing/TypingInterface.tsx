import { useState, useEffect, useRef, KeyboardEvent } from 'react'
import styled from 'styled-components'
import { TextExercise, TypingState, TypingStats } from '../../types/typing'

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`

const Header = styled.header`
  text-align: center;
  margin-bottom: 2rem;
`

const Title = styled.h1`
  font-size: 2rem;
  color: #1e40af;
  margin-bottom: 0.5rem;
`

const Description = styled.p`
  color: #4b5563;
  font-size: 1.1rem;
`

const TextDisplay = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  font-size: 1.2rem;
  line-height: 1.8;
  white-space: pre-wrap;
  position: relative;
`

const TextInput = styled.textarea`
  width: 100%;
  min-height: 200px;
  padding: 1rem;
  font-size: 1.2rem;
  line-height: 1.8;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  resize: none;
  background: transparent;
  color: transparent;
  caret-color: transparent;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;

  &:focus {
    outline: none;
    border-color: #2563eb;
  }
`

const Character = styled.span<{ $isCorrect: boolean; $isCurrent: boolean }>`
  color: ${props => props.$isCorrect ? '#1f2937' : '#ef4444'};
  background-color: ${props => props.$isCurrent ? '#dbeafe' : 'transparent'};
  border-radius: 2px;
  padding: 0 1px;
`

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  text-align: center;
`

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #1e40af;
  margin-bottom: 0.5rem;
`

const StatLabel = styled.div`
  color: #6b7280;
  font-size: 0.9rem;
`

const CompleteMessage = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  text-align: center;
  z-index: 10;
`

const CompleteTitle = styled.h2`
  font-size: 1.8rem;
  color: #1e40af;
  margin-bottom: 1rem;
`

const CompleteStats = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`

const CompleteStat = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e5e7eb;
`

const CompleteLabel = styled.span`
  color: #6b7280;
`

const CompleteValue = styled.span`
  font-weight: 600;
  color: #1f2937;
`

const RestartButton = styled.button`
  background: #2563eb;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #1d4ed8;
    transform: translateY(-1px);
  }
`

interface TypingInterfaceProps {
  exercise: TextExercise;
}

export const TypingInterface = ({ exercise }: TypingInterfaceProps) => {
  const [state, setState] = useState<TypingState>({
    currentPosition: 0,
    mistakes: 0,
    startTime: null,
    endTime: null,
    isComplete: false,
    wpm: 0,
    accuracy: 100
  })
  const [inputValue, setInputValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [])

  const calculateStats = (): TypingStats => {
    if (!state.startTime || !state.endTime) return {
      wpm: 0,
      accuracy: 100,
      mistakes: 0,
      timeSpent: 0
    }

    const timeSpent = (state.endTime - state.startTime) / 1000 // in seconds
    const wordsTyped = exercise.text.split(/\s+/).length
    const wpm = Math.round((wordsTyped / timeSpent) * 60)
    const accuracy = Math.round(((exercise.text.length - state.mistakes) / exercise.text.length) * 100)

    return {
      wpm,
      accuracy,
      mistakes: state.mistakes,
      timeSpent
    }
  }

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setInputValue(value)

    if (!state.startTime) {
      setState(prev => ({ ...prev, startTime: Date.now() }))
    }

    // Count mistakes
    let newMistakes = 0
    for (let i = 0; i < value.length; i++) {
      if (value[i] !== exercise.text[i]) {
        newMistakes++
      }
    }
    setState(prev => ({ ...prev, mistakes: newMistakes }))

    if (value.length === exercise.text.length) {
      setState(prev => ({ ...prev, endTime: Date.now(), isComplete: true }))
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault()
    }
  }

  const handleRestart = () => {
    setState({
      currentPosition: 0,
      mistakes: 0,
      startTime: null,
      endTime: null,
      isComplete: false,
      wpm: 0,
      accuracy: 100
    })
    setInputValue('')
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }

  const renderText = () => {
    return exercise.text.split('').map((char, index) => {
      const isCorrect = inputValue[index] === char
      const isCurrent = index === inputValue.length

      return (
        <Character
          key={index}
          $isCorrect={isCorrect}
          $isCurrent={isCurrent}
        >
          {char}
        </Character>
      )
    })
  }

  const stats = calculateStats()

  return (
    <Container>
      <Header>
        <Title>{exercise.title}</Title>
        <Description>{exercise.description}</Description>
      </Header>

      <StatsContainer>
        <StatCard>
          <StatValue>{stats.wpm}</StatValue>
          <StatLabel>Words per Minute</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.accuracy}%</StatValue>
          <StatLabel>Accuracy</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{state.mistakes}</StatValue>
          <StatLabel>Mistakes</StatLabel>
        </StatCard>
      </StatsContainer>

      <TextDisplay>
        {renderText()}
        <TextInput
          ref={textareaRef}
          value={inputValue}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          spellCheck={false}
        />
      </TextDisplay>

      {state.isComplete && (
        <CompleteMessage>
          <CompleteTitle>Exercise Complete! 🎉</CompleteTitle>
          <CompleteStats>
            <CompleteStat>
              <CompleteLabel>Words per Minute</CompleteLabel>
              <CompleteValue>{stats.wpm} WPM</CompleteValue>
            </CompleteStat>
            <CompleteStat>
              <CompleteLabel>Accuracy</CompleteLabel>
              <CompleteValue>{stats.accuracy}%</CompleteValue>
            </CompleteStat>
            <CompleteStat>
              <CompleteLabel>Mistakes</CompleteLabel>
              <CompleteValue>{state.mistakes}</CompleteValue>
            </CompleteStat>
            <CompleteStat>
              <CompleteLabel>Time Spent</CompleteLabel>
              <CompleteValue>{Math.round(stats.timeSpent)}s</CompleteValue>
            </CompleteStat>
          </CompleteStats>
          <RestartButton onClick={handleRestart}>
            Try Again
          </RestartButton>
        </CompleteMessage>
      )}
    </Container>
  )
} 