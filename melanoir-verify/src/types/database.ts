export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      mnr_lots: {
        Row: {
          lot_id: string
          manufactured_at: string
          quantity: number
          qc_result: 'pass' | 'fail'
          qc_document_url: string | null
        }
        Insert: Omit<Database['public']['Tables']['mnr_lots']['Row'], never>
        Update: Partial<Database['public']['Tables']['mnr_lots']['Row']>
      }
      mnr_products: {
        Row: {
          internal_id: number
          serial_token: string
          lot_id: string | null
          product_type: 'main' | 'retouch'
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['mnr_products']['Row'], 'internal_id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['mnr_products']['Row']>
      }
      mnr_practitioners: {
        Row: {
          practitioner_id: string
          name: string
          shop_name: string
          phone: string
          region: string | null
          tier: 'basic' | 'silver' | 'gold' | 'partner'
          tier_updated_at: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['mnr_practitioners']['Row'], 'practitioner_id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['mnr_practitioners']['Row']>
      }
      mnr_shipments: {
        Row: {
          shipment_id: string
          internal_id_from: number | null
          internal_id_to: number | null
          waybill_no: string | null
          carrier: string | null
          shop_name: string | null
          shipped_at: string | null
          delivered_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['mnr_shipments']['Row'], 'shipment_id'>
        Update: Partial<Database['public']['Tables']['mnr_shipments']['Row']>
      }
      mnr_procedures: {
        Row: {
          procedure_id: string
          serial_token: string
          practitioner_id: string | null
          procedure_at: string
          technique: 'hairstroke' | 'combo' | 'machine_gradient'
          customer_phone: string | null
          registered_at: string
        }
        Insert: Omit<Database['public']['Tables']['mnr_procedures']['Row'], 'procedure_id' | 'registered_at'>
        Update: Partial<Database['public']['Tables']['mnr_procedures']['Row']>
      }
      mnr_registrations: {
        Row: {
          reg_id: string
          serial_token: string
          customer_name: string | null
          customer_phone: string | null
          review_text: string | null
          photo_url: string | null
          healing_photo_url: string | null
          credits_issued: boolean
          healing_credits_issued: boolean
          registered_at: string
          healing_registered_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['mnr_registrations']['Row'], 'reg_id' | 'registered_at'>
        Update: Partial<Database['public']['Tables']['mnr_registrations']['Row']>
      }
      // 멜라누아 멤버십 크레딧(customer) + 멜라누아 프로 포인트(practitioner) 통합 원장
      mnr_credits: {
        Row: {
          credit_id: string
          owner_type: 'customer' | 'practitioner' // customer=멤버십 크레딧, practitioner=프로 포인트
          owner_id: string
          amount: number
          type: 'earn' | 'spend'
          reason: string | null
          expires_at: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['mnr_credits']['Row'], 'credit_id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['mnr_credits']['Row']>
      }
      mnr_retouch_dispatches: {
        Row: {
          dispatch_id: string
          origin_serial: string | null
          r_serial: string | null
          status: 'pending' | 'approved' | 'dispatched'
          approved_at: string | null
          dispatched_at: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['mnr_retouch_dispatches']['Row'], 'dispatch_id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['mnr_retouch_dispatches']['Row']>
      }
      mnr_sms_verifications: {
        Row: {
          id: string
          phone: string
          code: string
          verified: boolean
          expires_at: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['mnr_sms_verifications']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['mnr_sms_verifications']['Row']>
      }
    }
  }
}
