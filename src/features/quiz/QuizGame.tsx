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

import { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import { Article, Word, QuizState } from '../../types/quiz'

// Temporary word list for testing - will be moved to a separate data file

const TEMP_WORDS: Word[] = [
  { english: 'house', german: 'Haus', article: 'das' },
  { english: 'tree', german: 'Baum', article: 'der' },
  { english: 'flower', german: 'Blume', article: 'die' },
  { english: 'car', german: 'Auto', article: 'das' },
  { english: 'road', german: 'Straße', article: 'die' },
  { english: 'book', german: 'Buch', article: 'das' },
  { english: 'teacher', german: 'Lehrer', article: 'der' },
  { english: 'student', german: 'Student', article: 'der' },
  { english: 'school', german: 'Schule', article: 'die' },
  { english: 'window', german: 'Fenster', article: 'das' },
  { english: 'door', german: 'Tür', article: 'die' },
  { english: 'computer', german: 'Computer', article: 'der' },
  { english: 'phone', german: 'Telefon', article: 'das' },
  { english: 'city', german: 'Stadt', article: 'die' },
  { english: 'village', german: 'Dorf', article: 'das' },
  { english: 'garden', german: 'Garten', article: 'der' },
  { english: 'mountain', german: 'Berg', article: 'der' },
  { english: 'river', german: 'Fluss', article: 'der' },
  { english: 'lake', german: 'See', article: 'der' },
  { english: 'forest', german: 'Wald', article: 'der' },
  { english: 'sun', german: 'Sonne', article: 'die' },
  { english: 'moon', german: 'Mond', article: 'der' },
  { english: 'star', german: 'Stern', article: 'der' },
  { english: 'sky', german: 'Himmel', article: 'der' },
  { english: 'rain', german: 'Regen', article: 'der' },
  { english: 'snow', german: 'Schnee', article: 'der' },
  { english: 'wind', german: 'Wind', article: 'der' },
  { english: 'storm', german: 'Sturm', article: 'der' },
  { english: 'cloud', german: 'Wolke', article: 'die' },
  { english: 'fire', german: 'Feuer', article: 'das' },
  { english: 'earth', german: 'Erde', article: 'die' },
  { english: 'food', german: 'Essen', article: 'das' },
  { english: 'drink', german: 'Getränk', article: 'das' },
  { english: 'water', german: 'Wasser', article: 'das' },
  { english: 'bread', german: 'Brot', article: 'das' },
  { english: 'meat', german: 'Fleisch', article: 'das' },
  { english: 'fruit', german: 'Obst', article: 'das' },
  { english: 'vegetable', german: 'Gemüse', article: 'das' },
  { english: 'coffee', german: 'Kaffee', article: 'der' },
  { english: 'tea', german: 'Tee', article: 'der' },
  { english: 'milk', german: 'Milch', article: 'die' },
  { english: 'sugar', german: 'Zucker', article: 'der' },
  { english: 'salt', german: 'Salz', article: 'das' },
  { english: 'pepper', german: 'Pfeffer', article: 'der' },
  { english: 'knife', german: 'Messer', article: 'das' },
  { english: 'fork', german: 'Gabel', article: 'die' },
  { english: 'spoon', german: 'Löffel', article: 'der' },
  { english: 'plate', german: 'Teller', article: 'der' },
  { english: 'cup', german: 'Tasse', article: 'die' },
  { english: 'bottle', german: 'Flasche', article: 'die' },
  { english: 'clock', german: 'Uhr', article: 'die' },
  { english: 'watch', german: 'Armbanduhr', article: 'die' },
  { english: 'bed', german: 'Bett', article: 'das' },
  { english: 'chair', german: 'Stuhl', article: 'der' },
  { english: 'table', german: 'Tisch', article: 'der' },
  { english: 'sofa', german: 'Sofa', article: 'das' },
  { english: 'doorbell', german: 'Türklingel', article: 'die' },
  { english: 'key', german: 'Schlüssel', article: 'der' },
  { english: 'roof', german: 'Dach', article: 'das' },
  { english: 'floor', german: 'Boden', article: 'der' },
  { english: 'wall', german: 'Wand', article: 'die' },
  { english: 'picture', german: 'Bild', article: 'das' },
  { english: 'mirror', german: 'Spiegel', article: 'der' },
  { english: 'lamp', german: 'Lampe', article: 'die' },
  { english: 'printer', german: 'Drucker', article: 'der' },
  { english: 'paper', german: 'Papier', article: 'das' },
  { english: 'pen', german: 'Stift', article: 'der' },
  { english: 'pencil', german: 'Bleistift', article: 'der' },
  { english: 'notebook', german: 'Notizbuch', article: 'das' },
  { english: 'bag', german: 'Tasche', article: 'die' },
  { english: 'wallet', german: 'Geldbörse', article: 'die' },
  { english: 'money', german: 'Geld', article: 'das' },
  { english: 'market', german: 'Markt', article: 'der' },
  { english: 'shop', german: 'Geschäft', article: 'das' },
  { english: 'store', german: 'Laden', article: 'der' },
  { english: 'hospital', german: 'Krankenhaus', article: 'das' },
  { english: 'doctor', german: 'Arzt', article: 'der' },
  { english: 'nurse', german: 'Krankenschwester', article: 'die' },
  { english: 'medicine', german: 'Medizin', article: 'die' },
  { english: 'lawyer', german: 'Anwalt', article: 'der' },
  { english: 'police', german: 'Polizei', article: 'die' },
  { english: 'firefighter', german: 'Feuerwehrmann', article: 'der' },
  { english: 'engineer', german: 'Ingenieur', article: 'der' },
  { english: 'scientist', german: 'Wissenschaftler', article: 'der' },
  { english: 'artist', german: 'Künstler', article: 'der' },
  { english: 'music', german: 'Musik', article: 'die' },
  { english: 'movie', german: 'Film', article: 'der' },
  { english: 'theater', german: 'Theater', article: 'das' },
  { english: 'dance', german: 'Tanz', article: 'der' },
  { english: 'song', german: 'Lied', article: 'das' },
  { english: 'game', german: 'Spiel', article: 'das' },
  { english: 'sport', german: 'Sport', article: 'der' },
  { english: 'ball', german: 'Ball', article: 'der' },
  { english: 'bicycle', german: 'Fahrrad', article: 'das' },
  { english: 'train', german: 'Zug', article: 'der' },
  { english: 'airport', german: 'Flughafen', article: 'der' },
  { english: 'station', german: 'Bahnhof', article: 'der' },
  { english: 'bridge', german: 'Brücke', article: 'die' },
  { english: 'island', german: 'Insel', article: 'die' },
  { english: 'riverbank', german: 'Flussufer', article: 'das' },
];


const QuizContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: white;
  border-radius: 24px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  padding: 3rem;
  min-height: 500px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
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
  width: 100%;
  max-width: 500px;
  background-color: ${props => props.$isCorrect ? '#ecfdf5' : '#fef2f2'};
  padding: 1.5rem;
  border-radius: 16px;
  margin: 2rem 0;
  color: ${props => props.$isCorrect ? '#065f46' : '#991b1b'};
  text-align: center;
  animation: fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 1.1rem;
  font-weight: 500;
  border: 1px solid ${props => props.$isCorrect ? '#a7f3d0' : '#fecaca'};

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`

const ScoreContainer = styled.div`
  margin-top: 2.5rem;
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

export const QuizGame = () => {
  const [state, setState] = useState<QuizState>({
    currentWord: null,
    currentScore: 0,
    highScore: parseInt(localStorage.getItem('highScore') || '0'),
    showFeedback: false,
    isCorrect: null,
    lastSelectedArticle: null,
  })

  const selectNewWord = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * TEMP_WORDS.length)
    setState(prev => ({
      ...prev,
      currentWord: TEMP_WORDS[randomIndex],
      showFeedback: false,
      isCorrect: null,
      lastSelectedArticle: null,
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
    
    // Update score and feedback synchronously
    setState(prev => ({
      ...prev,
      showFeedback: true,
      isCorrect,
      lastSelectedArticle: selectedArticle,
      currentScore: isCorrect ? prev.currentScore + 1 : prev.currentScore,
      highScore: isCorrect && prev.currentScore + 1 > prev.highScore ? prev.currentScore + 1 : prev.highScore,
    }))

    // Schedule next word
    setTimeout(selectNewWord, 2000)
  }

  if (!state.currentWord) return <div>Loading...</div>

  return (
    <QuizContainer>
      <QuestionText data-testid="question-text">
        Write "{state.currentWord.english}" in German
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
        value={state.currentWord.german}
        readOnly
      />

      <SpecialCharacters>
        {['ä', 'ö', 'ü', 'ß'].map(char => (
          <SpecialCharButton key={char}>{char}</SpecialCharButton>
        ))}
      </SpecialCharacters>

      {state.showFeedback && state.lastSelectedArticle && (
        <FeedbackContainer 
          $isCorrect={state.isCorrect || false}
          data-testid="feedback-message"
        >
          {state.isCorrect ? (
            <p>Correct! 🎉</p>
          ) : (
            <p>
              Incorrect. The correct article for {state.currentWord.german} is{' '}
              {state.currentWord.article}
            </p>
          )}
        </FeedbackContainer>
      )}

      <ScoreContainer data-testid="score-display">
        <p>Current Score: <span data-testid="current-score">{state.currentScore}</span></p>
        <p>High Score: {state.highScore}</p>
      </ScoreContainer>
    </QuizContainer>
  )
} 