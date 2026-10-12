import { useState } from "react"
import { Button } from "./ui/Button"
import type { BatchPayment, BreakdownRow } from "../types/batches"
import closeIcon from "../assets/splash/shell/overlay-close-icon.svg"
import checkImage from "../assets/check-details/check-image.png"

export function ClearedCheckModal({
  payment,
  checkRow,
  onClose,
}: {
  payment: BatchPayment
  checkRow: BreakdownRow
  onClose: () => void
}) {
  const [showFront, setShowFront] = useState(true)

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[rgba(76,76,76,0.5)]">
      <div className="flex w-[800px] max-w-full flex-col overflow-hidden rounded-sm border border-border-primary bg-white shadow-[var(--shadow-dropshadow-lg)]">
        <header className="flex h-12 shrink-0 items-center justify-between border-b border-border-primary px-md py-xs">
          <h1 className="text-[20px] leading-[28px] font-normal text-text-secondary">
            VendorPay Cleared Check: {checkRow.checkNumber}
          </h1>
          <button type="button" aria-label="Close" className="opacity-70 hover:opacity-100" onClick={onClose}>
            <img src={closeIcon} alt="" className="h-6 w-6" />
          </button>
        </header>

        <div className="flex flex-col gap-xl p-xl">
          <div className="overflow-hidden rounded-sm border border-border-primary">
            <div className="flex bg-[#737373] text-[12.6px] font-medium tracking-[1.134px] text-white">
              <div className="flex h-7 flex-1 items-center justify-center truncate px-xs">Description</div>
              <div className="flex h-7 flex-1 items-center justify-center truncate px-xs">Comment</div>
              <div className="flex h-7 flex-1 items-center justify-center truncate px-xs">Time</div>
            </div>
            {payment.history.map((row, i) => (
              <div key={i} className="flex h-9 items-center border-t border-border-disabled bg-white">
                <div className="flex-1 truncate px-xs text-sm text-text-secondary">{row.description}</div>
                <div className="flex-1 truncate px-xs text-sm text-text-secondary">{row.comment}</div>
                <div className="flex-1 truncate px-xs text-sm text-text-secondary">{row.time}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center gap-xs">
            <div className="flex w-full items-center gap-lg">
              <span className="text-[20px] leading-[28px] font-normal text-text-secondary">Check Image</span>
              <p className="text-sm">
                <button
                  type="button"
                  onClick={() => setShowFront(true)}
                  className={showFront ? "text-[#008dd5]" : "text-[rgba(0,141,213,0.5)]"}
                >
                  Front
                </button>
                <span className="text-black"> / </span>
                <button
                  type="button"
                  onClick={() => setShowFront(false)}
                  className={!showFront ? "text-[#008dd5]" : "text-[rgba(0,141,213,0.5)]"}
                >
                  Back
                </button>
              </p>
            </div>
            {showFront ? (
              <img src={checkImage} alt="Front of check" className="h-[282px] w-[640px] object-cover" />
            ) : (
              <div className="flex h-[282px] w-[640px] items-center justify-center rounded-sm border border-border-primary bg-[#f5f8fa] text-sm italic text-label-gray">
                Back of check not available in this prototype
              </div>
            )}
          </div>
        </div>

        <footer className="flex shrink-0 items-center justify-end border-t border-border-primary bg-input-fill px-md py-xs">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </footer>
      </div>
    </div>
  )
}
