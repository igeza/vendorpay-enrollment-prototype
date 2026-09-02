import { useRef } from "react"
import { useNavigate } from "react-router-dom"
import { WizardShell } from "../../components/WizardShell"
import { MultiSelectDropdown } from "../../components/ui/MultiSelectDropdown"
import { useWizard } from "../../context/WizardContext"
import { CONTACT_ROLES, CONTACT_ROLE_DESCRIPTIONS, makeId, type Contact, type ContactRole } from "../../types"
import addIcon from "../../assets/contacts/add-icon.svg"
import checkCircleDone from "../../assets/contacts/check-circle-filled-done.svg"
import checkCirclePending from "../../assets/contacts/check-circle-filled-pending.svg"

const ROLE_OPTIONS = CONTACT_ROLES.map((role) => ({ value: role, description: CONTACT_ROLE_DESCRIPTIONS[role] }))

const REMAINING_ROLES: ContactRole[] = ["Payment Funding Contact", "Payment Servicing Contact", "Platform Contact"]
const DEMO_SECOND_CONTACT = {
  firstName: "Emery",
  lastName: "Callahan",
  email: "ecallahan@email.com",
  phone: "415-672-8390",
}

function emptyContact(): Contact {
  return { id: makeId(), roles: [], firstName: "", lastName: "", email: "", phone: "" }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function ContactsPage() {
  const { state, update } = useWizard()
  const navigate = useNavigate()
  const contacts = state.contacts.length ? state.contacts : [emptyContact()]
  const demoRunningIds = useRef<Set<string>>(new Set())

  async function runContactAutoFill(contactId: string) {
    if (demoRunningIds.current.has(contactId)) return
    const current = contacts.find((c) => c.id === contactId)
    if (!current || current.firstName) return
    demoRunningIds.current.add(contactId)

    const next = contacts.map((c) => ({ ...c }))
    const idx = next.findIndex((c) => c.id === contactId)

    async function typeField(key: "firstName" | "lastName" | "email" | "phone", text: string) {
      for (let i = 1; i <= text.length; i++) {
        next[idx] = { ...next[idx], [key]: text.slice(0, i) }
        update({ contacts: next.map((c) => ({ ...c })) })
        await delay(20 + Math.random() * 30)
      }
      await delay(180)
    }

    await typeField("firstName", DEMO_SECOND_CONTACT.firstName)
    await typeField("lastName", DEMO_SECOND_CONTACT.lastName)
    await typeField("email", DEMO_SECOND_CONTACT.email)
    await typeField("phone", DEMO_SECOND_CONTACT.phone)

    demoRunningIds.current.delete(contactId)
  }

  function setContacts(next: Contact[]) {
    update({ contacts: next })
  }

  function patchContact(id: string, patch: Partial<Contact>) {
    setContacts(contacts.map((c) => (c.id === id ? { ...c, ...patch } : c)))
  }

  function addContact() {
    setContacts([...contacts, emptyContact()])
  }

  function removeContact(id: string) {
    setContacts(contacts.filter((c) => c.id !== id))
  }

  function fillBillingFromCompanyProfile() {
    const billingIndex = contacts.findIndex((c) => c.roles.includes("Billing Contact"))
    const patch: Partial<Contact> = {
      firstName: "Jennifer",
      lastName: "Bell",
      email: "jenbell@email.com",
      phone: "732-849-3021",
    }
    if (billingIndex >= 0) {
      setContacts(contacts.map((c) => (c.id === contacts[billingIndex].id ? { ...c, ...patch } : c)))
    } else {
      const target = contacts.find((c) => !c.roles.length) ?? emptyContact()
      const rest = contacts.filter((c) => c.id !== target.id)
      setContacts([...rest, { ...target, ...patch, roles: [...target.roles, "Billing Contact"] }])
    }
  }

  const rolesSatisfied = CONTACT_ROLES.map((role) => ({ role, done: contacts.some((c) => c.roles.includes(role)) }))
  const allRolesSatisfied = rolesSatisfied.every((r) => r.done)
  const rowsValid = contacts.every((c) => c.roles.length && c.firstName && c.lastName && c.email && c.phone)

  return (
    <WizardShell
      stepKey="contacts"
      title="Add Contacts"
      subtitle="Add contacts to receive communications from AvidXchange. You must assign each role to at least one contact."
      onBack={() => navigate("/enroll/beneficial-owners")}
      onNext={() => navigate("/enroll/choose-banks")}
      nextDisabled={!(allRolesSatisfied && rowsValid)}
      onSaveForLater={() => navigate("/")}
    >
      <div className="flex flex-col gap-md">
        <div className="flex flex-col gap-xxs px-xs">
          {rolesSatisfied.map(({ role, done }) => (
            <div key={role} className="flex items-center gap-xxs">
              <ul className="text-sm text-[#616466]">
                <li className="list-disc ms-[21px]">{role}</li>
              </ul>
              <img src={done ? checkCircleDone : checkCirclePending} alt="" className="h-5 w-5 shrink-0" />
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={fillBillingFromCompanyProfile}
          className="w-fit text-sm font-normal text-text-link hover:underline"
        >
          Fill Billing Contact From Company Profile
        </button>

        <div className="overflow-x-auto rounded-sm border border-border-primary">
          <div className="min-w-[900px]">
            <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_32px] rounded-t-sm bg-[#737373] text-[12.6px] font-normal tracking-[1.134px] text-white">
              <div className="min-w-0 truncate px-sm py-xxs">Contact Type *</div>
              <div className="min-w-0 truncate px-sm py-xxs">First Name *</div>
              <div className="min-w-0 truncate px-sm py-xxs">Last Name *</div>
              <div className="min-w-0 truncate px-sm py-xxs">Email Address *</div>
              <div className="min-w-0 truncate px-sm py-xxs">Phone Number *</div>
              <div />
            </div>
            {contacts.map((c) => (
              <div
                key={c.id}
                className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_32px] items-center border-t border-border-disabled bg-white py-xxxs"
              >
                <div className="min-w-0 px-sm">
                  <MultiSelectDropdown
                    size="compact"
                    placeholder=""
                    options={ROLE_OPTIONS}
                    values={c.roles}
                    onChange={(roles) => patchContact(c.id, { roles: roles as Contact["roles"] })}
                  />
                </div>
                <div className="min-w-0 px-sm">
                  <input
                    className="h-8 w-full rounded-sm border border-border-primary bg-input-fill px-xs text-sm outline-none focus:border-brand-blue"
                    value={c.firstName}
                    onChange={(e) => patchContact(c.id, { firstName: e.target.value })}
                    onFocus={() => {
                      if (c.roles.length === REMAINING_ROLES.length && REMAINING_ROLES.every((r) => c.roles.includes(r))) {
                        runContactAutoFill(c.id)
                      }
                    }}
                  />
                </div>
                <div className="min-w-0 px-sm">
                  <input
                    className="h-8 w-full rounded-sm border border-border-primary bg-input-fill px-xs text-sm outline-none focus:border-brand-blue"
                    value={c.lastName}
                    onChange={(e) => patchContact(c.id, { lastName: e.target.value })}
                  />
                </div>
                <div className="min-w-0 px-sm">
                  <input
                    type="email"
                    className="h-8 w-full rounded-sm border border-border-primary bg-input-fill px-xs text-sm outline-none focus:border-brand-blue"
                    value={c.email}
                    onChange={(e) => patchContact(c.id, { email: e.target.value })}
                  />
                </div>
                <div className="min-w-0 px-sm">
                  <input
                    type="tel"
                    className="h-8 w-full rounded-sm border border-border-primary bg-input-fill px-xs text-sm outline-none focus:border-brand-blue"
                    value={c.phone}
                    onChange={(e) => patchContact(c.id, { phone: e.target.value })}
                  />
                </div>
                <div className="flex items-center justify-center">
                  <button
                    type="button"
                    aria-label="Remove contact"
                    onClick={() => removeContact(c.id)}
                    className="text-text-secondary hover:text-error"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={addContact}
          className="inline-flex w-fit items-center gap-xxs pt-xs text-sm font-normal text-text-link hover:underline"
        >
          <img src={addIcon} alt="" className="h-4 w-4" />
          Add Contact
        </button>
      </div>
    </WizardShell>
  )
}
