import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../components/ui/Button"
import { RMXBackground } from "../components/RMXBackground"
import { AppHeader } from "../components/AppHeader"
import { EnrollmentGuideModal } from "../components/EnrollmentGuideModal"
import heroIllustration from "../assets/splash/hero-illustration.png"
import bulletDot from "../assets/splash/bullet-dot.svg"
import poweredByLogo from "../assets/shell/powered-by-avidxchange.svg"
import autorenewIcon from "../assets/shell/autorenew.svg"
import helpIcon from "../assets/shell/help.svg"

export function SplashPage() {
  const navigate = useNavigate()
  const [showGuide, setShowGuide] = useState(false)

  return (
    <div className="min-h-screen bg-white">
      <AppHeader />
      <div className="flex h-10 items-center justify-between bg-brand-blue px-md py-xs text-white">
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

      <main className="relative flex min-h-[calc(100vh-88px-32px)] items-stretch overflow-hidden border border-border-primary bg-white rounded-sm shadow-[0_3px_6px_0_rgba(0,0,0,0.1)] m-md px-5xl">
        <RMXBackground />
        <div className="relative z-10 flex w-[588px] shrink-0 flex-col justify-center gap-xl py-2xl pl-xl">
          <div className="flex flex-col gap-md">
            <h1 className="text-[40px] leading-[48px] font-semibold text-text-primary">Automate Payments with VendorPay</h1>
            <p className="text-base text-text-secondary">
              Eliminate paper checks and automate your vendor payments with VendorPay* by AvidXchange. VendorPay
              handles payments and allows you to track their status, all from within Rent Manager.
            </p>
            <div className="flex flex-col gap-sm">
              <span className="text-sm font-normal text-text-primary">To get started:</span>
              <div className="flex flex-col gap-xs">
                <button
                  type="button"
                  onClick={() => setShowGuide(true)}
                  className="flex items-center gap-xs text-sm text-text-link hover:underline"
                >
                  <img src={bulletDot} alt="" className="h-1 w-1" />
                  Check out the enrollment guide
                </button>
                <button type="button" className="flex items-center gap-xs text-sm text-text-link hover:underline">
                  <img src={bulletDot} alt="" className="h-1 w-1" />
                  Watch how VendorPay works
                </button>
              </div>
            </div>
          </div>
          <Button variant="marketing" onClick={() => navigate("/enroll/company-info")}>
            Start Enrollment
          </Button>
        </div>
        <div className="relative z-10 flex min-h-0 min-w-0 flex-1 items-center justify-center overflow-hidden py-lg pl-lg">
          <img src={heroIllustration} alt="" className="max-h-full max-w-full object-contain" />
        </div>
        <p className="absolute bottom-lg left-5xl z-10 w-[540px] text-xs text-text-primary">
          *VendorPay services are limited to payments processed within the United States.
        </p>
      </main>

      {showGuide && <EnrollmentGuideModal onClose={() => setShowGuide(false)} />}
    </div>
  )
}
