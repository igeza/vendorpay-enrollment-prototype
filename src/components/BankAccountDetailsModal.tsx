import { useState } from "react"
import { Dropdown } from "./ui/Dropdown"
import { Button } from "./ui/Button"
import closeIcon from "../assets/splash/shell/overlay-close-icon.svg"
import eyeIcon from "../assets/choose-banks/icon-visibility-eye.svg"
import infoIcon from "../assets/bank-accounts/icon-info.svg"

const OWNER_TYPES = ["Business", "Personal"]
const PAYER_NAMES = ["Company Name", "Premiere PMC", "Property Name"]

export interface BankAccountRecord {
  bankName: string
  routingNumber: string
  accountNumber: string
  ownerName: string
  ownerType: string
  payerName: string
}

export function BankAccountDetailsModal({
  account,
  onClose,
  onSave,
}: {
  account: BankAccountRecord
  onClose: () => void
  onSave: (account: BankAccountRecord) => void
}) {
  const [form, setForm] = useState(account)
  const [revealed, setRevealed] = useState(false)

  function set<K extends keyof BankAccountRecord>(key: K, value: BankAccountRecord[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(76,76,76,0.5)]">
      <div className="flex w-[720px] flex-col overflow-hidden rounded-sm border border-border-primary bg-white shadow-[var(--shadow-dropshadow-lg)]">
        <header className="flex h-12 shrink-0 items-center justify-between border-b border-border-primary px-md py-xs">
          <h1 className="text-[20px] leading-[28px] font-normal text-text-primary">Bank Account Details</h1>
          <button aria-label="Close" className="opacity-70 hover:opacity-100" onClick={onClose}>
            <img src={closeIcon} alt="" className="h-6 w-6" />
          </button>
        </header>

        <div className="flex flex-col gap-lg p-md">
          <div className="flex items-end gap-md">
            <div className="flex flex-1 flex-col gap-xxs">
              <span className="text-sm font-normal text-label-gray">Bank Account *</span>
              <div className="flex h-9 items-center justify-between truncate rounded-sm border border-border-disabled bg-[#f8f8f8] px-sm text-sm text-[#b3b3b3]">
                {form.bankName}
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-xxs">
              <div className="flex items-center justify-between">
                <span className="text-sm font-normal text-label-gray">Routing Number *</span>
                <button type="button" className="text-sm font-normal text-text-link hover:underline">
                  Fill From MICR
                </button>
              </div>
              <input
                value={form.routingNumber}
                onChange={(e) => set("routingNumber", e.target.value)}
                className="h-9 rounded-sm border border-border-primary bg-input-fill px-sm text-sm text-text-primary outline-none focus:border-brand-blue"
              />
            </div>
          </div>

          <div className="flex items-end gap-md">
            <div className="flex flex-1 flex-col gap-xxs">
              <div className="flex items-center justify-between">
                <span className="text-sm font-normal text-label-gray">Account Number *</span>
                <button type="button" className="text-sm font-normal text-text-link hover:underline">
                  Fill From MICR
                </button>
              </div>
              <div className="flex h-9 items-center gap-xs rounded-sm border border-border-primary bg-input-fill px-sm focus-within:border-brand-blue">
                <input
                  type={revealed ? "text" : "password"}
                  value={form.accountNumber}
                  onChange={(e) => set("accountNumber", e.target.value)}
                  className="h-full min-w-0 flex-1 bg-transparent text-sm text-text-primary outline-none"
                />
                <button type="button" aria-label="Toggle visibility" onClick={() => setRevealed((r) => !r)} className="shrink-0">
                  <img src={eyeIcon} alt="" className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-xxs">
              <span className="inline-flex items-center gap-xxs text-sm font-normal text-label-gray">
                Owner Name
                <img src={infoIcon} alt="" className="h-4 w-4" />
              </span>
              <input
                value={form.ownerName}
                onChange={(e) => set("ownerName", e.target.value)}
                className="h-9 rounded-sm border border-border-primary bg-input-fill px-sm text-sm text-text-primary outline-none focus:border-brand-blue"
              />
            </div>
          </div>

          <div className="flex items-end gap-md">
            <div className="flex-1">
              <Dropdown label="Owner Type" options={OWNER_TYPES} value={form.ownerType} onChange={(v) => set("ownerType", v)} />
            </div>
            <div className="flex-1">
              <Dropdown
                label="Payer Name"
                labelIcon={<img src={infoIcon} alt="" className="h-4 w-4" />}
                options={PAYER_NAMES}
                value={form.payerName}
                onChange={(v) => set("payerName", v)}
              />
            </div>
          </div>
        </div>

        <footer className="flex shrink-0 items-center justify-end gap-md border-t border-border-primary bg-input-fill px-md py-xs">
          <Button
            variant="primary"
            onClick={() => {
              onSave(form)
              onClose()
            }}
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
