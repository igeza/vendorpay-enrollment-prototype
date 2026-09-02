import { Button } from "./ui/Button"
import checkIcon from "../assets/pay-bills/icon-check-blue.svg"

export function ConfirmationPopup({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(76,76,76,0.5)]">
      <div className="flex w-[386px] flex-col overflow-hidden rounded-sm border border-border-primary bg-white shadow-[var(--shadow-dropshadow-lg)]">
        <div className="flex items-center gap-sm p-md">
          <img src={checkIcon} alt="" className="h-5 w-5 shrink-0" />
          <p className="text-sm text-text-primary">{message}</p>
        </div>
        <footer className="flex shrink-0 items-center justify-end border-t border-border-primary bg-input-fill px-md py-xs">
          <Button variant="primary" onClick={onClose}>
            OK
          </Button>
        </footer>
      </div>
    </div>
  )
}
