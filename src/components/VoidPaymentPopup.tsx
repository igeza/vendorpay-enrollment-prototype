import { Button } from "./ui/Button"
import closeIcon from "../assets/splash/shell/overlay-close-icon.svg"
import warningIcon from "../assets/pay-bills/icon-warning.svg"

export function VoidPaymentPopup({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[rgba(76,76,76,0.5)]">
      <div className="flex w-[450px] flex-col overflow-hidden rounded-sm border border-border-primary bg-white shadow-[var(--shadow-dropshadow-lg)]">
        <header className="flex h-12 shrink-0 items-center justify-between border-b border-border-primary px-md py-xs">
          <h1 className="text-[20px] leading-[28px] font-normal text-text-secondary">Void Payment</h1>
          <button type="button" aria-label="Close" className="opacity-70 hover:opacity-100" onClick={onClose}>
            <img src={closeIcon} alt="" className="h-6 w-6" />
          </button>
        </header>

        <div className="flex gap-md p-md pt-xl">
          <img src={warningIcon} alt="" className="h-12 w-12 shrink-0" />
          <div className="flex flex-col gap-md">
            <p className="text-sm text-label-gray">
              This payment has already been processed. Voiding it will only record the payment as void in Rent Manager. It will not cancel or
              reverse the actual payment.
            </p>
            <p className="text-sm text-label-gray">Are you sure you want to record the payment as void?</p>
          </div>
        </div>

        <footer className="flex shrink-0 items-center justify-end gap-md border-t border-border-primary bg-input-fill px-md py-xs">
          <Button variant="primary" onClick={onConfirm}>
            Void Payment
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </footer>
      </div>
    </div>
  )
}
