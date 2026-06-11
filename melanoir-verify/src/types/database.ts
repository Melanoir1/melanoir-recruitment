export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      attachments: {
        Row: {
          created_at: string
          file_name: string
          file_size: number
          id: string
          mime_type: string
          storage_path: string
          task_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          file_name: string
          file_size?: number
          id?: string
          mime_type?: string
          storage_path: string
          task_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          file_name?: string
          file_size?: number
          id?: string
          mime_type?: string
          storage_path?: string
          task_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attachments_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "milestones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attachments_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      feedbacks: {
        Row: {
          comment: string
          created_at: string
          id: string
          mentions: string[]
          milestone_id: string
          parent_id: string | null
          user_id: string | null
        }
        Insert: {
          comment: string
          created_at?: string
          id?: string
          mentions?: string[]
          milestone_id: string
          parent_id?: string | null
          user_id?: string | null
        }
        Update: {
          comment?: string
          created_at?: string
          id?: string
          mentions?: string[]
          milestone_id?: string
          parent_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feedbacks_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "feedbacks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedbacks_task_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "milestones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedbacks_task_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      milestone_dependencies: {
        Row: {
          created_at: string
          depends_on_milestone_id: string
          id: string
          milestone_id: string
        }
        Insert: {
          created_at?: string
          depends_on_milestone_id: string
          id?: string
          milestone_id: string
        }
        Update: {
          created_at?: string
          depends_on_milestone_id?: string
          id?: string
          milestone_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_dependencies_depends_on_task_id_fkey"
            columns: ["depends_on_milestone_id"]
            isOneToOne: false
            referencedRelation: "milestones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_dependencies_depends_on_task_id_fkey"
            columns: ["depends_on_milestone_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_dependencies_task_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "milestones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_dependencies_task_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      milestone_mission_links: {
        Row: {
          created_at: string
          milestone_id: string
          mission_id: string
        }
        Insert: {
          created_at?: string
          milestone_id: string
          mission_id: string
        }
        Update: {
          created_at?: string
          milestone_id?: string
          mission_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_project_links_project_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "missions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_project_links_project_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_project_links_task_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "milestones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_project_links_task_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      milestone_participants: {
        Row: {
          created_at: string
          milestone_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          milestone_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          milestone_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "milestone_participants_milestone_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "milestones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "milestone_participants_milestone_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      milestone_revisions: {
        Row: {
          created_at: string
          field: string
          id: string
          milestone_id: string
          new_value: string | null
          old_value: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          field: string
          id?: string
          milestone_id: string
          new_value?: string | null
          old_value?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          field?: string
          id?: string
          milestone_id?: string
          new_value?: string | null
          old_value?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "task_revisions_task_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "milestones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_revisions_task_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      milestones: {
        Row: {
          accountable_user_id: string | null
          completed_at: string | null
          content: string | null
          created_at: string
          created_by: string | null
          custom_fields: Json
          deleted_at: string | null
          end_date: string | null
          extension_count: number
          google_resource_url: string | null
          id: string
          lifecycle_changed_at: string | null
          lifecycle_changed_by: string | null
          lifecycle_reason: string | null
          lifecycle_status: string
          meeting_end_time: string | null
          meeting_start_time: string | null
          mission_id: string | null
          owner_id: string | null
          parent_id: string | null
          planned_end_date: string | null
          planned_start_date: string | null
          start_date: string | null
          status: Database["public"]["Enums"]["task_status"]
          tags: string[]
          title: string
          type: Database["public"]["Enums"]["task_type"]
          updated_at: string
        }
        Insert: {
          accountable_user_id?: string | null
          completed_at?: string | null
          content?: string | null
          created_at?: string
          created_by?: string | null
          custom_fields?: Json
          deleted_at?: string | null
          end_date?: string | null
          extension_count?: number
          google_resource_url?: string | null
          id?: string
          lifecycle_changed_at?: string | null
          lifecycle_changed_by?: string | null
          lifecycle_reason?: string | null
          lifecycle_status?: string
          meeting_end_time?: string | null
          meeting_start_time?: string | null
          mission_id?: string | null
          owner_id?: string | null
          parent_id?: string | null
          planned_end_date?: string | null
          planned_start_date?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["task_status"]
          tags?: string[]
          title: string
          type?: Database["public"]["Enums"]["task_type"]
          updated_at?: string
        }
        Update: {
          accountable_user_id?: string | null
          completed_at?: string | null
          content?: string | null
          created_at?: string
          created_by?: string | null
          custom_fields?: Json
          deleted_at?: string | null
          end_date?: string | null
          extension_count?: number
          google_resource_url?: string | null
          id?: string
          lifecycle_changed_at?: string | null
          lifecycle_changed_by?: string | null
          lifecycle_reason?: string | null
          lifecycle_status?: string
          meeting_end_time?: string | null
          meeting_start_time?: string | null
          mission_id?: string | null
          owner_id?: string | null
          parent_id?: string | null
          planned_end_date?: string | null
          planned_start_date?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["task_status"]
          tags?: string[]
          title?: string
          type?: Database["public"]["Enums"]["task_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "milestones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "missions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      mission_participants: {
        Row: {
          created_at: string
          mission_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          mission_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          mission_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mission_participants_user_id_ws_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "workspace_users"
            referencedColumns: ["auth_user_id"]
          },
          {
            foreignKeyName: "project_participants_project_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "missions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_participants_project_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      missions: {
        Row: {
          accountable_user_id: string | null
          color_code: string
          completed_at: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          description: string | null
          end_date: string | null
          extension_count: number
          id: string
          lifecycle_changed_at: string | null
          lifecycle_changed_by: string | null
          lifecycle_reason: string | null
          lifecycle_status: string
          manager_id: string | null
          planned_end_date: string | null
          planned_start_date: string | null
          sort_order: number
          start_date: string | null
          status: Database["public"]["Enums"]["project_status"]
          title: string
          updated_at: string
        }
        Insert: {
          accountable_user_id?: string | null
          color_code?: string
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          description?: string | null
          end_date?: string | null
          extension_count?: number
          id?: string
          lifecycle_changed_at?: string | null
          lifecycle_changed_by?: string | null
          lifecycle_reason?: string | null
          lifecycle_status?: string
          manager_id?: string | null
          planned_end_date?: string | null
          planned_start_date?: string | null
          sort_order?: number
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          title: string
          updated_at?: string
        }
        Update: {
          accountable_user_id?: string | null
          color_code?: string
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          description?: string | null
          end_date?: string | null
          extension_count?: number
          id?: string
          lifecycle_changed_at?: string | null
          lifecycle_changed_by?: string | null
          lifecycle_reason?: string | null
          lifecycle_status?: string
          manager_id?: string | null
          planned_end_date?: string | null
          planned_start_date?: string | null
          sort_order?: number
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      mnr_credits: {
        Row: {
          amount: number
          created_at: string | null
          credit_id: string
          expires_at: string | null
          owner_id: string
          owner_type: string
          reason: string | null
          type: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          credit_id?: string
          expires_at?: string | null
          owner_id: string
          owner_type: string
          reason?: string | null
          type: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          credit_id?: string
          expires_at?: string | null
          owner_id?: string
          owner_type?: string
          reason?: string | null
          type?: string
        }
        Relationships: []
      }
      mnr_lots: {
        Row: {
          lot_id: string
          manufactured_at: string
          qc_document_url: string | null
          qc_result: string
          quantity: number
        }
        Insert: {
          lot_id: string
          manufactured_at: string
          qc_document_url?: string | null
          qc_result: string
          quantity: number
        }
        Update: {
          lot_id?: string
          manufactured_at?: string
          qc_document_url?: string | null
          qc_result?: string
          quantity?: number
        }
        Relationships: []
      }
      mnr_practitioners: {
        Row: {
          created_at: string | null
          name: string
          phone: string
          practitioner_id: string
          region: string | null
          shop_name: string
          tier: string | null
          tier_updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          name: string
          phone: string
          practitioner_id?: string
          region?: string | null
          shop_name: string
          tier?: string | null
          tier_updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          name?: string
          phone?: string
          practitioner_id?: string
          region?: string | null
          shop_name?: string
          tier?: string | null
          tier_updated_at?: string | null
        }
        Relationships: []
      }
      mnr_procedures: {
        Row: {
          area: string | null
          customer_phone: string | null
          device_type: string | null
          dilution: string | null
          is_retouch: boolean | null
          needle_type: string | null
          practitioner_id: string | null
          procedure_at: string
          procedure_id: string
          registered_at: string | null
          serial_token: string | null
          skin_type: string | null
          technique: string
        }
        Insert: {
          area?: string | null
          customer_phone?: string | null
          device_type?: string | null
          dilution?: string | null
          is_retouch?: boolean | null
          needle_type?: string | null
          practitioner_id?: string | null
          procedure_at: string
          procedure_id?: string
          registered_at?: string | null
          serial_token?: string | null
          skin_type?: string | null
          technique: string
        }
        Update: {
          area?: string | null
          customer_phone?: string | null
          device_type?: string | null
          dilution?: string | null
          is_retouch?: boolean | null
          needle_type?: string | null
          practitioner_id?: string | null
          procedure_at?: string
          procedure_id?: string
          registered_at?: string | null
          serial_token?: string | null
          skin_type?: string | null
          technique?: string
        }
        Relationships: [
          {
            foreignKeyName: "mnr_procedures_practitioner_id_fkey"
            columns: ["practitioner_id"]
            isOneToOne: false
            referencedRelation: "mnr_practitioners"
            referencedColumns: ["practitioner_id"]
          },
          {
            foreignKeyName: "mnr_procedures_serial_token_fkey"
            columns: ["serial_token"]
            isOneToOne: true
            referencedRelation: "mnr_products"
            referencedColumns: ["serial_token"]
          },
        ]
      }
      mnr_products: {
        Row: {
          created_at: string | null
          internal_id: number
          lot_id: string | null
          product_type: string
          serial_token: string
        }
        Insert: {
          created_at?: string | null
          internal_id?: number
          lot_id?: string | null
          product_type?: string
          serial_token: string
        }
        Update: {
          created_at?: string | null
          internal_id?: number
          lot_id?: string | null
          product_type?: string
          serial_token?: string
        }
        Relationships: [
          {
            foreignKeyName: "mnr_products_lot_id_fkey"
            columns: ["lot_id"]
            isOneToOne: false
            referencedRelation: "mnr_lots"
            referencedColumns: ["lot_id"]
          },
        ]
      }
      mnr_registrations: {
        Row: {
          consented_at: string | null
          credits_issued: boolean | null
          customer_name: string | null
          customer_phone: string | null
          discomfort: string[] | null
          healing_credits_issued: boolean | null
          healing_photo_url: string | null
          healing_registered_at: string | null
          healing_reminder2_sent_at: string | null
          healing_reminder_sent_at: string | null
          healing_review_text: string | null
          longterm_review_text: string | null
          longterm_credits_issued: boolean | null
          longterm_photo_url: string | null
          longterm_registered_at: string | null
          longterm_reminder_sent_at: string | null
          marketing_consent: boolean | null
          photo_url: string | null
          reg_id: string
          registered_at: string | null
          research_consent: boolean | null
          review_text: string | null
          satisfaction: number | null
          serial_token: string | null
        }
        Insert: {
          consented_at?: string | null
          credits_issued?: boolean | null
          customer_name?: string | null
          customer_phone?: string | null
          discomfort?: string[] | null
          healing_credits_issued?: boolean | null
          healing_photo_url?: string | null
          healing_registered_at?: string | null
          healing_reminder2_sent_at?: string | null
          healing_reminder_sent_at?: string | null
          healing_review_text?: string | null
          longterm_credits_issued?: boolean | null
          longterm_photo_url?: string | null
          longterm_registered_at?: string | null
          longterm_reminder_sent_at?: string | null
          longterm_review_text?: string | null
          marketing_consent?: boolean | null
          photo_url?: string | null
          reg_id?: string
          registered_at?: string | null
          research_consent?: boolean | null
          review_text?: string | null
          satisfaction?: number | null
          serial_token?: string | null
        }
        Update: {
          consented_at?: string | null
          credits_issued?: boolean | null
          customer_name?: string | null
          customer_phone?: string | null
          discomfort?: string[] | null
          healing_credits_issued?: boolean | null
          healing_photo_url?: string | null
          healing_registered_at?: string | null
          healing_reminder2_sent_at?: string | null
          healing_reminder_sent_at?: string | null
          healing_review_text?: string | null
          longterm_credits_issued?: boolean | null
          longterm_photo_url?: string | null
          longterm_registered_at?: string | null
          longterm_reminder_sent_at?: string | null
          longterm_review_text?: string | null
          marketing_consent?: boolean | null
          photo_url?: string | null
          reg_id?: string
          registered_at?: string | null
          research_consent?: boolean | null
          review_text?: string | null
          satisfaction?: number | null
          serial_token?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mnr_registrations_serial_token_fkey"
            columns: ["serial_token"]
            isOneToOne: true
            referencedRelation: "mnr_products"
            referencedColumns: ["serial_token"]
          },
        ]
      }
      mnr_retouch_dispatches: {
        Row: {
          approved_at: string | null
          created_at: string | null
          dispatch_id: string
          dispatched_at: string | null
          origin_serial: string | null
          r_serial: string | null
          status: string | null
        }
        Insert: {
          approved_at?: string | null
          created_at?: string | null
          dispatch_id?: string
          dispatched_at?: string | null
          origin_serial?: string | null
          r_serial?: string | null
          status?: string | null
        }
        Update: {
          approved_at?: string | null
          created_at?: string | null
          dispatch_id?: string
          dispatched_at?: string | null
          origin_serial?: string | null
          r_serial?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mnr_retouch_dispatches_origin_serial_fkey"
            columns: ["origin_serial"]
            isOneToOne: false
            referencedRelation: "mnr_products"
            referencedColumns: ["serial_token"]
          },
        ]
      }
      mnr_shipments: {
        Row: {
          carrier: string | null
          delivered_at: string | null
          internal_id_from: number | null
          internal_id_to: number | null
          shipment_id: string
          shipped_at: string | null
          shop_name: string | null
          waybill_no: string | null
        }
        Insert: {
          carrier?: string | null
          delivered_at?: string | null
          internal_id_from?: number | null
          internal_id_to?: number | null
          shipment_id?: string
          shipped_at?: string | null
          shop_name?: string | null
          waybill_no?: string | null
        }
        Update: {
          carrier?: string | null
          delivered_at?: string | null
          internal_id_from?: number | null
          internal_id_to?: number | null
          shipment_id?: string
          shipped_at?: string | null
          shop_name?: string | null
          waybill_no?: string | null
        }
        Relationships: []
      }
      mnr_sms_verifications: {
        Row: {
          code: string
          created_at: string | null
          expires_at: string
          id: string
          phone: string
          verified: boolean | null
        }
        Insert: {
          code: string
          created_at?: string | null
          expires_at: string
          id?: string
          phone: string
          verified?: boolean | null
        }
        Update: {
          code?: string
          created_at?: string | null
          expires_at?: string
          id?: string
          phone?: string
          verified?: boolean | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          actor_id: string | null
          created_at: string
          id: string
          is_read: boolean
          message: string
          milestone_id: string | null
          mission_id: string | null
          read_at: string | null
          type: string
          user_id: string
        }
        Insert: {
          actor_id?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          milestone_id?: string | null
          mission_id?: string | null
          read_at?: string | null
          type: string
          user_id: string
        }
        Update: {
          actor_id?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          milestone_id?: string | null
          mission_id?: string | null
          read_at?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_project_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "missions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_project_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_task_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "milestones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_task_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      period_change_log: {
        Row: {
          created_at: string
          entity_type: string
          extension_ordinal: number | null
          id: string
          kind: string
          milestone_id: string | null
          mission_id: string | null
          new_end_date: string | null
          new_start_date: string | null
          old_end_date: string | null
          old_start_date: string | null
          reason: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          entity_type: string
          extension_ordinal?: number | null
          id?: string
          kind: string
          milestone_id?: string | null
          mission_id?: string | null
          new_end_date?: string | null
          new_start_date?: string | null
          old_end_date?: string | null
          old_start_date?: string | null
          reason: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          entity_type?: string
          extension_ordinal?: number | null
          id?: string
          kind?: string
          milestone_id?: string | null
          mission_id?: string | null
          new_end_date?: string | null
          new_start_date?: string | null
          old_end_date?: string | null
          old_start_date?: string | null
          reason?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "period_change_log_project_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "missions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "period_change_log_project_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "period_change_log_task_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "milestones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "period_change_log_task_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      workspace_users: {
        Row: {
          auth_user_id: string | null
          created_at: string
          display_name: string
          email: string | null
          id: string
          is_active: boolean
          role: string
          role_level: number
        }
        Insert: {
          auth_user_id?: string | null
          created_at?: string
          display_name: string
          email?: string | null
          id?: string
          is_active?: boolean
          role?: string
          role_level?: number
        }
        Update: {
          auth_user_id?: string | null
          created_at?: string
          display_name?: string
          email?: string | null
          id?: string
          is_active?: boolean
          role?: string
          role_level?: number
        }
        Relationships: []
      }
    }
    Views: {
      project_participants: {
        Row: {
          created_at: string | null
          project_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          project_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          project_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mission_participants_user_id_ws_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "workspace_users"
            referencedColumns: ["auth_user_id"]
          },
          {
            foreignKeyName: "project_participants_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "missions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_participants_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          accountable_user_id: string | null
          color_code: string | null
          completed_at: string | null
          created_at: string | null
          created_by: string | null
          deleted_at: string | null
          description: string | null
          end_date: string | null
          extension_count: number | null
          id: string | null
          lifecycle_changed_at: string | null
          lifecycle_changed_by: string | null
          lifecycle_reason: string | null
          lifecycle_status: string | null
          manager_id: string | null
          sort_order: number | null
          start_date: string | null
          status: Database["public"]["Enums"]["project_status"] | null
          title: string | null
        }
        Insert: {
          accountable_user_id?: string | null
          color_code?: string | null
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          deleted_at?: string | null
          description?: string | null
          end_date?: string | null
          extension_count?: number | null
          id?: string | null
          lifecycle_changed_at?: string | null
          lifecycle_changed_by?: string | null
          lifecycle_reason?: string | null
          lifecycle_status?: string | null
          manager_id?: string | null
          sort_order?: number | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"] | null
          title?: string | null
        }
        Update: {
          accountable_user_id?: string | null
          color_code?: string | null
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          deleted_at?: string | null
          description?: string | null
          end_date?: string | null
          extension_count?: number | null
          id?: string | null
          lifecycle_changed_at?: string | null
          lifecycle_changed_by?: string | null
          lifecycle_reason?: string | null
          lifecycle_status?: string | null
          manager_id?: string | null
          sort_order?: number | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"] | null
          title?: string | null
        }
        Relationships: []
      }
      task_dependencies: {
        Row: {
          created_at: string | null
          depends_on_task_id: string | null
          id: string | null
          task_id: string | null
        }
        Insert: {
          created_at?: string | null
          depends_on_task_id?: string | null
          id?: string | null
          task_id?: string | null
        }
        Update: {
          created_at?: string | null
          depends_on_task_id?: string | null
          id?: string | null
          task_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "task_dependencies_depends_on_task_id_fkey"
            columns: ["depends_on_task_id"]
            isOneToOne: false
            referencedRelation: "milestones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_dependencies_depends_on_task_id_fkey"
            columns: ["depends_on_task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_dependencies_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "milestones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_dependencies_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      task_project_links: {
        Row: {
          created_at: string | null
          project_id: string | null
          task_id: string | null
        }
        Insert: {
          created_at?: string | null
          project_id?: string | null
          task_id?: string | null
        }
        Update: {
          created_at?: string | null
          project_id?: string | null
          task_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "task_project_links_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "missions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_project_links_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_project_links_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "milestones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_project_links_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      task_revisions: {
        Row: {
          created_at: string | null
          field: string | null
          id: string | null
          new_value: string | null
          old_value: string | null
          task_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          field?: string | null
          id?: string | null
          new_value?: string | null
          old_value?: string | null
          task_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          field?: string | null
          id?: string | null
          new_value?: string | null
          old_value?: string | null
          task_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "task_revisions_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "milestones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_revisions_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          accountable_user_id: string | null
          completed_at: string | null
          content: string | null
          created_at: string | null
          created_by: string | null
          custom_fields: Json | null
          deleted_at: string | null
          end_date: string | null
          extension_count: number | null
          google_resource_url: string | null
          id: string | null
          lifecycle_changed_at: string | null
          lifecycle_changed_by: string | null
          lifecycle_reason: string | null
          lifecycle_status: string | null
          owner_id: string | null
          parent_id: string | null
          planned_end_date: string | null
          planned_start_date: string | null
          project_id: string | null
          start_date: string | null
          status: Database["public"]["Enums"]["task_status"] | null
          tags: string[] | null
          title: string | null
          type: Database["public"]["Enums"]["task_type"] | null
        }
        Insert: {
          accountable_user_id?: string | null
          completed_at?: string | null
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          custom_fields?: Json | null
          deleted_at?: string | null
          end_date?: string | null
          extension_count?: number | null
          google_resource_url?: string | null
          id?: string | null
          lifecycle_changed_at?: string | null
          lifecycle_changed_by?: string | null
          lifecycle_reason?: string | null
          lifecycle_status?: string | null
          owner_id?: string | null
          parent_id?: string | null
          planned_end_date?: string | null
          planned_start_date?: string | null
          project_id?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["task_status"] | null
          tags?: string[] | null
          title?: string | null
          type?: Database["public"]["Enums"]["task_type"] | null
        }
        Update: {
          accountable_user_id?: string | null
          completed_at?: string | null
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          custom_fields?: Json | null
          deleted_at?: string | null
          end_date?: string | null
          extension_count?: number | null
          google_resource_url?: string | null
          id?: string | null
          lifecycle_changed_at?: string | null
          lifecycle_changed_by?: string | null
          lifecycle_reason?: string | null
          lifecycle_status?: string | null
          owner_id?: string | null
          parent_id?: string | null
          planned_end_date?: string | null
          planned_start_date?: string | null
          project_id?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["task_status"] | null
          tags?: string[] | null
          title?: string | null
          type?: Database["public"]["Enums"]["task_type"] | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "milestones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "missions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      can_manage_mission_roster: {
        Args: { p_mission_id: string }
        Returns: boolean
      }
      can_manage_project_roster: {
        Args: { p_project_id: string }
        Returns: boolean
      }
      can_mutate_milestone_meeting_participants: {
        Args: { p_milestone_id: string }
        Returns: boolean
      }
      can_request_period_change: {
        Args: {
          p_entity_type: string
          p_project_id: string
          p_task_id: string
          p_user_id: string
        }
        Returns: boolean
      }
      current_role_level: { Args: never; Returns: number }
      insert_notification_compat: {
        Args: {
          p_actor_id: string
          p_message: string
          p_milestone_id: string
          p_mission_id: string
          p_type: string
          p_user_id: string
        }
        Returns: undefined
      }
      is_bootstrap_admin_email: { Args: { p_email: string }; Returns: boolean }
      is_workspace_admin: { Args: never; Returns: boolean }
      member_can_view_milestone: {
        Args: {
          p_milestone_accountable_user_id: string
          p_milestone_id: string
          p_mission_id: string
          p_owner_id: string
        }
        Returns: boolean
      }
      member_can_view_task: {
        Args: {
          p_owner_id: string
          p_project_id: string
          p_task_accountable_user_id: string
          p_task_id: string
        }
        Returns: boolean
      }
      milestone_is_strict_ancestor_of: {
        Args: { ancestor_id: string; descendant_id: string }
        Returns: boolean
      }
      rls_mission_has_today_public_milestone: {
        Args: { p_mission_id: string }
        Returns: boolean
      }
      rls_user_can_view_mission_for_milestone: {
        Args: { p_mission_id: string }
        Returns: boolean
      }
      task_is_strict_ancestor_of: {
        Args: { ancestor_id: string; descendant_id: string }
        Returns: boolean
      }
      workspace_today_outcome_bundle: {
        Args: { p_today_kst?: string }
        Returns: Json
      }
    }
    Enums: {
      project_status: "active" | "completed"
      task_status: "pending" | "in_progress" | "completed"
      task_type: "daily" | "weekly" | "monthly" | "general" | "meeting"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      project_status: ["active", "completed"],
      task_status: ["pending", "in_progress", "completed"],
      task_type: ["daily", "weekly", "monthly", "general", "meeting"],
    },
  },
} as const
