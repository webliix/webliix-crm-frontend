import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { AppButton, AppCard, AppTextField } from "@/shared/components/ui";
import { authService } from "@/modules/auth/services/auth.service";
import { useNotification } from "@/shared/notifications/useNotification";
import { tokens } from "@/theme/tokens";

export default function VerifyEmailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const notification = useNotification();

  const [email, setEmail] = useState((location.state as any)?.email || "");
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);

  const [cooldownSeconds, setCooldownSeconds] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    let timer: any;
    if (cooldownSeconds > 0 && !verified) {
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
  }, [cooldownSeconds, verified]);

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

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      notification.error("Please enter your email address");
      return;
    }
    const fullOtp = otpDigits.join("");
    if (fullOtp.length !== 6) {
      notification.error("Please enter the full 6-digit verification code");
      return;
    }
    setLoading(true);
    try {
      await authService.verifyEmail(email, fullOtp);
      notification.success("Email verified successfully!");
      setVerified(true);
    } catch (err: any) {
      notification.error(err?.message || "Invalid or expired verification code");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend || !email || loading) return;
    setLoading(true);
    try {
      await authService.resendVerificationOtp(email);
      notification.success("New verification code sent to your email!");
      setCooldownSeconds(60);
      setCanResend(false);
    } catch (err: any) {
      notification.error(err?.message || "Failed to resend verification code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 440 }}>
      <AppCard padding="lg" cardVariant="elevated" sx={{ p: { xs: 3, sm: 4.5 } }}>
        {!verified ? (
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
                <EmailOutlinedIcon sx={{ fontSize: 26 }} />
              </Box>
              <Typography variant="h5" fontWeight={700} color={tokens.colors.secondary[900]}>
                Verify Your Email
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Enter the 6-digit verification code sent to your inbox.
              </Typography>
            </Box>

            <form onSubmit={handleVerifyEmail}>
              <Box sx={{ display: "grid", gap: 2.5 }}>
                {!location.state?.email && (
                  <Box>
                    <Typography variant="caption" fontWeight={600} color={tokens.colors.secondary[700]} sx={{ mb: 0.75, display: "block" }}>
                      Email Address
                    </Typography>
                    <AppTextField
                      placeholder="name@company.com"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Box>
                )}

                <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1 }} onPaste={handleOtpPaste}>
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
                  loadingText="Verifying..."
                >
                  Verify Email
                </AppButton>
              </Box>
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
        ) : (
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
              Email Verified!
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
              Your email has been verified. You can now sign in to your Webliix Hub workspace.
            </Typography>

            <AppButton
              onClick={() => navigate("/login")}
              appVariant="primary"
              appSize="lg"
              fullWidth
            >
              Proceed to Sign In
            </AppButton>
          </Box>
        )}
      </AppCard>
    </Box>
  );
}
