import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell, inputCls, primaryBtn } from "@/components/aera";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Set new password — AERA" },
      { name: "description", content: "Choose a new password for your AERA account." },
      { property: "og:title", content: "Set new password — AERA" },
      { property: "og:description", content: "Choose a new password for your AERA account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.length < 8) { toast.error("Password must be at least 8 characters"); return; }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Password updated");
    navigate({ to: "/" });
  };

  return (
    <AppShell title="Set a new password" subtitle="Open this page from the link in your reset email.">
      <form onSubmit={submit} className="space-y-3">
        <input type="password" autoComplete="new-password" placeholder="New password" value={pw} onChange={(e) => setPw(e.target.value)} className={inputCls} />
        <button disabled={busy} className={primaryBtn}>{busy ? "Saving…" : "Update password"}</button>
      </form>
    </AppShell>
  );
}
