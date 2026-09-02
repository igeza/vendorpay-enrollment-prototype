import { useState } from "react"
import clsx from "clsx"
import { AppHeader } from "../components/AppHeader"
import { BatchDetailsModal } from "../components/BatchDetailsModal"
import { usePayBills } from "../context/PayBillsContext"
import type { Batch } from "../types/batches"
import poweredByLogo from "../assets/shell/powered-by-avidxchange.svg"
import autorenewIcon from "../assets/shell/autorenew.svg"
import helpIcon from "../assets/shell/help.svg"
import searchIcon from "../assets/bank-accounts/icon-search.svg"
import arrowForwardIcon from "../assets/pay-bills/icon-arrow-forward.svg"
import chevronDownIcon from "../assets/shell/keyboard-arrow-down.svg"
import calendarIcon from "../assets/beneficial-owners/calendar-today.svg"
import tuneIcon from "../assets/pay-bills/icon-tune.svg"
import moreVertIcon from "../assets/bank-accounts/icon-more-vert.svg"

function formatMoney(n: number) {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function batchAmount(batch: Batch) {
  return batch.payments.reduce((sum, p) => sum + p.amount, 0)
}

function statusDotColor(status: string) {
  if (status === "Review Required") return "bg-error"
  if (status === "Closed") return "bg-success"
  return "bg-attention"
}

export function VendorPayBatchesPage() {
  const { batches } = usePayBills()
  const [query, setQuery] = useState("")
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null)

  const visibleBatches = batches.filter(
    (b) => b.id.includes(query) || b.createdBy.toLowerCase().includes(query.toLowerCase()),
  )
  const selectedBatch = batches.find((b) => b.id === selectedBatchId) ?? null

  return (
    <div className="flex min-h-screen flex-col bg-[#f3f4f8]">
      <AppHeader />
      <div className="relative flex h-10 shrink-0 items-center justify-between bg-brand-blue px-md py-xs text-white">
        <div className="flex items-center gap-sm">
          <span className="text-lg">VendorPay Batches</span>
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
      </div>

      <div className="flex min-h-0 flex-1 flex-col p-md pb-0">
        <div className="flex flex-wrap items-end gap-x-md gap-y-sm">
          <div className="flex w-[223px] flex-col gap-xxs">
            <span className="text-sm font-normal text-text-link">Search</span>
            <div className="relative">
              <img src={searchIcon} alt="" className="pointer-events-none absolute left-sm top-1/2 h-5 w-5 -translate-y-1/2" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Find a batch"
                className="h-9 w-full rounded-sm border border-brand-blue bg-white pl-9 pr-sm text-sm outline-none placeholder:italic placeholder:text-[#b3b3b3] focus:border-brand-blue"
              />
            </div>
          </div>

          <div className="flex w-[223px] flex-col gap-xxs">
            <span className="text-sm font-normal text-text-link">Status</span>
            <div className="flex h-9 items-center justify-between rounded-sm border border-brand-blue bg-white px-sm text-sm text-text-primary">
              All Selected
              <img src={chevronDownIcon} alt="" className="h-5 w-5 shrink-0" />
            </div>
          </div>

          <div className="flex flex-col gap-xxs">
            <span className="text-sm font-normal text-text-link">Filter By Date</span>
            <div className="flex h-9 items-center gap-xs">
              <div className="flex h-9 w-[150px] items-center justify-between rounded-sm border border-brand-blue bg-white px-sm text-sm text-text-primary">
                1/15/2026
                <img src={calendarIcon} alt="" className="h-4 w-4 shrink-0" />
              </div>
              <div className="flex h-9 w-[150px] items-center justify-between rounded-sm border border-brand-blue bg-white px-sm text-sm text-text-primary">
                04/15/2026
                <img src={calendarIcon} alt="" className="h-4 w-4 shrink-0" />
              </div>
              <button type="button" aria-label="Filters" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-brand-blue hover:bg-hover-primary">
                <img src={tuneIcon} alt="" className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-md flex-1 overflow-x-auto rounded-sm border border-border-primary bg-white">
          <div className="min-w-[1100px]">
            <div className="flex bg-[#737373] text-[12.6px] font-medium tracking-[1.134px] text-white">
              <div className="flex h-7 min-w-0 flex-1 items-center truncate px-xs">Batch ID</div>
              <div className="flex h-7 min-w-0 flex-1 items-center truncate px-xs">Payment Count</div>
              <div className="flex h-7 min-w-0 flex-1 items-center truncate px-xs">Created By</div>
              <div className="flex h-7 min-w-0 flex-1 items-center truncate px-xs">Date Created</div>
              <div className="flex h-7 min-w-0 flex-1 items-center justify-end truncate px-xs">Amount</div>
              <div className="flex h-7 w-[160px] shrink-0 items-center truncate px-xs">Status</div>
              <div className="h-7 w-9 shrink-0" />
            </div>

            {visibleBatches.map((batch) => (
              <button
                key={batch.id}
                type="button"
                onClick={() => setSelectedBatchId(batch.id)}
                className="flex h-9 w-full items-center border-t border-border-primary bg-white text-left hover:bg-row-hover"
              >
                <div className="flex-1 truncate px-xs text-sm text-text-primary">{batch.id}</div>
                <div className="flex-1 truncate px-xs text-sm text-text-primary">{batch.payments.length}</div>
                <div className="flex-1 truncate px-xs text-sm text-text-primary">{batch.createdBy}</div>
                <div className="flex-1 truncate px-xs text-sm text-text-primary">{batch.dateCreated}</div>
                <div className="flex-1 truncate px-xs text-right text-sm text-text-primary">{formatMoney(batchAmount(batch))}</div>
                <div className="flex w-[160px] shrink-0 items-center gap-xxs px-xs text-sm italic text-text-primary">
                  <span className={clsx("h-2 w-2 shrink-0 rounded-round", statusDotColor(batch.status))} />
                  {batch.status}
                </div>
                <div className="flex w-9 shrink-0 items-center justify-center px-xs">
                  <img src={moreVertIcon} alt="" className="h-5 w-5" />
                </div>
              </button>
            ))}

            {visibleBatches.length === 0 && (
              <div className="flex h-16 items-center justify-center text-sm text-label-gray">No batches found.</div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-md flex shrink-0 items-center justify-end border-t border-border-primary bg-input-fill px-md py-xs">
        <span className="text-xs text-[#b3b3b3]">{batches.length} Batches</span>
      </div>

      {selectedBatch && <BatchDetailsModal batch={selectedBatch} onClose={() => setSelectedBatchId(null)} />}
    </div>
  )
}
