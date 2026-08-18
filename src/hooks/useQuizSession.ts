import { useCallback, useReducer } from 'react'
import type { PreparedQuestion } from '../types/quiz'

export type SessionState = {
  questions: PreparedQuestion[]
  selectedAnswers: number[]
  currentQuestionIndex: number
  isFinished: boolean
}

export type SessionAction =
  | { type: 'START'; questions: PreparedQuestion[] }
  | { type: 'SELECT_ANSWER'; answerIndex: number }
  | { type: 'GO_NEXT' }
  | { type: 'GO_PREV' }
  | { type: 'FINISH' }
  | { type: 'RESTART' }

const initialSessionState: SessionState = {
  questions: [],
  selectedAnswers: [],
  currentQuestionIndex: 0,
  isFinished: false,
}

function sessionReducer(state: SessionState, action: SessionAction): SessionState {
  switch (action.type) {
    case 'START':
      return {
        questions: action.questions,
        selectedAnswers: new Array(action.questions.length).fill(0),
        currentQuestionIndex: 0,
        isFinished: false,
      }
    case 'SELECT_ANSWER': {
      const nextAnswers = [...state.selectedAnswers]
      nextAnswers[state.currentQuestionIndex] = action.answerIndex
      return { ...state, selectedAnswers: nextAnswers }
    }
    case 'GO_NEXT': {
      const currentAnswer = state.selectedAnswers[state.currentQuestionIndex] ?? 0
      if (currentAnswer === 0) return state
      return {
        ...state,
        currentQuestionIndex: Math.min(state.currentQuestionIndex + 1, state.questions.length - 1)
      }
    }
    case 'GO_PREV':
      return {
        ...state,
        currentQuestionIndex: Math.max(state.currentQuestionIndex - 1, 0)
      }
    case 'FINISH': {
      const currentAnswer = state.selectedAnswers[state.currentQuestionIndex] ?? 0
      if (currentAnswer === 0) return state
      return { ...state, isFinished: true }
    }
    case 'RESTART':
      return initialSessionState
    default:
      return state
  }
}

export function useQuizSession() {
  const [state, dispatch] = useReducer(sessionReducer, initialSessionState)

  const startSession = useCallback((questions: PreparedQuestion[]) => {
    dispatch({ type: 'START', questions })
  }, [])

  const selectAnswer = useCallback((answerIndex: number) => {
    dispatch({ type: 'SELECT_ANSWER', answerIndex })
  }, [])

  const goNext = useCallback(() => {
    dispatch({ type: 'GO_NEXT' })
  }, [])

  const goPrev = useCallback(() => {
    dispatch({ type: 'GO_PREV' })
  }, [])

  const finishExam = useCallback(() => {
    dispatch({ type: 'FINISH' })
  }, [])

  const restartSession = useCallback(() => {
    dispatch({ type: 'RESTART' })
  }, [])

  return {
    ...state,
    startSession,
    selectAnswer,
    goNext,
    goPrev,
    finishExam,
    restartSession,
  }
}
