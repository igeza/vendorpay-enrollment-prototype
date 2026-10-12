import { useEffect, useMemo, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import clsx from "clsx"
import { AppHeader } from "../components/AppHeader"
import { useWizard } from "../context/WizardContext"
import { ADMIN_MENU, type AdminMenuItem, type AdminMenuSection } from "./adminMenuData"
import adminMenuLogo from "../assets/admin/admin-menu-logo.svg"
import searchIcon from "../assets/admin/find-search.svg"
import megaMenuCorner from "../assets/admin/megamenu-corner.svg"
import vendorPayIcon from "../assets/admin/vendorpay.svg"
import propertyGroupsGlyph from "../assets/admin/glyph32/property-groups.svg"
import amenitiesGlyph from "../assets/admin/glyph32/amenities.svg"
import unitStatusTypesGlyph from "../assets/admin/glyph32/unit-status-types.svg"
import violationCategoriesGlyph from "../assets/admin/glyph32/violation-categories.svg"
import strPaymentPoliciesGlyph from "../assets/admin/glyph32/str-payment-policies.svg"

/*
 * RMX Pages › Administration Menu (Figma 5XEzI94nmZsWE7rQQ7OIHP, node 4620:157756).
 * Colors below are the Foundations variables that have no token in index.css yet.
 */
/** background/background-megamenu */
const MEGAMENU_BLUE = "#0071aa"
/** icon/icon-rm12 — Section and Group Title text + Section Title rule */
const RM12_BLUE = "text-[#3776bc]"

const NAV_ITEMS = [
  "Preferences",
  "Rental Info",
  "Accounting",
  "Owners",
  "Payables",
  "Receivables",
  "Service",
  "Users",
  "Customization",
  "Rollback",
  "Automation",
  "Import",
  "Integrations",
  "Locations",
]

interface PageItem extends AdminMenuItem {
  /** Items with an action open that part of the prototype; the rest render inert. */
  action?: "vendorpay"
  /** The VendorPay glyph is drawn at 40px inside the 50px icon slot (VendorPay Figma, node 2457:30650). */
  inset?: boolean
}

const VENDORPAY_ITEM: PageItem = {
  title: "VendorPay Powered by AvidXchange",
  description:
    "Streamline vendor invoice payments and automate your accounts payable process through our powerful partnership with AvidXchange.",
  icon: vendorPayIcon,
  inset: true,
  action: "vendorpay",
}

/** The canonical admin menu, with VendorPay added to the end of Payables. */
const SECTIONS: AdminMenuSection[] = ADMIN_MENU.map((section) =>
  section.title === "Payables"
    ? {
        ...section,
        groups: section.groups.map((g, i) => (i === section.groups.length - 1 ? { ...g, items: [...g.items, VENDORPAY_ITEM] } : g)),
      }
    : section,
)

/**
 * These five export from RMX Pages as empty drawings. The same Express glyphs harvested from the
 * VendorPay file (node 2457:27133) stand in, drawn 32px inside the 50px slot as that file does.
 * Contact Types and Lease Terms are also empty and have no other source yet — they render blank.
 */
const GLYPH_FALLBACKS: Record<string, string> = {
  "Property Groups": propertyGroupsGlyph,
  Amenities: amenitiesGlyph,
  "Unit Status Types": unitStatusTypesGlyph,
  "Violation Categories": violationCategoriesGlyph,
  "STR Payment Policies": strPaymentPoliciesGlyph,
}

/** A section counts as "on top" once its title reaches this far from the viewport top (sections scroll to 16px). */
const SPY_OFFSET = 24

function sectionId(title: string) {
  return `admin-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`
}

function Item({ item, onOpen }: { item: PageItem; onOpen?: () => void }) {
  // Title-only entries (the Automation and Import lists) have no icon or description.
  if (!item.icon && !item.description) {
    return <span className="truncate text-sm leading-normal text-text-primary">{item.title}</span>
  }

  const content = (
    <>
      {item.icon &&
        (GLYPH_FALLBACKS[item.title] ? (
          <div className="flex h-[50px] w-[50px] shrink-0 items-center justify-center">
            <img src={GLYPH_FALLBACKS[item.title]} alt="" className="h-8 w-8" />
          </div>
        ) : item.inset ? (
          <div className="flex h-[50px] w-[50px] shrink-0 items-center justify-center">
            <img src={item.icon} alt="" className="h-10 w-10" />
          </div>
        ) : (
          <img src={item.icon} alt="" className="h-[50px] w-[50px] shrink-0" />
        ))}
      <div className="flex min-w-0 max-w-[304.75px] flex-1 flex-col gap-xs">
        <span className="truncate text-sm leading-normal text-text-primary">{item.title}</span>
        {item.description && <span className="text-xs italic leading-normal text-label-gray">{item.description}</span>}
      </div>
    </>
  )

  if (!onOpen) return <div className="flex items-start gap-xs">{content}</div>
  return (
    <button type="button" onClick={onOpen} className="flex items-start gap-xs text-left [&:hover_span:first-child]:underline">
      {content}
    </button>
  )
}

export function AdminPage() {
  const navigate = useNavigate()
  const { state } = useWizard()
  const [active, setActive] = useState(NAV_ITEMS[0])
  const [query, setQuery] = useState("")
  /** While a menu click's smooth scroll is running, the clicked item stays selected. */
  const lockUntil = useRef(0)

  const visibleSections = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return SECTIONS
    return SECTIONS.map((s) => ({
      ...s,
      groups: s.groups
        .map((g) => ({ ...g, items: g.items.filter((it) => it.title.toLowerCase().includes(q)) }))
        .filter((g) => g.items.length > 0),
    })).filter((s) => s.groups.length > 0)
  }, [query])

  // Scroll spy: the selected menu item follows whichever section is at the top of the page.
  useEffect(() => {
    function onScroll() {
      const now = Date.now()
      if (now < lockUntil.current) {
        lockUntil.current = Math.max(lockUntil.current, now + 150)
        return
      }
      const sections = [...document.querySelectorAll<HTMLElement>("main section[data-title]")]
      if (sections.length === 0) return
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2
      let current = sections[0]
      if (atBottom) current = sections[sections.length - 1]
      else
        for (const section of sections) {
          if (section.getBoundingClientRect().top > SPY_OFFSET) break
          current = section
        }
      setActive(current.dataset.title!)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [visibleSections])

  function select(label: string) {
    const target = document.getElementById(sectionId(label))
    if (!target) return
    setActive(label)
    lockUntil.current = Date.now() + 1000
    target.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  function open(item: PageItem) {
    // VendorPay opens its settings once enrolled, otherwise the enrollment splash.
    if (item.action === "vendorpay") navigate(state.enrollmentComplete ? "/bank-accounts" : "/")
  }

  return (
    <div className="flex min-h-screen flex-col bg-container-primary">
      <AppHeader />

      {/* Mega Menu Headers — Admin */}
      <div className="flex h-[74px] shrink-0 items-center gap-[80px] border-b border-border-primary px-lg">
        <div className="flex shrink-0 items-center gap-lg">
          <img src={adminMenuLogo} alt="" className="h-10 w-10" />
          <span className="whitespace-nowrap text-2xl leading-8 text-text-primary">Administration</span>
        </div>
        <div className="relative w-[188px] shrink-0">
          <img src={searchIcon} alt="" className="pointer-events-none absolute left-xs top-1/2 h-5 w-5 -translate-y-1/2" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find an item"
            className="h-9 w-full rounded-sm border border-brand-blue bg-white pl-[32px] pr-xs text-sm text-text-primary outline-none placeholder:italic placeholder:text-[#b3b3b3]"
          />
        </div>
      </div>

      <div className="flex flex-1">
        {/*
          Mega Menu — Admin. The panel stops 12px short of the column so the active row can
          bleed past the divider with its folded corner; don't add overflow clipping here.
        */}
        <nav className="relative hidden w-[232px] shrink-0 md:block">
          <div className="absolute inset-y-0 left-0 right-[12px] border-r border-border-primary bg-container-primary" />
          <div className="sticky top-0 flex flex-col gap-sm py-xs">
            {NAV_ITEMS.map((label) =>
              label === active ? (
                <div key={label} className="relative flex h-9 w-[232px] items-center px-md" style={{ backgroundColor: MEGAMENU_BLUE }}>
                  <span className="truncate text-lg leading-6 text-white">{label}</span>
                  <img src={megaMenuCorner} alt="" className="absolute bottom-[-12px] right-0 h-3 w-[13px] -scale-x-100" />
                </div>
              ) : (
                <button
                  key={label}
                  type="button"
                  onClick={() => select(label)}
                  className="relative flex h-9 w-[232px] items-center px-md text-left hover:underline"
                  style={{ color: MEGAMENU_BLUE }}
                >
                  <span className="truncate text-lg leading-6">{label}</span>
                </button>
              ),
            )}
          </div>
        </nav>

        {/* Menu Items */}
        <main className="flex min-w-0 flex-1 flex-col gap-xl px-2xl pt-md pb-2xl">
          {visibleSections.map((section) => (
            <section key={section.title} id={sectionId(section.title)} data-title={section.title} className="flex scroll-mt-md flex-col gap-xl">
              <h2 className="w-[200px] border-b-2 border-[#3776bc] py-xxs">
                <span className={clsx("block truncate text-base font-semibold leading-6", RM12_BLUE)}>{section.title}</span>
              </h2>
              {section.groups.map((group, i) => (
                <div key={group.title ?? i} className="flex flex-col gap-xl">
                  {group.title && <h3 className={clsx("truncate text-sm font-semibold leading-normal", RM12_BLUE)}>{group.title}</h3>}
                  <div className="grid grid-cols-1 gap-x-md gap-y-xl md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                    {group.items.map((item: PageItem) => (
                      <Item key={item.title} item={item} onOpen={item.action ? () => open(item) : undefined} />
                    ))}
                  </div>
                </div>
              ))}
            </section>
          ))}
          {visibleSections.length === 0 && <p className="text-sm italic text-label-gray">No items match “{query}”.</p>}
        </main>
      </div>
    </div>
  )
}
