import { Button } from "./ui/Button"
import closeIcon from "../assets/splash/shell/overlay-close-icon.svg"

export function ProofOfPaymentModal({
  pdfUrl,
  checkNumber,
  onClose,
}: {
  pdfUrl: string
  checkNumber: string
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[rgba(76,76,76,0.5)]">
      <div className="flex h-[90vh] w-[850px] max-w-full flex-col overflow-hidden rounded-sm border border-border-primary bg-white shadow-[var(--shadow-dropshadow-lg)]">
        <header className="flex h-12 shrink-0 items-center justify-between border-b border-border-primary px-md py-xs">
          <h1 className="text-[20px] leading-[28px] font-normal text-text-secondary">
            Proof of Payment: Check {checkNumber}
          </h1>
          <button type="button" aria-label="Close" className="opacity-70 hover:opacity-100" onClick={onClose}>
            <img src={closeIcon} alt="" className="h-6 w-6" />
          </button>
        </header>

        <iframe src={pdfUrl} title={`Proof of Payment: Check ${checkNumber}`} className="min-h-0 flex-1 border-0" />

        <footer className="flex shrink-0 items-center justify-end border-t border-border-primary bg-input-fill px-md py-xs">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </footer>
      </div>
    </div>
  )
}
