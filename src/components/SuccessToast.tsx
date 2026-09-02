import checkIcon from "../assets/next-steps/success-checkmark.svg"

export function SuccessToast({ message }: { message: string }) {
  return (
    <div className="pointer-events-none absolute left-1/2 top-md z-40 flex -translate-x-1/2 items-center gap-xs rounded-sm bg-success px-md py-xs text-white shadow-[0_3px_6px_rgba(0,0,0,0.25)]">
      <img src={checkIcon} alt="" className="h-4 w-4" />
      <span className="text-sm font-semibold">{message}</span>
    </div>
  )
}
