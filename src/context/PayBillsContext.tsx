import { createContext, useContext, useState, type ReactNode } from "react"
import {
  BANK_ACCOUNT_OPTIONS,
  SEED_UNPAID_BILLS,
  nextId,
  type PaymentInfo,
  type UnpaidBill,
  type VendorPayPayment,
} from "../types/payBills"
import { SEED_BATCHES, makeBatchPayment, nextBatchId, type Batch } from "../types/batches"

interface PayBillsContextValue {
  bills: UnpaidBill[]
  vendorPayQueue: VendorPayPayment[]
  batches: Batch[]
  toggleBillSelected: (id: string) => void
  toggleAllBills: (selected: boolean) => void
  updateBill: <K extends keyof UnpaidBill>(id: string, key: K, value: UnpaidBill[K]) => void
  payBills: (info: PaymentInfo) => void
  toggleVendorPaymentSelected: (id: string) => void
  toggleAllVendorPayments: (selected: boolean) => void
  postVendorPayments: () => void
  voidPayment: (batchId: string, paymentId: string, reversalDate: string) => void
}

const PayBillsContext = createContext<PayBillsContextValue | null>(null)

function randomBankAccount() {
  return BANK_ACCOUNT_OPTIONS[Math.floor(Math.random() * BANK_ACCOUNT_OPTIONS.length)]
}

function randomCheckNo() {
  return `RM${Math.floor(100000 + Math.random() * 900000)}`
}

function formatMMDDYY(isoDate: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate)
  if (!match) return isoDate
  const [, y, m, d] = match
  return `${m}/${d}/${y.slice(2)}`
}

function todayMMDDYYYY() {
  const d = new Date()
  return `${(d.getMonth() + 1).toString().padStart(2, "0")}/${d.getDate().toString().padStart(2, "0")}/${d.getFullYear()}`
}

function nowTimeString() {
  const d = new Date()
  const mm = (d.getMonth() + 1).toString().padStart(2, "0")
  const dd = d.getDate().toString().padStart(2, "0")
  const yy = (d.getFullYear() % 100).toString().padStart(2, "0")
  let hours = d.getHours()
  const minutes = d.getMinutes().toString().padStart(2, "0")
  const ampm = hours >= 12 ? "pm" : "am"
  hours = hours % 12 || 12
  return `${mm}/${dd}/${yy} ${hours}:${minutes} ${ampm}`
}

export function PayBillsProvider({ children }: { children: ReactNode }) {
  const [bills, setBills] = useState<UnpaidBill[]>(SEED_UNPAID_BILLS)
  const [vendorPayQueue, setVendorPayQueue] = useState<VendorPayPayment[]>([])
  const [batches, setBatches] = useState<Batch[]>(SEED_BATCHES)

  function toggleBillSelected(id: string) {
    setBills((prev) => prev.map((b) => (b.id === id ? { ...b, selected: !b.selected } : b)))
  }

  function toggleAllBills(selected: boolean) {
    setBills((prev) => prev.map((b) => ({ ...b, selected })))
  }

  function updateBill<K extends keyof UnpaidBill>(id: string, key: K, value: UnpaidBill[K]) {
    setBills((prev) => prev.map((b) => (b.id === id ? { ...b, [key]: value } : b)))
  }

  function payBills(info: PaymentInfo) {
    const toPay = bills.filter((b) => b.selected)
    const vendorPayBills = toPay.filter((b) => b.payMethod === "VendorPay")

    const newPayments: VendorPayPayment[] = vendorPayBills.map((b) => ({
      id: nextId("payment"),
      date: info.paymentDate ? formatMMDDYY(info.paymentDate) : b.dueDate,
      vendor: b.vendor,
      bankAccount: info.bankOverride && info.bankOverride !== "<Use Bank/CC Assigned on Register>" ? info.bankOverride : randomBankAccount(),
      memo: info.comment || String(Math.floor(1000 + Math.random() * 9000)),
      checkNo: randomCheckNo(),
      amount: b.amountToPay,
      selected: true,
    }))

    setVendorPayQueue((prev) => [...prev, ...newPayments])
    setBills((prev) => prev.filter((b) => !b.selected))
  }

  function toggleVendorPaymentSelected(id: string) {
    setVendorPayQueue((prev) => prev.map((p) => (p.id === id ? { ...p, selected: !p.selected } : p)))
  }

  function toggleAllVendorPayments(selected: boolean) {
    setVendorPayQueue((prev) => prev.map((p) => ({ ...p, selected })))
  }

  function postVendorPayments() {
    const posted = vendorPayQueue.filter((p) => p.selected)

    if (posted.length > 0) {
      const newBatch: Batch = {
        id: nextBatchId(),
        createdBy: "mgarcia",
        dateCreated: todayMMDDYYYY(),
        status: "Processing",
        payments: posted.map((p) =>
          makeBatchPayment({
            vendor: p.vendor,
            amount: p.amount,
            bank: p.bankAccount,
            datePosted: p.date,
            checkNo: p.checkNo,
            bankAccount: p.bankAccount,
          }),
        ),
      }
      setBatches((prev) => [newBatch, ...prev])
    }

    setVendorPayQueue((prev) => prev.filter((p) => !p.selected))
  }

  function voidPayment(batchId: string, paymentId: string, reversalDate: string) {
    setBatches((prev) =>
      prev.map((batch) =>
        batch.id !== batchId
          ? batch
          : {
              ...batch,
              payments: batch.payments.map((p) =>
                p.id !== paymentId
                  ? p
                  : {
                      ...p,
                      status: "Voided",
                      voidedOn: reversalDate,
                      breakdown: p.breakdown.map((row) => ({ ...row, status: "Voided" })),
                      history: [
                        ...p.history,
                        { description: "Payment Voided", comment: "Voided", user: "mgarcia", time: nowTimeString() },
                      ],
                    },
              ),
            },
      ),
    )
  }

  return (
    <PayBillsContext.Provider
      value={{
        bills,
        vendorPayQueue,
        batches,
        toggleBillSelected,
        toggleAllBills,
        updateBill,
        payBills,
        toggleVendorPaymentSelected,
        toggleAllVendorPayments,
        postVendorPayments,
        voidPayment,
      }}
    >
      {children}
    </PayBillsContext.Provider>
  )
}

export function usePayBills() {
  const ctx = useContext(PayBillsContext)
  if (!ctx) throw new Error("usePayBills must be used within a PayBillsProvider")
  return ctx
}
