import { type ReactNode } from "react";
import Box from "@mui/material/Box";
import { FormProvider, useForm, type UseFormReturn } from "react-hook-form";
import { AppButton } from "@/shared/components/ui/button";
import { tokens } from "@/theme/tokens";

interface Props<T extends Record<string, any> = Record<string, any>> {
  children: ReactNode;
  defaultValues?: T;
  onSubmit: (values: T, methods: UseFormReturn<T>) => Promise<void> | void;
  onCancel?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  methods?: UseFormReturn<T>;
}

export function AppForm<T extends Record<string, any> = Record<string, any>>({
  children,
  defaultValues = {} as T,
  onSubmit,
  onCancel,
  submitLabel = "Save Changes",
  cancelLabel = "Cancel",
  loading = false,
  methods: externalMethods,
}: Props<T>) {
  const internalMethods = useForm<T>({ defaultValues: defaultValues as any });
  const methods = externalMethods || internalMethods;

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(async (values) => {
          await onSubmit(values as T, methods);
        })}
        noValidate
      >
        <Box sx={{ display: "grid", gap: 3 }}>{children}</Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 2,
            mt: 4,
            pt: 2,
            borderTop: `1px solid ${tokens.colors.secondary[200]}`,
          }}
        >
          {onCancel && (
            <AppButton
              type="button"
              appVariant="outlined"
              onClick={onCancel}
              disabled={loading}
            >
              {cancelLabel}
            </AppButton>
          )}

          <AppButton
            type="submit"
            appVariant="primary"
            loading={loading}
            loadingText="Saving..."
          >
            {submitLabel}
          </AppButton>
        </Box>
      </form>
    </FormProvider>
  );
}
