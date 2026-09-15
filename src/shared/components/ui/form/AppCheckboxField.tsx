import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox, { type CheckboxProps } from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export interface AppCheckboxFieldProps extends CheckboxProps {
  label: string;
  description?: string;
}

export function AppCheckboxField({
  label,
  description,
  disabled,
  sx,
  ...props
}: AppCheckboxFieldProps) {
  return (
    <FormControlLabel
      control={<Checkbox color="primary" disabled={disabled} {...props} />}
      label={
        <Box>
          <Typography variant="body2" fontWeight={500} color={disabled ? "text.disabled" : "text.primary"}>
            {label}
          </Typography>
          {description && (
            <Typography variant="caption" color="text.secondary" display="block">
              {description}
            </Typography>
          )}
        </Box>
      }
      sx={{ m: 0, ...sx }}
    />
  );
}
