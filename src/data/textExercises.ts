import { TextCategory } from '../types/typing'

export const textCategories: TextCategory[] = [
  {
    id: 'emails',
    name: 'Emails',
    description: 'Practice writing common German emails',
    icon: '✉️',
    exercises: [
      {
        id: 'email-1',
        title: 'Business Email',
        description: 'Write a formal business email in German',
        category: 'emails',
        text: 'Sehr geehrte Damen und Herren,\n\nich schreibe Ihnen bezüglich der Zusammenarbeit zwischen unseren Unternehmen. Ich würde gerne einen Termin für ein persönliches Gespräch vereinbaren.\n\nMit freundlichen Grüßen',
        difficulty: 'intermediate'
      },
      {
        id: 'email-2',
        title: 'Friendly Email',
        description: 'Write a casual email to a friend',
        category: 'emails',
        text: 'Hallo Maria!\n\nwie geht es dir? Ich hoffe, du hast einen schönen Tag. Lass uns bald mal wieder treffen!\n\nLiebe Grüße',
        difficulty: 'beginner'
      }
    ]
  },
  {
    id: 'complaints',
    name: 'Complaints',
    description: 'Practice writing formal complaints in German',
    icon: '📝',
    exercises: [
      {
        id: 'complaint-1',
        title: 'Product Complaint',
        description: 'Write a formal complaint about a defective product',
        category: 'complaints',
        text: 'Sehr geehrte Damen und Herren,\n\nich schreibe Ihnen, um mich über den defekten Artikel zu beschweren, den ich vor einer Woche bei Ihnen bestellt habe. Das Produkt funktioniert nicht wie beschrieben.\n\nIch erwarte eine umgehende Rückerstattung.\n\nMit freundlichen Grüßen',
        difficulty: 'intermediate'
      }
    ]
  }
] 