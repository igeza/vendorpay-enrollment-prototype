import { createContext, useContext, useState, type ReactNode } from "react"
import {
  BANK_ACCOUNT_OPTIONS,
  SEED_UNPAID_BILLS,
  nextId,
  type PaymentInfo,
  type UnpaidBill,
  type VendorPayPayment,
} from "../types/payBills"

interface PayBillsContextValue {
  bills: UnpaidBill[]
  vendorPayQueue: VendorPayPayment[]
  toggleBillSelected: (id: string) => void
  toggleAllBills: (selected: boolean) => void
  updateBill: <K extends keyof UnpaidBill>(id: string, key: K, value: UnpaidBill[K]) => void
  payBills: (info: PaymentInfo) => void
  toggleVendorPaymentSelected: (id: string) => void
  toggleAllVendorPayments: (selected: boolean) => void
  postVendorPayments: () => void
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

export function PayBillsProvider({ children }: { children: ReactNode }) {
  const [bills, setBills] = useState<UnpaidBill[]>(SEED_UNPAID_BILLS)
  const [vendorPayQueue, setVendorPayQueue] = useState<VendorPayPayment[]>([])

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
    setVendorPayQueue((prev) => prev.filter((p) => !p.selected))
  }

  return (
    <PayBillsContext.Provider
      value={{
        bills,
        vendorPayQueue,
        toggleBillSelected,
        toggleAllBills,
        updateBill,
        payBills,
        toggleVendorPaymentSelected,
        toggleAllVendorPayments,
        postVendorPayments,
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
