import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";

export interface AuthResult {
  success: boolean;
  awaitingBackend?: boolean;
  user?: User | null;
  session?: Session | null;
  message?: string;
  error?: string;
}

/**
 * Checks whether real Supabase authentication credentials are provided.
 * During development before Supabase setup, this returns false so the app
 * never fakes logins or claims unverified authentication works.
 */
export function isBackendConfigured(): boolean {
  const url =
    import.meta.env["VITE_SUPABASE_URL"] ||
    (typeof process !== "undefined" ? process.env?.["SUPABASE_URL"] : undefined);
  const key =
    import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] ||
    (typeof process !== "undefined" ? process.env?.["SUPABASE_PUBLISHABLE_KEY"] : undefined);

  return Boolean(
    url &&
    key &&
    typeof url === "string" &&
    url.startsWith("http") &&
    !url.includes("placeholder") &&
    !url.includes("your-project"),
  );
}

/**
 * Authenticate with email & password.
 * Only calls backend if configured.
 */
export async function signInWithEmail(email: string, password: string): Promise<AuthResult> {
  if (!isBackendConfigured()) {
    return {
      success: false,
      awaitingBackend: true,
      message:
        "Authentication service is ready, but Supabase backend credentials (VITE_SUPABASE_URL & VITE_SUPABASE_PUBLISHABLE_KEY) are awaiting configuration in the next phase.",
    };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, user: data.user, session: data.session };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Sign in failed.",
    };
  }
}

/**
 * Register a new user with full name, email, and password.
 */
export async function signUpWithEmail(
  name: string,
  email: string,
  password: string,
): Promise<AuthResult> {
  if (!isBackendConfigured()) {
    return {
      success: false,
      awaitingBackend: true,
      message:
        "Input validation passed! Registration requires connecting your Supabase project in the next backend integration phase.",
    };
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: name,
        },
      },
    });
    if (error) {
      return { success: false, error: error.message };
    }
    return {
      success: true,
      user: data.user,
      session: data.session,
      message: data.session
        ? "Account created successfully."
        : "Check your email for a confirmation link.",
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Account creation failed.",
    };
  }
}

/**
 * Send password reset email.
 */
export async function requestPasswordReset(email: string): Promise<AuthResult> {
  if (!isBackendConfigured()) {
    return {
      success: false,
      awaitingBackend: true,
      message:
        "Password reset request validated! Live reset emails will dispatch once Supabase email credentials are configured.",
    };
  }

  try {
    const redirectUrl =
      typeof window !== "undefined" ? `${window.location.origin}/reset-password` : undefined;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return {
      success: true,
      message: "If an account exists with this email, instructions have been sent.",
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Reset request failed.",
    };
  }
}

/**
 * Sign out current session.
 */
export async function signOutUser(): Promise<{ error?: string }> {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) return { error: error.message };
    return {};
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Sign out failed." };
  }
}
