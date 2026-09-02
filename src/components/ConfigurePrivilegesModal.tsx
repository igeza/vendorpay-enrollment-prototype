import { useState } from "react"
import { MultiSelectDropdown } from "./ui/MultiSelectDropdown"
import { Button } from "./ui/Button"
import helpIcon from "../assets/splash/shell/overlay-help-icon.svg"
import closeIcon from "../assets/splash/shell/overlay-close-icon.svg"

const PRIVILEGES = [
  "Pay bills with VendorPay",
  "Submit user's own VendorPay check batches",
  "Submit other user's VendorPay check batches",
  "View VendorPay Cleared Checks",
  "Manage VendorPay Batches",
  "Manage VendorPay Settings",
]

const TEAM_MEMBERS = ["Matthew Grant", "Jennifer Bell", "Emery Callahan", "Priya Anand", "Diego Ruiz"]
const DEFAULT_SELECTED = TEAM_MEMBERS.slice(0, 3)
const USER_OPTIONS = TEAM_MEMBERS.map((value) => ({ value }))

export function ConfigurePrivilegesModal({ onClose }: { onClose: () => void }) {
  const [selections, setSelections] = useState<Record<string, string[]>>(
    Object.fromEntries(PRIVILEGES.map((p) => [p, DEFAULT_SELECTED])),
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(76,76,76,0.5)]">
      <div className="flex w-[560px] flex-col overflow-hidden rounded-sm border border-border-primary bg-white shadow-[var(--shadow-dropshadow-lg)]">
        <header className="flex h-12 shrink-0 items-center justify-between border-b border-border-primary px-md py-xs">
          <h1 className="text-[20px] leading-[28px] font-normal text-text-primary">Configure VendorPay Privileges</h1>
          <div className="flex items-center gap-xs">
            <button aria-label="Help" className="opacity-70 hover:opacity-100">
              <img src={helpIcon} alt="" className="h-6 w-6" />
            </button>
            <button aria-label="Close" className="opacity-70 hover:opacity-100" onClick={onClose}>
              <img src={closeIcon} alt="" className="h-6 w-6" />
            </button>
          </div>
        </header>

        <div className="flex flex-col gap-xs p-md">
          <p className="text-sm font-normal text-label-gray">
            Configure privileges for users to manage VendorPay. These privileges can be changed in each user's profile later if needed.
          </p>

          <div className="flex flex-col rounded-sm border border-border-primary">
            <div className="flex shrink-0 bg-[#737373]">
              <div className="flex h-7 flex-1 items-center px-xs text-[12.6px] font-normal tracking-[1.134px] text-white">Privilege</div>
              <div className="flex h-7 flex-1 items-center px-xs text-[12.6px] font-normal tracking-[1.134px] text-white">Users</div>
            </div>

            {PRIVILEGES.map((privilege) => (
              <div key={privilege} className="flex h-9 items-center border-t border-border-disabled bg-white">
                <div className="flex-1 truncate px-xs text-sm text-text-primary">{privilege}</div>
                <div className="flex-1 px-xs py-[2px]">
                  <MultiSelectDropdown
                    size="compact"
                    options={USER_OPTIONS}
                    values={selections[privilege]}
                    onChange={(values) => setSelections((prev) => ({ ...prev, [privilege]: values }))}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <footer className="flex shrink-0 items-center justify-end gap-md border border-border-primary bg-input-fill px-md py-xs">
          <Button variant="primary" onClick={onClose}>
            Save
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </footer>
      </div>
    </div>
  )
}
