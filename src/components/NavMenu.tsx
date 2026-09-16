import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { useNavigate } from "react-router-dom"
import clsx from "clsx"
import { useWizard } from "../context/WizardContext"
import rmHouseLogo from "../assets/nav-menu/rm-house-logo.svg"
import workspaceIcon from "../assets/nav-menu/icon-workspace.svg"
import dashboardIcon from "../assets/nav-menu/icon-dashboard.svg"
import adminIcon from "../assets/nav-menu/icon-admin.svg"
import fullMenuIcon from "../assets/nav-menu/icon-full-menu.svg"
import searchIcon from "../assets/nav-menu/icon-search.svg"
import helpIcon from "../assets/nav-menu/icon-help.svg"
import closeIcon from "../assets/nav-menu/icon-close.svg"
import settingsIcon from "../assets/nav-menu/icon-settings.svg"
import reportsIcon from "../assets/nav-menu/icon-reports.svg"
import cornerIcon from "../assets/nav-menu/icon-corner.svg"

interface MenuItem {
  label: string
  to?: string
}

interface MenuColumn {
  title: string
  items: MenuItem[]
}

interface MenuCategory {
  key: string
  label: string
  columns: MenuColumn[] | null
  setupLabel: string
  reportsLabel: string
}

const CATEGORIES: MenuCategory[] = [
  {
    key: "rental-info",
    label: "Rental Info",
    setupLabel: "Rental Info Setup",
    reportsLabel: "Rental Info Reports",
    columns: [
      {
        title: "General",
        items: ["Tenants", "Prospects", "Units", "Properties", "Unit Types", "Assets", "Violations", "Merge Prospects"].map((label) => ({
          label,
        })),
      },
      {
        title: "Leasing",
        items: [
          "Screenings",
          "Applications",
          "Application Templates",
          "Renewal Increases",
          "Prospect Leasing Board",
          "Create Renewal Offers",
          "Lease Renewal Register",
          "Lease Renewal Board",
          "Export Minnesota CRP",
        ].map((label) => ({ label })),
      },
      {
        title: "Short Term Rentals",
        items: ["STR Reservations", "Check-ins", "Find Reservation"].map((label) => ({ label })),
      },
      {
        title: "Online Listing",
        items: [{ label: "Listings" }],
      },
      {
        title: "Bird’s Eye View (BEV)",
        items: [{ label: "Manage BEV Maps" }, { label: "Manage BEV Map Views" }],
      },
    ],
  },
  { key: "accounting", label: "Accounting", setupLabel: "Accounting Setup", reportsLabel: "Accounting Reports", columns: null },
  { key: "receivables", label: "Receivables", setupLabel: "Receivables Setup", reportsLabel: "Receivables Reports", columns: null },
  {
    key: "payables",
    label: "Payables",
    setupLabel: "Payables Setup",
    reportsLabel: "Payables Reports",
    columns: [
      {
        title: "General",
        items: [
          "Vendors",
          "Vendor Credits",
          "Purchase Orders",
          "Account Balance Disbursal",
          "Export 1099",
          "Export Corrected 1099",
          "Merge Vendors",
          "Smart Receipts",
        ].map((label) => ({ label })),
      },
      {
        title: "Checks",
        items: ["Checks", "Write Checks", "Print Checks", "Post eChecks", "eChecks", "Reorder eChecks"].map((label) => ({ label })),
      },
      {
        title: "Bills",
        items: [
          { label: "Bills" },
          { label: "Add Bill" },
          { label: "Recurring Bills" },
          { label: "Pay Bills", to: "/pay-bills" },
          { label: "Post Recurring Bills" },
          { label: "Smart Bills" },
        ],
      },
      {
        title: "AvidXchange",
        items: [
          { label: "AvidInvoice" },
          { label: "Post VendorPay", to: "/post-vendorpay" },
          { label: "VendorPay Batches", to: "/vendorpay-batches" },
        ],
      },
      {
        title: "Loans Payable",
        items: [{ label: "Loans Payable" }, { label: "Post Loans Payable" }],
      },
    ],
  },
  { key: "owners", label: "Owners", setupLabel: "Owners Setup", reportsLabel: "Owners Reports", columns: null },
  { key: "services", label: "Services", setupLabel: "Services Setup", reportsLabel: "Services Reports", columns: null },
  { key: "communication", label: "Communication", setupLabel: "Communication Setup", reportsLabel: "Communication Reports", columns: null },
]

/** These links stay inert until enrollment is finished, matching Rent Manager's staged-rollout convention. */
const REQUIRES_ENROLLMENT = new Set(["VendorPay Batches"])

const TOP_NAV_ITEMS = [
  { icon: workspaceIcon, label: "Workspace" },
  { icon: dashboardIcon, label: "Dashboard" },
  { icon: adminIcon, label: "Administration" },
  { icon: fullMenuIcon, label: "Full Menu" },
  { icon: searchIcon, label: "Search" },
  { icon: helpIcon, label: "Help" },
]

export function NavMenu({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate()
  const { state } = useWizard()
  const [selectedKey, setSelectedKey] = useState("rental-info")

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [onClose])

  const selected = CATEGORIES.find((c) => c.key === selectedKey) ?? CATEGORIES[0]

  function go(item: MenuItem) {
    if (!item.to) return
    navigate(item.to)
    onClose()
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex justify-center bg-[rgba(19,49,76,0.45)] px-xl pb-xl pt-5xl"
      onClick={onClose}
    >
      <div
        className="flex w-full max-w-[1320px] flex-col overflow-hidden rounded-md bg-white shadow-[0_8px_24px_rgba(19,49,76,0.3)]"
        style={{ maxHeight: "calc(100vh - 80px)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-none items-center gap-2xl border-b border-border-primary px-lg py-[14px]">
          <div className="flex shrink-0 items-center gap-lg">
            <img src={rmHouseLogo} alt="" className="h-10 w-10" />
            <span className="whitespace-nowrap text-2xl text-text-secondary">Menu</span>
          </div>
          <nav className="flex min-w-0 flex-1 flex-wrap items-center gap-x-xl gap-y-[10px]">
            {TOP_NAV_ITEMS.map((item) => (
              <span
                key={item.label}
                className={clsx(
                  "flex shrink-0 items-center gap-[6px] whitespace-nowrap text-sm text-text-secondary",
                  item.label !== "Full Menu" && "cursor-default",
                )}
              >
                <img src={item.icon} alt="" className="h-[18px] w-[18px]" />
                {item.label}
              </span>
            ))}
          </nav>
          <button type="button" aria-label="Close menu" onClick={onClose} className="flex shrink-0 p-xxs text-[#0071aa]">
            <img src={closeIcon} alt="" className="h-5 w-5" />
          </button>
        </div>

        <div className="relative flex min-h-0 flex-1">
          <div className="flex w-[200px] shrink-0 flex-col gap-sm border-r border-border-primary py-xs">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                type="button"
                disabled={cat.key !== "payables"}
                onClick={() => setSelectedKey(cat.key)}
                className={clsx(
                  "relative flex h-7 shrink-0 items-center px-md text-left text-lg",
                  cat.key === selectedKey
                    ? "w-[calc(100%+12px)] bg-[#0071aa] text-white"
                    : cat.key === "payables"
                      ? "text-[#0071aa] hover:bg-row-hover"
                      : "cursor-default text-[#0071aa]",
                )}
              >
                {cat.label}
                {cat.key === selectedKey && (
                  <img
                    src={cornerIcon}
                    alt=""
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-3 right-0 z-10 h-3 w-[13px]"
                  />
                )}
              </button>
            ))}
          </div>

          <div className="min-w-0 flex-1 overflow-y-auto">
            {selected.columns ? (
              <div className="flex flex-wrap content-start gap-xl px-xl py-lg">
                {selected.columns.map((col) => (
                  <div key={col.title} className="flex flex-col">
                    <span className="mb-[6px] whitespace-nowrap border-b border-[#0071aa] pb-[6px] text-sm text-[#0071aa]">
                      {col.title}
                    </span>
                    {col.items
                      .filter((item) => !(REQUIRES_ENROLLMENT.has(item.label) && !state.enrollmentComplete))
                      .map((item) =>
                        item.to ? (
                          <button
                            key={item.label}
                            type="button"
                            onClick={() => go(item)}
                            className="whitespace-nowrap py-[6px] text-left text-sm text-text-secondary hover:text-[#0071aa]"
                          >
                            {item.label}
                          </button>
                        ) : (
                          <span key={item.label} className="whitespace-nowrap py-[6px] text-sm text-text-secondary">
                            {item.label}
                          </span>
                        ),
                      )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-full items-center justify-center p-sm">
                <span className="text-sm italic text-[#b3b3b3]">Not included in this prototype.</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-none flex-wrap items-center justify-between gap-md border-t border-border-primary px-lg py-[10px]">
          <div className="flex flex-wrap items-center gap-lg">
            <span className="flex items-center gap-[6px] whitespace-nowrap text-sm text-text-secondary">
              <img src={settingsIcon} alt="" className="h-[18px] w-[18px]" />
              {selected.setupLabel}
            </span>
            <span className="flex items-center gap-[6px] whitespace-nowrap text-sm text-text-secondary">
              <img src={reportsIcon} alt="" className="h-[18px] w-[18px]" />
              {selected.reportsLabel}
            </span>
          </div>
          <span className="whitespace-nowrap text-xs text-label-gray">Version 12.250907</span>
        </div>
      </div>
    </div>,
    document.body,
  )
}
