import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('your-project-id') &&
  !supabaseUrl.includes('placeholder')
);

// Browser / Universal Supabase Client
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

// Server-side Admin Client (bypasses RLS for system operations if key is configured)
export const supabaseAdmin: SupabaseClient | null = (isSupabaseConfigured && supabaseServiceKey)
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : supabase;

/**
 * Sign up a new user with email & password
 */
export async function signUpWithEmail(email: string, password: string) {
  if (!supabase) {
    throw new Error('Supabase no está configurado. Agrega NEXT_PUBLIC_SUPABASE_URL en .env.local');
  }
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

/**
 * Sign in existing user with email & password
 */
export async function signInWithEmail(email: string, password: string) {
  if (!supabase) {
    throw new Error('Supabase no está configurado. Agrega NEXT_PUBLIC_SUPABASE_URL en .env.local');
  }
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

/**
 * Sign in via OAuth (Google / GitHub)
 */
export async function signInWithOAuth(provider: 'google' | 'github') {
  if (!supabase) {
    throw new Error('Supabase no está configurado. Agrega NEXT_PUBLIC_SUPABASE_URL en .env.local');
  }
  const redirectUrl = typeof window !== 'undefined' ? window.location.origin : undefined;
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: redirectUrl,
    },
  });
  if (error) throw error;
  return data;
}

/**
 * Sign out current user
 */
export async function signOutUser() {
  if (!supabase) return;
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/**
 * Get current user & session
 */
export async function getCurrentSession(): Promise<{ user: User | null; session: Session | null }> {
  if (!supabase) return { user: null, session: null };
  const { data: { session } } = await supabase.auth.getSession();
  return {
    user: session?.user ?? null,
    session: session ?? null,
  };
}

/**
 * Listen to auth state changes (sign in, sign out, token refresh)
 */
export function onAuthStateChange(callback: (event: string, session: Session | null) => void) {
  if (!supabase) return { unsubscribe: () => {} };
  const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);
  return { unsubscribe: () => subscription.unsubscribe() };
}
