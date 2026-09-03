import { useState } from "react"
import { Checkbox } from "./ui/Controls"
import { Button } from "./ui/Button"
import searchIcon from "../assets/next-steps/icon-search-blue.svg"
import helpIcon from "../assets/splash/shell/overlay-help-icon.svg"
import closeIcon from "../assets/splash/shell/overlay-close-icon.svg"

const VENDORS = [
  "EcoCycle Tree Services",
  "Goldengate Construction",
  "Green Leaf Solutions",
  "Greenway Waste Solutions",
  "L&S Fencing",
  "Metro Plumbing Services",
  "OnSite Concrete Pros",
  "PropFix Solutions",
  "Serviqo",
  "Silver Pines Landscaping",
  "Thompson Trash Removal",
  "GreenWay Junk Solutions",
]

export function ManageExceptionsModal({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("")
  const [excluded, setExcluded] = useState<Set<string>>(new Set())

  const filtered = VENDORS.filter((v) => v.toLowerCase().includes(query.toLowerCase()))
  const allFilteredExcluded = filtered.length > 0 && filtered.every((v) => excluded.has(v))

  function toggleVendor(name: string, checked: boolean) {
    setExcluded((prev) => {
      const next = new Set(prev)
      if (checked) next.add(name)
      else next.delete(name)
      return next
    })
  }

  function toggleAll(checked: boolean) {
    setExcluded((prev) => {
      const next = new Set(prev)
      filtered.forEach((v) => (checked ? next.add(v) : next.delete(v)))
      return next
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(76,76,76,0.5)]">
      <div className="flex w-[560px] flex-col overflow-hidden rounded-sm border border-border-primary bg-white shadow-[var(--shadow-dropshadow-lg)]">
        <header className="flex h-12 shrink-0 items-center justify-between border-b border-border-primary px-md py-xs">
          <h1 className="text-[20px] leading-[28px] font-normal text-text-primary">Manage Exceptions</h1>
          <div className="flex items-center gap-xs">
            <button aria-label="Help">
              <img src={helpIcon} alt="" className="h-6 w-6" />
            </button>
            <button aria-label="Close" onClick={onClose}>
              <img src={closeIcon} alt="" className="h-6 w-6" />
            </button>
          </div>
        </header>

        <div className="flex h-[420px] flex-col gap-xs border-x border-border-primary p-md">
          <p className="text-sm font-normal text-label-gray">
            Select any Vendors you do not want to update to VendorPay. These vendors will keep their current payment method.
          </p>

          <div className="relative w-[248px] shrink-0">
            <img src={searchIcon} alt="" className="pointer-events-none absolute left-sm top-1/2 h-5 w-5 -translate-y-1/2" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Find a vendor"
              className="h-9 w-full rounded-sm border border-brand-blue bg-white pl-9 pr-sm text-sm outline-none"
            />
          </div>

          <div className="flex min-h-0 flex-1 flex-col rounded-sm border border-border-primary">
            <div className="flex shrink-0 items-center bg-[#737373]">
              <div className="flex h-7 w-9 items-center justify-center">
                <Checkbox label="" checked={allFilteredExcluded} onChange={toggleAll} />
              </div>
              <div className="flex h-7 flex-1 items-center px-xs text-[12.6px] font-normal tracking-[1.134px] text-white">Vendor</div>
            </div>

            <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
              {filtered.map((vendor) => (
                <div key={vendor} className="flex h-9 shrink-0 items-center border-t border-border-disabled bg-white">
                  <div className="flex h-full w-9 items-center justify-center">
                    <Checkbox
                      label=""
                      checked={excluded.has(vendor)}
                      onChange={(checked) => toggleVendor(vendor, checked)}
                    />
                  </div>
                  <div className="flex-1 truncate px-xs text-sm text-text-primary">{vendor}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <footer className="flex shrink-0 items-center justify-end gap-md border border-border-primary bg-input-fill px-md py-xs">
          <Button variant="primary" onClick={onClose}>
            OK
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </footer>
      </div>
    </div>
  )
}
