import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import clsx from "clsx"
import { WizardShell } from "../../components/WizardShell"
import { Dropdown } from "../../components/ui/Dropdown"
import { Checkbox } from "../../components/ui/Controls"
import { InfoTooltip } from "../../components/ui/InfoTooltip"
import { useWizard } from "../../context/WizardContext"
import type { BankAccount } from "../../types"
import searchIcon from "../../assets/choose-banks/icon-search-gray.svg"
import eyeIcon from "../../assets/choose-banks/icon-visibility-eye.svg"
import eyeIconCrossed from "../../assets/choose-banks/icon-visibility-eye-crossed.svg"
import eyeIconDisabled from "../../assets/choose-banks/icon-visibility-eye-disabled.svg"
import infoIcon from "../../assets/choose-banks/icon-info.svg"

const OWNER_TYPES: BankAccount["ownerType"][] = ["Business", "Individual"]
const PAYER_NAME_OPTIONS = ["Company Name", "Property Name", "Custom Name"]

const MICR_DATA: Record<string, { routingNumber: string; accountNumber: string }> = {
  "1000 Fifth Third": { routingNumber: "584267951", accountNumber: "8834215489" },
  "1009 Sun Trust": { routingNumber: "852749611", accountNumber: "4192637118" },
  "1003 Chase Bank": { routingNumber: "411875932", accountNumber: "7261594128" },
  "1008 Truist": { routingNumber: "813374125", accountNumber: "5039482877" },
  "1015 US Bank": { routingNumber: "182346779", accountNumber: "6847293357" },
  "1006 Mountaintop Bank": { routingNumber: "286491735", accountNumber: "3752619517" },
  "1007 PNC Bank": { routingNumber: "248516673", accountNumber: "9184627391" },
}

function maskAccountNumber(value: string) {
  if (value.length <= 4) return value
  return "•".repeat(value.length - 4) + value.slice(-4)
}

const OWNER_DEMO_DATA: Record<string, { ownerName: string; ownerType: BankAccount["ownerType"]; payerName: string }> = {
  "1000 Fifth Third": { ownerName: "Harold Clark", ownerType: "Business", payerName: "Company Name" },
  "1009 Sun Trust": { ownerName: "Maya Thornton", ownerType: "Individual", payerName: "Premiere PMC" },
  "1003 Chase Bank": { ownerName: "Ethan Caldwell", ownerType: "Individual", payerName: "Premiere PMC" },
  "1008 Truist": { ownerName: "Lila Montgomery", ownerType: "Business", payerName: "Property Name" },
  "1015 US Bank": { ownerName: "Jasper Whitman", ownerType: "Business", payerName: "Company Name" },
  "1006 Mountaintop Bank": { ownerName: "Nina Carlisle", ownerType: "Business", payerName: "Company Name" },
  "1007 PNC Bank": { ownerName: "Owen Prescott", ownerType: "Business", payerName: "Company Name" },
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function ChooseBanksPage() {
  const { state, update } = useWizard()
  const navigate = useNavigate()
  const [query, setQuery] = useState("")
  const [revealed, setRevealed] = useState<Record<string, boolean>>({})
  const [customPayerIds, setCustomPayerIds] = useState<Set<string>>(
    () => new Set(state.banks.filter((b) => b.payerName && !PAYER_NAME_OPTIONS.includes(b.payerName)).map((b) => b.id)),
  )
  const demoRunning = useRef(false)
  const ownerNameRefs = useRef<Record<string, HTMLInputElement | null>>({})
  const ownerTypeRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const payerNameRefs = useRef<Record<string, HTMLButtonElement | HTMLInputElement | null>>({})

  const banks = state.banks

  function setCustomPayerMode(id: string, custom: boolean) {
    setCustomPayerIds((prev) => {
      const next = new Set(prev)
      if (custom) next.add(id)
      else next.delete(id)
      return next
    })
  }

  function patchBank(id: string, patch: Partial<BankAccount>) {
    update({ banks: banks.map((b) => (b.id === id ? { ...b, ...patch } : b)) })
  }

  function fillRoutingFromMicr() {
    update({
      banks: banks.map((b) => {
        const micr = MICR_DATA[b.bankName]
        return micr ? { ...b, routingNumber: micr.routingNumber, accountNumber: micr.accountNumber } : b
      }),
    })
  }

  async function runOwnerAutoFill() {
    if (demoRunning.current) return
    const rows = banks.filter((b) => b.selected && !b.ownerName && OWNER_DEMO_DATA[b.bankName])
    if (!rows.length) return
    demoRunning.current = true

    const next = banks.map((b) => ({ ...b }))

    for (const row of rows) {
      const idx = next.findIndex((b) => b.id === row.id)
      const demo = OWNER_DEMO_DATA[row.bankName]

      ownerNameRefs.current[row.id]?.focus()
      for (let i = 1; i <= demo.ownerName.length; i++) {
        next[idx] = { ...next[idx], ownerName: demo.ownerName.slice(0, i) }
        update({ banks: next.map((b) => ({ ...b })) })
        await delay(18 + Math.random() * 28)
      }
      await delay(150)

      ownerTypeRefs.current[row.id]?.focus()
      await delay(200)
      next[idx] = { ...next[idx], ownerType: demo.ownerType }
      update({ banks: next.map((b) => ({ ...b })) })

      payerNameRefs.current[row.id]?.focus()
      await delay(200)
      next[idx] = { ...next[idx], payerName: demo.payerName }
      update({ banks: next.map((b) => ({ ...b })) })
      await delay(150)
    }

    demoRunning.current = false
  }

  const filtered = banks.filter((b) => b.bankName.toLowerCase().includes(query.toLowerCase()))
  const allFilteredSelected = filtered.length > 0 && filtered.every((b) => b.selected)

  function toggleAll(checked: boolean) {
    const filteredIds = new Set(filtered.map((b) => b.id))
    update({ banks: banks.map((b) => (filteredIds.has(b.id) ? { ...b, selected: checked } : b)) })
  }

  const selected = banks.filter((b) => b.selected)
  const canProceed =
    selected.length > 0 && selected.every((b) => b.routingNumber && b.accountNumber && b.ownerName && b.ownerType && b.payerName)

  return (
    <WizardShell
      stepKey="choose-banks"
      title="Choose Banks"
      subtitle="Select the bank accounts you'd like us to use to pay your vendors. These must be checking accounts."
      onBack={() => navigate("/enroll/contacts")}
      onNext={() => navigate("/enroll/sign-agreement")}
      nextDisabled={!canProceed}
      onSaveForLater={() => navigate("/enroll-saved")}
    >
      <div className="flex flex-col gap-md">
        <div className="flex items-center gap-md">
          <div className="relative w-[248px]">
            <img src={searchIcon} alt="" className="pointer-events-none absolute left-sm top-1/2 h-4 w-4 -translate-y-1/2" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Find a bank account"
              className="h-9 w-full rounded-sm border border-brand-blue bg-white pl-8 pr-sm text-sm outline-none placeholder:italic placeholder:text-[#b3b3b3] focus:border-brand-blue"
            />
          </div>
          <button type="button" onClick={fillRoutingFromMicr} className="text-sm font-normal text-text-link hover:underline">
            Fill Routing &amp; Account # From MICR
          </button>
        </div>

        <div className="overflow-x-auto rounded-sm border border-border-primary">
          <div className="min-w-[1100px]">
            <div className="flex rounded-t-sm bg-[#737373] text-[12.6px] font-normal tracking-[1.134px] text-white">
              <div className="flex h-7 max-w-[36px] flex-1 items-center justify-center px-xs">
                <Checkbox label="" checked={allFilteredSelected} onChange={toggleAll} />
              </div>
              <div className="flex h-7 flex-1 items-center truncate px-xs">Bank Account</div>
              <div className="flex h-7 flex-1 items-center truncate px-xs">Routing Number</div>
              <div className="flex h-7 flex-1 items-center truncate px-xs">Account Number</div>
              <div className="flex h-7 flex-1 items-center gap-xs truncate pl-xs">
                Owner Name
                <InfoTooltip
                  text="Enter the name of the individual or business that owns the bank account."
                  icon={infoIcon}
                  iconClassName="h-6 w-6 shrink-0"
                />
              </div>
              <div className="flex h-7 flex-1 items-center truncate px-xs">Owner Type</div>
              <div className="flex h-7 flex-1 items-center gap-xs truncate pl-xs">
                Payer Name
                <InfoTooltip
                  text="The name that displays on payments sent to vendors through VendorPay."
                  icon={infoIcon}
                  iconClassName="h-6 w-6 shrink-0"
                />
              </div>
            </div>

            {filtered.map((b) => (
              <div key={b.id} className="flex h-9 items-center border-t border-border-primary bg-white">
                <div className="flex h-full max-w-[36px] flex-1 items-center justify-center px-xs">
                  <Checkbox label="" checked={b.selected} onChange={(checked) => patchBank(b.id, { selected: checked })} />
                </div>
                <div className="min-w-0 flex-1 truncate py-[2px] pl-xs pr-md text-sm text-text-primary">{b.bankName}</div>
                <div className="min-w-0 flex-1 py-[2px] pl-xs pr-md">
                  <input
                    disabled={!b.selected}
                    className={clsx(
                      "h-8 w-full rounded-sm border px-xs text-sm outline-none",
                      b.selected
                        ? "border-border-primary bg-input-fill text-text-primary focus:border-brand-blue"
                        : "border-border-disabled bg-[#f8f8f8] text-[#b3b3b3]",
                    )}
                    value={b.routingNumber}
                    onChange={(e) => patchBank(b.id, { routingNumber: e.target.value })}
                  />
                </div>
                <div className="min-w-0 flex-1 py-[2px] pl-xs pr-md">
                  <div
                    className={clsx(
                      "flex h-8 items-center gap-xs rounded-sm border px-xs",
                      b.selected
                        ? "border-border-primary bg-input-fill focus-within:border-brand-blue"
                        : "border-border-disabled bg-[#f8f8f8]",
                    )}
                  >
                    <input
                      disabled={!b.selected}
                      readOnly={!revealed[b.id]}
                      className={clsx(
                        "h-full min-w-0 flex-1 bg-transparent text-sm outline-none",
                        b.selected ? "text-text-primary" : "text-[#b3b3b3]",
                      )}
                      value={revealed[b.id] ? b.accountNumber : maskAccountNumber(b.accountNumber)}
                      onChange={(e) => patchBank(b.id, { accountNumber: e.target.value })}
                    />
                    <button
                      type="button"
                      disabled={!b.selected}
                      aria-label="Toggle visibility"
                      onClick={() => setRevealed((r) => ({ ...r, [b.id]: !r[b.id] }))}
                      className="shrink-0"
                    >
                      <img
                        src={!b.selected ? eyeIconDisabled : revealed[b.id] ? eyeIconCrossed : eyeIcon}
                        alt=""
                        className="h-5 w-5"
                      />
                    </button>
                  </div>
                </div>
                <div className="min-w-0 flex-1 py-[2px] pl-xs pr-md">
                  <input
                    ref={(el) => {
                      ownerNameRefs.current[b.id] = el
                    }}
                    disabled={!b.selected}
                    className={clsx(
                      "h-8 w-full rounded-sm border px-xs text-sm outline-none",
                      b.selected
                        ? "border-border-primary bg-input-fill text-text-primary focus:border-brand-blue"
                        : "border-border-disabled bg-[#f8f8f8] text-[#b3b3b3]",
                    )}
                    value={b.ownerName}
                    onChange={(e) => patchBank(b.id, { ownerName: e.target.value })}
                    onFocus={() => runOwnerAutoFill()}
                  />
                </div>
                <div className="min-w-0 flex-1 py-[2px] pl-xs pr-md">
                  <Dropdown
                    ref={(el) => {
                      ownerTypeRefs.current[b.id] = el
                    }}
                    size="compact"
                    disabled={!b.selected}
                    placeholder=""
                    options={OWNER_TYPES}
                    value={b.ownerType}
                    onChange={(v) => patchBank(b.id, { ownerType: v as BankAccount["ownerType"] })}
                  />
                </div>
                <div className="min-w-0 flex-1 py-[2px] pl-xs pr-md">
                  {customPayerIds.has(b.id) ? (
                    <input
                      ref={(el) => {
                        payerNameRefs.current[b.id] = el
                      }}
                      disabled={!b.selected}
                      placeholder="Type a custom name"
                      value={b.payerName}
                      onChange={(e) => patchBank(b.id, { payerName: e.target.value })}
                      onBlur={() => {
                        if (!b.payerName) setCustomPayerMode(b.id, false)
                      }}
                      className={clsx(
                        "h-8 w-full rounded-sm border px-xs text-sm outline-none",
                        b.selected
                          ? "border-border-primary bg-input-fill text-text-primary focus:border-brand-blue"
                          : "border-border-disabled bg-[#f8f8f8] text-[#b3b3b3]",
                      )}
                    />
                  ) : (
                    <Dropdown
                      ref={(el) => {
                        payerNameRefs.current[b.id] = el
                      }}
                      size="compact"
                      disabled={!b.selected}
                      placeholder=""
                      options={PAYER_NAME_OPTIONS}
                      value={b.payerName}
                      onChange={(v) => {
                        if (v === "Custom Name") {
                          setCustomPayerMode(b.id, true)
                          patchBank(b.id, { payerName: "" })
                        } else {
                          patchBank(b.id, { payerName: v })
                        }
                      }}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </WizardShell>
  )
}
