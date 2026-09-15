import { TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

interface Props {
  name: string;
  label?: string;
}

export function AppDateField({ name, label }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <TextField
          fullWidth
          type="date"
          InputLabelProps={{ shrink: true }}
          label={label}
          {...field}
          error={!!fieldState.error}
          helperText={fieldState.error?.message}
        />
      )}
    />
  );
}
