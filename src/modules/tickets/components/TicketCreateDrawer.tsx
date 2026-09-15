import { useForm } from "react-hook-form";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import AddIcon from "@mui/icons-material/Add";
import { AppDrawer } from "@/shared/components/ui/dialog";
import { AppButton } from "@/shared/components/ui/button";
import { AppTextField } from "@/shared/components/ui/form";
import { useCreateTicket } from "../hooks/useTicketMutations";
import { tokens } from "@/theme/tokens";
import type { TicketPriority, TicketCategory } from "../types/ticket.types";

interface TicketCreateFormData {
  title: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  customerName?: string;
}

interface TicketCreateDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function TicketCreateDrawer({ open, onClose }: TicketCreateDrawerProps) {
  const createTicketMutation = useCreateTicket();

  const { register, handleSubmit, reset, watch, setValue } = useForm<TicketCreateFormData>({
    defaultValues: {
      category: "SUPPORT",
      priority: "MEDIUM",
    },
  });

  const selectedCategory = watch("category");
  const selectedPriority = watch("priority");

  const onSubmit = (data: TicketCreateFormData) => {
    createTicketMutation.mutate(
      {
        title: data.title,
        description: data.description,
        category: data.category,
        priority: data.priority,
        status: "OPEN",
        createdBy: "Internal Staff",
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
      title="Create New Support Ticket"
      subtitle="Register an inquiry, technical issue, or customer request"
      width="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Box sx={{ display: "grid", gap: 2.5 }}>
          <Box>
            <Typography variant="caption" fontWeight={600} color={tokens.colors.secondary[700]} sx={{ mb: 0.75, display: "block" }}>
              Ticket Subject / Title *
            </Typography>
            <AppTextField
              placeholder="e.g., Cannot export monthly billing reports to PDF"
              {...register("title", { required: true })}
            />
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" }, gap: 2 }}>
            <Box>
              <Typography variant="caption" fontWeight={600} color={tokens.colors.secondary[700]} sx={{ mb: 0.75, display: "block" }}>
                Category *
              </Typography>
              <FormControl size="small" fullWidth>
                <Select
                  value={selectedCategory}
                  onChange={(e) => setValue("category", e.target.value as TicketCategory)}
                  sx={{ bgcolor: "#ffffff", borderRadius: tokens.borderRadius.sm }}
                >
                  <MenuItem value="SUPPORT">SUPPORT</MenuItem>
                  <MenuItem value="TECHNICAL">TECHNICAL</MenuItem>
                  <MenuItem value="BILLING">BILLING</MenuItem>
                  <MenuItem value="BUG">BUG REPORT</MenuItem>
                  <MenuItem value="FEATURE_REQUEST">FEATURE REQUEST</MenuItem>
                  <MenuItem value="GENERAL_INQUIRY">GENERAL INQUIRY</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box>
              <Typography variant="caption" fontWeight={600} color={tokens.colors.secondary[700]} sx={{ mb: 0.75, display: "block" }}>
                Priority *
              </Typography>
              <FormControl size="small" fullWidth>
                <Select
                  value={selectedPriority}
                  onChange={(e) => setValue("priority", e.target.value as TicketPriority)}
                  sx={{ bgcolor: "#ffffff", borderRadius: tokens.borderRadius.sm }}
                >
                  <MenuItem value="LOW">LOW</MenuItem>
                  <MenuItem value="MEDIUM">MEDIUM</MenuItem>
                  <MenuItem value="HIGH">HIGH</MenuItem>
                  <MenuItem value="CRITICAL">CRITICAL</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          <Box>
            <Typography variant="caption" fontWeight={600} color={tokens.colors.secondary[700]} sx={{ mb: 0.75, display: "block" }}>
              Query Description / Steps *
            </Typography>
            <AppTextField
              multiline
              rows={4}
              placeholder="Provide full description of the issue or inquiry..."
              {...register("description", { required: true })}
            />
          </Box>

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5, mt: 2 }}>
            <AppButton appVariant="ghost" onClick={onClose} disabled={createTicketMutation.isPending}>
              Cancel
            </AppButton>
            <AppButton
              type="submit"
              appVariant="primary"
              startIcon={<AddIcon sx={{ fontSize: 18 }} />}
              loading={createTicketMutation.isPending}
              loadingText="Creating..."
            >
              Create Ticket
            </AppButton>
          </Box>
        </Box>
      </form>
    </AppDrawer>
  );
}
