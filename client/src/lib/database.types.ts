export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      practices: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          stripe_customer_id: string | null
          subscription_status: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          stripe_customer_id?: string | null
          subscription_status?: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['practices']['Insert']>
      }
      users: {
        Row: {
          id: string
          practice_id: string
          email: string
          role: string
          created_at: string
        }
        Insert: {
          id: string
          practice_id: string
          email: string
          role?: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['users']['Insert']>
      }
      patients: {
        Row: {
          id: string
          practice_id: string
          first_name: string
          last_name: string
          date_of_birth: string | null
          phone: string | null
          email: string | null
          insurance_carrier: string | null
          member_id: string | null
          group_number: string | null
          last_visit_date: string | null
          contact_lens_wearer: boolean
          last_frame_purchase: string | null
          last_frame_brand: string | null
          last_frame_model: string | null
          last_cl_order: string | null
          last_cl_brand: string | null
          cl_supply_days: number | null
          last_sunglasses_purchase: string | null
          last_sunglasses_brand: string | null
          last_sunglasses_model: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          practice_id: string
          first_name: string
          last_name: string
          date_of_birth?: string | null
          phone?: string | null
          email?: string | null
          insurance_carrier?: string | null
          member_id?: string | null
          group_number?: string | null
          last_visit_date?: string | null
          contact_lens_wearer?: boolean
          last_frame_purchase?: string | null
          last_frame_brand?: string | null
          last_frame_model?: string | null
          last_cl_order?: string | null
          last_cl_brand?: string | null
          cl_supply_days?: number | null
          last_sunglasses_purchase?: string | null
          last_sunglasses_brand?: string | null
          last_sunglasses_model?: string | null
        }
        Update: Partial<Database['public']['Tables']['patients']['Insert']>
      }
      eligibility_checks: {
        Row: {
          id: string
          patient_id: string
          practice_id: string
          frame_allowance: number | null
          cl_allowance: number | null
          exam_copay: number | null
          deductible_met: boolean | null
          expiration_date: string | null
          plan_name: string | null
          checked_at: string
          api_provider: string | null
          raw_response: Json | null
        }
        Insert: {
          id?: string
          patient_id: string
          practice_id: string
          frame_allowance?: number | null
          cl_allowance?: number | null
          exam_copay?: number | null
          deductible_met?: boolean | null
          expiration_date?: string | null
          plan_name?: string | null
          checked_at?: string
          api_provider?: string | null
          raw_response?: Json | null
        }
        Update: Partial<Database['public']['Tables']['eligibility_checks']['Insert']>
      }
      campaigns: {
        Row: {
          id: string
          practice_id: string
          name: string
          type: string
          status: string
          scheduled_at: string | null
          sent_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          practice_id: string
          name: string
          type: string
          status?: string
          scheduled_at?: string | null
          sent_at?: string | null
        }
        Update: Partial<Database['public']['Tables']['campaigns']['Insert']>
      }
      campaign_messages: {
        Row: {
          id: string
          campaign_id: string
          patient_id: string
          practice_id: string
          message_text: string
          channel: string
          status: string
          sent_at: string | null
          delivered_at: string | null
          opened_at: string | null
          responded_at: string | null
          response_text: string | null
        }
        Insert: {
          id?: string
          campaign_id: string
          patient_id: string
          practice_id: string
          message_text: string
          channel: string
          status?: string
          sent_at?: string | null
          delivered_at?: string | null
          opened_at?: string | null
          responded_at?: string | null
          response_text?: string | null
        }
        Update: Partial<Database['public']['Tables']['campaign_messages']['Insert']>
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string | null
          practice_id: string | null
          action: string
          resource_type: string
          resource_id: string | null
          ip_address: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          practice_id?: string | null
          action: string
          resource_type: string
          resource_id?: string | null
          ip_address?: string | null
        }
        Update: Partial<Database['public']['Tables']['audit_logs']['Insert']>
      }
    }
  }
}

// Convenience row types
export type Practice = Database['public']['Tables']['practices']['Row']
export type User = Database['public']['Tables']['users']['Row']
export type Patient = Database['public']['Tables']['patients']['Row']
export type EligibilityCheck = Database['public']['Tables']['eligibility_checks']['Row']
export type Campaign = Database['public']['Tables']['campaigns']['Row']
export type CampaignMessage = Database['public']['Tables']['campaign_messages']['Row']
export type AuditLog = Database['public']['Tables']['audit_logs']['Row']
