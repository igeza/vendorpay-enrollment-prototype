import { useState } from "react"
import { Dropdown } from "./ui/Dropdown"
import { DatePicker } from "./ui/DatePicker"
import { Button } from "./ui/Button"
import { ASSOCIATED_BILL_OPTIONS } from "../types/batches"
import closeIcon from "../assets/splash/shell/overlay-close-icon.svg"

function todayISO() {
  const d = new Date()
  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`
}

function formatMMDDYYYY(iso: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
  if (!m) return iso
  return `${m[2]}/${m[3]}/${m[1]}`
}

export function ConfirmVoidPopup({
  date,
  amount,
  onClose,
  onAccept,
}: {
  date: string
  amount: number
  onClose: () => void
  onAccept: (reversalDate: string) => void
}) {
  const [associatedBills, setAssociatedBills] = useState(ASSOCIATED_BILL_OPTIONS[0])
  const [reversalDate, setReversalDate] = useState(todayISO())

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[rgba(76,76,76,0.5)]">
      <div className="flex w-[460px] flex-col overflow-hidden rounded-sm border border-border-primary bg-white shadow-[var(--shadow-dropshadow-lg)]">
        <header className="flex h-12 shrink-0 items-center justify-between border-b border-border-primary px-md py-xs">
          <h1 className="text-[20px] leading-[28px] font-normal text-text-secondary">Confirm Void</h1>
          <button type="button" aria-label="Close" className="opacity-70 hover:opacity-100" onClick={onClose}>
            <img src={closeIcon} alt="" className="h-6 w-6" />
          </button>
        </header>

        <div className="flex flex-col gap-md p-md">
          <p className="text-sm text-label-gray">Are you sure you want to void this payment?</p>
          <div className="flex gap-2xl text-sm text-text-secondary">
            <span>Date: {date}</span>
            <span>Amount: {amount.toFixed(2)}</span>
          </div>
          <p className="text-sm text-label-gray">This pays a bill. Please select from the following options:</p>
          <Dropdown
            label="What should happen to associated bills?"
            options={ASSOCIATED_BILL_OPTIONS}
            value={associatedBills}
            onChange={setAssociatedBills}
          />
          <DatePicker label="Date of Reversal" value={reversalDate} onChange={setReversalDate} />
        </div>

        <footer className="flex shrink-0 items-center justify-end gap-md border-t border-border-primary bg-input-fill px-md py-xs">
          <Button variant="primary" onClick={() => onAccept(formatMMDDYYYY(reversalDate))}>
            Accept
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </footer>
      </div>
    </div>
  )
}
