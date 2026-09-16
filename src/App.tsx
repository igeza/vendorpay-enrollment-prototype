import type { ReactNode } from "react"
import { HashRouter, MemoryRouter, Routes, Route, Outlet, Navigate } from "react-router-dom"
import { WizardProvider, useWizard } from "./context/WizardContext"
import { PayBillsProvider } from "./context/PayBillsContext"
import { SplashPage } from "./pages/SplashPage"
import { CompanyInfoPage } from "./pages/wizard/CompanyInfoPage"
import { ControlPersonPage } from "./pages/wizard/ControlPersonPage"
import { BeneficialOwnersPage } from "./pages/wizard/BeneficialOwnersPage"
import { ContactsPage } from "./pages/wizard/ContactsPage"
import { ChooseBanksPage } from "./pages/wizard/ChooseBanksPage"
import { SignAgreementPage } from "./pages/wizard/SignAgreementPage"
import { NextStepsPage } from "./pages/wizard/NextStepsPage"
import { BankAccountsPage } from "./pages/BankAccountsPage"
import { PayBillsPage } from "./pages/PayBillsPage"
import { PostVendorPayPage } from "./pages/PostVendorPayPage"
import { VendorPayBatchesPage } from "./pages/VendorPayBatchesPage"
import { CheckDetailsPage } from "./pages/CheckDetailsPage"

function EnrollLayout() {
  return (
    <>
      <SplashPage />
      <Outlet />
    </>
  )
}

/** VendorPay Batches only becomes reachable once enrollment has finished. */
function RequireEnrollment({ children }: { children: ReactNode }) {
  const { state } = useWizard()
  return state.enrollmentComplete ? <>{children}</> : <Navigate to="/" replace />
}

/**
 * HashRouter reads window.location.href via the URL constructor, which some sandboxed
 * preview embeds (e.g. an iframe with a non-standard/opaque location) give an invalid
 * value for. Fall back to an in-memory router there instead of crashing to a blank page.
 */
function isLocationHrefValid() {
  try {
    new URL(window.location.href)
    return true
  } catch {
    return false
  }
}

const Router = isLocationHrefValid() ? HashRouter : MemoryRouter

export default function App() {
  return (
    <WizardProvider>
      <PayBillsProvider>
        <Router>
          <Routes>
            <Route path="/" element={<SplashPage />} />
            <Route path="/bank-accounts" element={<BankAccountsPage />} />
            <Route path="/pay-bills" element={<PayBillsPage />} />
            <Route path="/post-vendorpay" element={<PostVendorPayPage />} />
            <Route path="/check/:batchId/:paymentId/:checkNumber" element={<CheckDetailsPage />} />
            <Route
              path="/vendorpay-batches"
              element={
                <RequireEnrollment>
                  <VendorPayBatchesPage />
                </RequireEnrollment>
              }
            />
            <Route element={<EnrollLayout />}>
              <Route path="/enroll/company-info" element={<CompanyInfoPage />} />
              <Route path="/enroll/control-person" element={<ControlPersonPage />} />
              <Route path="/enroll/beneficial-owners" element={<BeneficialOwnersPage />} />
              <Route path="/enroll/contacts" element={<ContactsPage />} />
              <Route path="/enroll/choose-banks" element={<ChooseBanksPage />} />
              <Route path="/enroll/sign-agreement" element={<SignAgreementPage />} />
              <Route path="/enroll/next-steps" element={<NextStepsPage />} />
            </Route>
          </Routes>
        </Router>
      </PayBillsProvider>
    </WizardProvider>
  )
}
