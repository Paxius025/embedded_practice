type ChoiceButtonProps = {
  index: number
  text: string
  isSelected: boolean
  onSelect: (choiceIndex: number) => void
}

export function ChoiceButton({
  index,
  text,
  isSelected,
  onSelect,
}: ChoiceButtonProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(index)}
      className={`flex w-full items-center justify-center rounded-xl border px-3 py-3 text-center text-lg transition ${
        isSelected
          ? 'border-amber-400 bg-amber-100 text-zinc-900'
          : 'border-zinc-300 bg-white/90 text-zinc-800 hover:border-zinc-400 hover:bg-white'
      }`}
    >
      {text}
    </button>
  )
}
