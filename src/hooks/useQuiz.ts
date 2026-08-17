import { useCallback, useMemo, useState } from 'react'
import { calculateScore } from '../utils/calculateScore'
import { buildExamQuestions } from '../utils/shuffle'
import type { PreparedQuestion, ScoreSummary, UnitQuizData } from '../types/quiz'

export type SubjectKey = 'embedded' | 'flutter' | 'economic' | 'abstract-data-type' | 'cyber-security'
export type ExamType = 'midterm' | 'final' | 'all'

export type SubjectUnitQuizData = UnitQuizData & {
  subject: SubjectKey
  examType: ExamType
}

const UNIT_SOURCES: { path: string; subject: SubjectKey; examType: ExamType }[] = [
  { path: '/data/embedded/final/unit-1.json', subject: 'embedded', examType: 'final' },
  { path: '/data/embedded/final/unit-2.json', subject: 'embedded', examType: 'final' },
  { path: '/data/embedded/final/unit-3.json', subject: 'embedded', examType: 'final' },
  { path: '/data/embedded/final/unit-4.json', subject: 'embedded', examType: 'final' },
  { path: '/data/embedded/final/unit-5.json', subject: 'embedded', examType: 'final' },
  { path: '/data/embedded/final/unit-6.json', subject: 'embedded', examType: 'final' },
  { path: '/data/flutter_qestion/final/flutter_unit_7.json', subject: 'flutter', examType: 'final' },
  { path: '/data/flutter_qestion/final/flutter_unit_8.json', subject: 'flutter', examType: 'final' },
  { path: '/data/flutter_qestion/final/flutter_unit_9.json', subject: 'flutter', examType: 'final' },
  { path: '/data/flutter_qestion/final/flutter_unit_10.json', subject: 'flutter', examType: 'final' },
  { path: '/data/flutter_qestion/final/flutter_unit_11.json', subject: 'flutter', examType: 'final' },
  { path: '/data/flutter_qestion/final/flutter_unit_12.json', subject: 'flutter', examType: 'final' },
  { path: '/data/flutter_qestion/final/flutter_unit_13.json', subject: 'flutter', examType: 'final' },
  { path: '/data/flutter_qestion/final/flutter_unit_14.json', subject: 'flutter', examType: 'final' },
  { path: '/data/flutter_qestion/final/flutter_unit_15.json', subject: 'flutter', examType: 'final' },
  { path: '/data/economics/final/unit-8.json', subject: 'economic', examType: 'final' },
  { path: '/data/economics/final/unit-9.json', subject: 'economic', examType: 'final' },
  { path: '/data/economics/final/unit-10.json', subject: 'economic', examType: 'final' },
  { path: '/data/economics/final/unit-11.json', subject: 'economic', examType: 'final' },
  { path: '/data/economics/final/unit-12.json', subject: 'economic', examType: 'final' },
  { path: '/data/abstract-data-type/unit-1.json', subject: 'abstract-data-type', examType: 'all' },
  { path: '/data/abstract-data-type/unit-2.json', subject: 'abstract-data-type', examType: 'all' },
  { path: '/data/abstract-data-type/unit-3.json', subject: 'abstract-data-type', examType: 'all' },
  { path: '/data/abstract-data-type/unit-4.json', subject: 'abstract-data-type', examType: 'all' },
  { path: '/data/cyber-security/midterm/unit-1.json', subject: 'cyber-security', examType: 'midterm' },
  { path: '/data/cyber-security/midterm/unit-2.json', subject: 'cyber-security', examType: 'midterm' },
  { path: '/data/cyber-security/midterm/unit-3.json', subject: 'cyber-security', examType: 'midterm' },
  { path: '/data/cyber-security/midterm/unit-4.json', subject: 'cyber-security', examType: 'midterm' },
  { path: '/data/cyber-security/midterm/unit-5.json', subject: 'cyber-security', examType: 'midterm' },
]

async function loadUnits(): Promise<SubjectUnitQuizData[]> {
  const responses = await Promise.all(UNIT_SOURCES.map((source) => fetch(source.path)))

  responses.forEach((response, index) => {
    if (!response.ok) {
      throw new Error(`Failed to load ${UNIT_SOURCES[index].path}`)
    }
  })

  const data = await Promise.all(
    responses.map(async (response, index) => {
      const payload = (await response.json()) as UnitQuizData
      return {
        ...payload,
        subject: UNIT_SOURCES[index].subject,
        examType: UNIT_SOURCES[index].examType,
      }
    }),
  )

  return data.sort((a, b) => a.unit_number - b.unit_number)
}

export function useQuiz() {
  const [units, setUnits] = useState<SubjectUnitQuizData[]>([])
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

  const startExam = (selectedUnits?: SubjectUnitQuizData[]) => {
    const activeUnits = selectedUnits ?? units
    const preparedQuestions = buildExamQuestions(activeUnits, selectedPercentage)

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
