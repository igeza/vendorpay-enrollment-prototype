import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import clsx from "clsx"
import { WizardShell } from "../../components/WizardShell"
import { TextField } from "../../components/ui/Field"
import { Button } from "../../components/ui/Button"
import { useWizard } from "../../context/WizardContext"
import warningIcon from "../../assets/sign-agreement/callout-warning-icon.svg"
import rmxLogo from "../../assets/verification/rmx-logo-mark.svg"
import editPencilIcon from "../../assets/sign-agreement/edit-pencil.svg"
import zoomInIcon from "../../assets/sign-agreement/zoom-in.svg"
import zoomOutIcon from "../../assets/sign-agreement/zoom-out.svg"
import downloadIcon from "../../assets/sign-agreement/download.svg"
import printIcon from "../../assets/sign-agreement/print.svg"
import commentIcon from "../../assets/sign-agreement/comment.svg"
import helpIcon2 from "../../assets/sign-agreement/help.svg"
import chevronDownWhite from "../../assets/sign-agreement/chevron-down-white.svg"
import signArrowIcon from "../../assets/sign-agreement/sign-arrow.svg"
import infoIcon from "../../assets/bank-accounts/icon-info.svg"

const AGREEMENT_PARAGRAPHS = [
  "Financial Services Agreement — Effective Date: March 20, 2026",
  'Between: [Provider Name] ("Service Provider") and [Client Name] ("Client")',
  "1. Scope of Services. The Service Provider agrees to perform the following financial management functions: Reporting — delivery of quarterly balance sheets and P&L statements. Compliance Tracking — monitoring of local tax filings and insurance renewals.",
  "2. Payment Terms. Service Fee: a monthly retainer of $2,500 shall be paid by the Client. Invoicing: invoices will be issued on the 1st of each month via the digital portal. Due Date: payments are due within 15 days of the invoice date. Late payments may incur a 1.5% monthly interest charge.",
  "3. Term and Termination. Duration: this agreement remains in effect for 12 months from the Effective Date. Cancellation: either party may terminate this agreement with 30 days written notice. Data Transfer: upon termination, the Service Provider will export all financial history and records to a CSV or compatible format for the Client's records.",
  "4. Confidentiality. Both parties agree to maintain strict confidentiality regarding all proprietary financial data, internal processes, and client information accessed during the term of this agreement.",
  "By completing the fields below, the parties acknowledge that they have read, understood, and agree to the terms outlined above.",
]

const DOCUSIGN_DISCLAIMER =
  "By selecting Adopt and Sign, I agree that the signature and initials will be the electronic representation of my signature and initials for all purposes when I (or my agent) use them on documents, including legally binding contracts - just the same as a pen-and-paper signature or initial."

const TOOLBAR_ICONS = [
  { src: zoomInIcon, label: "Zoom in" },
  { src: zoomOutIcon, label: "Zoom out" },
  { src: downloadIcon, label: "Download" },
  { src: printIcon, label: "Print" },
  { src: commentIcon, label: "Comment" },
  { src: helpIcon2, label: "Help" },
]

const DEMO_SIGNER = { firstName: "Matthew", lastName: "Grant", email: "m.grant@gmail.com" }

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/** Deterministic DocuSign-style envelope ID derived from the signature text, for display only. */
function envelopeCode(text: string) {
  let hash = 0
  for (let i = 0; i < text.length; i++) hash = (hash * 31 + text.charCodeAt(i)) >>> 0
  return hash.toString(16).toUpperCase().padStart(12, "0").slice(0, 12)
}

function SignatureModal({
  onCancel,
  onAdopt,
  fullName,
}: {
  onCancel: () => void
  onAdopt: (typedName: string) => void
  fullName: string
}) {
  const [typedName, setTypedName] = useState("")
  const demoRunning = useRef(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  async function runAutoFill() {
    if (demoRunning.current || typedName || !fullName) return
    demoRunning.current = true
    inputRef.current?.focus()
    for (let i = 1; i <= fullName.length; i++) {
      setTypedName(fullName.slice(0, i))
      await delay(20 + Math.random() * 30)
    }
    demoRunning.current = false
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(76,76,76,0.5)]">
      <div className="flex w-[520px] flex-col gap-md rounded-sm bg-white p-xl shadow-[var(--shadow-dropshadow-lg)]">
        <h2 className="text-lg font-semibold text-text-primary">Adopt Your Signature</h2>
        <TextField
          ref={inputRef}
          label="Type your full name to sign"
          value={typedName}
          onChange={(e) => setTypedName(e.target.value)}
          onFocus={() => runAutoFill()}
          placeholder="Full name"
        />
        {typedName && <div className="rounded-sm border border-border-primary bg-[#f5f8fa] p-md font-serif text-2xl italic text-brand-navy">{typedName}</div>}
        <p className="text-xs text-text-secondary">{DOCUSIGN_DISCLAIMER}</p>
        <div className="flex justify-end gap-sm">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="primary" disabled={!typedName.trim()} onClick={() => onAdopt(typedName.trim())}>
            Adopt and Sign
          </Button>
        </div>
      </div>
    </div>
  )
}

function VerifyingModal() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(76,76,76,0.5)]">
      <div className="flex w-[610px] flex-col items-center gap-md rounded-sm bg-white px-xl py-2xl shadow-[var(--shadow-dropshadow-lg)]">
        <div className="relative flex h-[148px] w-[148px] items-center justify-center">
          <svg viewBox="0 0 148 148" fill="none" className="absolute inset-0 h-full w-full animate-spin" style={{ animationDuration: "1.4s" }}>
            <defs>
              <linearGradient id="verifying-spinner-fade" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#F79B4D" stopOpacity="1" />
                <stop offset="100%" stopColor="#F79B4D" stopOpacity="0" />
              </linearGradient>
            </defs>
            <circle
              cx="74"
              cy="74"
              r="66"
              stroke="url(#verifying-spinner-fade)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray="290 415"
            />
          </svg>
          <img src={rmxLogo} alt="" className="h-20 w-20" />
        </div>
        <p className="text-center text-base font-semibold text-text-primary">
          AvidXchange is verifying your Compliance Agreement and Bank Accounts
        </p>
      </div>
    </div>
  )
}

function DocusignStamp({ label, text, code }: { label: string; text: string; code?: string }) {
  return (
    <div className="relative shrink-0 py-xxs pl-sm">
      <div className="absolute left-0 top-0 h-full w-[10px] rounded-l-[6px] border-b-2 border-l-2 border-t-2 border-brand-blue" />
      <span className="block text-[10px] font-semibold leading-none text-text-primary">{label}</span>
      <span className="block whitespace-nowrap font-serif text-2xl italic leading-tight text-text-primary">{text}</span>
      {code && <span className="block text-[9px] leading-none text-[#b3b3b3]">{code}</span>}
    </div>
  )
}

export function SignAgreementPage() {
  const { state, update } = useWizard()
  const navigate = useNavigate()
  const [showSignatureModal, setShowSignatureModal] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [editingSignerInfo, setEditingSignerInfo] = useState(false)
  const signer = state.signer
  const demoRunning = useRef(false)
  const fieldRefs = useRef<Record<keyof typeof signer, HTMLInputElement | null>>({ firstName: null, lastName: null, email: null })

  function setSigner<K extends keyof typeof signer>(key: K, value: (typeof signer)[K]) {
    update({ signer: { ...signer, [key]: value }, agreementSigned: false, agreementSignatureText: "", agreementFinished: false })
  }

  async function runSignerAutoFill() {
    if (demoRunning.current || signer.firstName) return
    demoRunning.current = true
    const next = { ...signer }

    async function typeField(key: keyof typeof signer, text: string) {
      fieldRefs.current[key]?.focus()
      for (let i = 1; i <= text.length; i++) {
        next[key] = text.slice(0, i)
        update({ signer: { ...next }, agreementSigned: false, agreementSignatureText: "", agreementFinished: false })
        await delay(20 + Math.random() * 30)
      }
      await delay(180)
    }

    await typeField("firstName", DEMO_SIGNER.firstName)
    await typeField("lastName", DEMO_SIGNER.lastName)
    await typeField("email", DEMO_SIGNER.email)

    demoRunning.current = false
  }

  const signerValid = signer.firstName && signer.lastName && signer.email
  const initials = `${signer.firstName[0] ?? ""}${signer.lastName[0] ?? ""}`.toUpperCase()

  function submitForReview() {
    setVerifying(true)
    window.setTimeout(() => {
      setVerifying(false)
      navigate("/enroll/next-steps")
    }, 2200)
  }

  return (
    <WizardShell
      stepKey="sign-agreement"
      title="Sign Agreement"
      subtitle="Review and sign the compliance agreement."
      onBack={() => navigate("/enroll/choose-banks")}
      onNext={submitForReview}
      nextLabel="Submit for Review"
      nextDisabled={!state.agreementFinished}
      onSaveForLater={() => navigate("/")}
    >
      <div className="flex flex-col gap-md">
        {!state.agreementFinished && (
          <div className="flex min-h-10 items-center gap-xs rounded-sm border border-attention bg-white p-xs">
            <img src={warningIcon} alt="" className="h-6 w-6 shrink-0" />
            <p className="text-sm font-normal text-label-gray">
              This name and email will be printed on the signed agreement and can't be changed after finalizing. Confirm they are correct.
            </p>
          </div>
        )}

        {state.agreementLoaded && !editingSignerInfo ? (
          <div className="flex flex-wrap items-end gap-md">
            {(
              [
                ["First Name", signer.firstName],
                ["Last Name", signer.lastName],
                ["Email Address", signer.email],
              ] as const
            ).map(([label, value]) => (
              <div key={label} className="flex min-w-[150px] shrink basis-[248px] flex-col gap-xxs">
                <span className="text-sm font-normal text-label-gray">{label} *</span>
                <div className="flex h-9 items-center truncate rounded-sm border border-border-disabled bg-[#f8f8f8] px-sm text-sm text-[#b3b3b3]">
                  {value}
                </div>
              </div>
            ))}
            {!state.agreementFinished && (
              <button
                type="button"
                aria-label="Edit name and email"
                onClick={() => setEditingSignerInfo(true)}
                className="flex h-9 shrink-0 items-center"
              >
                <img src={editPencilIcon} alt="" className="h-5 w-5" />
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-wrap items-end gap-md">
            <div className="min-w-[150px] shrink basis-[248px]">
              <TextField
                ref={(el) => {
                  fieldRefs.current.firstName = el
                }}
                label="First Name"
                required
                className="w-full"
                value={signer.firstName}
                onChange={(e) => setSigner("firstName", e.target.value)}
                onFocus={() => runSignerAutoFill()}
              />
            </div>
            <div className="min-w-[150px] shrink basis-[248px]">
              <TextField
                ref={(el) => {
                  fieldRefs.current.lastName = el
                }}
                label="Last Name"
                required
                className="w-full"
                value={signer.lastName}
                onChange={(e) => setSigner("lastName", e.target.value)}
              />
            </div>
            <div className="min-w-[150px] shrink basis-[248px]">
              <TextField
                ref={(el) => {
                  fieldRefs.current.email = el
                }}
                label="Email Address"
                type="email"
                required
                className="w-full"
                value={signer.email}
                onChange={(e) => setSigner("email", e.target.value)}
              />
            </div>
            <Button
              variant="primary"
              disabled={!signerValid}
              onClick={() => {
                update({ agreementLoaded: true })
                setEditingSignerInfo(false)
              }}
              className="shrink-0 whitespace-nowrap"
            >
              Load Agreement
            </Button>
          </div>
        )}

        {state.agreementFinished && (
          <div className="flex items-center gap-xs rounded-sm border border-brand-blue bg-white p-xs">
            <img src={infoIcon} alt="" className="h-6 w-6 shrink-0" />
            <p className="flex-1 text-sm font-normal text-label-gray">
              Thank you for signing the agreement. Download a copy if needed and select Submit for Review to continue.
            </p>
            <button type="button" className="shrink-0 px-xs py-xxs text-sm font-normal text-text-link hover:underline">
              Download Agreement
            </button>
          </div>
        )}

        {state.agreementLoaded && !state.agreementFinished && (
          <div
            className={clsx(
              "flex flex-col overflow-hidden rounded-sm border border-border-primary",
              editingSignerInfo && "pointer-events-none grayscale opacity-60",
            )}
          >
            <div className="flex items-center gap-xl bg-[#005cb9] px-md py-xs">
              <p className="flex-1 text-sm font-normal text-white">Select the sign field to create and add your signature</p>
              <button
                type="button"
                disabled={!state.agreementSigned}
                onClick={() => update({ agreementFinished: true })}
                className={clsx(
                  "flex h-9 w-[93px] shrink-0 items-center justify-center rounded-xs bg-[#ffc820]",
                  !state.agreementSigned && "opacity-50",
                )}
              >
                <span className="text-sm font-semibold text-text-primary">FINISH</span>
              </button>
              <button type="button" className="flex shrink-0 items-center gap-xxs whitespace-nowrap">
                <span className="text-sm font-normal text-white">OTHER ACTIONS</span>
                <img src={chevronDownWhite} alt="" className="h-5 w-5" />
              </button>
            </div>

            <div className="flex items-center justify-center gap-xs bg-[#f2f2f2] py-xs">
              {TOOLBAR_ICONS.map((icon, i) => (
                <div key={icon.label} className="flex items-center gap-xs">
                  {i > 0 && <div className="h-4 w-px bg-border-primary" />}
                  <img src={icon.src} alt={icon.label} className="h-5 w-5" />
                </div>
              ))}
            </div>

            <div className="max-h-[500px] overflow-y-auto bg-[#f2f2f2] p-xl">
              <div className="mx-auto max-w-[900px] rounded-sm bg-white p-xl shadow-[0px_4px_12px_0px_rgba(0,0,0,0.1)]">
                <div className="flex flex-col gap-sm text-[15px] text-black">
                  {AGREEMENT_PARAGRAPHS.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>

                <div className="mt-lg flex flex-col gap-xs">
                  <p className="text-[15px] text-black">Signature:</p>
                  {state.agreementSigned ? (
                    <div className="flex items-center gap-md rounded-sm border border-border-primary bg-white p-md">
                      <div className="flex items-center gap-xs">
                        <DocusignStamp label="DocuSigned by:" text={state.agreementSignatureText} code={envelopeCode(state.agreementSignatureText)} />
                        <DocusignStamp label="DS" text={initials} />
                      </div>
                      <p className="flex-1 text-sm font-normal text-label-gray">{DOCUSIGN_DISCLAIMER}</p>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowSignatureModal(true)}
                      className="flex h-[65px] w-[93px] flex-col items-center justify-center gap-xs rounded-xs border border-[#d9be7c] bg-[#ffe184] px-[25px] py-sm"
                    >
                      <span className="text-xs font-bold text-black">Sign</span>
                      <img src={signArrowIcon} alt="" className="h-5 w-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex justify-center pt-lg">
                <button
                  type="button"
                  disabled={!state.agreementSigned}
                  onClick={() => update({ agreementFinished: true })}
                  className={clsx("flex h-9 w-[93px] items-center justify-center rounded-xs bg-[#ffc820]", !state.agreementSigned && "opacity-50")}
                >
                  <span className="text-sm font-semibold text-text-primary">FINISH</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {showSignatureModal && (
        <SignatureModal
          fullName={`${signer.firstName} ${signer.lastName}`.trim()}
          onCancel={() => setShowSignatureModal(false)}
          onAdopt={(typedName) => {
            update({ agreementSigned: true, agreementSignatureText: typedName })
            setShowSignatureModal(false)
          }}
        />
      )}
      {verifying && <VerifyingModal />}
    </WizardShell>
  )
}
