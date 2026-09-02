import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { WizardShell } from "../../components/WizardShell"
import { ManageExceptionsModal } from "../../components/ManageExceptionsModal"
import { ConfigurePrivilegesModal } from "../../components/ConfigurePrivilegesModal"
import { useWizard } from "../../context/WizardContext"
import iconVendors from "../../assets/next-steps/icon-update-vendor-payment-methods.svg"
import iconTeam from "../../assets/next-steps/icon-enable-team-members.svg"
import iconPayBills from "../../assets/next-steps/icon-pay-bills.svg"
import iconVideo from "../../assets/next-steps/icon-explore-vendorpay-video.svg"
import iconLocations from "../../assets/next-steps/icon-share-with-other-locations.svg"

const TIPS = [
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
    icon: iconPayBills,
    title: "Pay bills as normal",
    body: "Continue paying bills as normal and VendorPay will take care of securely paying vendors.",
    link: "Learn How This Works",
  },
  {
    icon: iconVideo,
    title: "Explore VendorPay",
    body: "Learn more about the VendorPay features in our intro video.",
    link: "Watch Video",
  },
  {
    icon: iconLocations,
    title: "Share VendorPay with other locations",
    body: "This VendorPay account can be shared with other locations. Manage sharing in System Preferences after enrollment.",
    link: null,
  },
]

export function NextStepsPage() {
  const { reset } = useWizard()
  const navigate = useNavigate()
  const [showManageExceptions, setShowManageExceptions] = useState(false)
  const [showConfigurePrivileges, setShowConfigurePrivileges] = useState(false)

  function finish() {
    reset()
    navigate("/bank-accounts")
  }

  return (
    <WizardShell stepKey="next-steps" title="Next Steps" onNext={finish} nextLabel="Finish">
      <div className="flex flex-col gap-md">
        <div className="flex flex-col gap-xxs">
          <p className="text-base font-semibold text-text-primary">You have successfully enrolled in VendorPay!</p>
          <p className="text-base font-normal text-label-gray">Here are some helpful tips to get started.</p>
        </div>
        {TIPS.map((tip) => (
          <div key={tip.title} className="flex items-center gap-md rounded-sm border border-border-primary p-md">
            <img src={tip.icon} alt="" className="h-10 w-10 shrink-0" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-text-primary">{tip.title}</h3>
              <p className="text-sm text-text-secondary">{tip.body}</p>
            </div>
            {tip.link && (
              <button
                type="button"
                onClick={() => {
                  if (tip.action === "manageExceptions") setShowManageExceptions(true)
                  if (tip.action === "configurePrivileges") setShowConfigurePrivileges(true)
                }}
                className="shrink-0 text-sm font-normal text-text-link hover:underline"
              >
                {tip.link}
              </button>
            )}
          </div>
        ))}
      </div>

      {showManageExceptions && <ManageExceptionsModal onClose={() => setShowManageExceptions(false)} />}
      {showConfigurePrivileges && <ConfigurePrivilegesModal onClose={() => setShowConfigurePrivileges(false)} />}
    </WizardShell>
  )
}
