import { type ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import { Stepper } from "./Stepper"
import { Button } from "./ui/Button"
import { useWizard } from "../context/WizardContext"
import type { StepKey } from "../types"
import helpIcon from "../assets/splash/shell/overlay-help-icon.svg"
import closeIcon from "../assets/splash/shell/overlay-close-icon.svg"

interface WizardShellProps {
  stepKey: StepKey
  title: string
  subtitle?: string
  children: ReactNode
  onBack?: () => void
  onNext?: () => void
  nextLabel?: string
  nextDisabled?: boolean
}

export function WizardShell({
  stepKey,
  title,
  subtitle,
  children,
  onBack,
  onNext,
  nextLabel = "Next",
  nextDisabled,
}: WizardShellProps) {
  const navigate = useNavigate()
  const { reset } = useWizard()

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-[rgba(76,76,76,0.5)] p-xl">
      <div className="flex h-full max-h-[920px] w-full max-w-[1840px] flex-col overflow-hidden rounded-sm bg-white shadow-[var(--shadow-dropshadow-lg)]">
        <header className="flex h-12 shrink-0 items-center justify-end gap-md border-b border-border-primary bg-white px-lg">
          <button aria-label="Help">
            <img src={helpIcon} alt="" className="h-6 w-6" />
          </button>
          <button
            aria-label="Close"
            onClick={() => {
              reset()
              navigate("/")
            }}
          >
            <img src={closeIcon} alt="" className="h-6 w-6" />
          </button>
        </header>

        <div className="flex min-h-0 min-w-0 flex-1">
          <Stepper currentKey={stepKey} />

          <div className="flex min-h-0 min-w-0 flex-1 flex-col">
            <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto px-xl py-lg">
              <div>
                <div className="border-b border-border-primary pb-xxs">
                  <h1 className="text-lg font-semibold text-text-primary">{title}</h1>
                </div>
                {subtitle && <p className="mt-xs text-sm font-normal text-label-gray">{subtitle}</p>}
              </div>
              <div className="min-w-0 flex-1 pt-xl">{children}</div>
            </div>

            <footer className="flex shrink-0 items-center justify-between px-xl py-md">
              <div>{onBack && <Button variant="primary" onClick={onBack}>Back</Button>}</div>
              <div className="flex items-center">
                {onNext && (
                  <Button variant="primary" onClick={onNext} disabled={nextDisabled}>
                    {nextLabel}
                  </Button>
                )}
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  )
}
