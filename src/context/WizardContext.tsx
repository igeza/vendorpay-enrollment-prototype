import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { initialWizardState, type WizardState } from "../types"

const STORAGE_KEY = "vendorpay-wizard-state"

interface WizardContextValue {
  state: WizardState
  update: (patch: Partial<WizardState>) => void
  reset: () => void
}

const WizardContext = createContext<WizardContextValue | null>(null)

function loadInitial(): WizardState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...initialWizardState, ...JSON.parse(raw) }
  } catch {
    // ignore corrupt storage
  }
  return initialWizardState
}

export function WizardProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WizardState>(loadInitial)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // storage unavailable or over quota (e.g. a sandboxed iframe) — state just won't persist
    }
  }, [state])

  function update(patch: Partial<WizardState>) {
    setState((prev) => ({ ...prev, ...patch }))
  }

  function reset() {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore
    }
    setState(initialWizardState)
  }

  return <WizardContext.Provider value={{ state, update, reset }}>{children}</WizardContext.Provider>
}

export function useWizard() {
  const ctx = useContext(WizardContext)
  if (!ctx) throw new Error("useWizard must be used within WizardProvider")
  return ctx
}
