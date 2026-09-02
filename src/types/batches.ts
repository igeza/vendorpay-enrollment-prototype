export type BatchStatus = "Processing" | "Review Required" | "Closed"
export type PaymentDetailStatus = "Processing" | "Voided"

export interface BreakdownRow {
  checkNumber: string
  status: string
  amount: number
  postingDate: string
}

export interface HistoryRow {
  description: string
  comment: string
  user: string
  time: string
}

export interface BatchPayment {
  id: string
  vendor: string
  amount: number
  status: PaymentDetailStatus
  bank: string
  datePosted: string
  checkNo: string
  bankAccount: string
  entryId: string
  vendorId: string
  invoiceId: string
  invoiceDate: string
  invoiceAmount: number
  discount: number
  breakdown: BreakdownRow[]
  history: HistoryRow[]
  voidedOn?: string
}

export interface Batch {
  id: string
  createdBy: string
  dateCreated: string
  status: BatchStatus
  payments: BatchPayment[]
}

export const ASSOCIATED_BILL_OPTIONS = ["Disconnect Bills", "Void Bills", "Delete Bills"]

let seq = 0
function nextSeq() {
  seq += 1
  return seq
}

export function makeBatchPayment(params: {
  vendor: string
  amount: number
  bank: string
  datePosted: string
  checkNo: string
  bankAccount: string
}): BatchPayment {
  const n = nextSeq()
  const invoiceId = `INV-${8000 + n}`
  return {
    id: `payment-${n}`,
    vendor: params.vendor,
    amount: params.amount,
    status: "Processing",
    bank: params.bank,
    datePosted: params.datePosted,
    checkNo: params.checkNo,
    bankAccount: params.bankAccount,
    entryId: `PI${20 + n}`,
    vendorId: `${params.vendor.slice(0, 2).toUpperCase()}${100 + n}`,
    invoiceId,
    invoiceDate: params.datePosted,
    invoiceAmount: params.amount,
    discount: 0,
    breakdown: [
      { checkNumber: params.checkNo, status: "Issued to Supplier", amount: params.amount, postingDate: params.datePosted },
    ],
    history: [
      { description: "Created", comment: "Payment created and saved", user: "system", time: `${params.datePosted} 10:48 am` },
      { description: "Payment Type Updated", comment: "AvidPay Check", user: "system", time: `${params.datePosted} 10:48 am` },
      { description: "Payment Status Updated", comment: "Pending Approval", user: "system", time: `${params.datePosted} 10:48 am` },
      { description: "Payment Status Updated", comment: "Processing", user: "system", time: `${params.datePosted} 10:48 am` },
    ],
  }
}

const VENDOR_ROTATION = [
  "AAA Drywall",
  "Anderson Pest Control",
  "Lowe's",
  "Miller Valentine",
  "Premiere Management",
  "J&M Construction",
  "Ironclad Cement",
  "Silver Pines Landscaping",
  "L&S Fencing",
  "Thompson Trash Removal",
  "Goldengate Construction",
  "Blue Peak Solutions",
  "Maple Leaf Catering",
]

const BANK_ROTATION = ["1000 Fifth Third", "1009 Sun Trust", "1015 US Bank", "1010 Wells Fargo", "1016 First National Bank"]

function generatePayments(count: number, totalAmount: number, dateCreated: string): BatchPayment[] {
  const payments: BatchPayment[] = []
  let remaining = totalAmount
  for (let i = 0; i < count; i++) {
    const isLast = i === count - 1
    const amount = isLast ? Math.round(remaining * 100) / 100 : Math.round((totalAmount / count) * 100) / 100
    remaining -= amount
    payments.push(
      makeBatchPayment({
        vendor: VENDOR_ROTATION[i % VENDOR_ROTATION.length],
        amount: Math.max(amount, 0.01),
        bank: BANK_ROTATION[i % BANK_ROTATION.length],
        datePosted: dateCreated,
        checkNo: `RM${100000 + nextSeq() * 137}`,
        bankAccount: BANK_ROTATION[(i + 1) % BANK_ROTATION.length],
      }),
    )
  }
  return payments
}

const BATCH_1_PAYMENTS: BatchPayment[] = [
  {
    ...makeBatchPayment({
      vendor: "J&M Construction",
      amount: 550.24,
      bank: "1000 Fifth Third",
      datePosted: "09/30/26",
      checkNo: "RM384752",
      bankAccount: "1000 Fifth Third",
    }),
    entryId: "PI23",
    vendorId: "JM123",
    invoiceId: "INV-8318",
    invoiceDate: "08/15/26",
    invoiceAmount: 550.24,
    discount: 0,
    breakdown: [
      { checkNumber: "182721", status: "Issued to Supplier", amount: 50.24, postingDate: "08/19/26" },
      { checkNumber: "182720", status: "Reissued", amount: 50.24, postingDate: "08/18/26" },
      { checkNumber: "182715", status: "Cleared", amount: 550.24, postingDate: "08/17/26" },
    ],
    history: [
      { description: "Created", comment: "Payment created and saved", user: "system", time: "08/05/26 10:48 am" },
      { description: "Payment Type Updated", comment: "AvidPay Check", user: "system", time: "08/05/26 10:48 am" },
      { description: "Payment Status Updated", comment: "Pending Approval", user: "system", time: "08/05/26 10:48 am" },
      { description: "Payment Status Updated", comment: "Processing", user: "system", time: "08/05/26 10:48 am" },
    ],
  },
  makeBatchPayment({ vendor: "Ironclad Cement", amount: 102.5, bank: "1009 Sun Trust", datePosted: "09/30/26", checkNo: "RM561093", bankAccount: "1015 First National Bank" }),
  makeBatchPayment({ vendor: "Silver Pines Landscaping", amount: 120.99, bank: "1000 Fifth Third", datePosted: "09/30/26", checkNo: "RM748205", bankAccount: "1009 Citizens Bank" }),
  makeBatchPayment({ vendor: "L&S Fencing", amount: 59.88, bank: "1015 US Bank", datePosted: "09/30/26", checkNo: "RM615830", bankAccount: "1010 Wells Fargo" }),
  makeBatchPayment({ vendor: "Thompson Trash Removal", amount: 45.67, bank: "1015 US Bank", datePosted: "09/30/26", checkNo: "RM927461", bankAccount: "1016 SunTrust Bank" }),
  makeBatchPayment({ vendor: "Goldengate Construction", amount: 135.0, bank: "1000 Fifth Third", datePosted: "09/30/26", checkNo: "RM739204", bankAccount: "1016 SunTrust Bank" }),
  makeBatchPayment({ vendor: "Blue Peak Solutions", amount: 68.75, bank: "1009 Sun Trust", datePosted: "09/30/26", checkNo: "RM482917", bankAccount: "1009 Citizens Bank" }),
]

export const SEED_BATCHES: Batch[] = [
  { id: "7592041836", createdBy: "jhoward", dateCreated: "04/15/2026", status: "Processing", payments: BATCH_1_PAYMENTS },
  { id: "4827361950", createdBy: "cramirez", dateCreated: "03/30/2026", status: "Processing", payments: generatePayments(42, 10250.0, "03/30/26") },
  { id: "1938475620", createdBy: "jhoward", dateCreated: "03/15/2026", status: "Review Required", payments: generatePayments(121, 12099.0, "03/15/26") },
  { id: "6482917530", createdBy: "jhoward", dateCreated: "02/28/2026", status: "Closed", payments: generatePayments(64, 5988.0, "02/28/26") },
  { id: "3701598642", createdBy: "cramirez", dateCreated: "02/15/2026", status: "Closed", payments: generatePayments(10, 4567.0, "02/15/26") },
  { id: "8256471930", createdBy: "cramirez", dateCreated: "01/29/2026", status: "Closed", payments: generatePayments(35, 13500.0, "01/29/26") },
  { id: "9145627380", createdBy: "jhoward", dateCreated: "01/15/2026", status: "Closed", payments: generatePayments(52, 6875.0, "01/15/26") },
]

export function nextBatchId() {
  return String(1000000000 + Math.floor(Math.random() * 8999999999))
}
