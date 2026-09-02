import { useLayoutEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { AppHeader } from "../components/AppHeader"
import { ResourceGuideModal } from "../components/ResourceGuideModal"
import { BankAccountDetailsModal, type BankAccountRecord } from "../components/BankAccountDetailsModal"
import { AddBankAccountModal } from "../components/AddBankAccountModal"
import poweredByLogo from "../assets/shell/powered-by-avidxchange.svg"
import autorenewIcon from "../assets/shell/autorenew.svg"
import helpIcon from "../assets/shell/help.svg"
import searchIcon from "../assets/bank-accounts/icon-search.svg"
import addCircleIcon from "../assets/bank-accounts/icon-add-circle.svg"
import checkCircleIcon from "../assets/bank-accounts/icon-check-circle-filled.svg"
import moreVertIcon from "../assets/bank-accounts/icon-more-vert.svg"

interface BankAccount extends BankAccountRecord {
  enabled: boolean
}

const INITIAL_BANK_ACCOUNTS: BankAccount[] = [
  { bankName: "1000 Fifth Third", routingNumber: "123456789", accountNumber: "****3745", ownerName: "Emma Smith", ownerType: "Business", payerName: "Company Name", enabled: true },
  { bankName: "1009 Sun Trust", routingNumber: "987654321", accountNumber: "****1947", ownerName: "Liam Johnson", ownerType: "Personal", payerName: "Premiere PMC", enabled: true },
  { bankName: "1003 Chase Bank", routingNumber: "456789123", accountNumber: "****8394", ownerName: "Noah Brown", ownerType: "Personal", payerName: "Premiere PMC", enabled: true },
  { bankName: "1008 Truist", routingNumber: "321654987", accountNumber: "****2038", ownerName: "Olivia Davis", ownerType: "Business", payerName: "Property Name", enabled: true },
  { bankName: "1015 US Bank", routingNumber: "654321789", accountNumber: "****5721", ownerName: "Ava Wilson", ownerType: "Business", payerName: "Company Name", enabled: true },
  { bankName: "1006 Mountaintop Bank", routingNumber: "286491735", accountNumber: "****9517", ownerName: "Lee Thompson", ownerType: "Business", payerName: "Company Name", enabled: true },
  { bankName: "1007 PNC Bank", routingNumber: "248516673", accountNumber: "****7391", ownerName: "Sarah Jenkins", ownerType: "Business", payerName: "Company Name", enabled: true },
]

const MENU_WIDTH = 192

function KebabMenu({ enabled, onToggleEnabled }: { enabled: boolean; onToggleEnabled: () => void }) {
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!open) return
    function updatePosition() {
      const rect = triggerRef.current?.getBoundingClientRect()
      if (!rect) return
      const left = Math.min(rect.right - MENU_WIDTH, window.innerWidth - MENU_WIDTH - 8)
      setPosition({ top: rect.bottom + 4, left: Math.max(8, left) })
    }
    updatePosition()
    window.addEventListener("scroll", updatePosition, true)
    window.addEventListener("resize", updatePosition)
    function onDocClick(e: MouseEvent) {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node) &&
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", onDocClick)
    return () => {
      window.removeEventListener("scroll", updatePosition, true)
      window.removeEventListener("resize", updatePosition)
      document.removeEventListener("mousedown", onDocClick)
    }
  }, [open])

  return (
    <>
      <button type="button" ref={triggerRef} aria-label="More actions" onClick={() => setOpen((o) => !o)}>
        <img src={moreVertIcon} alt="" className="h-5 w-5" />
      </button>
      {open &&
        createPortal(
          <div
            ref={menuRef}
            style={{ top: position.top, left: position.left, width: MENU_WIDTH }}
            className="fixed z-50 overflow-hidden rounded-sm bg-white shadow-[0px_3px_6px_0px_rgba(0,0,0,0.15)]"
          >
            <button
              type="button"
              onClick={() => {
                onToggleEnabled()
                setOpen(false)
              }}
              className="flex w-full items-center px-xs py-xxs text-left text-sm text-text-link hover:bg-[#f5f8fa]"
            >
              {enabled ? "Disable Bank Account" : "Enable Bank Account"}
            </button>
          </div>,
          document.body,
        )}
    </>
  )
}

export function BankAccountsPage() {
  const [banks, setBanks] = useState(INITIAL_BANK_ACCOUNTS)
  const [query, setQuery] = useState("")
  const [showDisabled, setShowDisabled] = useState(false)
  const [showResourceGuide, setShowResourceGuide] = useState(false)
  const [editingBank, setEditingBank] = useState<string | null>(null)
  const [showAddBank, setShowAddBank] = useState(false)

  const visibleBanks = banks
    .filter((b) => showDisabled || b.enabled)
    .filter((b) => b.bankName.toLowerCase().includes(query.toLowerCase()))

  function toggleEnabled(bankName: string) {
    setBanks((prev) => prev.map((b) => (b.bankName === bankName ? { ...b, enabled: !b.enabled } : b)))
  }

  function saveBank(updated: BankAccountRecord) {
    setBanks((prev) => prev.map((b) => (b.bankName === editingBank ? { ...b, ...updated } : b)))
  }

  function addBank(newAccount: BankAccountRecord) {
    setBanks((prev) => [...prev, { ...newAccount, enabled: true }])
  }

  const editingRecord = banks.find((b) => b.bankName === editingBank)

  return (
    <div className="min-h-screen bg-[#f3f4f8]">
      <AppHeader />
      <div className="flex h-10 items-center justify-between bg-brand-blue px-md py-xs text-white">
        <div className="flex items-center gap-sm">
          <span className="text-lg">VendorPay</span>
          <span className="flex items-center gap-xxxs rounded-sm bg-[#cce8f7] px-xxs py-xxxs text-xs italic text-brand-navy">
            Powered by
            <img src={poweredByLogo} alt="AvidXchange" className="h-4" />
          </span>
        </div>
        <div className="flex items-center gap-md">
          <button type="button" onClick={() => setShowResourceGuide(true)} className="text-sm text-white hover:underline">
            Resource Guide
          </button>
          <button type="button" aria-label="Refresh">
            <img src={autorenewIcon} alt="" className="h-5 w-5" />
          </button>
          <button type="button" aria-label="Help">
            <img src={helpIcon} alt="" className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="p-md">
        <div className="flex items-center justify-between">
          <div className="relative w-[248px]">
            <img src={searchIcon} alt="" className="pointer-events-none absolute left-sm top-1/2 h-5 w-5 -translate-y-1/2" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Find a bank account"
              className="h-9 w-full rounded-sm border border-brand-blue bg-white pl-9 pr-sm text-sm outline-none placeholder:italic placeholder:text-[#b3b3b3]"
            />
          </div>
          <div className="flex flex-1 items-center gap-md pl-md">
            <button type="button" onClick={() => setShowDisabled((s) => !s)} className="flex items-center gap-xs text-sm text-text-link">
              <span
                className={
                  "flex h-5 w-5 items-center justify-center rounded-xs border-2 border-brand-blue" +
                  (showDisabled ? " bg-brand-blue" : "")
                }
              >
                {showDisabled && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                )}
              </span>
              Show Disabled Banks
            </button>
          </div>
          <button
            type="button"
            onClick={() => setShowAddBank(true)}
            className="flex h-9 shrink-0 items-center gap-xs rounded-sm bg-brand-blue px-sm text-sm text-white"
          >
            <img src={addCircleIcon} alt="" className="h-5 w-5" />
            Add Bank Account
          </button>
        </div>

        <div className="mt-md overflow-x-auto rounded-sm border border-border-primary bg-white">
          <div className="min-w-[1100px]">
            <div className="flex bg-[#737373] text-[12.6px] font-medium tracking-[1.134px] text-white">
              <div className="flex h-7 w-[68px] shrink-0 items-center justify-center px-xs">Enabled</div>
              <div className="flex h-7 flex-1 items-center px-xs">Bank Account</div>
              <div className="flex h-7 flex-1 items-center px-xs">Routing Number</div>
              <div className="flex h-7 flex-1 items-center px-xs">Account Number</div>
              <div className="flex h-7 flex-1 items-center px-xs">Owner Name</div>
              <div className="flex h-7 flex-1 items-center px-xs">Owner Type</div>
              <div className="flex h-7 flex-1 items-center px-xs">Payer Name</div>
              <div className="h-7 w-9 shrink-0" />
            </div>

            {visibleBanks.map((b) => (
              <div key={b.bankName} className="flex h-9 items-center border-t border-border-primary bg-white">
                <div className="flex w-[68px] shrink-0 items-center justify-center px-xs">
                  {b.enabled ? (
                    <img src={checkCircleIcon} alt="Enabled" className="h-5 w-5" />
                  ) : (
                    <span className="h-5 w-5 rounded-round border-2 border-[#b3b3b3]" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setEditingBank(b.bankName)}
                  className="flex-1 truncate px-xs text-left text-sm text-text-primary"
                >
                  {b.bankName}
                </button>
                <div className="flex-1 truncate px-xs text-sm text-text-primary">{b.routingNumber}</div>
                <div className="flex-1 truncate px-xs text-sm text-text-primary">{b.accountNumber}</div>
                <div className="flex-1 truncate px-xs text-sm text-text-primary">{b.ownerName}</div>
                <div className="flex-1 truncate px-xs text-sm text-text-primary">{b.ownerType}</div>
                <div className="flex-1 truncate px-xs text-sm text-text-primary">{b.payerName}</div>
                <div className="flex w-9 shrink-0 items-center justify-center px-xs">
                  <KebabMenu enabled={b.enabled} onToggleEnabled={() => toggleEnabled(b.bankName)} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showResourceGuide && <ResourceGuideModal onClose={() => setShowResourceGuide(false)} />}
      {editingRecord && (
        <BankAccountDetailsModal account={editingRecord} onClose={() => setEditingBank(null)} onSave={saveBank} />
      )}
      {showAddBank && <AddBankAccountModal onClose={() => setShowAddBank(false)} onAdd={addBank} />}
    </div>
  )
}
