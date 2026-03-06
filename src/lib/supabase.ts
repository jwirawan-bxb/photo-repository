import { createClient } from '@supabase/supabase-js'

// Read Supabase credentials from .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validate that credentials are present
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase credentials! Make sure your .env file contains VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY'
  )
}

// Create and export Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
