/**
 * QuizGame Component
 * 
 * This is the main game container component that manages the quiz state and game logic.
 * It handles:
 * - Word selection and display
 * - Article selection
 * - Score tracking
 * - Feedback display
 * - High score persistence
 */

import { useState, useEffect, useCallback, KeyboardEvent } from 'react'
import styled from 'styled-components'
import { Article, QuizState } from '../../types/quiz'
import { GERMAN_WORDS } from '../../data/words'
import { useNavigate } from 'react-router-dom'

const QuizContainer = styled.div`
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 24px;
  padding: 2rem;
  position: relative;
`

const QuestionText = styled.h2`
  font-size: 2rem;
  color: #1a1a1a;
  margin-bottom: 3rem;
  font-weight: 700;
  text-align: center;
  width: 100%;
  letter-spacing: -0.02em;
`

const TargetWord = styled.span`
  color: #2563eb;
  background-color: #eff6ff;
  padding: 0.2em 0.4em;
  border-radius: 8px;
  font-weight: 800;
`

const ButtonContainer = styled.div`
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  margin: 2rem 0;
  width: 100%;
  max-width: 500px;
`

interface StyledButtonProps {
  $isSelected?: boolean;
}

const ArticleButton = styled.button<StyledButtonProps>`
  flex: 1;
  max-width: 150px;
  padding: 1.2rem 2.5rem;
  font-size: 1.3rem;
  font-weight: 600;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  background-color: ${props => props.$isSelected ? '#2563eb' : '#f3f4f6'};
  color: ${props => props.$isSelected ? 'white' : '#1f2937'};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  box-shadow: ${props => props.$isSelected ? '0 4px 12px rgba(37, 99, 235, 0.2)' : 'none'};

  &:hover {
    background-color: ${props => props.$isSelected ? '#2563eb' : '#e5e7eb'};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &:before {
    content: "${props => props.children?.toString()?.charAt(0)}";
    position: absolute;
    top: -8px;
    left: 12px;
    background-color: white;
    padding: 0 6px;
    font-size: 0.75rem;
    color: #6b7280;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
`

const GermanWord = styled.input`
  width: 100%;
  max-width: 400px;
  padding: 1.2rem;
  font-size: 1.5rem;
  font-weight: 500;
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  margin: 2rem 0;
  text-align: center;
  transition: all 0.3s ease;
  background-color: #f9fafb;
  color: #1f2937;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
  }
`

interface StyledFeedbackProps {
  $isCorrect: boolean;
}

const FeedbackContainer = styled.div<StyledFeedbackProps>`
  position: fixed;
  left: 50%;
  bottom: 32px;
  transform: translateX(-50%);
  width: 100%;
  max-width: 500px;
  background-color: ${props => props.$isCorrect ? '#ecfdf5' : '#fef2f2'};
  padding: 1.5rem;
  border-radius: 16px;
  color: ${props => props.$isCorrect ? '#065f46' : '#991b1b'};
  text-align: center;
  font-size: 1.1rem;
  font-weight: 500;
  border: 1px solid ${props => props.$isCorrect ? '#a7f3d0' : '#fecaca'};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 10;
  animation: slideUpFade 2s cubic-bezier(0.4, 0, 0.2, 1);
  margin: 0 1rem;

  @keyframes slideUpFade {
    0% { opacity: 0; transform: translate(-50%, 0); }
    15% { opacity: 1; transform: translate(-50%, 0); }
    85% { opacity: 1; transform: translate(-50%, 0); }
    100% { opacity: 0; transform: translate(-50%, 0); }
  }
`

const ActionArea = styled.div`
  min-height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 1rem;
`

const ScoreContainer = styled.div`
  font-size: 1.1rem;
  color: #4b5563;
  text-align: center;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  p {
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  span {
    font-weight: 600;
    color: #2563eb;
    background-color: #eff6ff;
    padding: 0.25rem 0.75rem;
    border-radius: 8px;
  }
`

const SpecialCharacters = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin: 1.5rem 0;
  width: 100%;
`

const SpecialCharButton = styled.button`
  padding: 0.8rem;
  font-size: 1.2rem;
  font-weight: 500;
  border: none;
  border-radius: 12px;
  background-color: #f3f4f6;
  cursor: pointer;
  color: #4b5563;
  min-width: 48px;
  height: 48px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #e5e7eb;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
    color: #1f2937;
  }
`

const ModeToggle = styled.div`
  position: absolute;
  top: 2rem;
  right: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1rem;
  color: #4b5563;
`

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #e5e7eb;
    transition: .4s;
    border-radius: 34px;

    &:before {
      position: absolute;
      content: "";
      height: 26px;
      width: 26px;
      left: 4px;
      bottom: 4px;
      background-color: white;
      transition: .4s;
      border-radius: 50%;
    }
  }

  input:checked + span {
    background-color: #2563eb;
  }

  input:checked + span:before {
    transform: translateX(26px);
  }
`

const ConfirmButton = styled.button`
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  border: none;
  border-radius: 16px;
  background-color: #2563eb;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;

  &:hover {
    background-color: #1d4ed8;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
  }

  &:disabled {
    background-color: #e5e7eb;
    color: #9ca3af;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`

const ContentArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 1rem;
  flex: 1;
`

const BackButton = styled.button`
  position: absolute;
  top: 2rem;
  left: 2rem;
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #4b5563;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: #f3f4f6;
    color: #1f2937;
  }
`

const updateHighScore = (currentScore: number, prevHighScore: number) => {
  if (currentScore > prevHighScore) {
    localStorage.setItem('highScore', currentScore.toString())
    return currentScore
  }
  return prevHighScore
}

export const QuizGame = () => {
  const navigate = useNavigate()
  const [state, setState] = useState<QuizState>({
    currentWord: null,
    currentScore: 0,
    highScore: parseInt(localStorage.getItem('highScore') || '0'),
    showFeedback: false,
    isCorrect: null,
    lastSelectedArticle: null,
    writtenAnswer: '',
    isWritingMode: false,
  })

  const selectNewWord = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * GERMAN_WORDS.length)
    setState(prev => ({
      ...prev,
      currentWord: GERMAN_WORDS[randomIndex],
      showFeedback: false,
      isCorrect: null,
      lastSelectedArticle: null,
      writtenAnswer: '',
    }))
  }, [])

  useEffect(() => {
    selectNewWord()
  }, [selectNewWord])

  useEffect(() => {
    if (state.currentScore > state.highScore) {
      setState(prev => ({ ...prev, highScore: state.currentScore }))
      localStorage.setItem('highScore', state.currentScore.toString())
    }
  }, [state.currentScore, state.highScore])

  const handleArticleSelection = (selectedArticle: Article) => {
    if (!state.currentWord) return

    const isCorrect = selectedArticle === state.currentWord.article
    
    if (state.isWritingMode) {
      // In writing mode, only update the selected article
      setState(prev => ({
        ...prev,
        lastSelectedArticle: selectedArticle,
      }))
    } else {
      // In article-only mode, proceed with feedback and next word
      setState(prev => {
        const newScore = isCorrect ? prev.currentScore + 1 : 0
        return {
          ...prev,
          showFeedback: true,
          isCorrect,
          lastSelectedArticle: selectedArticle,
          currentScore: newScore,
          highScore: updateHighScore(newScore, prev.highScore)
        }
      })
      setTimeout(selectNewWord, 2000)
    }
  }

  const handleWrittenAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState(prev => ({ ...prev, writtenAnswer: e.target.value }))
  }

  const handleAnswerSubmit = () => {
    if (!state.currentWord || !state.lastSelectedArticle) return

    const isArticleCorrect = state.lastSelectedArticle === state.currentWord.article
    const isWordCorrect = state.writtenAnswer.trim().toLowerCase() === state.currentWord.german.toLowerCase()
    const isCorrect = isArticleCorrect && isWordCorrect

    setState(prev => {
      const newScore = isCorrect ? prev.currentScore + 1 : 0
      return {
        ...prev,
        showFeedback: true,
        isCorrect,
        currentScore: newScore,
        highScore: updateHighScore(newScore, prev.highScore)
      }
    })

    setTimeout(selectNewWord, 2000)
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && state.isWritingMode && state.lastSelectedArticle) {
      handleAnswerSubmit()
    }
  }

  const toggleWritingMode = () => {
    setState(prev => ({
      ...prev,
      isWritingMode: !prev.isWritingMode,
      writtenAnswer: '',
      lastSelectedArticle: null,
      showFeedback: false,
    }))
  }

  if (!state.currentWord) return <div>Loading...</div>

  return (
    <QuizContainer>
      <BackButton onClick={() => navigate('/')}>
        ← Back to Dashboard
      </BackButton>

      <ModeToggle>
        <span>Writing Mode</span>
        <ToggleSwitch>
          <input
            type="checkbox"
            checked={state.isWritingMode}
            onChange={toggleWritingMode}
          />
          <span />
        </ToggleSwitch>
      </ModeToggle>

      <ContentArea>
        <QuestionText data-testid="question-text">
          Write <TargetWord>"{state.currentWord.english}"</TargetWord> in German
        </QuestionText>

        <div data-testid="article-buttons">
          <ButtonContainer>
            {(['der', 'die', 'das'] as Article[]).map(article => (
              <ArticleButton
                key={article}
                onClick={() => handleArticleSelection(article)}
                $isSelected={article === state.lastSelectedArticle}
                data-testid={article === state.currentWord?.article ? 'correct-article' : undefined}
              >
                {article}
              </ArticleButton>
            ))}
          </ButtonContainer>
        </div>

        <GermanWord
          type="text"
          placeholder="Type the German word here"
          value={state.isWritingMode ? state.writtenAnswer : state.currentWord.german}
          onChange={handleWrittenAnswerChange}
          onKeyPress={handleKeyPress}
          readOnly={!state.isWritingMode}
        />

        <SpecialCharacters>
          {['ä', 'ö', 'ü', 'ß'].map(char => (
            <SpecialCharButton 
              key={char}
              onClick={() => {
                if (state.isWritingMode) {
                  setState(prev => ({
                    ...prev,
                    writtenAnswer: prev.writtenAnswer + char
                  }))
                }
              }}
              disabled={!state.isWritingMode}
            >
              {char}
            </SpecialCharButton>
          ))}
        </SpecialCharacters>

        <ActionArea>
          {state.isWritingMode && (
            <ConfirmButton
              onClick={handleAnswerSubmit}
              disabled={!state.lastSelectedArticle || !state.writtenAnswer.trim()}
            >
              Check Answer
            </ConfirmButton>
          )}
          <ScoreContainer data-testid="score-display">
            <p>Current Score: <span data-testid="current-score">{state.currentScore}</span></p>
            <p>Highest Score: <span>{state.highScore}</span></p>
          </ScoreContainer>
        </ActionArea>
      </ContentArea>

      {state.showFeedback && state.lastSelectedArticle && (
        <FeedbackContainer 
          $isCorrect={state.isCorrect || false}
          data-testid="feedback-message"
        >
          {state.isCorrect ? (
            <p>Correct! 🎉</p>
          ) : (
            <p>
              Incorrect. The correct answer is {state.currentWord.article} {state.currentWord.german}
            </p>
          )}
        </FeedbackContainer>
      )}
    </QuizContainer>
  )
} 