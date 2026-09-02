import { useState } from "react"
import { useNavigate } from "react-router-dom"
import clsx from "clsx"
import rmLogo from "../assets/shell/rm-logo.svg"
import menuIcon from "../assets/shell/menu.svg"
import reportsIcon from "../assets/shell/reports.svg"
import favoritesIcon from "../assets/shell/favorites-grade.svg"
import searchIcon from "../assets/shell/search.svg"
import notificationsIcon from "../assets/shell/notifications.svg"
import { NavMenu } from "./NavMenu"
import { useWizard } from "../context/WizardContext"

/** The 48px navy app header that sits atop every Express page — logo, Command Launch, company code, bell, avatar. */
export function AppHeader() {
  const navigate = useNavigate()
  const { reset } = useWizard()
  const [showMenu, setShowMenu] = useState(false)

  function goHome() {
    reset()
    navigate("/")
  }

  return (
    <header className="relative flex h-12 items-center bg-brand-navy px-md py-xs text-white">
      <div className="flex flex-1 items-center gap-md">
        <button type="button" onClick={goHome} aria-label="Rent Manager home">
          <img src={rmLogo} alt="Rent Manager" className="h-8 w-[175px]" />
        </button>
      </div>

      <div className="flex flex-1 items-center justify-center gap-xs">
        <div className="flex items-center gap-px">
          <button
            type="button"
            aria-label="Menu"
            aria-pressed={showMenu}
            onClick={() => setShowMenu((s) => !s)}
            className={clsx(
              "flex h-8 w-10 items-center justify-center rounded-l-sm",
              showMenu ? "bg-brand-blue hover:bg-hover-primary" : "bg-[#425a70] hover:bg-[#4d6580]",
            )}
          >
            <img src={menuIcon} alt="" className="h-5 w-5" />
          </button>
          <button type="button" aria-label="Reports" className="flex h-8 w-11 items-center justify-center bg-[#425a70] hover:bg-[#4d6580]">
            <img src={reportsIcon} alt="" className="h-5 w-5" />
          </button>
          <button type="button" aria-label="Favorites" className="flex h-8 w-10 items-center justify-center rounded-r-sm bg-[#425a70] hover:bg-[#4d6580]">
            <img src={favoritesIcon} alt="" className="h-5 w-5" />
          </button>
        </div>
        <div className="flex h-8 w-[454px] items-center gap-xs rounded-sm bg-[#425a70] px-xs">
          <img src={searchIcon} alt="" className="h-6 w-6" />
          <span className="text-xs italic text-white">Command Launch</span>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-end gap-2xl">
        <div className="flex flex-col leading-tight">
          <span className="text-xs">Company Code</span>
          <span className="text-sm">lcs-rmexpress</span>
        </div>
        <div className="flex items-center gap-lg">
          <button type="button" aria-label="Notifications">
            <img src={notificationsIcon} alt="" className="h-5 w-5" />
          </button>
          <div className="flex h-8 w-8 items-center justify-center rounded-round bg-brand-blue text-sm">MG</div>
        </div>
      </div>

      {showMenu && <NavMenu onClose={() => setShowMenu(false)} />}
    </header>
  )
}
