import { useForm } from "react-hook-form";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import { AppDrawer } from "@/shared/components/ui/dialog";
import { AppButton } from "@/shared/components/ui/button";
import { AppTextField } from "@/shared/components/ui/form";
import { useCreateCustomer } from "../hooks/useCustomerMutations";
import { tokens } from "@/theme/tokens";
import type { CreateCustomerRequest } from "../types/customer.types";

interface CustomerCreateDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CustomerCreateDrawer({ open, onClose }: CustomerCreateDrawerProps) {
  const createMutation = useCreateCustomer();
  const { register, handleSubmit, reset } = useForm<CreateCustomerRequest>({
    defaultValues: {
      active: true,
      country: "India",
    },
  });

  const onSubmit = (data: CreateCustomerRequest) => {
    createMutation.mutate(
      {
        ...data,
        lifetimeValue: data.lifetimeValue ? Number(data.lifetimeValue) : 0,
      },
      {
        onSuccess: () => {
          reset();
          onClose();
        },
      }
    );
  };

  return (
    <AppDrawer
      open={open}
      onClose={onClose}
      title="Onboard New Client Account"
      subtitle="Register customer details and automatically dispatch account credentials"
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
                Email Address (For Invoices & Notices) *
              </Typography>
              <AppTextField
                type="email"
                placeholder="billing@acme.com"
                {...register("email", { required: true })}
              />
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
                Initial Lifetime Value
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
            <AppButton appVariant="ghost" onClick={onClose} disabled={createMutation.isPending}>
              Cancel
            </AppButton>
            <AppButton
              type="submit"
              appVariant="primary"
              startIcon={<AddIcon sx={{ fontSize: 18 }} />}
              loading={createMutation.isPending}
              loadingText="Creating & Emailing..."
            >
              Onboard Client
            </AppButton>
          </Box>
        </Box>
      </form>
    </AppDrawer>
  );
}
