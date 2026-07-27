import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Retrieve credentials from Vite env or localStorage override
const getSupabaseConfig = () => {
  const metaEnv = (import.meta as any).env || {};
  const envUrl = metaEnv.VITE_SUPABASE_URL || '';
  const envKey = metaEnv.VITE_SUPABASE_ANON_KEY || '';
  
  const localUrl = localStorage.getItem('parkplatz_supabase_url') || envUrl;
  const localKey = localStorage.getItem('parkplatz_supabase_key') || envKey;

  return { url: localUrl, key: localKey };
};

export const config = getSupabaseConfig();

let supabaseInstance: SupabaseClient | null = null;

if (config.url && config.key && config.url.startsWith('https://')) {
  try {
    supabaseInstance = createClient(config.url, config.key);
  } catch (err) {
    console.warn('Failed to initialize Supabase client:', err);
  }
}

export const supabase = supabaseInstance;

export const isSupabaseConfigured = (): boolean => {
  const cfg = getSupabaseConfig();
  return Boolean(cfg.url && cfg.key && cfg.url.startsWith('https://'));
};

export const saveSupabaseConfig = (url: string, key: string) => {
  localStorage.setItem('parkplatz_supabase_url', url);
  localStorage.setItem('parkplatz_supabase_key', key);
  window.location.reload();
};

export const clearSupabaseConfig = () => {
  localStorage.removeItem('parkplatz_supabase_url');
  localStorage.removeItem('parkplatz_supabase_key');
  window.location.reload();
};
