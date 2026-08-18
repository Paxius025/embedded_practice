import { useCallback, useMemo, useState } from 'react'
import { calculateScore } from '../utils/calculateScore'
import { buildExamQuestions } from '../utils/shuffle'
import type { ScoreSummary } from '../types/quiz'

import { useQuizData } from './useQuizData'
import type { SubjectKey, ExamType, SubjectUnitQuizData } from './useQuizData'
import { useQuizSession } from './useQuizSession'

export type { SubjectKey, ExamType, SubjectUnitQuizData }

export function useQuiz() {
  const { units, isLoading, error, initialize } = useQuizData()
  const {
    questions,
    selectedAnswers,
    currentQuestionIndex,
    isFinished,
    startSession,
    selectAnswer,
    goNext,
    goPrev,
    finishExam,
    restartSession,
  } = useQuizSession()

  const [selectedPercentage, setSelectedPercentage] = useState(0.25)
  const [showStartModal, setShowStartModal] = useState(false)

  const totalBankQuestions = useMemo(
    () => units.reduce((sum, unit) => sum + unit.questions.length, 0),
    [units],
  )

  const currentQuestion = questions[currentQuestionIndex]
  const currentAnswer = selectedAnswers[currentQuestionIndex] ?? 0
  
  // Memoize answered count to avoid recalculation
  const answeredCount = useMemo(
    () => selectedAnswers.filter((answer) => answer > 0).length,
    [selectedAnswers]
  )
  
  const isLastQuestion = currentQuestionIndex === questions.length - 1

  const result: ScoreSummary | null = useMemo(() => {
    if (!isFinished || questions.length === 0) {
      return null
    }

    return calculateScore(questions, selectedAnswers)
  }, [isFinished, questions, selectedAnswers])

  const openStartModal = useCallback(() => {
    setShowStartModal(true)
  }, [])

  const closeStartModal = useCallback(() => {
    setShowStartModal(false)
  }, [])

  const startExam = useCallback((selectedUnits?: SubjectUnitQuizData[]) => {
    const activeUnits = selectedUnits ?? units
    const preparedQuestions = buildExamQuestions(activeUnits, selectedPercentage)
    
    startSession(preparedQuestions)
    setShowStartModal(false)
  }, [units, selectedPercentage, startSession])

  const restart = useCallback(() => {
    restartSession()
    setShowStartModal(false)
  }, [restartSession])

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
