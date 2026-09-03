export type EntityType = "LLC" | "Corporation" | "Partnership" | "Sole Proprietorship" | "Non-Profit"

export type YesNo = "yes" | "no" | ""

export interface CompanyInfo {
  companyName: string
  legalCompanyName: string
  dba: string
  companyType: EntityType | ""
  taxId: string
  naics: string
  yearOfEstablishment: string
  stateOfEstablishment: string
  country: string
  street: string
  city: string
  state: string
  postalCode: string
  hasLegalProceedings: YesNo
  legalProceedingsDetails: string
  hasBankruptcy: YesNo
  bankruptcyDetails: string
  hasCriminalHistory: YesNo
  criminalHistoryDetails: string
}

export interface ControlPerson {
  firstName: string
  lastName: string
  title: string
  email: string
  dateOfBirth: string
  addressLine1: string
  city: string
  state: string
  zip: string
  country: string
  addressChanged: boolean
  previousAddressLine1: string
  previousCity: string
  previousState: string
  previousZip: string
  previousCountry: string
  livedAtOtherAddress: YesNo
  previous2AddressLine1: string
  previous2City: string
  previous2State: string
  previous2Zip: string
  previous2Country: string
}

export interface BeneficialOwner {
  id: string
  sameAsControlPerson: boolean
  firstName: string
  lastName: string
  dateOfBirth: string
  addressLine1: string
  city: string
  state: string
  zip: string
  country: string
}

export type ContactRole = "Billing Contact" | "Payment Funding Contact" | "Payment Servicing Contact" | "Platform Contact"

export const CONTACT_ROLES: ContactRole[] = [
  "Billing Contact",
  "Payment Funding Contact",
  "Payment Servicing Contact",
  "Platform Contact",
]

export const CONTACT_ROLE_DESCRIPTIONS: Record<ContactRole, string> = {
  "Billing Contact": "Receives questions on billing-related activities",
  "Payment Funding Contact": "Handles bank setup, debit returns, fraud alerts, and refund notifications",
  "Payment Servicing Contact": "Manages payment status, returned mail, and payment detail requests",
  "Platform Contact": "Receives system updates, release information, and outage notifications",
}

export interface Contact {
  id: string
  roles: ContactRole[]
  firstName: string
  lastName: string
  email: string
  phone: string
}

export type OwnerType = "Business" | "Individual"

export interface BankAccount {
  id: string
  bankName: string
  selected: boolean
  routingNumber: string
  accountNumber: string
  ownerName: string
  ownerType: OwnerType | ""
  payerName: string
}

export interface WizardState {
  company: CompanyInfo
  controlPerson: ControlPerson
  hasBeneficialOwners: "yes" | "no" | ""
  beneficialOwners: BeneficialOwner[]
  contacts: Contact[]
  banks: BankAccount[]
  signer: { firstName: string; lastName: string; email: string }
  agreementLoaded: boolean
  agreementSignatureText: string
  agreementSigned: boolean
  agreementFinished: boolean
  enrollmentComplete: boolean
  lastStep: StepKey
}

export const WIZARD_STEPS = [
  { key: "company-info", label: "Verify Company" },
  { key: "control-person", label: "Add Control Person" },
  { key: "beneficial-owners", label: "Add Beneficial Owners" },
  { key: "contacts", label: "Add Contacts" },
  { key: "choose-banks", label: "Choose Banks" },
  { key: "sign-agreement", label: "Sign Agreement" },
  { key: "next-steps", label: "Next Steps" },
] as const

export type StepKey = (typeof WIZARD_STEPS)[number]["key"]

export const emptyCompanyInfo: CompanyInfo = {
  companyName: "",
  legalCompanyName: "",
  dba: "",
  companyType: "",
  taxId: "",
  naics: "",
  yearOfEstablishment: "",
  stateOfEstablishment: "",
  country: "",
  street: "",
  city: "",
  state: "",
  postalCode: "",
  hasLegalProceedings: "no",
  legalProceedingsDetails: "",
  hasBankruptcy: "no",
  bankruptcyDetails: "",
  hasCriminalHistory: "no",
  criminalHistoryDetails: "",
}

export const emptyControlPerson: ControlPerson = {
  firstName: "",
  lastName: "",
  title: "",
  email: "",
  dateOfBirth: "",
  addressLine1: "",
  city: "",
  state: "",
  zip: "",
  country: "",
  addressChanged: false,
  previousAddressLine1: "",
  previousCity: "",
  previousState: "",
  previousZip: "",
  previousCountry: "",
  livedAtOtherAddress: "no",
  previous2AddressLine1: "",
  previous2City: "",
  previous2State: "",
  previous2Zip: "",
  previous2Country: "",
}

export const SEED_BANKS: BankAccount[] = [
  "1000 Fifth Third",
  "1009 Sun Trust",
  "1003 Chase Bank",
  "1008 Truist",
  "1015 US Bank",
  "1006 Mountaintop Bank",
  "1007 PNC Bank",
].map((bankName, i) => ({
  id: `bank-${i}`,
  bankName,
  selected: false,
  routingNumber: "",
  accountNumber: "",
  ownerName: "",
  ownerType: "",
  payerName: "",
}))

export const initialWizardState: WizardState = {
  company: emptyCompanyInfo,
  controlPerson: emptyControlPerson,
  hasBeneficialOwners: "no",
  beneficialOwners: [],
  contacts: [],
  banks: SEED_BANKS,
  signer: { firstName: "", lastName: "", email: "" },
  agreementLoaded: false,
  agreementSignatureText: "",
  agreementSigned: false,
  agreementFinished: false,
  enrollmentComplete: false,
  lastStep: "company-info",
}

export function makeId() {
  return `id-${Math.random().toString(36).slice(2, 10)}`
}
