import { TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import type { TextFieldProps } from "@mui/material";

interface Props extends Omit<TextFieldProps, "name"> {
  name: string;
  label?: string;
}

export function AppTextField({ name, label, ...rest }: Props) {
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
          {...rest}
        />
      )}
    />
  );
}
