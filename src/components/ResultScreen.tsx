import type { ScoreSummary } from '../types/quiz'

type ResultScreenProps = {
  result: ScoreSummary
  onRestart: () => void
}

export function ResultScreen({ result, onRestart }: ResultScreenProps) {
  return (
    <section className="w-full rounded-2xl border border-zinc-200 bg-white/95 p-5 text-zinc-900 shadow-xl md:p-6">
      <h2 className="text-2xl font-bold">ผลคะแนน</h2>

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

      <button
        type="button"
        onClick={onRestart}
        className="mt-5 rounded-lg bg-zinc-900 px-6 py-2.5 font-semibold text-white transition hover:bg-zinc-700"
      >
        เริ่มใหม่
      </button>
    </section>
  )
}
