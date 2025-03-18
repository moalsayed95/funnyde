import { useState } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { textCategories } from '../../data/textExercises'
import { TextCategory, TextExercise } from '../../types/typing'
import { TypingInterface } from './TypingInterface'

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(135deg, #f0f9ff 0%, #e6f6fe 100%);
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

const Header = styled.header`
  text-align: center;
  margin-bottom: 3rem;
`

const Title = styled.h1`
  font-size: 2.5rem;
  color: #1e40af;
  margin-bottom: 1rem;
  font-weight: 800;
`

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #4b5563;
  max-width: 600px;
  margin: 0 auto;
`

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`

const CategoryCard = styled.div`
  background: white;
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, #3b82f6, #2563eb);
  }
`

const CategoryIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
`

const CategoryTitle = styled.h2`
  font-size: 1.5rem;
  color: #1f2937;
  margin-bottom: 1rem;
  font-weight: 700;
`

const CategoryDescription = styled.p`
  color: #6b7280;
  margin-bottom: 1.5rem;
  line-height: 1.6;
`

const ExerciseList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const ExerciseItem = styled.div`
  padding: 1rem;
  background: #f3f4f6;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #e5e7eb;
  }
`

const ExerciseTitle = styled.h3`
  font-size: 1.1rem;
  color: #1f2937;
  margin-bottom: 0.5rem;
`

const ExerciseDescription = styled.p`
  font-size: 0.9rem;
  color: #6b7280;
`

const DifficultyBadge = styled.span<{ $difficulty: string }>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
  background-color: ${props => {
    switch (props.$difficulty) {
      case 'beginner': return '#dcfce7';
      case 'intermediate': return '#fef3c7';
      case 'advanced': return '#fee2e2';
      default: return '#f3f4f6';
    }
  }};
  color: ${props => {
    switch (props.$difficulty) {
      case 'beginner': return '#166534';
      case 'intermediate': return '#92400e';
      case 'advanced': return '#991b1b';
      default: return '#4b5563';
    }
  }};
`

export const OnRepeat = () => {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState<TextCategory | null>(null)
  const [selectedExercise, setSelectedExercise] = useState<TextExercise | null>(null)

  const handleCategorySelect = (category: TextCategory) => {
    setSelectedCategory(category)
  }

  const handleExerciseSelect = (exercise: TextExercise) => {
    setSelectedExercise(exercise)
  }

  const handleBack = () => {
    if (selectedExercise) {
      setSelectedExercise(null)
    } else if (selectedCategory) {
      setSelectedCategory(null)
    } else {
      navigate('/')
    }
  }

  if (selectedExercise) {
    return (
      <Container>
        <BackButton onClick={handleBack}>← Back</BackButton>
        <TypingInterface exercise={selectedExercise} />
      </Container>
    )
  }

  if (selectedCategory) {
    return (
      <Container>
        <BackButton onClick={handleBack}>← Back to Categories</BackButton>
        <Header>
          <Title>{selectedCategory.name}</Title>
          <Subtitle>{selectedCategory.description}</Subtitle>
        </Header>
        <ExerciseList>
          {selectedCategory.exercises.map(exercise => (
            <ExerciseItem key={exercise.id} onClick={() => handleExerciseSelect(exercise)}>
              <ExerciseTitle>{exercise.title}</ExerciseTitle>
              <ExerciseDescription>{exercise.description}</ExerciseDescription>
              <DifficultyBadge $difficulty={exercise.difficulty}>
                {exercise.difficulty}
              </DifficultyBadge>
            </ExerciseItem>
          ))}
        </ExerciseList>
      </Container>
    )
  }

  return (
    <Container>
      <BackButton onClick={handleBack}>← Back to Dashboard</BackButton>
      <Header>
        <Title>On Repeat</Title>
        <Subtitle>
          Practice typing German text while improving your typing speed and accuracy.
          Choose a category to get started!
        </Subtitle>
      </Header>
      <CategoryGrid>
        {textCategories.map(category => (
          <CategoryCard key={category.id} onClick={() => handleCategorySelect(category)}>
            <CategoryIcon>{category.icon}</CategoryIcon>
            <CategoryTitle>{category.name}</CategoryTitle>
            <CategoryDescription>{category.description}</CategoryDescription>
          </CategoryCard>
        ))}
      </CategoryGrid>
    </Container>
  )
} 