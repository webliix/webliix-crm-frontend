import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import LinearProgress from "@mui/material/LinearProgress";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import KeyOutlinedIcon from "@mui/icons-material/KeyOutlined";
import { AppButton, AppCard, AppTextField } from "@/shared/components/ui";
import { authService } from "@/modules/auth/services/auth.service";
import { useNotification } from "@/shared/notifications/useNotification";
import { tokens } from "@/theme/tokens";

type Step = "EMAIL" | "OTP" | "NEW_PASSWORD" | "SUCCESS";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const notification = useNotification();

  const [step, setStep] = useState<Step>("EMAIL");
  const [email, setEmail] = useState("");
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  // Countdown timer for OTP resend (60s)
  const [cooldownSeconds, setCooldownSeconds] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    let timer: any;
    if (step === "OTP" && cooldownSeconds > 0) {
      setCanResend(false);
      timer = setInterval(() => {
        setCooldownSeconds((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, cooldownSeconds]);

  // Stage 1: Send Forgot Password Request
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      notification.error("Please enter a valid email address");
      return;
    }
    setLoading(true);
    try {
      const res = await authService.forgotPassword(email);
      notification.success(typeof res === "string" ? res : "Verification code sent to your email");
      setStep("OTP");
      setCooldownSeconds(60);
    } catch (err: any) {
      notification.error(err?.message || "Failed to send verification code");
    } finally {
      setLoading(false);
    }
  };

  // Stage 2: Resend OTP
  const handleResendOtp = async () => {
    if (!canResend || loading) return;
    setLoading(true);
    try {
      const res = await authService.forgotPassword(email);
      notification.success(typeof res === "string" ? res : "New verification code sent");
      setCooldownSeconds(60);
      setCanResend(false);
    } catch (err: any) {
      notification.error(err?.message || "Failed to resend verification code");
    } finally {
      setLoading(false);
    }
  };

  // OTP Input Handlers (Auto-focus, Paste)
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1);
    setOtpDigits(newDigits);

    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pastedData) return;
    const newDigits = ["", "", "", "", "", ""];
    for (let i = 0; i < pastedData.length; i++) {
      newDigits[i] = pastedData[i];
    }
    setOtpDigits(newDigits);
    const nextIndex = Math.min(pastedData.length, 5);
    otpInputRefs.current[nextIndex]?.focus();
  };

  // Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otpDigits.join("");
    if (fullOtp.length !== 6) {
      notification.error("Please enter the full 6-digit verification code");
      return;
    }
    setLoading(true);
    try {
      const res = await authService.verifyResetOtp(email, fullOtp);
      notification.success("Code verified successfully!");
      setResetToken(res.resetToken);
      setStep("NEW_PASSWORD");
    } catch (err: any) {
      notification.error(err?.message || "Invalid or expired verification code");
    } finally {
      setLoading(false);
    }
  };

  // Stage 3: Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      notification.error("Password must be at least 6 characters long");
      return;
    }
    if (newPassword !== confirmPassword) {
      notification.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await authService.resetPassword({
        email,
        resetToken,
        newPassword,
      });
      notification.success("Password reset successfully!");
      setStep("SUCCESS");
    } catch (err: any) {
      notification.error(err?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  // Password Strength Calculation
  const getPasswordStrength = () => {
    if (!newPassword) return { score: 0, label: "None", color: tokens.colors.secondary[300] };
    let score = 0;
    if (newPassword.length >= 6) score += 1;
    if (newPassword.length >= 10) score += 1;
    if (/[A-Z]/.test(newPassword) && /[0-9]/.test(newPassword)) score += 1;
    if (/[^A-Za-z0-9]/.test(newPassword)) score += 1;

    if (score <= 1) return { score: 25, label: "Weak", color: tokens.colors.error.main };
    if (score === 2) return { score: 50, label: "Fair", color: tokens.colors.warning.main };
    if (score === 3) return { score: 75, label: "Good", color: tokens.colors.info.main };
    return { score: 100, label: "Strong", color: tokens.colors.success.main };
  };

  const strength = getPasswordStrength();

  return (
    <Box sx={{ width: "100%", maxWidth: 440 }}>
      <AppCard padding="lg" cardVariant="elevated" sx={{ p: { xs: 3, sm: 4.5 } }}>
        {/* Step 1: EMAIL */}
        {step === "EMAIL" && (
          <>
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
                  mx: "auto",
                  mb: 2,
                  boxShadow: `0 4px 12px ${tokens.colors.primary[300]}`,
                }}
              >
                <KeyOutlinedIcon sx={{ fontSize: 26 }} />
              </Box>
              <Typography variant="h5" fontWeight={700} color={tokens.colors.secondary[900]}>
                Forgot Password?
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Enter your registered email address and we&apos;ll send you a 6-digit verification code.
              </Typography>
            </Box>

            <form onSubmit={handleSendOtp} noValidate>
              <Box sx={{ display: "grid", gap: 2.5 }}>
                <Box>
                  <Typography variant="caption" fontWeight={600} color={tokens.colors.secondary[700]} sx={{ mb: 0.75, display: "block" }}>
                    Email Address
                  </Typography>
                  <AppTextField
                    placeholder="name@company.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailOutlinedIcon sx={{ fontSize: 18, color: tokens.colors.secondary[400] }} />
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
                  loadingText="Sending Code..."
                >
                  Send Verification Code
                </AppButton>
              </Box>
            </form>

            <Box sx={{ textAlign: "center", mt: 3, pt: 2, borderTop: `1px solid ${tokens.colors.secondary[100]}` }}>
              <Typography
                component={Link}
                to="/login"
                variant="caption"
                fontWeight={600}
                color={tokens.colors.secondary[700]}
                sx={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 0.5, "&:hover": { color: tokens.colors.primary.main } }}
              >
                <ArrowBackIcon sx={{ fontSize: 16 }} /> Back to Sign In
              </Typography>
            </Box>
          </>
        )}

        {/* Step 2: OTP */}
        {step === "OTP" && (
          <>
            <Box sx={{ textAlign: "center", mb: 3.5 }}>
              <Typography variant="h5" fontWeight={700} color={tokens.colors.secondary[900]}>
                Verify Code
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Enter the 6-digit verification code sent to <strong>{email}</strong>
              </Typography>
            </Box>

            <form onSubmit={handleVerifyOtp}>
              <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1, mb: 3 }} onPaste={handleOtpPaste}>
                {otpDigits.map((digit, idx) => (
                  <Box
                    key={idx}
                    component="input"
                    ref={(el: HTMLInputElement | null) => { otpInputRefs.current[idx] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleOtpKeyDown(idx, e)}
                    sx={{
                      width: 46,
                      height: 52,
                      fontSize: "1.25rem",
                      fontWeight: 700,
                      textAlign: "center",
                      borderRadius: tokens.borderRadius.md,
                      border: `1.5px solid ${digit ? tokens.colors.primary.main : tokens.colors.secondary[300]}`,
                      backgroundColor: digit ? tokens.colors.primary[50] : "#ffffff",
                      outline: "none",
                      transition: "all 0.2s ease-in-out",
                      "&:focus": {
                        borderColor: tokens.colors.primary.main,
                        boxShadow: `0 0 0 3px ${tokens.colors.primary[100]}`,
                      },
                    }}
                  />
                ))}
              </Box>

              <AppButton
                type="submit"
                appVariant="primary"
                appSize="lg"
                fullWidth
                loading={loading}
                loadingText="Verifying Code..."
              >
                Verify Code
              </AppButton>
            </form>

            <Box sx={{ textAlign: "center", mt: 3, pt: 2, borderTop: `1px solid ${tokens.colors.secondary[100]}` }}>
              <Typography variant="caption" color="text.secondary">
                Didn&apos;t receive code?{" "}
                <Typography
                  component="button"
                  type="button"
                  onClick={handleResendOtp}
                  disabled={!canResend || loading}
                  variant="caption"
                  fontWeight={700}
                  color={canResend ? tokens.colors.primary.main : tokens.colors.secondary[400]}
                  sx={{
                    background: "none",
                    border: "none",
                    cursor: canResend ? "pointer" : "default",
                    p: 0,
                    textDecoration: canResend ? "underline" : "none",
                  }}
                >
                  {canResend ? "Resend Code" : `Resend in ${cooldownSeconds}s`}
                </Typography>
              </Typography>
            </Box>
          </>
        )}

        {/* Step 3: NEW_PASSWORD */}
        {step === "NEW_PASSWORD" && (
          <>
            <Box sx={{ textAlign: "center", mb: 3.5 }}>
              <Typography variant="h5" fontWeight={700} color={tokens.colors.secondary[900]}>
                Reset Password
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Enter your new password below.
              </Typography>
            </Box>

            <form onSubmit={handleResetPassword}>
              <Box sx={{ display: "grid", gap: 2.5 }}>
                <Box>
                  <Typography variant="caption" fontWeight={600} color={tokens.colors.secondary[700]} sx={{ mb: 0.75, display: "block" }}>
                    New Password
                  </Typography>
                  <AppTextField
                    placeholder="••••••••"
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
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
                  {newPassword && (
                    <Box sx={{ mt: 1 }}>
                      <Box sx={{ display: "flex", justifyBetween: "space-between", alignItems: "center", mb: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">
                          Password strength: <strong>{strength.label}</strong>
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={strength.score}
                        sx={{
                          height: 4,
                          borderRadius: 2,
                          backgroundColor: tokens.colors.secondary[200],
                          "& .MuiLinearProgress-bar": { backgroundColor: strength.color },
                        }}
                      />
                    </Box>
                  )}
                </Box>

                <Box>
                  <Typography variant="caption" fontWeight={600} color={tokens.colors.secondary[700]} sx={{ mb: 0.75, display: "block" }}>
                    Confirm New Password
                  </Typography>
                  <AppTextField
                    placeholder="••••••••"
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOutlinedIcon sx={{ fontSize: 18, color: tokens.colors.secondary[400] }} />
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
                  loadingText="Resetting Password..."
                >
                  Reset Password
                </AppButton>
              </Box>
            </form>
          </>
        )}

        {/* Step 4: SUCCESS */}
        {step === "SUCCESS" && (
          <Box sx={{ textAlign: "center", py: 2 }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                backgroundColor: tokens.colors.success.light || "#dcfce7",
                color: tokens.colors.success.main,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 2.5,
              }}
            >
              <CheckCircleOutlineIcon sx={{ fontSize: 40 }} />
            </Box>

            <Typography variant="h5" fontWeight={700} color={tokens.colors.secondary[900]}>
              Password Reset!
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
              Your password has been successfully reset. You can now log in using your new credentials.
            </Typography>

            <AppButton
              onClick={() => navigate("/login")}
              appVariant="primary"
              appSize="lg"
              fullWidth
            >
              Back to Sign In
            </AppButton>
          </Box>
        )}
      </AppCard>
    </Box>
  );
}
