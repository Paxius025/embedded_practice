import type { PreparedQuestion, Question, UnitQuizData } from '../types/quiz'

export function shuffleArray<T>(items: T[]): T[] {
  const result = [...items]

  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = result[i]
    result[i] = result[j]
    result[j] = temp
  }

  return result
}

export function shuffleChoices(question: Question): {
  choices: string[]
  answer: number
} {
  const choices = [
    { text: question.choice_1, correct: question.answer === 1 },
    { text: question.choice_2, correct: question.answer === 2 },
    { text: question.choice_3, correct: question.answer === 3 },
    { text: question.choice_4, correct: question.answer === 4 },
  ]

  const shuffled = shuffleArray(choices)
  const newAnswerIndex = shuffled.findIndex((choice) => choice.correct) + 1

  return {
    choices: shuffled.map((choice) => choice.text),
    answer: newAnswerIndex,
  }
}

export function buildExamQuestions(
  units: UnitQuizData[],
  percentage: number,
): PreparedQuestion[] {
  const totalQuestions = units.reduce(
    (sum, unit) => sum + unit.questions.length,
    0,
  )

  const selectedCount = Math.floor(totalQuestions * percentage)
  const baseCountByUnit = units.map((unit) =>
    Math.floor(unit.questions.length * percentage),
  )

  let assignedCount = baseCountByUnit.reduce((sum, count) => sum + count, 0)
  let remaining = selectedCount - assignedCount

  const remainderOrder = units
    .map((unit, index) => ({
      index,
      fraction: unit.questions.length * percentage - baseCountByUnit[index],
    }))
    .sort((a, b) => b.fraction - a.fraction)

  for (const item of remainderOrder) {
    if (remaining <= 0) {
      break
    }

    const current = baseCountByUnit[item.index]
    const max = units[item.index].questions.length

    if (current < max) {
      baseCountByUnit[item.index] = current + 1
      assignedCount += 1
      remaining -= 1
    }
  }

  // Fallback if there is still remainder due to rounding edge cases.
  if (assignedCount < selectedCount) {
    for (let i = 0; i < units.length && assignedCount < selectedCount; i += 1) {
      const max = units[i].questions.length
      while (baseCountByUnit[i] < max && assignedCount < selectedCount) {
        baseCountByUnit[i] += 1
        assignedCount += 1
      }
    }
  }

  return units.flatMap((unit, index) => {
    const shuffledQuestions = shuffleArray(unit.questions)
    const picked = shuffledQuestions.slice(0, baseCountByUnit[index])

    return picked.map((question) => {
      const shuffled = shuffleChoices(question)

      return {
        unitNumber: unit.unit_number,
        unitName: unit.unit_name,
        question: question.question,
        choices: shuffled.choices,
        answer: shuffled.answer,
      }
    })
  })
}
