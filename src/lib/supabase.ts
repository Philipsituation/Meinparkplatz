import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Deine festen Supabase-Standardwerte
const DEFAULT_URL = 'https://yvwgdhznhhaforfnyjjx.supabase.co';
const DEFAULT_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2d2dkaHpuaGhhZm9yZm55amp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUxODQ0MjcsImV4cCI6MjEwMDc2MDQyN30._mp1jB3SA6olmWPxD9fNOh5GwWwtRICn8G_XSqEAJhQ';

// Retrieve credentials from Vite env, localStorage override, or fall back to defaults
const getSupabaseConfig = () => {
  const metaEnv = (import.meta as any).env || {};
  const envUrl = metaEnv.VITE_SUPABASE_URL || DEFAULT_URL;
  const envKey = metaEnv.VITE_SUPABASE_ANON_KEY || DEFAULT_KEY;
  
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
