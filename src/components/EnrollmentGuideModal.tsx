import { Button } from "./ui/Button"
import helpIcon from "../assets/splash/shell/overlay-help-icon.svg"
import closeIcon from "../assets/splash/shell/overlay-close-icon.svg"
import companyInfoIcon from "../assets/splash/guide/company-info.svg"
import ownersIcon from "../assets/splash/guide/owners.svg"
import mailIcon from "../assets/splash/guide/mail.svg"
import subsidiesIcon from "../assets/splash/guide/subsidies.svg"
import vendorsIcon from "../assets/splash/guide/vendors.svg"

const GUIDE_ITEMS = [
  {
    icon: companyInfoIcon,
    title: "Company Information",
    description:
      "You will need your company's legal name, DBA, company type, Tax ID, NAICS code, year and state of formation, and corporate address. You will also be asked about company background, such as whether the company has been involved in any legal proceedings or bankruptcy.",
  },
  {
    icon: ownersIcon,
    title: "Control Person & Beneficial Owners",
    description:
      "To support verification, we ask for information about the individual who controls your company and up to four beneficial owners. This includes names, dates of birth, emails, and home addresses.",
  },
  {
    icon: mailIcon,
    title: "Contacts",
    description:
      "You will be asked to add at least one contact to receive communications from AvidXchange. This is typically a billing or payment contact. You can add additional contacts as needed.",
  },
  {
    icon: subsidiesIcon,
    title: "Bank Account Information",
    description:
      "You'll enter which bank accounts VendorPay will use to pay vendors. Make sure these banks are set up as active GL accounts in Rent Manager before enrollment. We'll need to verify each account, so be prepared with the routing and account numbers, and the account owner name for each account. Note: VendorPay can only verify checking accounts.",
  },
  {
    icon: vendorsIcon,
    title: "Vendor and User Access",
    description:
      "Identify which vendors you plan to pay with VendorPay and who on your team will be able to issue those payments in Rent Manager. We'll help you set up permissions at the end of enrollment.",
  },
]

export function EnrollmentGuideModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(76,76,76,0.5)] p-xl">
      <div className="flex w-[880px] max-h-full flex-col overflow-hidden rounded-sm border border-border-primary bg-white shadow-[var(--shadow-dropshadow-lg)]">
        <header className="flex h-12 shrink-0 items-center justify-between border-b border-border-primary px-md py-xs">
          <h1 className="text-[20px] leading-[28px] font-normal text-text-primary">VendorPay Enrollment Guide</h1>
          <div className="flex items-center gap-xs">
            <button aria-label="Help" className="opacity-70 hover:opacity-100">
              <img src={helpIcon} alt="" className="h-6 w-6" />
            </button>
            <button aria-label="Close" className="opacity-70 hover:opacity-100" onClick={onClose}>
              <img src={closeIcon} alt="" className="h-6 w-6" />
            </button>
          </div>
        </header>

        <div className="flex min-h-0 flex-col gap-xl overflow-y-auto px-xl py-xl">
          <p className="text-sm font-normal text-label-gray">
            VendorPay enrollment can be completed in minutes. We recommend gathering the following information to
            make enrollment easier.
          </p>

          <div className="flex flex-col gap-xl">
            {GUIDE_ITEMS.map((item) => (
              <div key={item.title} className="flex items-start gap-sm">
                <img src={item.icon} alt="" className="h-5 w-5 shrink-0" />
                <div className="flex min-w-0 flex-1 flex-col gap-xxs">
                  <p className="text-sm font-semibold text-text-primary">{item.title}</p>
                  <p className="text-sm font-normal leading-[20px] text-label-gray">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <footer className="flex shrink-0 items-center justify-end border-t border-border-primary bg-input-fill px-md py-xs">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </footer>
      </div>
    </div>
  )
}
