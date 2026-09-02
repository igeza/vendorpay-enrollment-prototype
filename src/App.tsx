import { HashRouter, Routes, Route, Outlet } from "react-router-dom"
import { WizardProvider } from "./context/WizardContext"
import { SplashPage } from "./pages/SplashPage"
import { CompanyInfoPage } from "./pages/wizard/CompanyInfoPage"
import { ControlPersonPage } from "./pages/wizard/ControlPersonPage"
import { BeneficialOwnersPage } from "./pages/wizard/BeneficialOwnersPage"
import { ContactsPage } from "./pages/wizard/ContactsPage"
import { ChooseBanksPage } from "./pages/wizard/ChooseBanksPage"
import { SignAgreementPage } from "./pages/wizard/SignAgreementPage"
import { NextStepsPage } from "./pages/wizard/NextStepsPage"
import { BankAccountsPage } from "./pages/BankAccountsPage"

function EnrollLayout() {
  return (
    <>
      <SplashPage />
      <Outlet />
    </>
  )
}

export default function App() {
  return (
    <WizardProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<SplashPage />} />
          <Route path="/bank-accounts" element={<BankAccountsPage />} />
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
      </HashRouter>
    </WizardProvider>
  )
}
