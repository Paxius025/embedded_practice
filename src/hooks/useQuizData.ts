import { useCallback, useState } from 'react'
import type { UnitQuizData } from '../types/quiz'

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
  { path: '/data/abstract-data-type/unit-1.json', subject: 'abstract-data-type', examType: 'midterm' },
  { path: '/data/abstract-data-type/unit-2.json', subject: 'abstract-data-type', examType: 'midterm' },
  { path: '/data/abstract-data-type/unit-3.json', subject: 'abstract-data-type', examType: 'midterm' },
  { path: '/data/abstract-data-type/unit-4.json', subject: 'abstract-data-type', examType: 'midterm' },
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

export function useQuizData() {
  const [units, setUnits] = useState<SubjectUnitQuizData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

  return { units, isLoading, error, initialize }
}
