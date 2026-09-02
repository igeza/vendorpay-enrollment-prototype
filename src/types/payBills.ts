export type PayMethod = "VendorPay" | "Check"

export interface UnpaidBill {
  id: string
  invoiceNumber: string
  vendor: string
  hasAttachment: boolean
  bankName: string
  billDate: string
  dueDate: string
  amount: number
  amountDue: number
  amountToPay: number
  payMethod: PayMethod
  selected: boolean
}

export interface VendorPayPayment {
  id: string
  date: string
  vendor: string
  bankAccount: string
  memo: string
  checkNo: string
  amount: number
  selected: boolean
}

export interface PaymentInfo {
  bankOverride: string
  paymentDate: string
  comment: string
  consolidateByVendor: boolean
  markChecksToBePrinted: boolean
}

export const BANK_OPTIONS = ["1000 Fifth Third", "1009 Sun Trust", "1015 US Bank"]

export const PAY_METHOD_OPTIONS: PayMethod[] = ["VendorPay", "Check"]

export const BANK_ACCOUNT_OPTIONS = [
  "1000 Chase Bank",
  "1015 First National Bank",
  "1009 Citizens Bank",
  "1010 Wells Fargo",
  "1016 SunTrust Bank",
]

let idCounter = 0
export function nextId(prefix: string) {
  idCounter += 1
  return `${prefix}-${idCounter}`
}

export const SEED_UNPAID_BILLS: UnpaidBill[] = [
  {
    id: "bill-1",
    invoiceNumber: "INV-2026-00122",
    vendor: "J&M Construction",
    hasAttachment: true,
    bankName: "1000 Fifth Third",
    billDate: "09/30/26",
    dueDate: "10/01/26",
    amount: 550.24,
    amountDue: 550.24,
    amountToPay: 550.24,
    payMethod: "VendorPay",
    selected: true,
  },
  {
    id: "bill-2",
    invoiceNumber: "INV-2026-00123",
    vendor: "Ironclad Cement",
    hasAttachment: false,
    bankName: "1009 Sun Trust",
    billDate: "09/30/26",
    dueDate: "10/01/26",
    amount: 102.5,
    amountDue: 102.5,
    amountToPay: 102.5,
    payMethod: "VendorPay",
    selected: true,
  },
  {
    id: "bill-3",
    invoiceNumber: "INV-2026-00124",
    vendor: "Silver Pines Landscaping",
    hasAttachment: false,
    bankName: "1000 Fifth Third",
    billDate: "09/29/26",
    dueDate: "10/01/26",
    amount: 120.99,
    amountDue: 120.99,
    amountToPay: 120.99,
    payMethod: "VendorPay",
    selected: true,
  },
  {
    id: "bill-4",
    invoiceNumber: "INV-2026-00125",
    vendor: "L&S Fencing",
    hasAttachment: true,
    bankName: "1015 US Bank",
    billDate: "09/28/26",
    dueDate: "10/01/26",
    amount: 59.88,
    amountDue: 59.88,
    amountToPay: 59.88,
    payMethod: "VendorPay",
    selected: true,
  },
  {
    id: "bill-5",
    invoiceNumber: "INV-2026-00126",
    vendor: "Thompson Trash Removal",
    hasAttachment: false,
    bankName: "1015 US Bank",
    billDate: "09/25/26",
    dueDate: "10/01/26",
    amount: 45.67,
    amountDue: 45.67,
    amountToPay: 45.67,
    payMethod: "VendorPay",
    selected: true,
  },
  {
    id: "bill-6",
    invoiceNumber: "INV-2026-00126",
    vendor: "Goldengate Construction",
    hasAttachment: false,
    bankName: "1000 Fifth Third",
    billDate: "09/25/26",
    dueDate: "10/01/26",
    amount: 135.0,
    amountDue: 135.0,
    amountToPay: 135.0,
    payMethod: "VendorPay",
    selected: true,
  },
  {
    id: "bill-7",
    invoiceNumber: "INV-2026-00126",
    vendor: "Blue Peak Solutions",
    hasAttachment: false,
    bankName: "1009 Sun Trust",
    billDate: "09/25/26",
    dueDate: "10/01/26",
    amount: 68.75,
    amountDue: 68.75,
    amountToPay: 68.75,
    payMethod: "VendorPay",
    selected: true,
  },
  {
    id: "bill-8",
    invoiceNumber: "INV-2026-00127",
    vendor: "Maple Leaf Catering",
    hasAttachment: true,
    bankName: "1009 Sun Trust",
    billDate: "09/20/26",
    dueDate: "10/01/26",
    amount: 1300.0,
    amountDue: 1125.0,
    amountToPay: 1125.0,
    payMethod: "Check",
    selected: false,
  },
]
