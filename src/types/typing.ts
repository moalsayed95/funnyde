export interface TextExercise {
  id: string;
  title: string;
  description: string;
  category: string;
  text: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface TypingState {
  currentPosition: number;
  mistakes: number;
  startTime: number | null;
  endTime: number | null;
  isComplete: boolean;
  wpm: number;
  accuracy: number;
}

export interface TypingStats {
  wpm: number;
  accuracy: number;
  mistakes: number;
  timeSpent: number;
}

export interface TextCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  exercises: TextExercise[];
} 