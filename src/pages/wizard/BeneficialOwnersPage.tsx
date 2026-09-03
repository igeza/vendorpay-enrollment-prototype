import { useNavigate } from "react-router-dom"
import clsx from "clsx"
import { WizardShell } from "../../components/WizardShell"
import { TextField } from "../../components/ui/Field"
import { Dropdown } from "../../components/ui/Dropdown"
import { DatePicker } from "../../components/ui/DatePicker"
import { Card, Checkbox, RadioGroup } from "../../components/ui/Controls"
import { useWizard } from "../../context/WizardContext"
import { COUNTRIES, US_STATES } from "../../constants"
import { makeId, type BeneficialOwner } from "../../types"
import addIcon from "../../assets/beneficial-owners/add.svg"
import deleteIcon from "../../assets/beneficial-owners/delete-filled.svg"

function emptyOwner(): BeneficialOwner {
  return {
    id: makeId(),
    sameAsControlPerson: false,
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    addressLine1: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  }
}

export function BeneficialOwnersPage() {
  const { state, update } = useWizard()
  const navigate = useNavigate()
  const owners = state.beneficialOwners

  function setOwners(next: BeneficialOwner[]) {
    update({ beneficialOwners: next })
  }

  function patchOwner(id: string, patch: Partial<BeneficialOwner>) {
    setOwners(owners.map((o) => (o.id === id ? { ...o, ...patch } : o)))
  }

  function toggleSameAsControlPerson(id: string, checked: boolean) {
    if (!checked) {
      patchOwner(id, { sameAsControlPerson: false })
      return
    }
    const cp = state.controlPerson
    patchOwner(id, {
      sameAsControlPerson: true,
      firstName: cp.firstName,
      lastName: cp.lastName,
      dateOfBirth: cp.dateOfBirth,
      addressLine1: cp.addressLine1,
      city: cp.city,
      state: cp.state,
      zip: cp.zip,
      country: cp.country,
    })
  }

  function addOwner() {
    setOwners([...owners, emptyOwner()])
  }

  function setHasOwners(value: string) {
    const v = value as typeof state.hasBeneficialOwners
    update({ hasBeneficialOwners: v, beneficialOwners: v === "yes" ? (owners.length ? owners : [emptyOwner()]) : [] })
  }

  const ownersValid =
    state.hasBeneficialOwners === "no" ||
    (state.hasBeneficialOwners === "yes" &&
      owners.length > 0 &&
      owners.every((o) => o.firstName && o.lastName && o.dateOfBirth && o.addressLine1 && o.city && o.state && o.zip && o.country))

  return (
    <WizardShell
      stepKey="beneficial-owners"
      title="Add Beneficial Owners"
      subtitle="Add up to 4 individuals who own or control 25% or more of the company."
      onBack={() => navigate("/enroll/control-person")}
      onNext={() => navigate("/enroll/contacts")}
      nextDisabled={!ownersValid}
      onSaveForLater={() => navigate("/enroll-saved")}
    >
      <div className="flex flex-col gap-md">
        <RadioGroup
          required
          legend="Do you or others have 25% ownership or more of the company?"
          options={[{ value: "yes", label: "Yes" }, { value: "no", label: "No" }]}
          value={state.hasBeneficialOwners}
          onChange={setHasOwners}
        />

        {state.hasBeneficialOwners === "yes" &&
          owners.map((owner, i) => (
            <div key={owner.id} className="flex flex-col gap-xs">
              <h2 className="text-sm font-semibold text-text-primary">Beneficial Owner</h2>
              <Card className={clsx("relative flex flex-col gap-md", i > 0 && "pt-2xl")}>
              {i > 0 && (
                <button
                  type="button"
                  aria-label="Remove beneficial owner"
                  onClick={() => setOwners(owners.filter((o) => o.id !== owner.id))}
                  className="absolute right-md top-sm"
                >
                  <img src={deleteIcon} alt="" className="h-5 w-5" />
                </button>
              )}
              {i === 0 && (
                <Checkbox
                  label="Same as Control Person"
                  checked={owner.sameAsControlPerson}
                  onChange={(checked) => toggleSameAsControlPerson(owner.id, checked)}
                />
              )}

              <div className="grid grid-cols-3 gap-md">
                <TextField
                  label="First Name"
                  required
                  disabled={owner.sameAsControlPerson}
                  value={owner.firstName}
                  onChange={(e) => patchOwner(owner.id, { firstName: e.target.value })}
                />
                <TextField
                  label="Last Name"
                  required
                  disabled={owner.sameAsControlPerson}
                  value={owner.lastName}
                  onChange={(e) => patchOwner(owner.id, { lastName: e.target.value })}
                />
                <DatePicker
                  label="Date of Birth"
                  required
                  disabled={owner.sameAsControlPerson}
                  value={owner.dateOfBirth}
                  onChange={(v) => patchOwner(owner.id, { dateOfBirth: v })}
                />
              </div>

              <h3 className="border-b border-border-primary pb-xxs text-sm font-semibold text-text-primary">
                Home Address
              </h3>
              <div className="grid grid-cols-3 gap-md">
                <TextField
                  label="Street"
                  required
                  disabled={owner.sameAsControlPerson}
                  className="col-span-2"
                  value={owner.addressLine1}
                  onChange={(e) => patchOwner(owner.id, { addressLine1: e.target.value })}
                />
                <TextField
                  label="City"
                  required
                  disabled={owner.sameAsControlPerson}
                  value={owner.city}
                  onChange={(e) => patchOwner(owner.id, { city: e.target.value })}
                />
                <Dropdown
                  label="State"
                  required
                  disabled={owner.sameAsControlPerson}
                  options={US_STATES}
                  value={owner.state}
                  onChange={(v) => patchOwner(owner.id, { state: v })}
                />
                <TextField
                  label="Postal Code"
                  required
                  disabled={owner.sameAsControlPerson}
                  value={owner.zip}
                  onChange={(e) => patchOwner(owner.id, { zip: e.target.value })}
                />
                <Dropdown
                  label="Country"
                  required
                  disabled={owner.sameAsControlPerson}
                  className="col-span-2"
                  options={COUNTRIES}
                  value={owner.country}
                  onChange={(v) => patchOwner(owner.id, { country: v })}
                />
              </div>
              </Card>
            </div>
          ))}

        {state.hasBeneficialOwners === "yes" && owners.length < 4 && (
          <button
            type="button"
            onClick={addOwner}
            className="inline-flex w-fit items-center gap-xxs text-sm font-normal text-text-link hover:underline"
          >
            <img src={addIcon} alt="" className="h-4 w-4" />
            Add Beneficial Owner
          </button>
        )}
      </div>
    </WizardShell>
  )
}
