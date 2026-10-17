import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { DEMO_USER, isDemoModeActive, setDemoModeActive, resetDemoState } from "./demo-mode";

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isDemo: boolean;
  enterDemoMode: () => void;
  exitDemoMode: () => void;
  resetDemo: () => void;
}

const AuthContext = createContext<AuthState>({
  user: null,
  session: null,
  loading: true,
  isDemo: false,
  enterDemoMode: () => {},
  exitDemoMode: () => {},
  resetDemo: () => {},
});

export function AuthProvider({
  children,
  onChange,
}: {
  children: ReactNode;
  onChange?: () => void;
}) {
  const [realUser, setRealUser] = useState<User | null>(null);
  const [realSession, setRealSession] = useState<Session | null>(null);
  const [isDemoActive, setIsDemoActive] = useState<boolean>(() => isDemoModeActive());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      setRealUser(session?.user ?? null);
      setRealSession(session);
      setLoading(false);
      if (session?.user) {
        // If a real user signs in, deactivate demo mode
        setDemoModeActive(false);
        setIsDemoActive(false);
      }
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
        onChange?.();
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setRealUser(session?.user ?? null);
      setRealSession(session);
      setLoading(false);
    });

    const handleDemoChange = (e: Event) => {
      const custom = e as CustomEvent<{ active: boolean }>;
      setIsDemoActive(custom.detail?.active ?? isDemoModeActive());
      onChange?.();
    };

    if (typeof window !== "undefined") {
      window.addEventListener("aera-demo-mode-change", handleDemoChange);
      window.addEventListener("aera-demo-reset", () => onChange?.());
    }

    return () => {
      data.subscription.unsubscribe();
      if (typeof window !== "undefined") {
        window.removeEventListener("aera-demo-mode-change", handleDemoChange);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const enterDemoMode = useCallback(() => {
    setDemoModeActive(true);
    setIsDemoActive(true);
    onChange?.();
  }, [onChange]);

  const exitDemoMode = useCallback(() => {
    setDemoModeActive(false);
    setIsDemoActive(false);
    onChange?.();
  }, [onChange]);

  const resetDemo = useCallback(() => {
    resetDemoState();
    onChange?.();
  }, [onChange]);

  // If real user is logged in, prioritize real user; otherwise check demo mode
  const effectiveUser = realUser || (isDemoActive ? DEMO_USER : null);
  const effectiveIsDemo = !realUser && isDemoActive;

  return (
    <AuthContext.Provider
      value={{
        user: effectiveUser,
        session: realSession,
        loading,
        isDemo: effectiveIsDemo,
        enterDemoMode,
        exitDemoMode,
        resetDemo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
