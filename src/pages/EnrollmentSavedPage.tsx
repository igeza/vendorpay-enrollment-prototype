import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { AppHeader } from "../components/AppHeader"
import { Button } from "../components/ui/Button"
import { EnrollmentGuideModal } from "../components/EnrollmentGuideModal"
import { useWizard } from "../context/WizardContext"
import poweredByLogo from "../assets/shell/powered-by-avidxchange.svg"
import autorenewIcon from "../assets/shell/autorenew.svg"
import helpIcon from "../assets/shell/help.svg"
import bulletDot from "../assets/splash/bullet-dot.svg"
import systemPreferencesIcon from "../assets/splash/continue-enrollment/icon-system-preferences.svg"

export function EnrollmentSavedPage() {
  const navigate = useNavigate()
  const { state } = useWizard()
  const [showGuide, setShowGuide] = useState(false)

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <AppHeader />
      <div className="flex h-10 shrink-0 items-center justify-between bg-brand-blue px-md py-xs text-white">
        <div className="flex items-center gap-sm">
          <span className="text-lg">VendorPay</span>
          <span className="flex items-center gap-xxxs rounded-sm bg-[#cce8f7] px-xxs py-xxxs text-xs italic text-brand-navy">
            Powered by
            <img src={poweredByLogo} alt="AvidXchange" className="h-4" />
          </span>
        </div>
        <div className="flex items-center gap-sm">
          <button type="button" aria-label="Refresh">
            <img src={autorenewIcon} alt="" className="h-5 w-5" />
          </button>
          <button type="button" aria-label="Help">
            <img src={helpIcon} alt="" className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 items-center justify-center bg-[#f5f8fa] p-md">
        <div className="flex items-center gap-lg">
          <img src={systemPreferencesIcon} alt="" className="h-[78px] w-[78px] shrink-0" />
          <div className="flex flex-col items-start gap-xl">
            <div className="flex flex-col gap-md">
              <div className="flex flex-col gap-xs">
                <p className="text-base font-semibold text-label-gray">Continue VendorPay Enrollment</p>
                <p className="text-sm font-normal text-label-gray">Your enrollment was started and saved for later.</p>
                <div className="flex flex-col gap-sm">
                  <div className="flex items-center gap-xs">
                    <img src={bulletDot} alt="" className="h-1 w-1" />
                    <span className="text-sm font-normal text-label-gray">
                      You can return anytime to complete the enrollment process.
                    </span>
                  </div>
                  <div className="flex items-center gap-xs">
                    <img src={bulletDot} alt="" className="h-1 w-1" />
                    <span className="text-sm font-normal text-label-gray">
                      To review what you'll need,{" "}
                      <button type="button" onClick={() => setShowGuide(true)} className="text-text-link hover:underline">
                        check out
                      </button>{" "}
                      the enrollment guide
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <Button variant="primary" onClick={() => navigate(`/enroll/${state.lastStep}`)}>
              Continue Enrollment
            </Button>
          </div>
        </div>
      </div>

      {showGuide && <EnrollmentGuideModal onClose={() => setShowGuide(false)} />}
    </div>
  )
}
