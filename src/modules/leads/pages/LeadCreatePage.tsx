import { useNavigate } from "react-router-dom";
import { PageLayout } from "@/shared/components/ui/layout";
import { LeadForm } from "@/modules/leads/components/LeadForm";

export default function LeadCreatePage() {
  const navigate = useNavigate();

  return (
    <PageLayout
      title="Create New Lead"
      subtitle="Register a new prospect into the CRM pipeline"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard", onClick: () => navigate("/dashboard") },
        { label: "Leads", href: "/leads", onClick: () => navigate("/leads") },
        { label: "Create Lead" },
      ]}
      onBack={() => navigate("/leads")}
    >
      <LeadForm />
    </PageLayout>
  );
}
