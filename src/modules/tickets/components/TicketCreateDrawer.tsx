import { useState, useEffect } from "react";
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
import { useCurrentUser } from "@/modules/auth/hooks/useCurrentUser";
import { http } from "@/shared/services/http";
import { tokens } from "@/theme/tokens";
import type { TicketPriority, TicketCategory } from "../types/ticket.types";

interface ProjectOption {
  id: number;
  projectName: string;
  projectCode?: string;
  customerId?: number;
}

interface TicketCreateFormData {
  title: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  projectId?: number | string;
}

interface TicketCreateDrawerProps {
  open: boolean;
  onClose: () => void;
  defaultProjectId?: number;
  defaultProjectName?: string;
}

export function TicketCreateDrawer({
  open,
  onClose,
  defaultProjectId,
  defaultProjectName,
}: TicketCreateDrawerProps) {
  const createTicketMutation = useCreateTicket();
  const { data: currentUser } = useCurrentUser();
  const [projects, setProjects] = useState<ProjectOption[]>([]);

  const { register, handleSubmit, reset, watch, setValue } = useForm<TicketCreateFormData>({
    defaultValues: {
      category: "SUPPORT",
      priority: "MEDIUM",
      projectId: defaultProjectId || "",
    },
  });

  const selectedCategory = watch("category");
  const selectedPriority = watch("priority");
  const selectedProjectId = watch("projectId");

  useEffect(() => {
    if (open) {
      http
        .get("/api/v1/projects", { params: { size: 100 } })
        .then((res) => {
          const list = res.data?.data?.content ?? res.data?.data ?? [];
          setProjects(list);
        })
        .catch(() => {
          setProjects([]);
        });

      if (defaultProjectId) {
        setValue("projectId", defaultProjectId);
      }
    }
  }, [open, defaultProjectId, setValue]);

  const onSubmit = (data: TicketCreateFormData) => {
    const creatorName =
      currentUser?.firstName || currentUser?.email
        ? `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim() || currentUser.email
        : "Client Portal User";

    const chosenProjectId = data.projectId ? Number(data.projectId) : defaultProjectId;

    createTicketMutation.mutate(
      {
        title: data.title,
        description: data.description,
        category: data.category,
        priority: data.priority,
        status: "OPEN",
        projectId: chosenProjectId,
        createdBy: creatorName,
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
      title="Create Project Support Ticket"
      subtitle={
        defaultProjectName
          ? `Raising ticket for project: ${defaultProjectName}`
          : "Register an issue, technical inquiry, or change request"
      }
      width="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Box sx={{ display: "grid", gap: 2.5 }}>
          {/* Linked Project Selection */}
          <Box>
            <Typography variant="caption" fontWeight={600} color={tokens.colors.secondary[700]} sx={{ mb: 0.75, display: "block" }}>
              Associated Project
            </Typography>
            {defaultProjectId && defaultProjectName ? (
              <AppTextField
                disabled
                value={defaultProjectName}
                helperText="Ticket will automatically link to this project."
              />
            ) : (
              <FormControl size="small" fullWidth>
                <Select
                  value={selectedProjectId || ""}
                  onChange={(e) => setValue("projectId", e.target.value)}
                  displayEmpty
                  sx={{ bgcolor: "#ffffff", borderRadius: tokens.borderRadius.sm }}
                >
                  <MenuItem value="">
                    <em>Select Project (Optional)</em>
                  </MenuItem>
                  {projects.map((p) => (
                    <MenuItem key={p.id} value={p.id}>
                      {p.projectName} {p.projectCode ? `(${p.projectCode})` : ""}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Box>

          <Box>
            <Typography variant="caption" fontWeight={600} color={tokens.colors.secondary[700]} sx={{ mb: 0.75, display: "block" }}>
              Ticket Subject / Issue Summary *
            </Typography>
            <AppTextField
              placeholder="e.g., Auth redirect issue or UI adjustment on checkout"
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
              Detailed Description & Requirements *
            </Typography>
            <AppTextField
              multiline
              rows={4}
              placeholder="Describe the issue in detail, error messages, or requested updates..."
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
              loadingText="Submitting Ticket..."
            >
              Submit Ticket
            </AppButton>
          </Box>
        </Box>
      </form>
    </AppDrawer>
  );
}
