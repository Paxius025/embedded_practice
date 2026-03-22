type StartModalProps = {
  onClose: () => void
  onConfirm: () => void
}

export function StartModal({ onClose, onConfirm }: StartModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-xl rounded-2xl border border-zinc-700 bg-zinc-900 p-6 text-zinc-100 shadow-2xl">
        <h2 className="text-2xl font-semibold">คำเตือนก่อนเริ่มทำข้อสอบ</h2>
        <ul className="mt-4 space-y-2 text-zinc-300">
          <li>ข้อสอบนี้ไม่ได้มีการบันทึกข้อมูล</li>
          <li>รีเฟรช = ข้อมูลหาย</li>
          <li>กรุณาทำให้เสร็จในครั้งเดียว</li>
        </ul>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-zinc-600 px-4 py-2 font-medium text-zinc-200 transition hover:bg-zinc-800"
          >
            ยกเลิก
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 rounded-lg bg-amber-400 px-4 py-2 font-semibold text-zinc-900 transition hover:bg-amber-300"
          >
            เริ่มทำข้อสอบ
          </button>
        </div>
      </div>
    </div>
  )
}
