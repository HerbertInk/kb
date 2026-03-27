export type LnMode = 'demo' | 'polar'

export interface QuizSummary {
  id: string
  title: string
  accessCode: string
  rewardSats: number
  status: string
  _count: { questions: number; participants: number }
}

export interface LeaderboardEntry {
  id: string
  name: string
  score: number
  currentQuestion: number
  completedAt: string | null
}

export interface QuestionWithoutAnswer {
  id: string
  text: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  order: number
}
