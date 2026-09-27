import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Navigate, Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { loginSchema, type LoginFormData } from "@/modules/auth/validations/login.schema";
import { AppButton, AppCard, AppTextField } from "@/shared/components/ui";
import { useLogin } from "@/modules/auth/hooks/useLogin";
import { useAppSelector } from "@/app/store/redux";
import { selectAuth } from "@/modules/auth/store/selectors";
import { tokens } from "@/theme/tokens";

export default function LoginPage() {
  const { accessToken, authenticated } = useAppSelector(selectAuth);
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const { mutate, status } = useLogin();
  const isLoading = status === "pending";

  if (accessToken && authenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = (data: LoginFormData) => {
    mutate(data);
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 440 }}>
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
            Welcome Back
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Sign in to access your Webliix CRM & ERP hub
          </Typography>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Box sx={{ display: "grid", gap: 2.5 }}>
            <Box>
              <Typography variant="caption" fontWeight={600} color={tokens.colors.secondary[700]} sx={{ mb: 0.75, display: "block" }}>
                Email Address
              </Typography>
              <AppTextField
                placeholder="name@company.com"
                type="email"
                {...register("email")}
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
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.75 }}>
                <Typography variant="caption" fontWeight={600} color={tokens.colors.secondary[700]}>
                  Password
                </Typography>
                <Typography
                  component={Link}
                  to="/forgot-password"
                  variant="caption"
                  fontWeight={600}
                  color={tokens.colors.primary.main}
                  sx={{ textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
                >
                  Forgot Password?
                </Typography>
              </Box>
              <AppTextField
                placeholder="••••••••"
                type={showPassword ? "text" : "password"}
                {...register("password")}
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
                      <IconButton
                        size="small"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        aria-label="toggle password visibility"
                      >
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
              loading={isLoading}
              loadingText="Authenticating..."
              sx={{ mt: 1 }}
            >
              Sign In to Hub
            </AppButton>
          </Box>
        </form>

        <Box sx={{ textAlign: "center", mt: 3, pt: 2, borderTop: `1px solid ${tokens.colors.secondary[100]}` }}>
          <Typography variant="caption" color="text.secondary">
            Don&apos;t have an account?{" "}
            <Typography
              component={Link}
              to="/register"
              variant="caption"
              fontWeight={700}
              color={tokens.colors.primary.main}
              sx={{ textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
            >
              Create Account
            </Typography>
          </Typography>
        </Box>
      </AppCard>
    </Box>
  );
}
