import { forwardRef } from "react";
import TextField, { type TextFieldProps } from "@mui/material/TextField";
import { tokens } from "@/theme/tokens";

export type AppTextFieldProps = TextFieldProps & {
  rounded?: boolean;
};

export const AppTextField = forwardRef<HTMLDivElement, AppTextFieldProps>(
  ({ rounded = true, sx, ...props }, ref) => {
    return (
      <TextField
        ref={ref}
        fullWidth
        size="small"
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: rounded ? tokens.borderRadius.sm : 0,
            backgroundColor: "#ffffff",
          },
          ...sx,
        }}
        {...props}
      />
    );
  }
);

AppTextField.displayName = "AppTextField";
