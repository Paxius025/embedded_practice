import { ChoiceButton } from './ChoiceButton'
import type { PreparedQuestion } from '../types/quiz'

type QuizCardProps = {
  question: PreparedQuestion
  currentQuestionIndex: number
  totalQuestions: number
  selectedAnswer: number
  answeredCount: number
  onSelect: (choiceIndex: number) => void
  onPrev: () => void
  onNext: () => void
  onFinish: () => void
}

export function QuizCard({
  question,
  currentQuestionIndex,
  totalQuestions,
  selectedAnswer,
  answeredCount,
  onSelect,
  onPrev,
  onNext,
  onFinish,
}: QuizCardProps) {
  const isLast = currentQuestionIndex === totalQuestions - 1

  return (
    <section className="my-auto w-full rounded-2xl border border-zinc-200 bg-white/95 p-4 shadow-xl md:p-6">
      <div className="mb-4">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-sm text-zinc-600">
          <span className="rounded-full bg-zinc-100 px-3 py-1 font-medium">
            บทที่ {question.unitNumber}: {question.unitName}
          </span>
          <span>
            ตอบแล้ว {answeredCount}/{totalQuestions}
          </span>
        </div>
        <progress
          className="h-2 w-full overflow-hidden rounded-full [&::-webkit-progress-bar]:bg-zinc-200 [&::-webkit-progress-value]:bg-linear-to-r [&::-webkit-progress-value]:from-amber-400 [&::-webkit-progress-value]:to-orange-500 [&::-moz-progress-bar]:bg-linear-to-r [&::-moz-progress-bar]:from-amber-400 [&::-moz-progress-bar]:to-orange-500"
          max={totalQuestions}
          value={currentQuestionIndex + 1}
        />
      </div>

      <h2 className="text-lg font-semibold text-zinc-900 md:text-xl">
        ข้อที่ {currentQuestionIndex + 1}: {question.question}
      </h2>

      <div className="mt-4 grid gap-2.5">
        {question.choices.map((choice, index) => {
          const choiceIndex = index + 1

          return (
            <ChoiceButton
              key={`${choice}-${choiceIndex}`}
              index={choiceIndex}
              text={choice}
              isSelected={selectedAnswer === choiceIndex}
              onSelect={onSelect}
            />
          )
        })}
      </div>

      <div className="mt-5 flex flex-wrap gap-2.5">
        <button
          type="button"
          onClick={onPrev}
          disabled={currentQuestionIndex === 0}
          className="rounded-lg border border-zinc-300 px-5 py-2 font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          ย้อนกลับ
        </button>

        {!isLast ? (
          <button
            type="button"
            onClick={onNext}
            disabled={selectedAnswer === 0}
            className="ml-auto rounded-lg bg-zinc-900 px-5 py-2 font-semibold text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ข้อถัดไป
          </button>
        ) : (
          <button
            type="button"
            onClick={onFinish}
            disabled={selectedAnswer === 0}
            className="ml-auto rounded-lg bg-emerald-600 px-5 py-2 font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ส่งข้อสอบ
          </button>
        )}
      </div>
    </section>
  )
}
