import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import {
  AppForm,
  AppTextField,
  AppSelectField,
  AppCurrencyField,
  AppTextAreaField,
  AppDateField,
  FormSection,
} from "@/shared/components/form";
import { useCreateLead } from "@/modules/leads/hooks/useCreateLead";
import { useUpdateLead } from "@/modules/leads/hooks/useUpdateLead";
import { leadSourceOptions } from "@/modules/leads/constants/lead-source";
import { leadStatusOptions } from "@/modules/leads/constants/lead-status";
import { enumToLabel } from "@/shared/utils/enumMapper";
import type { SelectOption } from "@/shared/types/select-option";
import { notificationService } from "@/shared/notifications/notification.service";
import type { LeadResponse } from "@/api/generated";

interface Props {
  initialData?: LeadResponse;
  isEdit?: boolean;
}

export function LeadForm({ initialData, isEdit = false }: Props) {
  const navigate = useNavigate();
  const create = useCreateLead();
  const update = useUpdateLead();

  const sourceOptions: SelectOption[] = leadSourceOptions.map((v) => ({
    value: v,
    label: enumToLabel(v),
  }));

  const statusOptions: SelectOption[] = leadStatusOptions.map((v) => ({
    value: v,
    label: enumToLabel(v),
  }));

  const defaultValues = {
    companyName: initialData?.companyName || "",
    contactPerson: initialData?.contactPerson || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    source: initialData?.source || "WEBSITE",
    status: initialData?.status || "NEW",
    estimatedValue: initialData?.estimatedValue ? String(initialData.estimatedValue) : "",
    requirements: initialData?.requirements || "",
    nextFollowUpDate: initialData?.nextFollowUpDate ? String(initialData.nextFollowUpDate) : "",
  };

  const handleSubmit = async (values: any) => {
    try {
      const payload: any = {
        companyName: values.companyName,
        contactPerson: values.contactPerson,
        email: values.email,
        phone: values.phone,
        requirements: values.requirements,
        estimatedValue: values.estimatedValue ? Number(values.estimatedValue) : undefined,
        source: values.source,
        status: values.status,
        nextFollowUpDate: values.nextFollowUpDate || undefined,
      };

      if (isEdit && initialData?.id) {
        await update.mutateAsync({ id: initialData.id, data: payload });
        notificationService.success("Lead updated successfully");
      } else {
        await create.mutateAsync(payload);
        notificationService.success("Lead created successfully");
      }
      navigate("/leads");
    } catch (err: any) {
      notificationService.error(err?.message || "Unable to save lead");
    }
  };

  const isLoading = create.isPending || update.isPending;

  return (
    <AppForm
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
      onCancel={() => navigate("/leads")}
      submitLabel={isEdit ? "Update Lead" : "Create Lead"}
      loading={isLoading}
    >
      <FormSection
        title="Company & Contact Information"
        subtitle="Basic organization and contact person details"
      >
        <AppTextField name="companyName" label="Company Name *" />
        <AppTextField name="contactPerson" label="Contact Person *" />
        <AppTextField name="email" label="Email Address *" />
        <AppTextField name="phone" label="Phone Number *" />
      </FormSection>

      <FormSection
        title="Opportunity Details"
        subtitle="Lead qualification, source attribution, and pipeline value"
      >
        <AppSelectField name="source" label="Lead Source" options={sourceOptions} />
        {isEdit && <AppSelectField name="status" label="Pipeline Status" options={statusOptions} />}
        <AppCurrencyField name="estimatedValue" label="Estimated Deal Value" currency="₹" />
        <AppDateField name="nextFollowUpDate" label="Next Follow-Up Date" />
        <Box className="full-width">
          <AppTextAreaField
            name="requirements"
            label="Client Requirements & Project Scope"
          />
        </Box>
      </FormSection>
    </AppForm>
  );
}
