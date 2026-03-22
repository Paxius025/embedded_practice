export type Question = {
  question: string
  choice_1: string
  choice_2: string
  choice_3: string
  choice_4: string
  answer: number
}

export type UnitQuizData = {
  unit_number: number
  unit_name: string
  questions: Question[]
}

export type PreparedQuestion = {
  unitNumber: number
  unitName: string
  question: string
  choices: string[]
  answer: number
}

export type ScoreSummary = {
  score: number
  total: number
  correct: number
  incorrect: number
  percentage: number
}
