import { useState } from "react"
import { AppHeader } from "../components/AppHeader"
import { Dropdown } from "../components/ui/Dropdown"
import { Checkbox } from "../components/ui/Controls"
import { PaymentInfoDialog } from "../components/PaymentInfoDialog"
import { SuccessToast } from "../components/SuccessToast"
import { usePayBills } from "../context/PayBillsContext"
import { BANK_OPTIONS, PAY_METHOD_OPTIONS, type PaymentInfo } from "../types/payBills"
import autorenewIcon from "../assets/shell/autorenew.svg"
import helpIcon from "../assets/shell/help.svg"
import searchIcon from "../assets/bank-accounts/icon-search.svg"
import chevronDownIcon from "../assets/shell/keyboard-arrow-down.svg"
import addCircleIcon from "../assets/bank-accounts/icon-add-circle.svg"
import moreVertIcon from "../assets/bank-accounts/icon-more-vert.svg"
import attachFileIcon from "../assets/pay-bills/icon-attach-file.svg"
import tuneIcon from "../assets/pay-bills/icon-tune.svg"
import printIcon from "../assets/pay-bills/icon-print.svg"
import arrowDropDownIcon from "../assets/pay-bills/icon-arrow-drop-down.svg"
import viewColumnIcon from "../assets/pay-bills/icon-view-column.svg"
import calculateIcon from "../assets/pay-bills/icon-calculate.svg"
import eyeIcon from "../assets/pay-bills/icon-visibility-blue.svg"

const COL_WIDE = "min-w-[140px] flex-1"

function formatMoney(n: number) {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function PayBillsPage() {
  const { bills, toggleBillSelected, toggleAllBills, updateBill, payBills } = usePayBills()
  const [query, setQuery] = useState("")
  const [showPaymentInfo, setShowPaymentInfo] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const visibleBills = bills.filter(
    (b) => b.vendor.toLowerCase().includes(query.toLowerCase()) || b.invoiceNumber.toLowerCase().includes(query.toLowerCase()),
  )
  const selectedBills = bills.filter((b) => b.selected)
  const allSelected = bills.length > 0 && bills.every((b) => b.selected)

  const totalBillAmount = bills.reduce((sum, b) => sum + b.amount, 0)
  const totalBillAmountDue = bills.reduce((sum, b) => sum + b.amountDue, 0)
  const totalSelectedToPay = selectedBills.reduce((sum, b) => sum + b.amountToPay, 0)

  function handleSave(info: PaymentInfo) {
    payBills(info)
    setShowPaymentInfo(false)
    setToast("Bill payments completed successfully")
    window.setTimeout(() => setToast(null), 3000)
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f3f4f8]">
      <AppHeader />
      <div className="relative flex h-10 shrink-0 items-center justify-between bg-brand-blue px-md py-xs text-white">
        <span className="text-lg">Pay Bills</span>
        <div className="flex items-center gap-md">
          <button type="button" aria-label="Refresh">
            <img src={autorenewIcon} alt="" className="h-5 w-5" />
          </button>
          <button type="button" aria-label="Help">
            <img src={helpIcon} alt="" className="h-5 w-5" />
          </button>
        </div>
        {toast && <SuccessToast message={toast} />}
      </div>

      <div className="flex min-h-0 flex-1 flex-col p-md pb-0">
        <div className="flex flex-wrap shrink-0 items-end justify-between gap-x-md gap-y-sm">
          <div className="flex flex-wrap items-end gap-x-xs gap-y-sm">
            <div className="flex w-[248px] flex-col gap-xxs">
              <span className="text-sm font-normal text-text-link">Search</span>
              <div className="relative">
                <img src={searchIcon} alt="" className="pointer-events-none absolute left-sm top-1/2 h-5 w-5 -translate-y-1/2" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Find an unpaid bill"
                  className="h-9 w-full rounded-sm border border-brand-blue bg-white pl-9 pr-sm text-sm outline-none placeholder:italic placeholder:text-[#b3b3b3] focus:border-brand-blue"
                />
              </div>
            </div>
            <div className="flex w-[248px] flex-col gap-xxs">
              <span className="text-sm font-normal text-text-link">Saved Filters</span>
              <div className="flex h-9">
                <div className="flex flex-1 items-center justify-between rounded-l-sm border border-r-0 border-brand-blue bg-white px-sm text-sm text-text-primary">
                  {"< No Filter >"}
                  <img src={chevronDownIcon} alt="" className="h-5 w-5 shrink-0" />
                </div>
                <button
                  type="button"
                  aria-label="Filters"
                  className="flex w-7 shrink-0 items-center justify-center rounded-r-sm border border-brand-blue bg-brand-blue hover:bg-hover-primary"
                >
                  <img src={tuneIcon} alt="" className="h-5 w-5" />
                </button>
              </div>
            </div>
            <button type="button" className="flex h-9 shrink-0 items-center gap-xxs text-sm text-text-link hover:underline">
              <img src={eyeIcon} alt="" className="h-5 w-5" />
              Show Quick Filters
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-md">
            <span className="text-sm text-text-link">
              Default Bank/CC: <span className="italic">&lt;Bill Default&gt;</span>
            </span>
            <button type="button" className="flex h-9 shrink-0 items-center gap-xxs rounded-sm bg-brand-blue px-sm text-sm text-white hover:bg-hover-primary">
              <img src={addCircleIcon} alt="" className="h-5 w-5" />
              Add Bill
            </button>
            <div className="flex h-9 shrink-0 items-stretch overflow-hidden rounded-sm bg-brand-blue text-white">
              <button type="button" className="flex items-center gap-xxs px-sm text-sm hover:bg-hover-primary">
                <img src={printIcon} alt="" className="h-5 w-5" />
                Print
              </button>
              <div className="w-px bg-white/40" />
              <button type="button" aria-label="Print options" className="flex items-center px-xxs hover:bg-hover-primary">
                <img src={arrowDropDownIcon} alt="" className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-md flex-1 overflow-x-auto rounded-sm border border-border-primary bg-white">
          <div className="min-w-[1560px]">
            <div className="flex bg-[#737373] text-[12.6px] font-medium tracking-[1.134px] text-white">
              <div className="flex h-7 w-[93px] shrink-0 items-center gap-xs px-sm">
                <span
                  role="checkbox"
                  aria-checked={allSelected}
                  onClick={() => toggleAllBills(!allSelected)}
                  className={
                    "flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-xs border-2 " +
                    (allSelected ? "border-brand-orange bg-brand-orange" : "border-white bg-transparent")
                  }
                >
                  {allSelected && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  )}
                </span>
                Pay
              </div>
              <div className="flex h-7 w-10 shrink-0 items-center justify-center px-xs" />
              <div className={`flex h-7 ${COL_WIDE} shrink-0 items-center truncate px-xs`}>Invoice #</div>
              <div className={`flex h-7 ${COL_WIDE} shrink-0 items-center truncate px-xs`}>Vendor</div>
              <div className={`flex h-7 ${COL_WIDE} shrink-0 items-center truncate px-xs`}>Bank</div>
              <div className={`flex h-7 ${COL_WIDE} shrink-0 items-center truncate px-xs`}>Bill Date</div>
              <div className={`flex h-7 ${COL_WIDE} shrink-0 items-center truncate px-xs`}>Due Date</div>
              <div className={`flex h-7 ${COL_WIDE} shrink-0 items-center justify-end truncate px-xs`}>Amount</div>
              <div className={`flex h-7 ${COL_WIDE} shrink-0 items-center justify-end truncate px-xs`}>Amount Due</div>
              <div className={`flex h-7 ${COL_WIDE} shrink-0 items-center justify-end truncate px-xs`}>Amount To Pay</div>
              <div className={`flex h-7 ${COL_WIDE} shrink-0 items-center truncate px-xs`}>Pay Method</div>
              <div className="flex h-7 w-[116px] shrink-0 items-center justify-center truncate px-xs">Has Credit</div>
              <div className="flex h-7 w-[52px] shrink-0 items-center justify-center px-xs">
                <img src={viewColumnIcon} alt="Columns" className="h-5 w-5" />
              </div>
            </div>

            {visibleBills.map((b) => (
              <div key={b.id} className="flex h-9 items-center border-t border-border-primary bg-white">
                <div className="flex w-[93px] shrink-0 items-center px-sm">
                  <Checkbox label="" checked={b.selected} onChange={() => toggleBillSelected(b.id)} />
                </div>
                <div className="flex w-10 shrink-0 items-center justify-center px-xs">
                  {b.hasAttachment && <img src={attachFileIcon} alt="Has attachment" className="h-5 w-5" />}
                </div>
                <div className={`${COL_WIDE} shrink-0 truncate px-xs text-sm text-text-primary`}>{b.invoiceNumber}</div>
                <div className={`${COL_WIDE} shrink-0 truncate px-xs text-sm text-text-primary`}>{b.vendor}</div>
                <div className={`${COL_WIDE} shrink-0 px-xs`}>
                  <Dropdown size="compact" options={BANK_OPTIONS} value={b.bankName} onChange={(v) => updateBill(b.id, "bankName", v)} />
                </div>
                <div className={`${COL_WIDE} shrink-0 truncate px-xs text-sm text-text-primary`}>{b.billDate}</div>
                <div className={`${COL_WIDE} shrink-0 truncate px-xs text-sm text-text-primary`}>{b.dueDate}</div>
                <div className={`${COL_WIDE} shrink-0 truncate px-xs text-right text-sm text-text-primary`}>{formatMoney(b.amount)}</div>
                <div className={`${COL_WIDE} shrink-0 truncate px-xs text-right text-sm text-text-primary`}>{formatMoney(b.amountDue)}</div>
                <div className={`${COL_WIDE} shrink-0 px-xs`}>
                  <div className="flex h-8 items-center gap-xs rounded-sm border border-border-primary bg-input-fill px-xs focus-within:border-brand-blue">
                    <input
                      type="text"
                      inputMode="decimal"
                      value={b.amountToPay}
                      onChange={(e) => {
                        const num = Number(e.target.value.replace(/[^0-9.]/g, ""))
                        updateBill(b.id, "amountToPay", Number.isNaN(num) ? 0 : num)
                      }}
                      className="h-full min-w-0 flex-1 bg-transparent text-left text-sm text-text-primary outline-none"
                    />
                    <img src={calculateIcon} alt="" className="h-5 w-5 shrink-0" />
                  </div>
                </div>
                <div className={`${COL_WIDE} shrink-0 px-xs`}>
                  <Dropdown
                    size="compact"
                    options={PAY_METHOD_OPTIONS}
                    value={b.payMethod}
                    onChange={(v) => updateBill(b.id, "payMethod", v as (typeof PAY_METHOD_OPTIONS)[number])}
                  />
                </div>
                <div className="w-[116px] shrink-0 px-xs" />
                <div className="flex w-[52px] shrink-0 items-center justify-center px-xs">
                  <button type="button" aria-label="More actions">
                    <img src={moreVertIcon} alt="" className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}

            {visibleBills.length === 0 && (
              <div className="flex h-16 items-center justify-center text-sm text-label-gray">No unpaid bills found.</div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-md flex shrink-0 items-center justify-end gap-2xl border-t border-border-primary bg-input-fill px-md py-xs">
        <div className="flex items-center gap-2xl text-xs text-[#b3b3b3]">
          <span>Total Unpaid Bills: {bills.length}</span>
          <span>Total Bill Amount: {formatMoney(totalBillAmount)}</span>
          <span>Total Bill Amount Due: {formatMoney(totalBillAmountDue)}</span>
          <span>
            {selectedBills.length} bills selected to pay: {formatMoney(totalSelectedToPay)}
          </span>
        </div>
        <button
          type="button"
          disabled={selectedBills.length === 0}
          onClick={() => setShowPaymentInfo(true)}
          className="flex h-9 shrink-0 items-center rounded-sm bg-brand-blue px-lg text-sm text-white hover:bg-hover-primary disabled:cursor-not-allowed disabled:bg-brand-blue/50"
        >
          Pay Bills
        </button>
      </div>

      {showPaymentInfo && <PaymentInfoDialog onClose={() => setShowPaymentInfo(false)} onSave={handleSave} />}
    </div>
  )
}
