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
      className={`w-full rounded-xl border px-3 py-2.5 text-left transition ${
        isSelected
          ? 'border-amber-400 bg-amber-100 text-zinc-900'
          : 'border-zinc-300 bg-white/90 text-zinc-800 hover:border-zinc-400 hover:bg-white'
      }`}
    >
      <span className="mr-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-zinc-100 text-sm font-semibold text-zinc-600">
        {index}
      </span>
      {text}
    </button>
  )
}
