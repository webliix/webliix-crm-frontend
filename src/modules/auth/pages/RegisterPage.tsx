import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { AppButton, AppCard, AppTextField } from "@/shared/components/ui";
import { authService } from "@/modules/auth/services/auth.service";
import { useNotification } from "@/shared/notifications/useNotification";
import { tokens } from "@/theme/tokens";

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const notification = useNotification();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState } = useForm<RegisterFormData>();

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    try {
      await authService.register(data);
      notification.success("Account created! Verification code sent to your email.");
      navigate("/verify-email", { state: { email: data.email } });
    } catch (err: any) {
      notification.error(err?.message || "Registration failed. Please check your information.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 460 }}>
      <AppCard padding="lg" cardVariant="elevated" sx={{ p: { xs: 3, sm: 4.5 } }}>
        <Box sx={{ textAlign: "center", mb: 3.5 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: tokens.borderRadius.md,
              backgroundColor: tokens.colors.primary.main,
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: "1.5rem",
              mx: "auto",
              mb: 2,
              boxShadow: `0 4px 12px ${tokens.colors.primary[300]}`,
            }}
          >
            W
          </Box>
          <Typography variant="h5" fontWeight={700} color={tokens.colors.secondary[900]} sx={{ letterSpacing: "-0.015em" }}>
            Create Your Account
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Join Webliix Hub CRM & ERP Platform
          </Typography>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Box sx={{ display: "grid", gap: 2 }}>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
              <Box>
                <Typography variant="caption" fontWeight={600} color={tokens.colors.secondary[700]} sx={{ mb: 0.75, display: "block" }}>
                  First Name
                </Typography>
                <AppTextField
                  placeholder="John"
                  {...register("firstName", { required: "First name is required" })}
                  error={!!formState.errors.firstName}
                  helperText={formState.errors.firstName?.message as any}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonOutlinedIcon sx={{ fontSize: 18, color: tokens.colors.secondary[400] }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <Box>
                <Typography variant="caption" fontWeight={600} color={tokens.colors.secondary[700]} sx={{ mb: 0.75, display: "block" }}>
                  Last Name
                </Typography>
                <AppTextField
                  placeholder="Doe"
                  {...register("lastName", { required: "Last name is required" })}
                  error={!!formState.errors.lastName}
                  helperText={formState.errors.lastName?.message as any}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonOutlinedIcon sx={{ fontSize: 18, color: tokens.colors.secondary[400] }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </Box>

            <Box>
              <Typography variant="caption" fontWeight={600} color={tokens.colors.secondary[700]} sx={{ mb: 0.75, display: "block" }}>
                Work Email Address
              </Typography>
              <AppTextField
                placeholder="name@company.com"
                type="email"
                {...register("email", { required: "Email is required" })}
                error={!!formState.errors.email}
                helperText={formState.errors.email?.message as any}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlinedIcon sx={{ fontSize: 18, color: tokens.colors.secondary[400] }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Box>
              <Typography variant="caption" fontWeight={600} color={tokens.colors.secondary[700]} sx={{ mb: 0.75, display: "block" }}>
                Phone Number (Optional)
              </Typography>
              <AppTextField
                placeholder="+1 (555) 000-0000"
                type="tel"
                {...register("phone")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneOutlinedIcon sx={{ fontSize: 18, color: tokens.colors.secondary[400] }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Box>
              <Typography variant="caption" fontWeight={600} color={tokens.colors.secondary[700]} sx={{ mb: 0.75, display: "block" }}>
                Password
              </Typography>
              <AppTextField
                placeholder="••••••••"
                type={showPassword ? "text" : "password"}
                {...register("password", { required: "Password is required", minLength: { value: 6, message: "Min 6 characters" } })}
                error={!!formState.errors.password}
                helperText={formState.errors.password?.message as any}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon sx={{ fontSize: 18, color: tokens.colors.secondary[400] }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? (
                          <VisibilityOffOutlinedIcon sx={{ fontSize: 18, color: tokens.colors.secondary[400] }} />
                        ) : (
                          <VisibilityOutlinedIcon sx={{ fontSize: 18, color: tokens.colors.secondary[400] }} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <AppButton
              type="submit"
              appVariant="primary"
              appSize="lg"
              fullWidth
              loading={loading}
              loadingText="Creating Account..."
              sx={{ mt: 1 }}
            >
              Register Account
            </AppButton>
          </Box>
        </form>

        <Box sx={{ textAlign: "center", mt: 3, pt: 2, borderTop: `1px solid ${tokens.colors.secondary[100]}` }}>
          <Typography variant="caption" color="text.secondary">
            Already have an account?{" "}
            <Typography
              component={Link}
              to="/login"
              variant="caption"
              fontWeight={700}
              color={tokens.colors.primary.main}
              sx={{ textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
            >
              Sign In
            </Typography>
          </Typography>
        </Box>
      </AppCard>
    </Box>
  );
}
