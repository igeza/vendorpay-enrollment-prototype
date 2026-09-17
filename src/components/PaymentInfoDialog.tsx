import { useState } from "react"
import { Dropdown } from "./ui/Dropdown"
import { DatePicker } from "./ui/DatePicker"
import { TextBox } from "./ui/Field"
import { Checkbox } from "./ui/Controls"
import { Button } from "./ui/Button"
import { BANK_OPTIONS, type PaymentInfo } from "../types/payBills"
import closeIcon from "../assets/splash/shell/overlay-close-icon.svg"

const BANK_CHOICES = ["<Use Bank/CC Assigned on Register>", ...BANK_OPTIONS]

function todayISO() {
  const d = new Date()
  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`
}

export function PaymentInfoDialog({ onClose, onSave }: { onClose: () => void; onSave: (info: PaymentInfo) => void }) {
  const [bankOverride, setBankOverride] = useState(BANK_CHOICES[0])
  const [paymentDate, setPaymentDate] = useState(todayISO())
  const [comment, setComment] = useState("")
  const [consolidateByVendor, setConsolidateByVendor] = useState(false)
  const [markChecksToBePrinted, setMarkChecksToBePrinted] = useState(false)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(76,76,76,0.5)]">
      <div className="flex w-[534px] flex-col overflow-hidden rounded-sm border border-border-primary bg-white shadow-[var(--shadow-dropshadow-lg)]">
        <header className="flex h-12 shrink-0 items-center justify-between border-b border-border-primary px-md py-xs">
          <h1 className="text-[20px] leading-[28px] font-normal text-text-primary">Payment Info</h1>
          <button type="button" aria-label="Close" onClick={onClose}>
            <img src={closeIcon} alt="" className="h-6 w-6" />
          </button>
        </header>

        <div className="flex flex-col gap-md p-md">
          <Dropdown
            label="Choose which Bank/Credit Card to apply to selected bills"
            options={BANK_CHOICES}
            value={bankOverride}
            onChange={setBankOverride}
          />
          <DatePicker label="Payment Date" value={paymentDate} onChange={setPaymentDate} />
          <TextBox label="Comment" value={comment} onChange={(e) => setComment(e.target.value)} className="h-16" />

          <div className="flex items-center gap-xl">
            <Checkbox label="Consolidate by Vendor" checked={consolidateByVendor} onChange={setConsolidateByVendor} />
            <Checkbox label="Mark check(s) to be printed" checked={markChecksToBePrinted} onChange={setMarkChecksToBePrinted} />
          </div>
        </div>

        <footer className="flex shrink-0 items-center justify-end gap-md border-t border-border-primary bg-input-fill px-md py-xs">
          <Button
            variant="primary"
            onClick={() => onSave({ bankOverride, paymentDate, comment, consolidateByVendor, markChecksToBePrinted })}
          >
            Save
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </footer>
      </div>
    </div>
  )
}
