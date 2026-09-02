import clsx from "clsx"
import { WIZARD_STEPS, type StepKey } from "../types"
import checkIcon from "../assets/splash/shell/step-check-icon.svg"
import editIcon from "../assets/splash/shell/step-current-edit-icon.svg"

export function Stepper({ currentKey }: { currentKey: StepKey }) {
  const currentIndex = WIZARD_STEPS.findIndex((s) => s.key === currentKey)

  return (
    <nav className="flex w-[304px] shrink-0 flex-col border-r border-border-primary bg-white">
      <div className="pl-[24px] pr-md py-lg text-lg font-medium text-text-primary">VendorPay Enrollment</div>
      <div className="flex flex-col gap-6xl pb-2xl pl-[28px] pt-lg">
        {WIZARD_STEPS.map((step, i) => {
          const isComplete = i < currentIndex
          const isCurrent = i === currentIndex
          const isLast = i === WIZARD_STEPS.length - 1
          return (
            <div key={step.key} className="relative flex items-center gap-xs">
              <div
                className={clsx(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-normal",
                  isComplete && "bg-[#6eb744] text-white shadow-sm",
                  isCurrent && "border-2 border-brand-blue bg-white",
                  !isComplete && !isCurrent && "bg-[#737373] text-white",
                )}
              >
                {isComplete ? (
                  <img src={checkIcon} alt="" className="h-3 w-3" />
                ) : isCurrent ? (
                  <img src={editIcon} alt="" className="h-3.5 w-3.5" />
                ) : (
                  i + 1
                )}
              </div>
              <div className={clsx("text-sm", isCurrent ? "font-semibold text-text-primary" : "text-text-primary")}>
                {step.label}
              </div>
              {!isLast && <div className="absolute left-3 top-8 h-12 w-px bg-border-primary" />}
            </div>
          )
        })}
      </div>
    </nav>
  )
}
