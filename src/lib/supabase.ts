import { createClient } from '@supabase/supabase-js';
import { ParkingListing } from '../types';

// Standard-Zugangsdaten für Meinparkplatz
const DEFAULT_URL = 'https://yvwgdhznhhaforfnyjx.supabase.co';
const DEFAULT_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2d2dkaHpuaGhhZm9yZm55amp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUxODQ0MjcsImV4cCI6MjEwMDc2MDQyN30._mp1jB3SA6olmWPxD9fNOh5GwWwtRICn8G_XSqEAJhQ';

// Konfiguration laden
export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_URL;
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_KEY;

export const isSupabaseConfigured = () => {
  return Boolean(
    supabaseUrl && 
    supabaseAnonKey && 
    supabaseUrl.includes('supabase.co') &&
    supabaseAnonKey.length > 20
  );
};

// Supabase Client Instanz
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export interface AppUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'user' | 'admin' | 'partner';
  created_at?: string;
}

// -------------------------------------------------------------
// AUTHENTIFIZIERUNG
// -------------------------------------------------------------

export async function signUpWithSupabase(email: string, password: string, name: string): Promise<{ user: AppUser | null; error: string | null }> {
  if (!supabase) {
    // Fallback falls Supabase nicht initialisiert ist
    const fallbackUser: AppUser = {
      id: 'local_' + Math.random().toString(36).substr(2, 9),
      email,
      name,
      role: 'user',
      created_at: new Date().toISOString()
    };
    localStorage.setItem('mp_auth_user', JSON.stringify(fallbackUser));
    return { user: fallbackUser, error: null };
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        }
      }
    });

    if (error) {
      return { user: null, error: error.message };
    }

    if (data.user) {
      const appUser: AppUser = {
        id: data.user.id,
        email: data.user.email || email,
        name: data.user.user_metadata?.full_name || name,
        role: 'user',
        created_at: data.user.created_at
      };
      localStorage.setItem('mp_auth_user', JSON.stringify(appUser));
      return { user: appUser, error: null };
    }

    return { user: null, error: 'Registrierung fehlgeschlagen' };
  } catch (err: any) {
    return { user: null, error: err.message || 'Unbekannter Fehler bei der Registrierung' };
  }
}

export async function signInWithSupabase(email: string, password: string): Promise<{ user: AppUser | null; error: string | null }> {
  if (!supabase) {
    const fallbackUser: AppUser = {
      id: 'local_' + Math.random().toString(36).substr(2, 9),
      email,
      name: email.split('@')[0],
      role: 'user',
      created_at: new Date().toISOString()
    };
    localStorage.setItem('mp_auth_user', JSON.stringify(fallbackUser));
    return { user: fallbackUser, error: null };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { user: null, error: error.message };
    }

    if (data.user) {
      const appUser: AppUser = {
        id: data.user.id,
        email: data.user.email || email,
        name: data.user.user_metadata?.full_name || email.split('@')[0],
        role: (data.user.user_metadata?.role as any) || 'user',
        created_at: data.user.created_at
      };
      localStorage.setItem('mp_auth_user', JSON.stringify(appUser));
      return { user: appUser, error: null };
    }

    return { user: null, error: 'Login fehlgeschlagen' };
  } catch (err: any) {
    return { user: null, error: err.message || 'Unbekannter Fehler beim Login' };
  }
}

export async function signOutSupabase(): Promise<void> {
  localStorage.removeItem('mp_auth_user');
  if (supabase) {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Fehler beim Abmelden:', e);
    }
  }
}

export async function getCurrentSupabaseUser(): Promise<AppUser | null> {
  const localSaved = localStorage.getItem('mp_auth_user');
  if (localSaved) {
    try {
      return JSON.parse(localSaved);
    } catch {
      // ignore
    }
  }

  if (!supabase) return null;

  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const appUser: AppUser = {
        id: session.user.id,
        email: session.user.email || '',
        name: session.user.user_metadata?.full_name || (session.user.email ? session.user.email.split('@')[0] : 'Nutzer'),
        role: (session.user.user_metadata?.role as any) || 'user',
        created_at: session.user.created_at
      };
      localStorage.setItem('mp_auth_user', JSON.stringify(appUser));
      return appUser;
    }
  } catch (e) {
    console.warn('Session konnte nicht geladen werden:', e);
  }

  return null;
}

// -------------------------------------------------------------
// INSERATE & DATENBANK
// -------------------------------------------------------------

export async function fetchListingsFromSupabase(): Promise<ParkingListing[]> {
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) {
      return [];
    }

    return data.map((item: any) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      address: item.address,
      city: item.city,
      zipCode: item.zip_code,
      lat: item.lat,
      lng: item.lng,
      type: item.type,
      pricePerHour: item.price_per_hour,
      pricePerDay: item.price_per_day,
      pricePerMonth: item.price_per_month,
      features: item.features || [],
      images: item.images || [],
      isAvailable: item.is_available ?? true,
      availableFrom: item.available_from,
      availableTo: item.available_to,
      ownerId: item.owner_id,
      ownerName: item.owner_name,
      ownerPhone: item.owner_phone,
      ownerEmail: item.owner_email,
      rating: item.rating || 5.0,
      reviewCount: item.review_count || 0,
      createdAt: item.created_at
    }));
  } catch (e) {
    console.error('Fehler beim Abrufen der Inserate:', e);
    return [];
  }
}

export async function saveListingToSupabase(listing: Partial<ParkingListing>): Promise<{ success: boolean; data?: any; error?: string }> {
  if (!supabase) {
    return { success: false, error: 'Keine Supabase-Verbindung vorhanden' };
  }

  try {
    const payload = {
      title: listing.title,
      description: listing.description,
      address: listing.address,
      city: listing.city,
      zip_code: listing.zipCode,
      lat: listing.lat,
      lng: listing.lng,
      type: listing.type,
      price_per_hour: listing.pricePerHour,
      price_per_day: listing.pricePerDay,
      price_per_month: listing.pricePerMonth,
      features: listing.features,
      images: listing.images,
      is_available: listing.isAvailable ?? true,
      owner_id: listing.ownerId,
      owner_name: listing.ownerName,
      owner_phone: listing.ownerPhone,
      owner_email: listing.ownerEmail
    };

    const { data, error } = await supabase
      .from('listings')
      .insert([payload])
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message || 'Fehler beim Speichern' };
  }
}
