import FormControlLabel from "@mui/material/FormControlLabel";
import Switch, { type SwitchProps } from "@mui/material/Switch";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export interface AppSwitchFieldProps extends SwitchProps {
  label: string;
  description?: string;
}

export function AppSwitchField({
  label,
  description,
  disabled,
  sx,
  ...props
}: AppSwitchFieldProps) {
  return (
    <FormControlLabel
      control={<Switch color="primary" disabled={disabled} {...props} />}
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
