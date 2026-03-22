import { useCallback, useMemo, useState } from 'react'
import { calculateScore } from '../utils/calculateScore'
import { buildExamQuestions } from '../utils/shuffle'
import type { PreparedQuestion, ScoreSummary, UnitQuizData } from '../types/quiz'

const UNIT_PATHS = [
  '/data/unit-1.json',
  '/data/unit-2.json',
  '/data/unit-3.json',
  '/data/unit-4.json',
  '/data/unit-5.json',
  '/data/unit-6.json',
]

async function loadUnits(): Promise<UnitQuizData[]> {
  const responses = await Promise.all(UNIT_PATHS.map((path) => fetch(path)))

  responses.forEach((response, index) => {
    if (!response.ok) {
      throw new Error(`Failed to load ${UNIT_PATHS[index]}`)
    }
  })

  const data = (await Promise.all(
    responses.map((response) => response.json()),
  )) as UnitQuizData[]

  return data.sort((a, b) => a.unit_number - b.unit_number)
}

export function useQuiz() {
  const [units, setUnits] = useState<UnitQuizData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [selectedPercentage, setSelectedPercentage] = useState(0.25)
  const [showStartModal, setShowStartModal] = useState(false)

  const [questions, setQuestions] = useState<PreparedQuestion[]>([])
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isFinished, setIsFinished] = useState(false)

  const totalBankQuestions = useMemo(
    () => units.reduce((sum, unit) => sum + unit.questions.length, 0),
    [units],
  )

  const currentQuestion = questions[currentQuestionIndex]
  const currentAnswer = selectedAnswers[currentQuestionIndex] ?? 0
  const answeredCount = selectedAnswers.filter((answer) => answer > 0).length
  const isLastQuestion = currentQuestionIndex === questions.length - 1

  const result: ScoreSummary | null = useMemo(() => {
    if (!isFinished || questions.length === 0) {
      return null
    }

    return calculateScore(questions, selectedAnswers)
  }, [isFinished, questions, selectedAnswers])

  const initialize = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await loadUnits()
      setUnits(data)
    } catch (loadError) {
      const message =
        loadError instanceof Error
          ? loadError.message
          : 'Failed to load question data'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const openStartModal = () => {
    setShowStartModal(true)
  }

  const closeStartModal = () => {
    setShowStartModal(false)
  }

  const startExam = () => {
    const preparedQuestions = buildExamQuestions(units, selectedPercentage)

    setQuestions(preparedQuestions)
    setSelectedAnswers(new Array(preparedQuestions.length).fill(0))
    setCurrentQuestionIndex(0)
    setIsFinished(false)
    setShowStartModal(false)
  }

  const selectAnswer = (answerIndex: number) => {
    setSelectedAnswers((prev) => {
      const next = [...prev]
      next[currentQuestionIndex] = answerIndex
      return next
    })
  }

  const goNext = () => {
    if (currentAnswer === 0) {
      return
    }

    setCurrentQuestionIndex((prev) => Math.min(prev + 1, questions.length - 1))
  }

  const goPrev = () => {
    setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))
  }

  const finishExam = () => {
    if (currentAnswer === 0) {
      return
    }

    setIsFinished(true)
  }

  const restart = () => {
    setQuestions([])
    setSelectedAnswers([])
    setCurrentQuestionIndex(0)
    setIsFinished(false)
    setShowStartModal(false)
  }

  return {
    units,
    isLoading,
    error,
    totalBankQuestions,

    selectedPercentage,
    setSelectedPercentage,

    showStartModal,
    openStartModal,
    closeStartModal,

    questions,
    currentQuestion,
    currentQuestionIndex,
    selectedAnswers,
    currentAnswer,
    answeredCount,
    isLastQuestion,
    isFinished,
    result,

    initialize,
    startExam,
    selectAnswer,
    goNext,
    goPrev,
    finishExam,
    restart,
  }
}
