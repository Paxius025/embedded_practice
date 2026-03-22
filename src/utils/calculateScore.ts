import type { PreparedQuestion, ScoreSummary } from '../types/quiz'

export function calculateScore(
  questions: PreparedQuestion[],
  userAnswers: number[],
): ScoreSummary {
  let score = 0
  const questionResults = questions.map((question, index) => {
    const userAnswer = userAnswers[index] ?? 0
    const isCorrect = userAnswer === question.answer

    if (isCorrect) {
      score += 1
    }

    return {
      questionNumber: index + 1,
      question: question.question,
      userAnswer,
      userAnswerText:
        userAnswer > 0 ? question.choices[userAnswer - 1] ?? '-' : '-',
      correctAnswer: question.answer,
      correctAnswerText: question.choices[question.answer - 1] ?? '-',
      isCorrect,
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
    questionResults,
  }
}
