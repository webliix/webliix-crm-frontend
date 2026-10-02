import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "@/modules/auth/pages/LoginPage";
import ForgotPasswordPage from "@/modules/auth/pages/ForgotPasswordPage";
import RegisterPage from "@/modules/auth/pages/RegisterPage";
import VerifyEmailPage from "@/modules/auth/pages/VerifyEmailPage";
import DashboardPage from "@/modules/dashboard/pages/DashboardPage";
import LeadCreatePage from "@/modules/leads/pages/LeadCreatePage";
import LeadEditPage from "@/modules/leads/pages/LeadEditPage";
import LeadListPage from "@/modules/leads/pages/LeadListPage";
import CustomerListPage from "@/modules/customers/pages/CustomerListPage";
import BlogListPage from "@/modules/blog/pages/BlogListPage";
import PublicBlogListingPage from "@/modules/blog/pages/PublicBlogListingPage";
import PublicBlogReaderPage from "@/modules/blog/pages/PublicBlogReaderPage";
import ProfilePage from "@/modules/profile/pages/ProfilePage";
import TicketListPage from "@/modules/tickets/pages/TicketListPage";
import SubscriberListPage from "@/modules/newsletter/pages/SubscriberListPage";
import ReviewListPage from "@/modules/reviews/pages/ReviewListPage";
import UserListPage from "@/modules/system/pages/UserListPage";
import ProjectListPage from "@/modules/projects/pages/ProjectListPage";
import ProjectDetailPage from "@/modules/projects/pages/ProjectDetailPage";
import InvoiceListPage from "@/modules/invoices/pages/InvoiceListPage";
import AutomationsListPage from "@/modules/automations/pages/AutomationsListPage";
import PayrollListPage from "@/modules/hr/pages/PayrollListPage";
import EmployeeListPage from "@/modules/hr/pages/EmployeeListPage";
import ExpenseListPage from "@/modules/expenses/pages/ExpenseListPage";
import ReportsPage from "@/modules/reports/pages/ReportsPage";
import AuditLogsPage from "@/modules/audit/pages/AuditLogsPage";
import QuotationListPage from "@/modules/quotations/pages/QuotationListPage";
import SettingsPage from "@/modules/settings/pages/SettingsPage";
import ClientPortalPage from "@/modules/portal/pages/ClientPortalPage";
import { AccessDeniedPage } from "@/modules/system/pages/AccessDeniedPage";
import { NotFoundPage } from "@/modules/system/pages/NotFoundPage";
import { ProtectedRoute } from "@/app/router/ProtectedRoute";
import { DashboardLayout } from "@/app/layouts/dashboard/DashboardLayout";
import { AuthLayout } from "@/app/layouts/auth/AuthLayout";
import { PageGuard } from "@/shared/components/rbac/PageGuard";
import { permissions, routeAccess } from "@/shared/security";
import { useGlobalErrorHandler } from "@/shared/hooks/useGlobalErrorHandler";

function RouterErrorHandler() {
  useGlobalErrorHandler();
  return null;
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <RouterErrorHandler />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Public Publication Reader Endpoints */}
        <Route path="/blog" element={<PublicBlogListingPage />} />
        <Route path="/blog/:slug" element={<PublicBlogReaderPage />} />

        {/* Authentication Routes */}
        <Route
          path="/login"
          element={
            <AuthLayout>
              <LoginPage />
            </AuthLayout>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <AuthLayout>
              <ForgotPasswordPage />
            </AuthLayout>
          }
        />
        <Route
          path="/register"
          element={
            <AuthLayout>
              <RegisterPage />
            </AuthLayout>
          }
        />
        <Route
          path="/verify-email"
          element={
            <AuthLayout>
              <VerifyEmailPage />
            </AuthLayout>
          }
        />

        <Route
          path="/403"
          element={
            <AuthLayout>
              <AccessDeniedPage />
            </AuthLayout>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <DashboardPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <ProfilePage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <ProjectListPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects/:id"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <ProjectDetailPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/portal"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <PageGuard permission={routeAccess["/portal"]}>
                  <ClientPortalPage />
                </PageGuard>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/invoices"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <InvoiceListPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/customers"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <PageGuard permission={routeAccess["/customers"]}>
                  <CustomerListPage />
                </PageGuard>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/blogs"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <PageGuard permission={routeAccess["/blogs"]}>
                  <BlogListPage />
                </PageGuard>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tickets"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <PageGuard permission={routeAccess["/tickets"]}>
                  <TicketListPage />
                </PageGuard>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/subscribers"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <PageGuard permission={routeAccess["/subscribers"]}>
                  <SubscriberListPage />
                </PageGuard>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/reviews"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <PageGuard permission={routeAccess["/reviews"]}>
                  <ReviewListPage />
                </PageGuard>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <PageGuard permission={routeAccess["/users"]}>
                  <UserListPage />
                </PageGuard>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/leads"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <PageGuard permission={routeAccess["/leads"]}>
                  <LeadListPage />
                </PageGuard>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/leads/create"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <PageGuard permission={permissions.leads.create}>
                  <LeadCreatePage />
                </PageGuard>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/leads/:id/edit"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <PageGuard permission={permissions.leads.edit}>
                  <LeadEditPage />
                </PageGuard>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/automations"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <PageGuard permission={routeAccess["/automations"]}>
                  <AutomationsListPage />
                </PageGuard>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/payroll"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <PageGuard permission={routeAccess["/payroll"]}>
                  <PayrollListPage />
                </PageGuard>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/audit-logs"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <PageGuard permission={routeAccess["/audit-logs"]}>
                  <AuditLogsPage />
                </PageGuard>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/quotations"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <PageGuard permission={routeAccess["/quotations"]}>
                  <QuotationListPage />
                </PageGuard>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/employees"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <EmployeeListPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/expenses"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <ExpenseListPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <ReportsPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <SettingsPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/404"
          element={
            <AuthLayout>
              <NotFoundPage />
            </AuthLayout>
          }
        />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
