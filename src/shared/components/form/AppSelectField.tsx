import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import type { SelectOption } from "@/shared/types/select-option";

interface Props {
  name: string;
  label?: string;
  options: SelectOption[];
}

export function AppSelectField({ name, label, options }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormControl fullWidth error={!!fieldState.error}>
          <InputLabel id={`${name}-label`}>{label}</InputLabel>
          <Select labelId={`${name}-label`} label={label} {...field}>
            {options.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>{fieldState.error?.message}</FormHelperText>
        </FormControl>
      )}
    />
  );
}
