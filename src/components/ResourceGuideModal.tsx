import { useState } from "react"
import { ManageExceptionsModal } from "./ManageExceptionsModal"
import { ConfigurePrivilegesModal } from "./ConfigurePrivilegesModal"
import helpIcon from "../assets/splash/shell/overlay-help-icon.svg"
import closeIcon from "../assets/splash/shell/overlay-close-icon.svg"
import iconVendors from "../assets/next-steps/icon-update-vendor-payment-methods.svg"
import iconTeam from "../assets/next-steps/icon-enable-team-members.svg"
import iconVideo from "../assets/next-steps/icon-explore-vendorpay-video.svg"

const ITEMS = [
  {
    icon: iconVendors,
    title: "Update vendor payment methods",
    body: "We recommend updating the payment method for each vendor to 'VendorPay.'",
    link: "Update Payment Methods",
    action: "manageExceptions" as const,
  },
  {
    icon: iconTeam,
    title: "Enable team members to use VendorPay",
    body: "Make sure you and others on your team have permission to use and manage VendorPay.",
    link: "Configure VendorPay Privileges",
    action: "configurePrivileges" as const,
  },
  {
    icon: iconVideo,
    title: "Explore VendorPay",
    body: "Learn more about the VendorPay features in our intro video.",
    link: "Watch Video",
    action: null,
  },
]

export function ResourceGuideModal({ onClose }: { onClose: () => void }) {
  const [showManageExceptions, setShowManageExceptions] = useState(false)
  const [showConfigurePrivileges, setShowConfigurePrivileges] = useState(false)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(76,76,76,0.5)]">
      <div className="flex w-[845px] flex-col overflow-hidden rounded-sm border border-border-primary bg-white shadow-[var(--shadow-dropshadow-lg)]">
        <header className="flex h-12 shrink-0 items-center justify-between border-b border-border-primary px-md py-xs">
          <h1 className="text-[20px] leading-[28px] font-normal text-text-primary">Resource Guide</h1>
          <div className="flex items-center gap-xs">
            <button aria-label="Help" className="opacity-70 hover:opacity-100">
              <img src={helpIcon} alt="" className="h-6 w-6" />
            </button>
            <button aria-label="Close" className="opacity-70 hover:opacity-100" onClick={onClose}>
              <img src={closeIcon} alt="" className="h-6 w-6" />
            </button>
          </div>
        </header>

        <div className="flex flex-col gap-xl px-xl py-xl">
          {ITEMS.map((item) => (
            <div key={item.title} className="flex items-start gap-sm">
              <img src={item.icon} alt="" className="h-5 w-5 shrink-0" />
              <div className="flex min-w-0 flex-1 items-end gap-md">
                <div className="flex min-w-0 flex-1 flex-col gap-xxs">
                  <p className="text-sm font-semibold text-text-primary">{item.title}</p>
                  <p className="text-sm font-normal leading-[20px] text-label-gray">{item.body}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (item.action === "manageExceptions") setShowManageExceptions(true)
                    if (item.action === "configurePrivileges") setShowConfigurePrivileges(true)
                  }}
                  className="shrink-0 text-sm font-normal text-text-link hover:underline"
                >
                  {item.link}
                </button>
              </div>
            </div>
          ))}
        </div>

        <footer className="flex shrink-0 items-center justify-end border-t border-border-primary bg-input-fill px-md py-xs">
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 items-center justify-center rounded-sm border border-brand-blue bg-white px-lg text-sm font-normal text-text-link"
          >
            Close
          </button>
        </footer>
      </div>

      {showManageExceptions && <ManageExceptionsModal onClose={() => setShowManageExceptions(false)} />}
      {showConfigurePrivileges && <ConfigurePrivilegesModal onClose={() => setShowConfigurePrivileges(false)} />}
    </div>
  )
}
