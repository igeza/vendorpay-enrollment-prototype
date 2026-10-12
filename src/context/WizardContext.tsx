import { createContext, useContext, useState, type ReactNode } from "react"
import { initialWizardState, type WizardState } from "../types"

interface WizardContextValue {
  state: WizardState
  update: (patch: Partial<WizardState>) => void
  reset: () => void
}

const WizardContext = createContext<WizardContextValue | null>(null)

export function WizardProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WizardState>(initialWizardState)

  function update(patch: Partial<WizardState>) {
    setState((prev) => ({ ...prev, ...patch }))
  }

  function reset() {
    setState(initialWizardState)
  }

  return <WizardContext.Provider value={{ state, update, reset }}>{children}</WizardContext.Provider>
}

export function useWizard() {
  const ctx = useContext(WizardContext)
  if (!ctx) throw new Error("useWizard must be used within WizardProvider")
  return ctx
}
