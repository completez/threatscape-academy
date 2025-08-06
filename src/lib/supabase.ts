import { createClient } from '@supabase/supabase-js'

// These will be automatically provided by Lovable when Supabase is connected
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Create client only if environment variables are available
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Helper to check if Supabase is available
export const isSupabaseConnected = () => Boolean(supabase)

// Database types
export interface TutorialProgress {
  id: string
  tutorial_id: string
  user_id: string
  progress: number
  completed: boolean
  steps_completed: number[]
  created_at: string
  updated_at: string
}

export interface ChallengeAttempt {
  id: string
  challenge_id: string
  user_id: string
  completed: boolean
  attempts: number
  score: number
  time_taken: number
  flag_found?: string
  created_at: string
  updated_at: string
}

export interface UserActivity {
  id: string
  user_id: string
  activity_type: string
  tool_used?: string
  duration: number
  success: boolean
  details: any
  created_at: string
}