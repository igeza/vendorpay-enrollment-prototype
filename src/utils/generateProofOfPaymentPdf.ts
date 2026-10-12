import { jsPDF } from "jspdf"
import type { BatchPayment } from "../types/batches"
import { memoFor } from "./vendorMemo"
import checkImageUrl from "../assets/check-details/check-image.png"

function formatMoney(n: number) {
  return `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

const ONES = [
  "",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
]
const TENS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"]
const GROUPS = ["", " Thousand", " Million", " Billion"]

function threeDigitsToWords(n: number): string {
  let str = ""
  if (n >= 100) {
    str += `${ONES[Math.floor(n / 100)]} Hundred `
    n %= 100
  }
  if (n >= 20) {
    str += TENS[Math.floor(n / 10)]
    if (n % 10) str += `-${ONES[n % 10]}`
  } else if (n > 0) {
    str += ONES[n]
  }
  return str.trim()
}

function amountToWords(amount: number): string {
  const dollars = Math.floor(amount)
  const cents = Math.round((amount - dollars) * 100)
  if (dollars === 0) return `Zero and ${String(cents).padStart(2, "0")}/100`

  let n = dollars
  const parts: string[] = []
  let groupIndex = 0
  while (n > 0) {
    const chunk = n % 1000
    if (chunk > 0) parts.unshift(`${threeDigitsToWords(chunk)}${GROUPS[groupIndex]}`)
    n = Math.floor(n / 1000)
    groupIndex++
  }
  return `${parts.join(" ")} and ${String(cents).padStart(2, "0")}/100`
}

function formatReportTimestamp(date: Date) {
  const mm = String(date.getMonth() + 1).padStart(2, "0")
  const dd = String(date.getDate()).padStart(2, "0")
  const yyyy = date.getFullYear()
  let hours = date.getHours()
  const ampm = hours >= 12 ? "P" : "A"
  hours = hours % 12 || 12
  const hh = String(hours).padStart(2, "0")
  const min = String(date.getMinutes()).padStart(2, "0")
  return `${mm}/${dd}/${yyyy} ${hh}:${min} ${ampm}`
}

async function loadImageAsDataUrl(url: string): Promise<{ dataUrl: string; width: number; height: number }> {
  const response = await fetch(url)
  const blob = await response.blob()
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(blob)
  })
  const { width, height } = await new Promise<{ width: number; height: number }>((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight })
    img.onerror = reject
    img.src = dataUrl
  })
  return { dataUrl, width, height }
}

type TableColumn = { label: string; width: number }

function drawTableRow(
  doc: jsPDF,
  x: number,
  y: number,
  columns: TableColumn[],
  values: string[],
  fill: [number, number, number],
) {
  const fontSize = 9
  doc.setFontSize(fontSize)
  const wrapped = columns.map((col, i) => doc.splitTextToSize(values[i], col.width - 8) as string[])
  const lineCount = Math.max(...wrapped.map((w) => w.length), 1)
  const lineHeight = fontSize + 3
  const rowHeight = lineCount * lineHeight + 6

  doc.setFillColor(...fill)
  const totalWidth = columns.reduce((sum, col) => sum + col.width, 0)
  doc.rect(x, y, totalWidth, rowHeight, "F")

  let colX = x
  for (let i = 0; i < columns.length; i++) {
    doc.rect(colX, y, columns[i].width, rowHeight)
    doc.text(wrapped[i], colX + 4, y + lineHeight - 2)
    colX += columns[i].width
  }
  return rowHeight
}

export async function generateProofOfPaymentPdf(params: { payerName: string; payment: BatchPayment }) {
  const { payerName, payment } = params
  const checkRow =
    payment.breakdown.find((row) => row.status === "Cleared") ?? payment.breakdown[payment.breakdown.length - 1]

  const doc = new jsPDF({ unit: "pt", format: "letter" })
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 50
  const centerX = pageWidth / 2

  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  doc.text(`Report Generated: ${formatReportTimestamp(new Date())}`, pageWidth - margin, 40, { align: "right" })

  doc.setFontSize(16)
  doc.text("Cleared Check Image", centerX, 75, { align: "center" })

  doc.setFontSize(11)
  const infoLines = [
    `Payer: ${payerName}`,
    `Payee: ${payment.vendor}`,
    `Payment ID: ${payment.entryId}`,
    `AvidPay Check Number: ${checkRow.checkNumber}`,
    `Amount: ${formatMoney(checkRow.amount)}`,
    `Cleared Date: ${checkRow.postingDate}`,
  ]
  let y = 105
  for (const line of infoLines) {
    doc.text(line, centerX, y, { align: "center" })
    y += 18
  }

  y += 20
  doc.setFontSize(11)
  doc.text("Check Image:", margin, y)
  y += 12

  const { dataUrl, width, height } = await loadImageAsDataUrl(checkImageUrl)
  const imgWidth = pageWidth - margin * 2
  const imgHeight = (imgWidth * height) / width
  const imgX = margin
  const imgY = y
  doc.addImage(dataUrl, "PNG", imgX, imgY, imgWidth, imgHeight)
  doc.setDrawColor(0)
  doc.rect(imgX, imgY, imgWidth, imgHeight)

  // Overlay the payment's real data onto the blank check template so it reads as filled out.
  doc.setFont("courier", "normal")
  doc.setTextColor(20, 30, 90)

  doc.setFontSize(11)
  doc.text(checkRow.postingDate, imgX + 0.6785 * imgWidth, imgY + 0.225 * imgHeight)
  doc.text(payment.vendor, imgX + 0.159 * imgWidth, imgY + 0.389 * imgHeight)
  doc.text(checkRow.amount.toFixed(2), imgX + 0.768 * imgWidth, imgY + 0.356 * imgHeight)

  doc.setFontSize(10)
  doc.text(`${amountToWords(checkRow.amount)}`, imgX + 0.059 * imgWidth, imgY + 0.522 * imgHeight)
  doc.text(memoFor(payment.vendor), imgX + 0.122 * imgWidth, imgY + 0.794 * imgHeight)

  doc.setTextColor(0)
  doc.setFont("helvetica", "normal")
  y += imgHeight + 20

  doc.setFontSize(9)
  doc.text("Page 1 of 2", pageWidth - margin, pageHeight - 30, { align: "right" })

  doc.addPage()
  doc.setFont("helvetica", "normal")
  doc.setFontSize(12)
  doc.text("Associated Invoices:", margin, 60)

  const columns: TableColumn[] = [
    { label: "Invoice No.", width: 90 },
    { label: "Invoice Date", width: 80 },
    { label: "Description", width: 160 },
    { label: "Gross", width: 60 },
    { label: "Discount", width: 60 },
    { label: "Net Amount Paid", width: 62 },
  ]

  let tableY = 80
  tableY += drawTableRow(
    doc,
    margin,
    tableY,
    columns,
    columns.map((c) => c.label),
    [200, 200, 200],
  )

  const netAmountPaid = payment.invoiceAmount - payment.discount
  drawTableRow(
    doc,
    margin,
    tableY,
    columns,
    [
      payment.invoiceId,
      payment.invoiceDate,
      memoFor(payment.vendor),
      formatMoney(payment.invoiceAmount),
      formatMoney(payment.discount),
      formatMoney(netAmountPaid),
    ],
    [235, 235, 235],
  )

  doc.setFontSize(9)
  doc.text("Page 2 of 2", pageWidth - margin, pageHeight - 30, { align: "right" })

  const blob = doc.output("blob") as Blob
  const url = URL.createObjectURL(blob)
  return { url, checkNumber: checkRow.checkNumber }
}
