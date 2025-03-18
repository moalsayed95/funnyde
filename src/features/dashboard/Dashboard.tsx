import styled from 'styled-components'
import { Link } from 'react-router-dom'

const DashboardContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(135deg, #f0f9ff 0%, #e6f6fe 100%);
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

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`

const Card = styled(Link)`
  background: white;
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  text-decoration: none;
  display: block;

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

const CardTitle = styled.h2`
  font-size: 1.5rem;
  color: #1f2937;
  margin-bottom: 1rem;
  font-weight: 700;
`

const CardDescription = styled.p`
  color: #6b7280;
  margin-bottom: 1.5rem;
  line-height: 1.6;
`

const CardIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #2563eb;
`

interface FeatureCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  path: string;
}

const features: FeatureCard[] = [
  {
    id: 'article-quiz',
    title: 'Article Quiz',
    description: 'Practice German articles (der, die, das) with interactive exercises and immediate feedback.',
    icon: '📚',
    path: '/quiz'
  },
  {
    id: 'on-repeat',
    title: 'On Repeat',
    description: 'Practice typing German text while improving your typing speed and accuracy. Choose from various text categories like emails and complaints.',
    icon: '⌨️',
    path: '/typing'
  }
]

export const Dashboard = () => {
  return (
    <DashboardContainer>
      <Header>
        <Title>FunnyDe - German Learning</Title>
        <Subtitle>
          Interactive and fun ways to learn German. Choose a feature to get started!
        </Subtitle>
      </Header>

      <CardGrid>
        {features.map(feature => (
          <Card key={feature.id} to={feature.path}>
            <CardIcon>{feature.icon}</CardIcon>
            <CardTitle>{feature.title}</CardTitle>
            <CardDescription>{feature.description}</CardDescription>
          </Card>
        ))}
      </CardGrid>
    </DashboardContainer>
  )
} 