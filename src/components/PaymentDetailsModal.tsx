import { useState } from "react"
import { useNavigate } from "react-router-dom"
import clsx from "clsx"
import { Button } from "./ui/Button"
import { VoidPaymentPopup } from "./VoidPaymentPopup"
import { ConfirmVoidPopup } from "./ConfirmVoidPopup"
import { usePayBills } from "../context/PayBillsContext"
import { useWizard } from "../context/WizardContext"
import { generateProofOfPaymentPdf } from "../utils/generateProofOfPaymentPdf"
import { ProofOfPaymentModal } from "./ProofOfPaymentModal"
import type { BatchPayment } from "../types/batches"
import closeIcon from "../assets/splash/shell/overlay-close-icon.svg"
import downloadIcon from "../assets/pay-bills/icon-download.svg"
import moreVertIcon from "../assets/bank-accounts/icon-more-vert.svg"

function formatMoney(n: number) {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function StatusLozenge({ status }: { status: string }) {
  const voided = status === "Voided"
  return (
    <span
      className={clsx(
        "flex h-6 shrink-0 items-center rounded-sm px-xs text-sm text-text-secondary",
        voided ? "bg-error-bg" : "bg-warning-bg",
      )}
    >
      {status}
    </span>
  )
}

export function PaymentDetailsModal({
  batchId,
  payment,
  onClose,
}: {
  batchId: string
  payment: BatchPayment
  onClose: () => void
}) {
  const { voidPayment } = usePayBills()
  const { state: wizardState } = useWizard()
  const navigate = useNavigate()
  const [showVoidWarning, setShowVoidWarning] = useState(false)
  const [showConfirmVoid, setShowConfirmVoid] = useState(false)
  const [isGeneratingProof, setIsGeneratingProof] = useState(false)
  const [proof, setProof] = useState<{ url: string; checkNumber: string } | null>(null)

  const isVoided = payment.status === "Voided"

  async function handleDownloadProof() {
    setIsGeneratingProof(true)
    try {
      const result = await generateProofOfPaymentPdf({
        payerName: wizardState.company.companyName || "—",
        payment,
      })
      setProof(result)
    } finally {
      setIsGeneratingProof(false)
    }
  }

  function handleCloseProof() {
    if (proof) URL.revokeObjectURL(proof.url)
    setProof(null)
  }

  function handleVoidClick() {
    if (payment.status === "Processing") {
      setShowConfirmVoid(true)
    } else {
      setShowVoidWarning(true)
    }
  }

  function handleAcceptVoid(reversalDate: string) {
    voidPayment(batchId, payment.id, reversalDate)
    setShowConfirmVoid(false)
  }

  return (
    <div className="fixed inset-0 z-[60] bg-[rgba(76,76,76,0.5)]">
      <div className="fixed inset-2xl z-[60] flex flex-col overflow-hidden rounded-sm border border-border-primary bg-white shadow-[var(--shadow-dropshadow-lg)]">
        <header className="flex h-12 shrink-0 items-center gap-sm border-b border-border-primary px-md py-xs">
          <h1 className="text-[20px] leading-[28px] font-normal text-text-secondary">Payment Details</h1>
          <StatusLozenge status={payment.status} />
          <button type="button" aria-label="Close" className="ml-auto" onClick={onClose}>
            <img src={closeIcon} alt="" className="h-6 w-6" />
          </button>
        </header>

        <div className="flex flex-1 flex-wrap gap-md overflow-y-auto bg-[#f3f4f8] p-md">
          <div className="flex min-w-[420px] flex-1 flex-col overflow-hidden rounded-sm border border-border-primary bg-white">
            <div className="flex min-h-9 shrink-0 items-center justify-between border-b-2 border-brand-blue p-xs">
              <span className="text-sm font-semibold text-text-secondary">Payment Details</span>
              <button
                type="button"
                disabled={isGeneratingProof}
                onClick={handleDownloadProof}
                className="flex items-center gap-xxs text-sm text-text-link hover:underline disabled:opacity-50 disabled:no-underline"
              >
                <img src={downloadIcon} alt="" className="h-4 w-4" />
                {isGeneratingProof ? "Generating…" : "Download Proof of Payment"}
              </button>
            </div>

            <div className="flex flex-col gap-md p-md">
            <div className="grid grid-cols-2 gap-x-xl gap-y-md text-sm">
              <div className="flex flex-col gap-xxs">
                <span className="text-label-gray">Vendor</span>
                <span className="font-semibold text-text-link">{payment.vendor}</span>
              </div>
              <div className="flex flex-col gap-xxs">
                <span className="text-label-gray">Total Amount</span>
                <span className="font-semibold text-text-secondary">{formatMoney(payment.amount)}</span>
              </div>
              <div className="flex flex-col gap-xxs">
                <span className="text-label-gray">Bank Account</span>
                <span className="font-semibold text-text-secondary">{payment.bankAccount}</span>
              </div>
              <div className="flex flex-col gap-xxs">
                <span className="text-label-gray">Status</span>
                <span className={clsx("font-semibold", isVoided ? "text-error" : "text-text-secondary")}>{payment.status}</span>
              </div>
              <div className="flex flex-col gap-xxs">
                <span className="text-label-gray">Entry ID</span>
                <span className="font-semibold text-text-secondary">{payment.entryId}</span>
              </div>
              <div className="flex flex-col gap-xxs">
                <span className="text-label-gray">Vendor ID</span>
                <span className="font-semibold text-text-secondary">{payment.vendorId}</span>
              </div>
              <div className="flex flex-col gap-xxs">
                <span className="text-label-gray">Invoice ID</span>
                <span className="font-semibold text-text-link">{payment.invoiceId}</span>
              </div>
              <div className="flex flex-col gap-xxs">
                <span className="text-label-gray">Invoice Date</span>
                <span className="font-semibold text-text-secondary">{payment.invoiceDate}</span>
              </div>
              <div className="flex flex-col gap-xxs">
                <span className="text-label-gray">Invoice Amount</span>
                <span className="font-semibold text-text-secondary">{formatMoney(payment.invoiceAmount)}</span>
              </div>
              <div className="flex flex-col gap-xxs">
                <span className="text-label-gray">Discount</span>
                <span className="font-semibold text-text-secondary">{formatMoney(payment.discount)}</span>
              </div>
            </div>

            <div className="flex flex-col gap-xs">
              <span className="text-sm font-semibold text-text-primary">Payment Breakdown</span>
              <div className="overflow-hidden rounded-sm border border-border-primary">
                <div className="flex bg-[#737373] text-[12.6px] font-medium tracking-[1.134px] text-white">
                  <div className="flex h-7 min-w-0 flex-1 items-center truncate px-xs">Payment Method</div>
                  <div className="flex h-7 min-w-0 flex-1 items-center truncate px-xs">Check Number</div>
                  <div className="flex h-7 min-w-0 flex-1 items-center truncate px-xs">Payment Status</div>
                  <div className="flex h-7 min-w-0 flex-1 items-center justify-end truncate px-xs">Amount</div>
                  <div className="flex h-7 min-w-0 flex-1 items-center truncate px-xs">Posting Date</div>
                  <div className="h-7 w-9 shrink-0" />
                </div>
                {payment.breakdown.map((row, i) => (
                  <div key={i} className="flex h-9 items-center border-t border-border-primary bg-white">
                    <div className="flex-1 truncate px-xs text-sm text-text-primary">Check</div>
                    <button
                      type="button"
                      onClick={() => navigate(`/check/${batchId}/${payment.id}/${row.checkNumber}`)}
                      className="flex-1 truncate px-xs text-left text-sm text-text-link hover:underline"
                    >
                      {row.checkNumber}
                    </button>
                    <div className="flex-1 truncate px-xs text-sm text-text-primary">{row.status}</div>
                    <div className="flex-1 truncate px-xs text-right text-sm text-text-primary">{formatMoney(row.amount)}</div>
                    <div className="flex-1 truncate px-xs text-sm text-text-primary">{row.postingDate}</div>
                    <div className="flex w-9 shrink-0 items-center justify-center px-xs">
                      <img src={moreVertIcon} alt="" className="h-5 w-5" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            </div>
          </div>

          <div className="flex min-w-[420px] flex-1 flex-col overflow-hidden rounded-sm border border-border-primary bg-white">
            <div className="flex min-h-9 shrink-0 items-center border-b-2 border-brand-blue p-xs">
              <span className="text-sm font-semibold text-text-secondary">Payment History</span>
            </div>
            <div className="p-md">
              <div className="overflow-hidden rounded-sm border border-border-primary">
                <div className="flex bg-[#737373] text-[12.6px] font-medium tracking-[1.134px] text-white">
                  <div className="flex h-7 min-w-0 flex-[1.2_0_0] items-center truncate px-xs">Description</div>
                  <div className="flex h-7 min-w-0 flex-[1.4_0_0] items-center truncate px-xs">Comment</div>
                  <div className="flex h-7 min-w-0 flex-1 items-center truncate px-xs">User</div>
                  <div className="flex h-7 min-w-0 flex-[1.2_0_0] items-center truncate px-xs">Time</div>
                </div>
                {payment.history.map((row, i) => (
                  <div key={i} className="flex h-9 items-center border-t border-border-primary bg-white">
                    <div className="flex-[1.2_0_0] truncate px-xs text-sm text-text-primary">{row.description}</div>
                    <div className="flex-[1.4_0_0] truncate px-xs text-sm text-text-primary">{row.comment}</div>
                    <div className="flex-1 truncate px-xs text-sm text-text-primary">{row.user}</div>
                    <div className="flex-[1.2_0_0] truncate px-xs text-sm text-text-primary">{row.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <footer className="flex shrink-0 items-center justify-end gap-md border-t border-border-primary bg-input-fill px-md py-xs">
          {isVoided ? (
            <>
              <span className="text-sm text-error">Voided on {payment.voidedOn}</span>
              <Button variant="secondary" onClick={onClose}>
                Close
              </Button>
            </>
          ) : (
            <>
              <Button variant="primary" onClick={handleVoidClick}>
                Void Payment
              </Button>
              <Button variant="secondary" onClick={onClose}>
                Close
              </Button>
            </>
          )}
        </footer>
      </div>

      {showVoidWarning && (
        <VoidPaymentPopup
          onClose={() => setShowVoidWarning(false)}
          onConfirm={() => {
            setShowVoidWarning(false)
            setShowConfirmVoid(true)
          }}
        />
      )}
      {showConfirmVoid && (
        <ConfirmVoidPopup
          date={payment.datePosted}
          amount={payment.amount}
          onClose={() => setShowConfirmVoid(false)}
          onAccept={handleAcceptVoid}
        />
      )}
      {proof && <ProofOfPaymentModal pdfUrl={proof.url} checkNumber={proof.checkNumber} onClose={handleCloseProof} />}
    </div>
  )
}
