import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { AppShell, inputCls, primaryBtn } from "@/components/aera";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — AERA" },
      { name: "description", content: "Sign in or create an AERA account to save places and submit reports." },
      { property: "og:title", content: "Sign in — AERA" },
      { property: "og:description", content: "Sign in to save places and submit reports." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

const emailSchema = z.string().trim().email("Enter a valid email");
const pwSchema = z.string().min(8, "Password must be at least 8 characters").max(72);

function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [info, setInfo] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { if (user) navigate({ to: "/", replace: true }); }, [user, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInfo(null);
    const em = emailSchema.safeParse(email);
    if (!em.success) return toast.error(em.error.issues[0].message);
    if (mode !== "forgot") {
      const pw = pwSchema.safeParse(password);
      if (!pw.success) return toast.error(pw.error.issues[0].message);
    }
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email: em.data, password });
        if (error) throw error;
        toast.success("Signed in");
      } else if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({ email: em.data, password, options: { emailRedirectTo: window.location.origin } });
        if (error) throw error;
        if (!data.session) setInfo("Check your email for a confirmation link, then sign in.");
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(em.data, { redirectTo: `${window.location.origin}/reset-password` });
        if (error) throw error;
        setInfo("If an account exists for this email, a reset link has been sent.");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AppShell title={mode === "signup" ? "Create account" : mode === "forgot" ? "Reset password" : "Sign in"} subtitle="Browse freely. Sign in to save places and submit reports.">
      <form onSubmit={submit} className="space-y-3">
        <input type="email" autoComplete="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
        {mode !== "forgot" && (
          <input type="password" autoComplete={mode === "signup" ? "new-password" : "current-password"} placeholder="Password (min 8 characters)" value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} />
        )}
        <button type="submit" disabled={busy} className={primaryBtn}>
          {busy ? "Please wait…" : mode === "signup" ? "Create account" : mode === "forgot" ? "Send reset link" : "Sign in"}
        </button>
        {info && <p className="rounded-xl bg-secondary p-3 text-sm text-secondary-foreground">{info}</p>}
      </form>
      <div className={cn("mt-5 flex flex-col items-center gap-2 text-sm")}>
        {mode !== "signin" && <button onClick={() => setMode("signin")} className="font-semibold text-primary">Have an account? Sign in</button>}
        {mode !== "signup" && <button onClick={() => setMode("signup")} className="font-semibold text-primary">New here? Create an account</button>}
        {mode === "signin" && <button onClick={() => setMode("forgot")} className="text-muted-foreground">Forgot password?</button>}
      </div>
    </AppShell>
  );
}
