import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types
export interface User {
  id: string
  email: string
  name: string
  role: 'student' | 'admin'
  college_id?: string
  created_at: string
}

export interface PrintJob {
  id: string
  user_id: string
  file_name: string
  file_url: string
  file_size: number
  print_options: {
    color: boolean
    copies: number
    paper_size: string
  }
  status: 'pending' | 'processing' | 'ready' | 'completed' | 'failed'
  cost: number
  created_at: string
  completed_at?: string
  user?: User
}
