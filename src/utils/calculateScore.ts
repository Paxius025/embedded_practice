import type { PreparedQuestion, ScoreSummary } from '../types/quiz'

export function calculateScore(
  questions: PreparedQuestion[],
  userAnswers: number[],
): ScoreSummary {
  let score = 0

  questions.forEach((question, index) => {
    if (userAnswers[index] === question.answer) {
      score += 1
    }
  })

  const total = questions.length
  const correct = score
  const incorrect = total - correct
  const percentage = total > 0 ? (score / total) * 100 : 0

  return {
    score,
    total,
    correct,
    incorrect,
    percentage,
  }
}
