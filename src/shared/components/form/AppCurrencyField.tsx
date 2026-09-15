import { InputAdornment, TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

interface Props {
  name: string;
  label?: string;
  currency?: string;
}

export function AppCurrencyField({ name, label, currency = "INR" }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <TextField
          fullWidth
          label={label}
          {...field}
          error={!!fieldState.error}
          helperText={fieldState.error?.message}
          InputProps={{
            startAdornment: <InputAdornment position="start">{currency}</InputAdornment>,
          }}
        />
      )}
    />
  );
}
