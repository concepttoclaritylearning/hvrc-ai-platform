import { createClient } from "@supabase/supabase-js";

// Supabase URL & Anon Key from Vite environment or fallback defaults
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://xyzcompany.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

/**
 * Trigger Google OAuth login via Supabase with Google Drive file access scope.
 * This stores user login details in Supabase Auth while requesting Google Drive permission.
 */
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/`,
      scopes: "https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    console.error("Supabase Google Auth Error:", error.message);
    throw error;
  }

  return data;
}

/**
 * Sign out user from Supabase Auth session
 */
export async function signOutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) console.error("Sign out error:", error.message);
}
