import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Eye, EyeOff, Lock, Loader2 } from "lucide-react";
import { AppShell, inputCls, primaryBtn } from "@/components/aera";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/lib/language";
import { isBackendConfigured } from "@/lib/auth-service";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Set new password — AERA" },
      {
        name: "description",
        content: "Choose a new password for your AERA account.",
      },
    ],
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const [pw, setPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);
  const { t } = useLanguage();
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.length < 8) {
      toast.error(t("val_password_min"));
      return;
    }
    if (pw !== confirmPw) {
      toast.error(t("val_password_mismatch"));
      return;
    }

    if (!isBackendConfigured()) {
      toast.info(t("auth_backend_awaiting"));
      return;
    }

    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Password updated successfully");
    navigate({ to: "/auth" });
  };

  return (
    <AppShell title={t("reset_password_title")} subtitle={t("reset_password_subtitle")}>
      <form onSubmit={submit} className="space-y-4 rounded-2xl border bg-card p-5 shadow-soft">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-foreground">{t("password_label")}</label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type={showPw ? "text" : "password"}
              autoComplete="new-password"
              placeholder={t("password_placeholder")}
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              className={`${inputCls} pl-10 pr-11`}
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <p className="text-[11px] text-muted-foreground">{t("password_hint")}</p>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-foreground">
            {t("confirm_password_label")}
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type={showPw ? "text" : "password"}
              autoComplete="new-password"
              placeholder={t("confirm_password_placeholder")}
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
              className={`${inputCls} pl-10`}
            />
          </div>
        </div>

        <button disabled={busy} className={primaryBtn}>
          {busy ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Saving…</span>
            </span>
          ) : (
            <span>Update password</span>
          )}
        </button>
      </form>
    </AppShell>
  );
}
