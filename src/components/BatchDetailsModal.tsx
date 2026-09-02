import { useState } from "react"
import clsx from "clsx"
import { Button } from "./ui/Button"
import { PaymentDetailsModal } from "./PaymentDetailsModal"
import type { Batch } from "../types/batches"
import closeIcon from "../assets/splash/shell/overlay-close-icon.svg"
import searchIcon from "../assets/bank-accounts/icon-search.svg"
import moreVertIcon from "../assets/bank-accounts/icon-more-vert.svg"

function formatMoney(n: number) {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function statusDotColor(status: string) {
  if (status === "Voided") return "bg-error"
  return "bg-attention"
}

export function BatchDetailsModal({ batch, onClose }: { batch: Batch; onClose: () => void }) {
  const [query, setQuery] = useState("")
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null)

  const visiblePayments = batch.payments.filter((p) => p.vendor.toLowerCase().includes(query.toLowerCase()))
  const batchTotal = batch.payments.reduce((sum, p) => sum + p.amount, 0)
  const selectedPayment = batch.payments.find((p) => p.id === selectedPaymentId) ?? null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(76,76,76,0.5)]">
      <div className="flex max-h-[90vh] w-[1400px] flex-col overflow-hidden rounded-sm border border-border-primary bg-white shadow-[var(--shadow-dropshadow-lg)]">
        <header className="flex h-12 shrink-0 items-center justify-between border-b border-border-primary px-md py-xs">
          <h1 className="text-[20px] leading-[28px] font-normal text-text-secondary">Batch Details</h1>
          <button type="button" aria-label="Close" className="opacity-70 hover:opacity-100" onClick={onClose}>
            <img src={closeIcon} alt="" className="h-6 w-6" />
          </button>
        </header>

        <div className="flex shrink-0 items-center justify-between border-b border-border-primary px-md py-sm">
          <div className="flex items-center gap-xl text-sm">
            <span className="font-semibold text-text-secondary">Batch: {batch.id}</span>
            <span className="text-text-secondary">Total Payments: {batch.payments.length}</span>
          </div>
          <span className="text-sm font-semibold text-text-secondary">Batch Total: {formatMoney(batchTotal)}</span>
        </div>

        <div className="flex flex-col gap-xxs p-md pb-0">
          <span className="text-sm font-normal text-text-link">Search</span>
          <div className="relative w-[248px]">
            <img src={searchIcon} alt="" className="pointer-events-none absolute left-sm top-1/2 h-5 w-5 -translate-y-1/2" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Find a Payment"
              className="h-9 w-full rounded-sm border border-brand-blue bg-white pl-9 pr-sm text-sm outline-none placeholder:italic placeholder:text-[#b3b3b3] focus:border-brand-blue"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-md">
          <div className="overflow-hidden rounded-sm border border-border-primary">
            <div className="flex bg-[#737373] text-[12.6px] font-medium tracking-[1.134px] text-white">
              <div className="flex h-7 flex-1 items-center px-xs">Vendor</div>
              <div className="flex h-7 w-[110px] shrink-0 items-center justify-end px-xs">Amount</div>
              <div className="flex h-7 w-[130px] shrink-0 items-center px-xs">Status</div>
              <div className="flex h-7 flex-1 items-center px-xs">Bank</div>
              <div className="flex h-7 w-[110px] shrink-0 items-center px-xs">Date Posted</div>
              <div className="flex h-7 w-[110px] shrink-0 items-center px-xs">Check #</div>
              <div className="flex h-7 w-[130px] shrink-0 items-center px-xs">Proof of Payment</div>
              <div className="h-7 w-9 shrink-0" />
            </div>

            {visiblePayments.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedPaymentId(p.id)}
                className="flex h-9 w-full items-center border-t border-border-primary bg-white text-left hover:bg-row-hover"
              >
                <div className="flex-1 truncate px-xs text-sm text-text-primary">{p.vendor}</div>
                <div className="w-[110px] shrink-0 truncate px-xs text-right text-sm text-text-primary">{formatMoney(p.amount)}</div>
                <div className="flex w-[130px] shrink-0 items-center gap-xxs px-xs text-sm italic text-text-primary">
                  <span className={clsx("h-2 w-2 shrink-0 rounded-round", statusDotColor(p.status))} />
                  {p.status}
                </div>
                <div className="flex-1 truncate px-xs text-sm text-text-primary">{p.bank}</div>
                <div className="w-[110px] shrink-0 truncate px-xs text-sm text-text-primary">{p.datePosted}</div>
                <div className="w-[110px] shrink-0 truncate px-xs text-sm text-text-link">{p.checkNo}</div>
                <div className="w-[130px] shrink-0 truncate px-xs text-sm text-text-link">View</div>
                <div className="flex w-9 shrink-0 items-center justify-center px-xs">
                  <img src={moreVertIcon} alt="" className="h-5 w-5" />
                </div>
              </button>
            ))}

            {visiblePayments.length === 0 && (
              <div className="flex h-16 items-center justify-center text-sm text-label-gray">No payments found.</div>
            )}
          </div>
        </div>

        <footer className="flex shrink-0 items-center justify-end gap-md border-t border-border-primary bg-input-fill px-md py-xs">
          <span className="text-xs text-[#b3b3b3]">{batch.payments.length} Payments</span>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </footer>
      </div>

      {selectedPayment && (
        <PaymentDetailsModal batchId={batch.id} payment={selectedPayment} onClose={() => setSelectedPaymentId(null)} />
      )}
    </div>
  )
}
