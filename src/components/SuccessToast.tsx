import checkIcon from "../assets/pay-bills/icon-toast-check.svg"

export function SuccessToast({ message }: { message: string }) {
  return (
    <div className="pointer-events-none absolute left-1/2 top-md z-40 flex -translate-x-1/2 items-center gap-xs rounded-sm bg-success p-md text-white shadow-[0_3px_6px_rgba(0,0,0,0.25)]">
      <img src={checkIcon} alt="" className="h-8 w-8 shrink-0" />
      <span className="whitespace-nowrap text-base font-semibold">{message}</span>
    </div>
  )
}
