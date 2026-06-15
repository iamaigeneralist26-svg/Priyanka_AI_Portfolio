/* ========================================
   Supabase Configuration
   ======================================== */

// Replace these with your actual Supabase credentials
// Get these from your Supabase project settings:
// - Go to: https://app.supabase.com/project/[project-id]/settings/api
// - Copy your Project URL and anon key

export const SUPABASE_URL = 'https://wrrgykulccllosctaxvz.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indycmd5a3VsY2NsbG9zY3RheHZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyMjk5ODUsImV4cCI6MjA5NjgwNTk4NX0.xoWg4MQiPd_O2H_EvuyLLQus0zpLn6jMcaqRMJa0NE0';

// Lazily initialize Supabase client and avoid throwing during module load.
let _supabaseClient = null;
try {
  if (window && window.supabase && typeof window.supabase.createClient === 'function') {
    try {
      _supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } catch (err) {
      // Don't rethrow; caller will handle a null client and show instructions.
      console.warn('Supabase client not created during load:', err && err.message ? err.message : err);
      _supabaseClient = null;
    }
  } else {
    // Supabase script may not be loaded yet when this module runs.
    _supabaseClient = null;
  }
} catch (e) {
  _supabaseClient = null;
}

export function getSupabaseClient() {
  // If client already created, return it.
  if (_supabaseClient) return _supabaseClient;

  // Try to create it now (in case the supabase script finished loading later)
  if (window && window.supabase && typeof window.supabase.createClient === 'function') {
    try {
      _supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      return _supabaseClient;
    } catch (err) {
      console.warn('Failed to create Supabase client:', err && err.message ? err.message : err);
      return null;
    }
  }

  return null;
}
