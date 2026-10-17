import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import {
  Eye,
  EyeOff,
  Globe,
  Loader2,
  Lock,
  Mail,
  User as UserIcon,
  ArrowLeft,
  Compass,
  KeyRound,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "@/lib/language";
import { useAuth } from "@/lib/auth";
import { signInWithEmail, signUpWithEmail, requestPasswordReset } from "@/lib/auth-service";
import { AeraLogo } from "@/components/AeraLogo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — AERA" },
      {
        name: "description",
        content: "Sign in or create an AERA account to save places and submit community reports.",
      },
    ],
  }),
  component: AuthPage,
});

type AuthMode = "signin" | "signup" | "forgot";

function AuthPage() {
  const { user } = useAuth();
  const { t, currentOption, resetLanguageSelection } = useLanguage();
  const navigate = useNavigate();

  const [mode, setMode] = useState<AuthMode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [statusNotice, setStatusNotice] = useState<{
    type: "info" | "warning" | "success" | "error";
    message: string;
  } | null>(null);

  // Field errors
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate({ to: "/", replace: true });
    }
  }, [user, navigate]);

  // Client validation
  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    const emailSchema = z.string().trim().email(t("val_email_invalid"));
    const emailResult = emailSchema.safeParse(email);
    if (!email) {
      errors.email = t("val_email_required");
    } else if (!emailResult.success) {
      errors.email = emailResult.error.issues[0]?.message ?? t("val_email_invalid");
    }

    if (mode === "signup") {
      if (!name.trim()) {
        errors.name = t("val_name_required");
      }
    }

    if (mode !== "forgot") {
      if (!password) {
        errors.password = t("val_password_required");
      } else if (password.length < 8) {
        errors.password = t("val_password_min");
      }
    }

    if (mode === "signup") {
      if (password !== confirmPassword) {
        errors.confirmPassword = t("val_password_mismatch");
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusNotice(null);

    if (!validate()) {
      return;
    }

    setBusy(true);

    try {
      if (mode === "signin") {
        const result = await signInWithEmail(email, password);
        if (result.success) {
          toast.success(t("sign_in_title") + " successful");
          navigate({ to: "/" });
        } else if (result.awaitingBackend) {
          setStatusNotice({
            type: "warning",
            message: t("auth_backend_awaiting"),
          });
          toast.info("Input validated. Supabase backend awaiting configuration.");
        } else {
          toast.error(result.error ?? "Sign in failed");
          setStatusNotice({
            type: "error",
            message: result.error ?? "Invalid credentials",
          });
        }
      } else if (mode === "signup") {
        const result = await signUpWithEmail(name, email, password);
        if (result.success) {
          toast.success(result.message ?? t("create_account_title"));
          setStatusNotice({
            type: "success",
            message: result.message ?? "Registration initiated.",
          });
        } else if (result.awaitingBackend) {
          setStatusNotice({
            type: "warning",
            message: t("auth_backend_awaiting"),
          });
          toast.info("Validation passed. Backend will connect in the next phase.");
        } else {
          toast.error(result.error ?? "Account creation failed");
          setStatusNotice({
            type: "error",
            message: result.error ?? "Account creation failed",
          });
        }
      } else {
        const result = await requestPasswordReset(email);
        if (result.success) {
          toast.success(t("reset_instructions_sent"));
          setStatusNotice({
            type: "success",
            message: t("reset_instructions_sent"),
          });
        } else if (result.awaitingBackend) {
          setStatusNotice({
            type: "warning",
            message: t("auth_backend_awaiting"),
          });
          toast.info("Validation passed. Reset dispatch awaiting Supabase configuration.");
        } else {
          toast.error(result.error ?? "Reset failed");
          setStatusNotice({
            type: "error",
            message: result.error ?? "Reset failed",
          });
        }
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setBusy(false);
    }
  };

  const handleReturnToLanguage = () => {
    resetLanguageSelection();
    navigate({ to: "/" });
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-between px-5 py-6">
      <main className="space-y-6">
        {/* Top bar with Language Selector option */}
        <div className="flex items-center justify-between border-b border-border/70 pb-3">
          <button
            type="button"
            onClick={handleReturnToLanguage}
            className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary/10"
            title={t("change_language")}
          >
            <Globe className="h-3.5 w-3.5" />
            <span>{currentOption.label}</span>
            <span className="text-[10px] underline font-normal">({t("change_language")})</span>
          </button>

          <Link
            to="/"
            className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            <Compass className="h-3.5 w-3.5" />
            <span>{t("continue_as_guest")}</span>
          </Link>
        </div>

        {/* Brand Header */}
        <header className="pt-2 text-center">
          <Link to="/" className="inline-flex flex-col items-center">
            <AeraLogo size="lg" variant="badge" className="mx-auto mb-2 shadow-xs" />
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-primary">
              AERA
            </h1>
          </Link>
          <p className="mt-1 font-display text-sm font-medium text-foreground/85">{t("tagline")}</p>
          <p className="mt-2 text-xs text-muted-foreground px-4">{t("browse_freely_note")}</p>
        </header>

        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-2 gap-1 rounded-xl bg-muted/60 p-1">
          <button
            type="button"
            onClick={() => {
              setMode("signin");
              setStatusNotice(null);
              setFieldErrors({});
            }}
            className={cn(
              "h-10 rounded-lg text-sm font-semibold transition-all",
              mode === "signin"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t("sign_in_title")}
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setStatusNotice(null);
              setFieldErrors({});
            }}
            className={cn(
              "h-10 rounded-lg text-sm font-semibold transition-all",
              mode === "signup"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t("create_account_title")}
          </button>
        </div>

        {/* Form Container */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border bg-card p-5 shadow-soft"
        >
          <div>
            <h2 className="text-lg font-bold text-foreground">
              {mode === "signin"
                ? t("sign_in_title")
                : mode === "signup"
                  ? t("create_account_title")
                  : t("reset_password_title")}
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {mode === "signin"
                ? t("browse_freely_note")
                : mode === "signup"
                  ? t("create_account_subtitle")
                  : t("reset_password_subtitle")}
            </p>
          </div>

          {/* Status / Error feedback */}
          {statusNotice && (
            <div
              className={cn(
                "rounded-xl border p-3 text-xs",
                statusNotice.type === "success" && "border-success/30 bg-success-soft text-success",
                statusNotice.type === "warning" && "border-warning/30 bg-warning-soft text-warning",
                statusNotice.type === "error" &&
                  "border-destructive/30 bg-destructive/10 text-destructive",
                statusNotice.type === "info" && "border-primary/20 bg-primary/5 text-primary",
              )}
            >
              {statusNotice.message}
            </div>
          )}

          {/* Sign Up: Name Field */}
          {mode === "signup" && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">{t("name_label")}</label>
              <div className="relative">
                <UserIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: "" }));
                  }}
                  placeholder={t("name_placeholder")}
                  className={cn(
                    "h-12 w-full rounded-xl border bg-card pl-10 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/20",
                    fieldErrors.name ? "border-destructive" : "border-input",
                  )}
                />
              </div>
              {fieldErrors.name && (
                <p className="text-[11px] font-medium text-destructive">{fieldErrors.name}</p>
              )}
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">{t("email_label")}</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: "" }));
                }}
                placeholder={t("email_placeholder")}
                autoComplete="email"
                className={cn(
                  "h-12 w-full rounded-xl border bg-card pl-10 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/20",
                  fieldErrors.email ? "border-destructive" : "border-input",
                )}
              />
            </div>
            {fieldErrors.email && (
              <p className="text-[11px] font-medium text-destructive">{fieldErrors.email}</p>
            )}
          </div>

          {/* Password Field (for signin & signup) */}
          {mode !== "forgot" && (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground">
                  {t("password_label")}
                </label>
                {mode === "signin" && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode("forgot");
                      setStatusNotice(null);
                      setFieldErrors({});
                    }}
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    {t("forgot_password_link")}
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: "" }));
                  }}
                  placeholder={t("password_placeholder")}
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  className={cn(
                    "h-12 w-full rounded-xl border bg-card pl-10 pr-11 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/20",
                    fieldErrors.password ? "border-destructive" : "border-input",
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? t("hide_password") : t("show_password")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {fieldErrors.password ? (
                <p className="text-[11px] font-medium text-destructive">{fieldErrors.password}</p>
              ) : mode === "signup" ? (
                <p className="text-[11px] text-muted-foreground">{t("password_hint")}</p>
              ) : null}
            </div>
          )}

          {/* Confirm Password Field (for signup) */}
          {mode === "signup" && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">
                {t("confirm_password_label")}
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (fieldErrors.confirmPassword)
                      setFieldErrors((prev) => ({ ...prev, confirmPassword: "" }));
                  }}
                  placeholder={t("confirm_password_placeholder")}
                  autoComplete="new-password"
                  className={cn(
                    "h-12 w-full rounded-xl border bg-card pl-10 pr-11 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/20",
                    fieldErrors.confirmPassword ? "border-destructive" : "border-input",
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? t("hide_password") : t("show_password")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {fieldErrors.confirmPassword && (
                <p className="text-[11px] font-medium text-destructive">
                  {fieldErrors.confirmPassword}
                </p>
              )}
            </div>
          )}

          {/* Primary Action Button */}
          <button
            type="submit"
            disabled={busy}
            className="mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground shadow-sm transition active:scale-[0.99] disabled:opacity-60"
          >
            {busy ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>
                  {mode === "signin"
                    ? t("signing_in")
                    : mode === "signup"
                      ? t("creating_account")
                      : t("sending_reset_link")}
                </span>
              </>
            ) : (
              <span>
                {mode === "signin"
                  ? t("sign_in_button")
                  : mode === "signup"
                    ? t("create_account_button")
                    : t("send_reset_link")}
              </span>
            )}
          </button>

          {/* Mode Switcher Links */}
          {mode === "forgot" ? (
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setMode("signin");
                  setStatusNotice(null);
                  setFieldErrors({});
                }}
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>{t("back_to_sign_in")}</span>
              </button>
            </div>
          ) : (
            <div className="text-center pt-1 text-xs text-muted-foreground">
              {mode === "signin" ? (
                <p>
                  {t("dont_have_account")}{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode("signup");
                      setStatusNotice(null);
                      setFieldErrors({});
                    }}
                    className="font-bold text-primary hover:underline ml-1"
                  >
                    {t("create_account_link")}
                  </button>
                </p>
              ) : (
                <p>
                  {t("already_have_account")}{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode("signin");
                      setStatusNotice(null);
                      setFieldErrors({});
                    }}
                    className="font-bold text-primary hover:underline ml-1"
                  >
                    {t("sign_in_link")}
                  </button>
                </p>
              )}
            </div>
          )}
        </form>

        {/* Try Demo Account Section */}
        {mode === "signin" && (
          <div className="rounded-2xl border border-primary/20 bg-card p-4 text-xs shadow-soft space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-primary">
                <Sparkles className="h-4 w-4" />
                <span>{t("demo_account_title")}</span>
              </div>
              <span className="rounded-md bg-demo px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-demo-foreground">
                Demo
              </span>
            </div>

            <p className="text-muted-foreground leading-relaxed">{t("demo_account_desc")}</p>

            <div className="rounded-xl border border-border/80 bg-muted/40 p-2.5 space-y-1 font-mono text-[11px]">
              <div className="flex justify-between">
                <span className="text-muted-foreground font-sans">Email:</span>
                <span className="font-semibold text-foreground select-all">
                  aera.demo@example.com
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground font-sans">Password:</span>
                <span className="font-semibold text-foreground select-all">AeraDemo@2026</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setEmail("aera.demo@example.com");
                setPassword("AeraDemo@2026");
                setFieldErrors({});
                toast.info("Demo credentials filled. Press Sign In to continue.");
              }}
              className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-primary/40 bg-secondary/60 font-bold text-primary hover:bg-secondary active:scale-[0.99] transition shadow-xs"
            >
              <KeyRound className="h-3.5 w-3.5" />
              <span>{t("fill_demo_creds")}</span>
            </button>

            <p className="text-[10px] text-muted-foreground leading-normal italic">
              Note: These are proposed demo credentials. If this account hasn't been created yet in
              your Supabase Auth dashboard, sign-in will report invalid credentials. You can create
              this account via the Create Account tab.
            </p>
          </div>
        )}
      </main>

      {/* Guest Explorer Fallback Footer */}
      <footer className="mt-8 text-center space-y-2">
        <Link
          to="/"
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-primary/30 bg-card px-4 text-xs font-semibold text-primary shadow-soft hover:bg-secondary"
        >
          <Compass className="h-4 w-4" />
          <span>{t("continue_as_guest")}</span>
        </Link>
        <p className="text-[11px] text-muted-foreground">{t("hero_subtitle")}</p>
      </footer>
    </div>
  );
}
