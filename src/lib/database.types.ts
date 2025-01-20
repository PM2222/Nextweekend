export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          created_at: string
          updated_at: string
          subscription_tier: string | null
          subscription_status: string | null
          stripe_customer_id: string | null
          subscription_id: string | null
        }
        Insert: {
          id: string
          full_name?: string | null
          created_at?: string
          updated_at?: string
          subscription_tier?: string | null
          subscription_status?: string | null
          stripe_customer_id?: string | null
          subscription_id?: string | null
        }
        Update: {
          id?: string
          full_name?: string | null
          created_at?: string
          updated_at?: string
          subscription_tier?: string | null
          subscription_status?: string | null
          stripe_customer_id?: string | null
          subscription_id?: string | null
        }
      }
    }
  }
}