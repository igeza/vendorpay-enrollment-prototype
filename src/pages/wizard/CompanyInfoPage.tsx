import { useRef } from "react"
import { useNavigate } from "react-router-dom"
import { WizardShell } from "../../components/WizardShell"
import { TextField, TextBox } from "../../components/ui/Field"
import { Dropdown } from "../../components/ui/Dropdown"
import { Card, RadioGroup } from "../../components/ui/Controls"
import { InfoTooltip } from "../../components/ui/InfoTooltip"
import { useWizard } from "../../context/WizardContext"
import { COMPANY_TYPES, COUNTRIES, US_STATES } from "../../constants"

const COMPANY_PROFILE_DATA = {
  companyName: "Premiere Property Management",
  legalCompanyName: "Premiere Property Management",
  dba: "Premiere PM",
  companyType: "Corporation",
  taxId: "TX-123-456-789",
  naics: "531311",
  yearOfEstablishment: "1983",
  stateOfEstablishment: "Washington",
  country: "United States of America",
  street: "742 Evergreen Terrace",
  city: "Seattle",
  state: "WA",
  postalCode: "98136",
} as const

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function CompanyInfoPage() {
  const { state, update } = useWizard()
  const navigate = useNavigate()
  const c = state.company
  const demoRunning = useRef(false)
  const fieldRefs = useRef<Partial<Record<keyof typeof COMPANY_PROFILE_DATA, HTMLInputElement | HTMLButtonElement | null>>>({})

  function fieldRef(key: keyof typeof COMPANY_PROFILE_DATA) {
    return (el: HTMLInputElement | HTMLButtonElement | null) => {
      fieldRefs.current[key] = el
    }
  }

  function set<K extends keyof typeof c>(key: K, value: (typeof c)[K]) {
    update({ company: { ...c, [key]: value } })
  }

  const requiredFilled =
    c.companyName &&
    c.legalCompanyName &&
    c.dba &&
    c.companyType &&
    c.taxId &&
    c.naics &&
    c.yearOfEstablishment &&
    c.stateOfEstablishment &&
    c.country &&
    c.street &&
    c.city &&
    c.state &&
    c.postalCode &&
    c.hasLegalProceedings &&
    (c.hasLegalProceedings !== "yes" || c.legalProceedingsDetails) &&
    c.hasBankruptcy &&
    (c.hasBankruptcy !== "yes" || c.bankruptcyDetails) &&
    c.hasCriminalHistory &&
    (c.hasCriminalHistory !== "yes" || c.criminalHistoryDetails)

  function fillFromCompanyProfile() {
    update({
      company: {
        ...c,
        companyName: c.companyName || COMPANY_PROFILE_DATA.companyName,
        legalCompanyName: c.legalCompanyName || COMPANY_PROFILE_DATA.legalCompanyName,
        dba: c.dba || COMPANY_PROFILE_DATA.dba,
        companyType: c.companyType || COMPANY_PROFILE_DATA.companyType,
        taxId: c.taxId || COMPANY_PROFILE_DATA.taxId,
        naics: c.naics || COMPANY_PROFILE_DATA.naics,
        yearOfEstablishment: c.yearOfEstablishment || COMPANY_PROFILE_DATA.yearOfEstablishment,
        stateOfEstablishment: c.stateOfEstablishment || COMPANY_PROFILE_DATA.stateOfEstablishment,
        country: c.country || COMPANY_PROFILE_DATA.country,
        street: c.street || COMPANY_PROFILE_DATA.street,
        city: c.city || COMPANY_PROFILE_DATA.city,
        state: c.state || COMPANY_PROFILE_DATA.state,
        postalCode: c.postalCode || COMPANY_PROFILE_DATA.postalCode,
      },
    })
  }

  async function runCompanyAutoFill() {
    if (demoRunning.current || c.companyName) return
    demoRunning.current = true
    const next = { ...c }

    async function typeField(key: keyof typeof COMPANY_PROFILE_DATA, text: string) {
      fieldRefs.current[key]?.focus()
      for (let i = 1; i <= text.length; i++) {
        ;(next[key] as string) = text.slice(0, i)
        update({ company: { ...next } })
        await delay(20 + Math.random() * 30)
      }
      await delay(180)
    }

    async function selectField(key: keyof typeof COMPANY_PROFILE_DATA, value: string) {
      fieldRefs.current[key]?.focus()
      await delay(250)
      ;(next[key] as string) = value
      update({ company: { ...next } })
      await delay(250)
    }

    await typeField("companyName", COMPANY_PROFILE_DATA.companyName)
    await typeField("legalCompanyName", COMPANY_PROFILE_DATA.legalCompanyName)
    await typeField("dba", COMPANY_PROFILE_DATA.dba)
    await selectField("companyType", COMPANY_PROFILE_DATA.companyType)
    await typeField("taxId", COMPANY_PROFILE_DATA.taxId)
    await typeField("naics", COMPANY_PROFILE_DATA.naics)
    await typeField("yearOfEstablishment", COMPANY_PROFILE_DATA.yearOfEstablishment)
    await selectField("stateOfEstablishment", COMPANY_PROFILE_DATA.stateOfEstablishment)
    await selectField("country", COMPANY_PROFILE_DATA.country)
    await typeField("street", COMPANY_PROFILE_DATA.street)
    await typeField("city", COMPANY_PROFILE_DATA.city)
    await selectField("state", COMPANY_PROFILE_DATA.state)
    await typeField("postalCode", COMPANY_PROFILE_DATA.postalCode)

    demoRunning.current = false
  }

  return (
    <WizardShell
      stepKey="company-info"
      title="Verify Company"
      subtitle="Let's start by gathering some information about your company."
      onNext={() => navigate("/enroll/control-person")}
      nextDisabled={!requiredFilled}
      onSaveForLater={() => navigate("/enroll-saved")}
    >
      <div className="flex flex-col gap-xl">
        <div className="flex flex-col gap-xxs">
          <div className="flex items-center gap-md">
            <h2 className="text-sm font-semibold text-text-primary">Company Information</h2>
            <button
              type="button"
              onClick={fillFromCompanyProfile}
              className="text-sm font-normal text-text-link hover:underline"
            >
              Fill From Company Profile
            </button>
          </div>
          <Card className="flex flex-col gap-md">
          <div className="grid grid-cols-3 gap-md">
            <TextField
              ref={fieldRef("companyName")}
              label="Company Name"
              required
              value={c.companyName}
              onChange={(e) => set("companyName", e.target.value)}
              onFocus={() => runCompanyAutoFill()}
            />
            <TextField
              ref={fieldRef("legalCompanyName")}
              label="Legal Company Name"
              required
              value={c.legalCompanyName}
              onChange={(e) => set("legalCompanyName", e.target.value)}
            />
            <TextField
              ref={fieldRef("dba")}
              label="DBA"
              labelIcon={<InfoTooltip text="Enter your DBA ('Doing Business As') if your business operates under a name different from its legal name." />}
              required
              value={c.dba}
              onChange={(e) => set("dba", e.target.value)}
            />
            <Dropdown
              ref={fieldRef("companyType")}
              label="Company Type"
              required
              options={COMPANY_TYPES}
              value={c.companyType}
              onChange={(v) => set("companyType", v as typeof c.companyType)}
            />
            <TextField
              ref={fieldRef("taxId")}
              label="Tax ID"
              labelIcon={<InfoTooltip text="Enter your business Tax ID (such as an EIN) used for tax reporting and verification." />}
              required
              value={c.taxId}
              onChange={(e) => set("taxId", e.target.value)}
            />
            <TextField
              ref={fieldRef("naics")}
              label="NAICS"
              labelIcon={<InfoTooltip text="Enter the NAICS code that best describes your business's primary activity or industry." />}
              required
              value={c.naics}
              onChange={(e) => set("naics", e.target.value)}
            />
            <TextField
              ref={fieldRef("yearOfEstablishment")}
              label="Year of Establishment"
              required
              value={c.yearOfEstablishment}
              onChange={(e) => set("yearOfEstablishment", e.target.value)}
            />
            <Dropdown
              ref={fieldRef("stateOfEstablishment")}
              label="State of Establishment"
              required
              options={US_STATES}
              value={c.stateOfEstablishment}
              onChange={(v) => set("stateOfEstablishment", v)}
            />
          </div>

          <h3 className="border-b border-border-primary pb-xxs text-sm font-semibold text-text-primary">
            Corporate Address
          </h3>
          <div className="grid grid-cols-3 gap-md">
            <Dropdown ref={fieldRef("country")} label="Country" required options={COUNTRIES} value={c.country} onChange={(v) => set("country", v)} />
            <TextField ref={fieldRef("street")} label="Street" required value={c.street} onChange={(e) => set("street", e.target.value)} />
            <TextField ref={fieldRef("city")} label="City" required value={c.city} onChange={(e) => set("city", e.target.value)} />
            <Dropdown ref={fieldRef("state")} label="State" required options={US_STATES} value={c.state} onChange={(v) => set("state", v)} />
            <TextField
              ref={fieldRef("postalCode")}
              label="Postal Code"
              required
              value={c.postalCode}
              onChange={(e) => set("postalCode", e.target.value)}
            />
          </div>
          </Card>
        </div>

        <div className="flex flex-col gap-xxs">
          <h2 className="text-sm font-semibold text-text-primary">Background &amp; Compliance Check</h2>
          <Card className="flex flex-col gap-md">
          <RadioGroup
            required
            legend="Are there any administrative proceedings, governmental investigations/inquiries, material litigation, pending or threatened, against the company or its beneficial owners or control person?"
            options={[{ value: "no", label: "No" }, { value: "yes", label: "Yes" }]}
            value={c.hasLegalProceedings}
            onChange={(v) => set("hasLegalProceedings", v as typeof c.hasLegalProceedings)}
          />
          {c.hasLegalProceedings === "yes" && (
            <TextBox
              label="Please provide details"
              required
              value={c.legalProceedingsDetails}
              onChange={(e) => set("legalProceedingsDetails", e.target.value)}
            />
          )}
          <RadioGroup
            required
            legend="Has the company or any of its beneficial owners or control persons ever filed for bankruptcy or been subject to any other voluntary or involuntary bankruptcy proceedings?"
            options={[{ value: "no", label: "No" }, { value: "yes", label: "Yes" }]}
            value={c.hasBankruptcy}
            onChange={(v) => set("hasBankruptcy", v as typeof c.hasBankruptcy)}
          />
          {c.hasBankruptcy === "yes" && (
            <TextBox
              label="Please provide details"
              required
              value={c.bankruptcyDetails}
              onChange={(e) => set("bankruptcyDetails", e.target.value)}
            />
          )}
          <RadioGroup
            required
            legend='Has the company or its beneficial owners or control persons ever been convicted of or pled guilty or nolo contendere ("no contest") to any felony or any misdemeanor involving (A) financial services/financial services-related business, (B) fraud, (C) false statements/omissions, (D) theft, (E) bribery, (F) perjury, (G) forgery, (H) counterfeiting, or (I) extortion?'
            options={[{ value: "no", label: "No" }, { value: "yes", label: "Yes" }]}
            value={c.hasCriminalHistory}
            onChange={(v) => set("hasCriminalHistory", v as typeof c.hasCriminalHistory)}
          />
          {c.hasCriminalHistory === "yes" && (
            <TextBox
              label="Please provide details"
              required
              value={c.criminalHistoryDetails}
              onChange={(e) => set("criminalHistoryDetails", e.target.value)}
            />
          )}
          </Card>
        </div>
      </div>
    </WizardShell>
  )
}
