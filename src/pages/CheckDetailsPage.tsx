import { useState } from "react"
import { useParams } from "react-router-dom"
import { AppHeader } from "../components/AppHeader"
import { Dropdown } from "../components/ui/Dropdown"
import { Checkbox } from "../components/ui/Controls"
import { ClearedCheckModal } from "../components/ClearedCheckModal"
import { usePayBills } from "../context/PayBillsContext"
import { memoFor } from "../utils/vendorMemo"
import infoWhiteIcon from "../assets/check-details/icon-info-white.svg"
import helpWhiteIcon from "../assets/check-details/icon-help-white.svg"
import keyboardArrowDownIcon from "../assets/check-details/icon-keyboard-arrow-down.svg"
import calendarTodayIcon from "../assets/check-details/icon-calendar-today.svg"
import searchIcon from "../assets/check-details/icon-search.svg"
import vendorsIcon from "../assets/check-details/icon-vendors.svg"
import calculatorIcon from "../assets/check-details/icon-calculator.svg"
import refreshIcon from "../assets/check-details/icon-refresh.svg"
import editFilledIcon from "../assets/check-details/icon-edit-filled.svg"
import cloudUploadIcon from "../assets/check-details/icon-cloud-upload.svg"
import pasteIcon from "../assets/check-details/icon-paste.svg"
import addIcon from "../assets/check-details/icon-add.svg"
import attachMoneyIcon from "../assets/check-details/icon-attach-money.svg"
import clearAllIcon from "../assets/check-details/icon-clear-all.svg"
import moreVertIcon from "../assets/check-details/icon-more-vert.svg"
import deleteFilledIcon from "../assets/check-details/icon-delete-filled.svg"
import libraryAddIcon from "../assets/check-details/icon-library-add.svg"
import printIcon from "../assets/check-details/icon-print.svg"

function formatMoney(n: number) {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

/** Stable, deterministic per-bank balance for display only — not a real ledger figure. */
function pseudoBalance(seed: string) {
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  return 5000 + (hash % 20000) + (hash % 100) / 100
}

/** Disabled-look input box matching this screen's own spec: #f2f2f2 fill, disabled border/text. */
function DisabledField({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`flex h-9 items-center gap-xs truncate rounded-sm border border-border-disabled bg-[#f2f2f2] px-sm text-sm text-[#b3b3b3] ${className ?? ""}`}
    >
      {children}
    </div>
  )
}

export function CheckDetailsPage() {
  const { batchId, paymentId, checkNumber } = useParams()
  const { batches } = usePayBills()
  const [showHistory, setShowHistory] = useState(false)

  const batch = batches.find((b) => b.id === batchId)
  const payment = batch?.payments.find((p) => p.id === paymentId)
  const checkRow = payment?.breakdown.find((row) => row.checkNumber === checkNumber)

  if (!payment || !checkRow) {
    return (
      <div className="flex min-h-screen flex-col bg-[#f3f4f8]">
        <AppHeader />
        <div className="flex flex-1 items-center justify-center text-sm text-label-gray">
          This check could not be found.
        </div>
      </div>
    )
  }

  const balance = pseudoBalance(payment.bankAccount)
  const memo = memoFor(payment.vendor)
  const invoiceShort = payment.invoiceId.replace(/^INV-/, "")

  return (
    <div className="flex min-h-screen flex-col bg-[#f5f8fa]">
      <AppHeader />
      <div className="flex h-10 shrink-0 items-center justify-between bg-brand-blue px-md py-xs text-white">
        <span className="text-lg">Check</span>
        <div className="flex items-center gap-md">
          <button type="button" aria-label="Info">
            <img src={infoWhiteIcon} alt="" className="h-5 w-5" />
          </button>
          <button type="button" aria-label="Help">
            <img src={helpWhiteIcon} alt="" className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="flex min-w-0 flex-1">
        <div className="flex min-w-0 flex-1 flex-col gap-md overflow-x-hidden p-md">
          <div className="flex flex-col gap-md min-[1900px]:flex-row">
            {/* Tile 1: Check fields */}
            <div className="flex w-full flex-col overflow-hidden rounded-sm border border-border-primary bg-white min-[1900px]:w-[1230px] min-[1900px]:shrink-0">
              <div className="h-[4px] shrink-0 bg-brand-navy" />
              <div className="flex flex-col gap-lg p-md">
                <div className="flex flex-wrap items-end gap-md">
                  <div className="flex min-w-[280px] flex-1 flex-col gap-xxs">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-normal text-label-gray">Bank</span>
                      <span className="text-sm text-label-gray">Balance: {formatMoney(balance)}</span>
                    </div>
                    <DisabledField className="justify-between">
                      <span className="truncate">{payment.bankAccount}</span>
                      <img src={keyboardArrowDownIcon} alt="" className="h-5 w-5 shrink-0 opacity-60" />
                    </DisabledField>
                  </div>
                  <div className="flex w-[248px] shrink-0 flex-col gap-xxs">
                    <span className="text-sm font-normal text-label-gray">Date</span>
                    <div className="flex h-9 items-center justify-between rounded-sm border border-border-primary bg-input-fill px-sm text-sm text-text-primary">
                      <span>{checkRow.postingDate}</span>
                      <img src={calendarTodayIcon} alt="" className="h-5 w-5 shrink-0" />
                    </div>
                  </div>
                  <div className="flex w-[248px] shrink-0 flex-col gap-xxs">
                    <span className="text-sm font-normal text-label-gray">No.</span>
                    <div className="flex h-9 items-center rounded-sm border border-border-primary bg-input-fill px-sm text-sm text-text-primary">
                      {checkRow.checkNumber}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-end gap-md">
                  <div className="flex min-w-[280px] flex-1 flex-col gap-xxs">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-normal text-label-gray">Vendor</span>
                      <span className="text-sm text-[rgba(0,141,213,0.5)]">Fill from history</span>
                    </div>
                    <div className="flex items-center gap-xxs">
                      <DisabledField className="min-w-0 flex-1 justify-between">
                        <span className="flex items-center gap-xs truncate">
                          <img src={searchIcon} alt="" className="h-5 w-5 shrink-0 opacity-60" />
                          {payment.vendor}
                        </span>
                      </DisabledField>
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-border-disabled bg-[#f2f2f2]">
                        <img src={vendorsIcon} alt="" className="h-5 w-5 opacity-60" />
                      </div>
                    </div>
                  </div>
                  <div className="flex w-[248px] shrink-0 flex-col gap-xxs">
                    <span className="text-sm font-normal text-label-gray">Amount</span>
                    <div className="flex items-center gap-xxs">
                      <DisabledField className="min-w-0 flex-1 justify-between">
                        <span>{formatMoney(checkRow.amount)}</span>
                        <img src={calculatorIcon} alt="" className="h-5 w-5 shrink-0 opacity-60" />
                      </DisabledField>
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-border-disabled bg-[#f2f2f2]">
                        <img src={refreshIcon} alt="" className="h-5 w-5 opacity-60" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-start gap-md">
                  <div className="flex min-w-[280px] flex-1 items-center gap-xxs">
                    <span className="text-sm font-normal text-label-gray">Payee Information</span>
                    <img src={editFilledIcon} alt="" className="h-4 w-4 opacity-60" />
                  </div>
                  <div className="flex min-w-[280px] flex-1 flex-col gap-xxs">
                    <span className="text-sm font-normal text-label-gray">Memo</span>
                    <div className="flex h-9 items-center rounded-sm border border-border-primary bg-input-fill px-sm text-sm text-text-primary">
                      {memo}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tile 2: VendorPay status + attachments */}
            <div className="flex w-full flex-1 flex-col overflow-hidden rounded-sm border border-border-primary bg-white min-[1900px]:min-w-[602px]">
              <div className="h-[4px] shrink-0 bg-brand-navy" />
              <div className="flex flex-col gap-md p-md">
                <div className="flex items-center gap-xs text-sm">
                  <span className="font-bold text-brand-navy">Check pays a bill</span>
                  <button type="button" className="font-normal text-text-link hover:underline">
                    Invoice #{invoiceShort}
                  </button>
                </div>

                <div className="flex items-center gap-xs">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-xs border-2 border-attention bg-attention opacity-60">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                  <span className="text-sm text-[#b3b3b3]">VendorPay</span>
                  <span className="text-sm font-semibold italic text-brand-navy">VendorPay Status: {checkRow.status}</span>
                  <button
                    type="button"
                    onClick={() => setShowHistory(true)}
                    className="text-sm font-normal text-text-link hover:underline"
                  >
                    View VendorPay Status History
                  </button>
                </div>

                <div className="flex flex-col gap-xxs">
                  <span className="text-sm font-normal text-label-gray">Attachments</span>
                  <div className="flex h-[129px] flex-col items-center justify-center gap-xxs rounded-xs border border-dashed border-border-primary bg-input-fill">
                    <div className="flex items-center gap-xxs">
                      <img src={cloudUploadIcon} alt="" className="h-4 w-4" />
                      <span className="text-sm text-text-link">Upload</span>
                      <span className="text-border-primary">|</span>
                      <img src={pasteIcon} alt="" className="h-4 w-4" />
                      <span className="text-sm text-text-link">Paste</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Register: GL allocation */}
          <div className="overflow-x-auto rounded-sm border border-border-primary bg-white shadow-[var(--shadow-dropshadow-md)]">
            <div className="min-w-[1444px]">
              <div className="flex h-7 bg-[#737373] text-[12.6px] font-medium tracking-[1.134px] text-white">
                <div className="flex w-[190px] shrink-0 items-center truncate px-xs">Property</div>
                <div className="flex w-[191px] shrink-0 items-center truncate px-xs">Unit</div>
                <div className="flex min-w-[148px] flex-1 items-center truncate px-xs">Expense Account</div>
                <div className="flex w-[49px] shrink-0 items-center justify-center truncate px-xs">1099</div>
                <div className="flex min-w-[148px] flex-1 items-center truncate px-xs">Job</div>
                <div className="flex min-w-[148px] flex-1 items-center truncate px-xs">Memo</div>
                <div className="flex w-[66px] shrink-0 items-center justify-center truncate px-xs">Billable</div>
                <div className="flex min-w-[148px] flex-1 items-center truncate px-xs">Billable To</div>
                <div className="flex w-[160px] shrink-0 items-center truncate px-xs">Markup</div>
                <div className="flex w-[160px] shrink-0 items-center truncate px-xs">Amount</div>
                <div className="w-9 shrink-0" />
              </div>

              <div className="flex h-9 items-center border-t border-border-disabled bg-white">
                <div className="w-[190px] shrink-0 px-xs">
                  <Dropdown size="compact" options={["FMHP"]} value="FMHP" onChange={() => {}} />
                </div>
                <div className="flex w-[191px] shrink-0 items-center gap-xs truncate px-xs text-sm text-text-link">
                  <img src={searchIcon} alt="" className="h-5 w-5 shrink-0" />
                  Lot #101
                </div>
                <div className="min-w-[148px] flex-1 px-xs">
                  <Dropdown size="compact" options={["5100 Maintenance"]} value="5100 Maintenance" onChange={() => {}} />
                </div>
                <div className="flex w-[49px] shrink-0 items-center justify-center px-xs">
                  <Checkbox label="" checked={false} onChange={() => {}} />
                </div>
                <div className="min-w-[148px] flex-1 px-xs">
                  <Dropdown size="compact" options={["<Unassigned>"]} value="<Unassigned>" onChange={() => {}} />
                </div>
                <div className="min-w-[148px] flex-1 truncate px-xs text-sm text-text-primary">{memo}</div>
                <div className="flex w-[66px] shrink-0 items-center justify-center px-xs">
                  <Checkbox label="" checked={false} onChange={() => {}} />
                </div>
                <div className="min-w-[148px] flex-1 truncate px-xs text-sm text-text-primary" />
                <div className="w-[160px] shrink-0 px-xs">
                  <DisabledField>0.00</DisabledField>
                </div>
                <div className="w-[160px] shrink-0 px-xs">
                  <div className="flex h-9 items-center justify-between rounded-sm border border-border-primary bg-input-fill px-sm text-sm text-text-primary">
                    {formatMoney(checkRow.amount)}
                    <img src={calculatorIcon} alt="" className="h-5 w-5 shrink-0" />
                  </div>
                </div>
                <div className="flex w-9 shrink-0 items-center justify-center px-xs">
                  <img src={moreVertIcon} alt="" className="h-5 w-5" />
                </div>
              </div>

              <div className="flex items-center gap-lg p-sm">
                <button type="button" className="flex items-center gap-xxs text-sm font-normal text-text-link hover:underline">
                  <img src={addIcon} alt="" className="h-5 w-5" />
                  Add Detail
                </button>
                <button type="button" className="flex items-center gap-xxs text-sm font-normal text-text-link hover:underline">
                  <img src={attachMoneyIcon} alt="" className="h-5 w-5" />
                  Disburse Amount
                </button>
                <button type="button" className="flex items-center gap-xxs text-sm font-normal text-text-link hover:underline">
                  <img src={clearAllIcon} alt="" className="h-5 w-5" />
                  Clear Allocations
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end pr-sm text-sm text-[#b3b3b3]">Total: {formatMoney(checkRow.amount)}</div>
        </div>

        <div className="flex w-10 shrink-0 flex-col items-center gap-md bg-brand-navy px-xs py-md">
          <button type="button" aria-label="Delete">
            <img src={deleteFilledIcon} alt="" className="h-5 w-5" />
          </button>
          <button type="button" aria-label="Duplicate">
            <img src={libraryAddIcon} alt="" className="h-5 w-5" />
          </button>
          <button type="button" aria-label="Print">
            <img src={printIcon} alt="" className="h-5 w-5" />
          </button>
        </div>
      </div>

      {showHistory && (
        <ClearedCheckModal payment={payment} checkRow={checkRow} onClose={() => setShowHistory(false)} />
      )}
    </div>
  )
}
