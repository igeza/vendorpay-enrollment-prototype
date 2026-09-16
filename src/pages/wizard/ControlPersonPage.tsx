import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { WizardShell } from "../../components/WizardShell"
import { TextField } from "../../components/ui/Field"
import { Dropdown } from "../../components/ui/Dropdown"
import { DatePicker } from "../../components/ui/DatePicker"
import { Card, Checkbox, RadioGroup } from "../../components/ui/Controls"
import { useWizard } from "../../context/WizardContext"
import { COUNTRIES, US_STATES } from "../../constants"
import type { ControlPerson } from "../../types"

const DEMO_TEXT_FIELDS: Array<[keyof ControlPerson, string]> = [
  ["firstName", "John"],
  ["lastName", "Howard"],
  ["title", "CEO"],
  ["email", "john.howard@email.com"],
]
const DEMO_DOB = "1977-03-30"
const DEMO_HOME_ADDRESS: Array<[keyof ControlPerson, string]> = [
  ["addressLine1", "351 Maple Lane."],
  ["city", "Seattle"],
]
const DEMO_STATE = "Washington"
const DEMO_ZIP = "98136"
const DEMO_COUNTRY = "United States of America"

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function ControlPersonPage() {
  const { state, update } = useWizard()
  const navigate = useNavigate()
  const p = state.controlPerson
  const demoRunning = useRef(false)
  const fieldRefs = useRef<Partial<Record<keyof ControlPerson, HTMLInputElement | HTMLButtonElement | null>>>({})

  function fieldRef(key: keyof ControlPerson) {
    return (el: HTMLInputElement | HTMLButtonElement | null) => {
      fieldRefs.current[key] = el
    }
  }

  function set<K extends keyof typeof p>(key: K, value: (typeof p)[K]) {
    update({ controlPerson: { ...p, [key]: value } })
  }

  async function runAutoFillDemo() {
    if (demoRunning.current || p.firstName) return
    demoRunning.current = true
    const next: ControlPerson = { ...p }

    async function typeField(key: keyof ControlPerson, text: string) {
      fieldRefs.current[key]?.focus()
      for (let i = 1; i <= text.length; i++) {
        ;(next[key] as string) = text.slice(0, i)
        update({ controlPerson: { ...next } })
        await delay(20 + Math.random() * 30)
      }
      await delay(200)
    }

    async function selectField(key: keyof ControlPerson, value: string) {
      fieldRefs.current[key]?.focus()
      await delay(250)
      ;(next[key] as string) = value
      update({ controlPerson: { ...next } })
      await delay(250)
    }

    for (const [key, value] of DEMO_TEXT_FIELDS) await typeField(key, value)
    await selectField("dateOfBirth", DEMO_DOB)
    for (const [key, value] of DEMO_HOME_ADDRESS) await typeField(key, value)
    await selectField("state", DEMO_STATE)
    await typeField("zip", DEMO_ZIP)
    await selectField("country", DEMO_COUNTRY)

    demoRunning.current = false
  }

  useEffect(() => {
    runAutoFillDemo()
  }, [])

  const requiredFilled =
    p.firstName &&
    p.lastName &&
    p.title &&
    p.email &&
    p.dateOfBirth &&
    p.addressLine1 &&
    p.city &&
    p.state &&
    p.zip &&
    p.country &&
    (!p.addressChanged ||
      (p.previousAddressLine1 &&
        p.previousCity &&
        p.previousState &&
        p.previousZip &&
        p.previousCountry &&
        p.livedAtOtherAddress &&
        (p.livedAtOtherAddress !== "yes" ||
          (p.previous2AddressLine1 && p.previous2City && p.previous2State && p.previous2Zip && p.previous2Country))))

  return (
    <WizardShell
      stepKey="control-person"
      title="Add Control Person"
      subtitle="Tell us about the individual responsible for managing your business."
      onBack={() => navigate("/enroll/company-info")}
      onNext={() => navigate("/enroll/beneficial-owners")}
      nextDisabled={!requiredFilled}
    >
      <div className="flex flex-col gap-xxs">
        <h2 className="text-sm font-semibold text-text-primary">Control Person</h2>
        <Card className="flex flex-col gap-md">
        <div className="grid grid-cols-3 gap-md">
          <TextField
            ref={fieldRef("firstName")}
            label="First Name"
            required
            value={p.firstName}
            onChange={(e) => set("firstName", e.target.value)}
          />
          <TextField ref={fieldRef("lastName")} label="Last Name" required value={p.lastName} onChange={(e) => set("lastName", e.target.value)} />
          <TextField ref={fieldRef("title")} label="Title" required value={p.title} onChange={(e) => set("title", e.target.value)} />
          <TextField ref={fieldRef("email")} label="Email" type="email" required value={p.email} onChange={(e) => set("email", e.target.value)} />
          <DatePicker ref={fieldRef("dateOfBirth")} label="Date of Birth" required value={p.dateOfBirth} onChange={(v) => set("dateOfBirth", v)} />
        </div>

        <h3 className="border-b border-border-primary pb-xxs text-sm font-semibold text-text-primary">
          Home Address
        </h3>
        <div className="grid grid-cols-3 gap-md">
          <TextField
            ref={fieldRef("addressLine1")}
            label="Street"
            required
            className="col-span-2"
            value={p.addressLine1}
            onChange={(e) => set("addressLine1", e.target.value)}
          />
          <TextField ref={fieldRef("city")} label="City" required value={p.city} onChange={(e) => set("city", e.target.value)} />
          <Dropdown ref={fieldRef("state")} label="State" required options={US_STATES} value={p.state} onChange={(v) => set("state", v)} />
          <TextField ref={fieldRef("zip")} label="Postal Code" required value={p.zip} onChange={(e) => set("zip", e.target.value)} />
          <Dropdown
            ref={fieldRef("country")}
            label="Country"
            required
            className="col-span-2"
            options={COUNTRIES}
            value={p.country}
            onChange={(v) => set("country", v)}
          />
        </div>

        <Checkbox
          label="This address has changed in the last 3 years"
          checked={p.addressChanged}
          onChange={(checked) => set("addressChanged", checked)}
        />

        {p.addressChanged && (
          <>
            <h3 className="border-b border-border-primary pb-xxs text-sm font-semibold text-text-primary">
              Previous Home Address
            </h3>
            <div className="grid grid-cols-3 gap-md">
              <TextField
                label="Street"
                required
                className="col-span-2"
                value={p.previousAddressLine1}
                onChange={(e) => set("previousAddressLine1", e.target.value)}
              />
              <TextField label="City" required value={p.previousCity} onChange={(e) => set("previousCity", e.target.value)} />
              <Dropdown label="State" required options={US_STATES} value={p.previousState} onChange={(v) => set("previousState", v)} />
              <TextField label="Postal Code" required value={p.previousZip} onChange={(e) => set("previousZip", e.target.value)} />
              <Dropdown
                label="Country"
                required
                className="col-span-2"
                options={COUNTRIES}
                value={p.previousCountry}
                onChange={(v) => set("previousCountry", v)}
              />
            </div>

            <RadioGroup
              required
              legend="Have you lived at any other address during the previous three years?"
              options={[{ value: "yes", label: "Yes" }, { value: "no", label: "No" }]}
              value={p.livedAtOtherAddress}
              onChange={(v) => set("livedAtOtherAddress", v as typeof p.livedAtOtherAddress)}
            />

            {p.livedAtOtherAddress === "yes" && (
              <>
                <h3 className="border-b border-border-primary pb-xxs text-sm font-semibold text-text-primary">
                  Previous Home Address #2
                </h3>
                <div className="grid grid-cols-3 gap-md">
                  <TextField
                    label="Street"
                    required
                    className="col-span-2"
                    value={p.previous2AddressLine1}
                    onChange={(e) => set("previous2AddressLine1", e.target.value)}
                  />
                  <TextField label="City" required value={p.previous2City} onChange={(e) => set("previous2City", e.target.value)} />
                  <Dropdown label="State" required options={US_STATES} value={p.previous2State} onChange={(v) => set("previous2State", v)} />
                  <TextField label="Postal Code" required value={p.previous2Zip} onChange={(e) => set("previous2Zip", e.target.value)} />
                  <Dropdown
                    label="Country"
                    required
                    className="col-span-2"
                    options={COUNTRIES}
                    value={p.previous2Country}
                    onChange={(v) => set("previous2Country", v)}
                  />
                </div>
              </>
            )}
          </>
        )}
        </Card>
      </div>
    </WizardShell>
  )
}
