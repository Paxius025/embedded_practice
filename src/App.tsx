import { useEffect } from 'react'
import { QuizCard } from './components/QuizCard'
import { ResultScreen } from './components/ResultScreen'
import { StartModal } from './components/StartModal'
import { useQuiz } from './hooks/useQuiz'

function App() {
  const {
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
    currentAnswer,
    answeredCount,
    isFinished,
    result,
    initialize,
    startExam,
    selectAnswer,
    goNext,
    goPrev,
    finishExam,
    restart,
  } = useQuiz()

  useEffect(() => {
    void initialize()
  }, [initialize])

  const options = [
    { label: '25%', value: 0.25 },
    { label: '50%', value: 0.5 },
    { label: '75%', value: 0.75 },
    { label: '100%', value: 1 },
  ]

  const selectedCount = Math.floor(totalBankQuestions * selectedPercentage)

  return (
    <main className="relative h-dvh overflow-hidden bg-[radial-gradient(circle_at_20%_20%,#fde68a_0%,transparent_35%),radial-gradient(circle_at_80%_0%,#fca5a5_0%,transparent_30%),linear-gradient(135deg,#f7f8fb_0%,#edf0f9_60%,#e5e7f1_100%)] px-2 py-2 md:px-3 md:py-3">
      <div
        className={`mx-auto flex h-full w-full max-w-4xl flex-col gap-3 ${
          isFinished ? 'overflow-y-auto pb-12 pr-1' : 'overflow-hidden'
        }`}
      >
        {questions.length === 0 && (
          <header className="sticky top-2 z-40 rounded-2xl border border-zinc-200/80 bg-white/90 p-4 shadow-lg backdrop-blur md:p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Embedded Practice Exam
            </p>
            <h1 className="mt-1.5 text-xl font-black text-zinc-900 md:text-3xl">
              ระบบฝึกทำข้อสอบวิชาระบบฝังตัวภาคปลาย
            </h1>
          </header>
        )}

        {isLoading && (
          <section className="rounded-2xl border border-zinc-200 bg-white/90 p-6 text-center text-base font-medium text-zinc-700 shadow-lg">
            กำลังโหลดชุดข้อสอบ...
          </section>
        )}

        {error && (
          <section className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-800 shadow-lg">
            เกิดข้อผิดพลาด: {error}
          </section>
        )}

        {!isLoading && !error && questions.length === 0 && !isFinished && (
          <section className="rounded-2xl border border-zinc-200 bg-white/95 p-4 shadow-xl md:p-6">
            <h2 className="text-xl font-semibold text-zinc-900">เลือกขนาดข้อสอบ</h2>
            <p className="mt-1.5 text-zinc-600">
              คลังข้อสอบทั้งหมด {totalBankQuestions} ข้อ จาก {units.length} ยูนิต
            </p>

            <div className="mt-3 grid grid-cols-2 gap-2.5 md:grid-cols-4">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSelectedPercentage(option.value)}
                  className={`rounded-xl border px-3 py-2.5 text-center font-semibold transition ${
                    selectedPercentage === option.value
                      ? 'border-amber-400 bg-amber-200 text-zinc-900'
                      : 'border-zinc-300 bg-white text-zinc-700 hover:border-zinc-500'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <div className="mt-3 rounded-xl bg-zinc-100 p-3 text-zinc-700">
              จำนวนข้อที่จะออกสอบ: <span className="font-bold">{selectedCount}</span> ข้อ
            </div>

            <button
              type="button"
              onClick={openStartModal}
              disabled={selectedCount <= 0}
              className="mt-4 rounded-lg bg-zinc-900 px-6 py-2.5 font-semibold text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              เริ่มทำข้อสอบ
            </button>
          </section>
        )}

        {currentQuestion && !isFinished && (
          <QuizCard
            question={currentQuestion}
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={questions.length}
            selectedAnswer={currentAnswer}
            answeredCount={answeredCount}
            onSelect={selectAnswer}
            onPrev={goPrev}
            onNext={goNext}
            onFinish={finishExam}
          />
        )}

        {isFinished && result && (
          <ResultScreen
            result={result}
            onRestart={restart}
          />
        )}
      </div>

      {showStartModal && (
        <StartModal onClose={closeStartModal} onConfirm={startExam} />
      )}

      <footer className="pointer-events-none absolute inset-x-0 bottom-2 text-center text-xs font-medium text-zinc-600 md:text-sm">
        จัดทำโดย Pantong Sanonok CPE9
      </footer>
    </main>
  )
}

export default App
