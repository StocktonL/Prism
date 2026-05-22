import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? 'https://jkqnqdmejclartbrknyt.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprcW5xZG1lamNsYXJ0YnJrbnlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwNTk5MTgsImV4cCI6MjA5NDYzNTkxOH0.9UZ5Nkw101Za38oyqatwY2fsgaKeOllmJKNbNTxWwXM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})
