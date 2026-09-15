import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import SaveIcon from "@mui/icons-material/Save";
import { AppDrawer } from "@/shared/components/ui/dialog";
import { AppButton } from "@/shared/components/ui/button";
import { AppTextField } from "@/shared/components/ui/form";
import { useUpdateCustomer } from "../hooks/useCustomerMutations";
import { tokens } from "@/theme/tokens";
import type { CustomerResponse, CreateCustomerRequest } from "../types/customer.types";

interface CustomerEditDrawerProps {
  customer: CustomerResponse | null;
  open: boolean;
  onClose: () => void;
}

export function CustomerEditDrawer({ customer, open, onClose }: CustomerEditDrawerProps) {
  const updateMutation = useUpdateCustomer();
  const { register, handleSubmit, reset } = useForm<CreateCustomerRequest>();

  useEffect(() => {
    if (customer) {
      reset({
        companyName: customer.companyName,
        contactPerson: customer.contactPerson,
        email: customer.email,
        phone: customer.phone,
        website: customer.website,
        gstNumber: customer.gstNumber,
        address: customer.address,
        city: customer.city,
        state: customer.state,
        country: customer.country,
        lifetimeValue: customer.lifetimeValue,
        active: customer.active,
      });
    }
  }, [customer, reset]);

  if (!customer || !open) return null;

  const onSubmit = (data: CreateCustomerRequest) => {
    updateMutation.mutate(
      {
        id: customer.id,
        payload: {
          ...data,
          lifetimeValue: data.lifetimeValue ? Number(data.lifetimeValue) : 0,
        },
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <AppDrawer
      open={open}
      onClose={onClose}
      title={`Edit Client: ${customer.companyName}`}
      subtitle="Update company information, billing, and contacts"
      width="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Box sx={{ display: "grid", gap: 2.5 }}>
          <Box>
            <Typography variant="caption" fontWeight={600} color={tokens.colors.secondary[700]} sx={{ mb: 0.5, display: "block" }}>
              Company / Client Name *
            </Typography>
            <AppTextField
              placeholder="e.g., Acme Technologies Pvt Ltd"
              {...register("companyName", { required: true })}
            />
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" }, gap: 2 }}>
            <Box>
              <Typography variant="caption" fontWeight={600} color={tokens.colors.secondary[700]} sx={{ mb: 0.5, display: "block" }}>
                Primary Contact Person
              </Typography>
              <AppTextField placeholder="e.g., Sarah Connor" {...register("contactPerson")} />
            </Box>

            <Box>
              <Typography variant="caption" fontWeight={600} color={tokens.colors.secondary[700]} sx={{ mb: 0.5, display: "block" }}>
                Email Address
              </Typography>
              <AppTextField type="email" placeholder="billing@acme.com" {...register("email")} />
            </Box>

            <Box>
              <Typography variant="caption" fontWeight={600} color={tokens.colors.secondary[700]} sx={{ mb: 0.5, display: "block" }}>
                Phone Number (WhatsApp)
              </Typography>
              <AppTextField placeholder="+91 98765 43210" {...register("phone")} />
            </Box>

            <Box>
              <Typography variant="caption" fontWeight={600} color={tokens.colors.secondary[700]} sx={{ mb: 0.5, display: "block" }}>
                GST / Tax ID
              </Typography>
              <AppTextField placeholder="29AAAAA0000A1Z5" {...register("gstNumber")} />
            </Box>

            <Box>
              <Typography variant="caption" fontWeight={600} color={tokens.colors.secondary[700]} sx={{ mb: 0.5, display: "block" }}>
                Website
              </Typography>
              <AppTextField placeholder="https://acme.com" {...register("website")} />
            </Box>

            <Box>
              <Typography variant="caption" fontWeight={600} color={tokens.colors.secondary[700]} sx={{ mb: 0.5, display: "block" }}>
                Lifetime Value
              </Typography>
              <AppTextField type="number" placeholder="0" {...register("lifetimeValue")} />
            </Box>
          </Box>

          <Box>
            <Typography variant="caption" fontWeight={600} color={tokens.colors.secondary[700]} sx={{ mb: 0.5, display: "block" }}>
              Billing Address
            </Typography>
            <AppTextField placeholder="Street address, Suite / Floor" {...register("address")} />
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" }, gap: 1.5 }}>
            <Box>
              <Typography variant="caption" fontWeight={600} color={tokens.colors.secondary[700]} sx={{ mb: 0.5, display: "block" }}>
                City
              </Typography>
              <AppTextField placeholder="e.g., Bengaluru" {...register("city")} />
            </Box>
            <Box>
              <Typography variant="caption" fontWeight={600} color={tokens.colors.secondary[700]} sx={{ mb: 0.5, display: "block" }}>
                State
              </Typography>
              <AppTextField placeholder="e.g., Karnataka" {...register("state")} />
            </Box>
            <Box>
              <Typography variant="caption" fontWeight={600} color={tokens.colors.secondary[700]} sx={{ mb: 0.5, display: "block" }}>
                Country
              </Typography>
              <AppTextField placeholder="India" {...register("country")} />
            </Box>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5, mt: 2 }}>
            <AppButton appVariant="ghost" onClick={onClose} disabled={updateMutation.isPending}>
              Cancel
            </AppButton>
            <AppButton
              type="submit"
              appVariant="primary"
              startIcon={<SaveIcon sx={{ fontSize: 18 }} />}
              loading={updateMutation.isPending}
              loadingText="Saving..."
            >
              Save Changes
            </AppButton>
          </Box>
        </Box>
      </form>
    </AppDrawer>
  );
}
