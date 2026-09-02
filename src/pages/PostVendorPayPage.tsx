import { useState } from "react"
import { AppHeader } from "../components/AppHeader"
import { Checkbox } from "../components/ui/Controls"
import { SuccessToast } from "../components/SuccessToast"
import { usePayBills } from "../context/PayBillsContext"
import poweredByLogo from "../assets/shell/powered-by-avidxchange.svg"
import autorenewIcon from "../assets/shell/autorenew.svg"
import helpIcon from "../assets/shell/help.svg"
import searchIcon from "../assets/bank-accounts/icon-search.svg"
import arrowForwardIcon from "../assets/pay-bills/icon-arrow-forward.svg"

function formatMoney(n: number) {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function PostVendorPayPage() {
  const { vendorPayQueue, toggleVendorPaymentSelected, toggleAllVendorPayments, postVendorPayments } = usePayBills()
  const [query, setQuery] = useState("")
  const [toast, setToast] = useState<string | null>(null)

  const visiblePayments = vendorPayQueue.filter((p) => p.vendor.toLowerCase().includes(query.toLowerCase()))
  const selectedPayments = vendorPayQueue.filter((p) => p.selected)
  const allSelected = vendorPayQueue.length > 0 && vendorPayQueue.every((p) => p.selected)
  const totalAmount = selectedPayments.reduce((sum, p) => sum + p.amount, 0)

  function handlePost() {
    postVendorPayments()
    setToast("VendorPay Payments posted successfully")
    window.setTimeout(() => setToast(null), 3000)
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f3f4f8]">
      <AppHeader />
      <div className="relative flex h-10 shrink-0 items-center justify-between bg-brand-blue px-md py-xs text-white">
        <div className="flex items-center gap-sm">
          <span className="text-lg">Post VendorPay</span>
          <span className="flex items-center gap-xxxs rounded-sm bg-[#cce8f7] px-xxs py-xxxs text-xs italic text-brand-navy">
            Powered by
            <img src={poweredByLogo} alt="AvidXchange" className="h-4" />
          </span>
        </div>
        <div className="flex items-center gap-md">
          <span className="flex items-center gap-xxs text-sm">
            Manage VendorPay Settings
            <img src={arrowForwardIcon} alt="" className="h-4 w-4" />
          </span>
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
        <div className="flex shrink-0 flex-col gap-xxs">
          <span className="text-sm font-normal text-text-link">Search</span>
          <div className="relative w-[248px]">
            <img src={searchIcon} alt="" className="pointer-events-none absolute left-sm top-1/2 h-5 w-5 -translate-y-1/2" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Find a payment"
              className="h-9 w-full rounded-sm border border-brand-blue bg-white pl-9 pr-sm text-sm outline-none placeholder:italic placeholder:text-[#b3b3b3] focus:border-brand-blue"
            />
          </div>
        </div>

        <div className="mt-md flex-1 overflow-x-auto rounded-sm border border-border-primary bg-white">
          <div className="min-w-[1100px]">
            <div className="flex bg-[#737373] text-[12.6px] font-medium tracking-[1.134px] text-white">
              <div className="flex h-7 w-[40px] shrink-0 items-center justify-center px-xs">
                <span
                  role="checkbox"
                  aria-checked={allSelected}
                  onClick={() => toggleAllVendorPayments(!allSelected)}
                  className={
                    "flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center rounded-xs border-2 " +
                    (allSelected ? "border-brand-orange bg-brand-orange" : "border-white bg-transparent")
                  }
                >
                  {allSelected && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  )}
                </span>
              </div>
              <div className="flex h-7 w-[110px] shrink-0 items-center px-xs">Date</div>
              <div className="flex h-7 flex-1 items-center px-xs">Vendor</div>
              <div className="flex h-7 flex-1 items-center px-xs">Bank Account</div>
              <div className="flex h-7 w-[140px] shrink-0 items-center px-xs">Memo</div>
              <div className="flex h-7 w-[140px] shrink-0 items-center px-xs">Check No.</div>
              <div className="flex h-7 w-[140px] shrink-0 items-center justify-end px-xs">Amount</div>
            </div>

            {visiblePayments.map((p) => (
              <div key={p.id} className="flex h-9 items-center border-t border-border-primary bg-white">
                <div className="flex w-[40px] shrink-0 items-center justify-center px-xs">
                  <Checkbox label="" checked={p.selected} onChange={() => toggleVendorPaymentSelected(p.id)} />
                </div>
                <div className="w-[110px] shrink-0 truncate px-xs text-sm text-text-primary">{p.date}</div>
                <div className="flex-1 truncate px-xs text-sm text-text-primary">{p.vendor}</div>
                <div className="flex-1 truncate px-xs text-sm text-text-primary">{p.bankAccount}</div>
                <div className="w-[140px] shrink-0 truncate px-xs text-sm text-text-primary">{p.memo}</div>
                <div className="w-[140px] shrink-0 truncate px-xs text-sm text-text-primary">{p.checkNo}</div>
                <div className="w-[140px] shrink-0 truncate px-xs text-right text-sm text-text-primary">{formatMoney(p.amount)}</div>
              </div>
            ))}

            {visiblePayments.length === 0 && (
              <div className="flex h-16 items-center justify-center text-sm text-label-gray">No VendorPay payments pending.</div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-md flex shrink-0 items-center justify-end gap-2xl border-t border-border-primary bg-input-fill px-md py-xs">
        <div className="flex items-center gap-2xl text-xs text-[#b3b3b3]">
          <span>
            {selectedPayments.length} of {vendorPayQueue.length} Payments Selected
          </span>
          <span>Total Amount: {formatMoney(totalAmount)}</span>
        </div>
        <button
          type="button"
          disabled={selectedPayments.length === 0}
          onClick={handlePost}
          className="flex h-9 shrink-0 items-center rounded-sm bg-brand-blue px-lg text-sm text-white hover:bg-hover-primary disabled:cursor-not-allowed disabled:bg-brand-blue/50"
        >
          Post
        </button>
      </div>
    </div>
  )
}
