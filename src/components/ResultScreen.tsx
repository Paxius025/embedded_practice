import { useMemo, useState } from 'react'
import type { ScoreSummary } from '../types/quiz'

type ResultScreenProps = {
  result: ScoreSummary
  onRestart: () => void
}

type ResultFilter = 'all' | 'correct' | 'incorrect'

export function ResultScreen({ result, onRestart }: ResultScreenProps) {
  const [activeFilter, setActiveFilter] = useState<ResultFilter>('all')

  const filteredQuestionResults = useMemo(() => {
    if (activeFilter === 'correct') {
      return result.questionResults.filter((item) => item.isCorrect)
    }

    if (activeFilter === 'incorrect') {
      return result.questionResults.filter((item) => !item.isCorrect)
    }

    return result.questionResults
  }, [activeFilter, result.questionResults])

  return (
    <section className="w-full rounded-2xl border border-zinc-200 bg-white/95 p-5 text-zinc-900 shadow-xl md:p-6">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-2xl font-bold">ผลคะแนน</h2>
        <button
          type="button"
          onClick={onRestart}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-700 md:px-5 md:py-2.5"
        >
          เริ่มใหม่
        </button>
      </div>

      <div className="mt-4 grid gap-2 text-base md:text-lg">
        <p>
          คะแนนรวม: <span className="font-semibold">{result.score}</span> /{' '}
          <span className="font-semibold">{result.total}</span>
        </p>
        <p>
          คิดเป็นเปอร์เซ็นต์:{' '}
          <span className="font-semibold">{result.percentage.toFixed(2)}%</span>
        </p>
        <p>
          จำนวนข้อถูก: <span className="font-semibold text-emerald-700">{result.correct}</span>
        </p>
        <p>
          จำนวนข้อผิด: <span className="font-semibold text-rose-700">{result.incorrect}</span>
        </p>
      </div>

      <div className="mt-5 space-y-3">
        <h3 className="text-lg font-semibold">สรุปรายข้อ</h3>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition ${
              activeFilter === 'all'
                ? 'border-zinc-900 bg-zinc-900 text-white'
                : 'border-zinc-300 bg-white text-zinc-700 hover:border-zinc-500'
            }`}
          >
            ทั้งหมด ({result.total})
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('correct')}
            className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition ${
              activeFilter === 'correct'
                ? 'border-emerald-700 bg-emerald-700 text-white'
                : 'border-emerald-300 bg-white text-emerald-800 hover:border-emerald-500'
            }`}
          >
            ตอบถูก ({result.correct})
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('incorrect')}
            className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition ${
              activeFilter === 'incorrect'
                ? 'border-rose-700 bg-rose-700 text-white'
                : 'border-rose-300 bg-white text-rose-800 hover:border-rose-500'
            }`}
          >
            ตอบผิด ({result.incorrect})
          </button>
        </div>

        {filteredQuestionResults.length === 0 && (
          <p className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-700 md:text-base">
            ไม่พบข้อสอบในตัวกรองที่เลือก
          </p>
        )}

        {filteredQuestionResults.map((item) => (
          <article
            key={item.questionNumber}
            className={`rounded-xl border p-4 ${
              item.isCorrect
                ? 'border-emerald-200 bg-emerald-50/70'
                : 'border-rose-200 bg-rose-50/70'
            }`}
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="font-semibold text-zinc-900">ข้อที่ {item.questionNumber}</p>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                  item.isCorrect
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {item.isCorrect ? 'ตอบถูก' : 'ตอบผิด'}
              </span>
            </div>

            <p className="text-sm text-zinc-800 md:text-base">{item.question}</p>

            <p className="mt-2 text-sm text-zinc-700 md:text-base">
              คำตอบของคุณ: <span className="font-medium">{item.userAnswerText}</span>
            </p>

            {!item.isCorrect && (
              <p className="mt-1 text-sm text-rose-800 md:text-base">
                คำตอบที่ถูกต้อง: <span className="font-semibold">{item.correctAnswerText}</span>
              </p>
            )}
          </article>
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={onRestart}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-700 md:px-5 md:py-2.5"
        >
          เริ่มใหม่
        </button>
      </div>

    </section>
  )
}
