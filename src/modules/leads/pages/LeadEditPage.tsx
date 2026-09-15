import { useParams, useNavigate } from "react-router-dom";
import { PageLayout } from "@/shared/components/ui/layout";
import { LoadingScreen, ErrorState } from "@/shared/components/ui/feedback";
import { LeadForm } from "@/modules/leads/components/LeadForm";
import { useLead } from "@/modules/leads/hooks/useLead";

export default function LeadEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const leadId = Number(id);

  const { data, isLoading, isError, refetch } = useLead(leadId);
  const lead = data?.data;

  return (
    <PageLayout
      title={lead?.companyName ? `Edit ${lead.companyName}` : "Edit Lead"}
      subtitle="Update lead qualification status, requirements, and contact info"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard", onClick: () => navigate("/dashboard") },
        { label: "Leads", href: "/leads", onClick: () => navigate("/leads") },
        { label: `Edit #${id}` },
      ]}
      onBack={() => navigate("/leads")}
    >
      {isLoading ? (
        <LoadingScreen message="Loading lead details for editing..." />
      ) : isError || !lead ? (
        <ErrorState
          title="Lead Not Found"
          message="Could not load the requested lead data."
          onRetry={refetch}
        />
      ) : (
        <LeadForm initialData={lead} isEdit={true} />
      )}
    </PageLayout>
  );
}
