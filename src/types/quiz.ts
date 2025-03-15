/**
 * Quiz Types
 * 
 * This file contains all the TypeScript types and interfaces used in the quiz application.
 * These types help ensure type safety across the application and make the code more maintainable.
 */

export type Article = 'der' | 'die' | 'das'

export interface Word {
  english: string
  german: string
  article: Article
}

export interface QuizState {
  currentWord: Word | null
  currentScore: number
  highScore: number
  showFeedback: boolean
  isCorrect: boolean | null
  lastSelectedArticle: Article | null
}

export interface FeedbackProps {
  isCorrect: boolean
  correctArticle: Article
  selectedArticle: Article
  germanWord: string
}

export interface ScoreProps {
  currentScore: number
  highScore: number
} 