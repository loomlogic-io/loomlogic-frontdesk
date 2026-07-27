export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      action_approvals: {
        Row: {
          action_type: string
          approved_at: string | null
          approved_by_user_id: string | null
          created_at: string
          executed_at: string | null
          failure_code: string | null
          id: string
          idempotency_key: string
          message_id: string
          organization_id: string
          recovery_case_id: string
          requested_by_user_id: string
          risk_class: string
          status: string
          updated_at: string
        }
        Insert: {
          action_type: string
          approved_at?: string | null
          approved_by_user_id?: string | null
          created_at?: string
          executed_at?: string | null
          failure_code?: string | null
          id?: string
          idempotency_key: string
          message_id: string
          organization_id: string
          recovery_case_id: string
          requested_by_user_id: string
          risk_class?: string
          status?: string
          updated_at?: string
        }
        Update: {
          action_type?: string
          approved_at?: string | null
          approved_by_user_id?: string | null
          created_at?: string
          executed_at?: string | null
          failure_code?: string | null
          id?: string
          idempotency_key?: string
          message_id?: string
          organization_id?: string
          recovery_case_id?: string
          requested_by_user_id?: string
          risk_class?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "action_approvals_approved_by_user_id_fkey"
            columns: ["approved_by_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "action_approvals_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "action_approvals_organization_id_message_id_fkey"
            columns: ["organization_id", "message_id"]
            isOneToOne: true
            referencedRelation: "messages"
            referencedColumns: ["organization_id", "id"]
          },
          {
            foreignKeyName: "action_approvals_organization_id_recovery_case_id_fkey"
            columns: ["organization_id", "recovery_case_id"]
            isOneToOne: false
            referencedRelation: "recovery_cases"
            referencedColumns: ["organization_id", "id"]
          },
          {
            foreignKeyName: "action_approvals_requested_by_user_id_fkey"
            columns: ["requested_by_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          actor_type: string
          actor_user_id: string | null
          created_at: string
          id: string
          ip_hash: string | null
          metadata: Json
          organization_id: string
          request_id: string
          source: string
          target_id: string | null
          target_type: string
          user_agent: string | null
        }
        Insert: {
          action: string
          actor_type: string
          actor_user_id?: string | null
          created_at?: string
          id?: string
          ip_hash?: string | null
          metadata?: Json
          organization_id: string
          request_id: string
          source: string
          target_id?: string | null
          target_type: string
          user_agent?: string | null
        }
        Update: {
          action?: string
          actor_type?: string
          actor_user_id?: string | null
          created_at?: string
          id?: string
          ip_hash?: string | null
          metadata?: Json
          organization_id?: string
          request_id?: string
          source?: string
          target_id?: string | null
          target_type?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_actor_user_id_fkey"
            columns: ["actor_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      call_events: {
        Row: {
          call_id: string
          created_at: string
          event_type: string
          id: string
          occurred_at: string
          organization_id: string
          payload: Json
          provider_event_id: string
          sequence: number
        }
        Insert: {
          call_id: string
          created_at?: string
          event_type: string
          id?: string
          occurred_at: string
          organization_id: string
          payload?: Json
          provider_event_id: string
          sequence: number
        }
        Update: {
          call_id?: string
          created_at?: string
          event_type?: string
          id?: string
          occurred_at?: string
          organization_id?: string
          payload?: Json
          provider_event_id?: string
          sequence?: number
        }
        Relationships: [
          {
            foreignKeyName: "call_events_organization_id_call_id_fkey"
            columns: ["organization_id", "call_id"]
            isOneToOne: false
            referencedRelation: "calls"
            referencedColumns: ["organization_id", "id"]
          },
          {
            foreignKeyName: "call_events_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      calls: {
        Row: {
          answered_at: string | null
          contact_id: string
          conversation_id: string
          created_at: string
          direction: string
          disposition: string | null
          duration_seconds: number
          ended_at: string | null
          from_number: string
          id: string
          intent: string | null
          is_demo: boolean
          metadata: Json
          organization_id: string
          phone_number_id: string
          provider: string
          provider_call_id: string
          recording_consent_state: string
          routing_outcome: string | null
          started_at: string
          status: string
          summary: string | null
          to_number: string
          updated_at: string
        }
        Insert: {
          answered_at?: string | null
          contact_id: string
          conversation_id: string
          created_at?: string
          direction: string
          disposition?: string | null
          duration_seconds?: number
          ended_at?: string | null
          from_number: string
          id?: string
          intent?: string | null
          is_demo?: boolean
          metadata?: Json
          organization_id: string
          phone_number_id: string
          provider: string
          provider_call_id: string
          recording_consent_state?: string
          routing_outcome?: string | null
          started_at: string
          status: string
          summary?: string | null
          to_number: string
          updated_at?: string
        }
        Update: {
          answered_at?: string | null
          contact_id?: string
          conversation_id?: string
          created_at?: string
          direction?: string
          disposition?: string | null
          duration_seconds?: number
          ended_at?: string | null
          from_number?: string
          id?: string
          intent?: string | null
          is_demo?: boolean
          metadata?: Json
          organization_id?: string
          phone_number_id?: string
          provider?: string
          provider_call_id?: string
          recording_consent_state?: string
          routing_outcome?: string | null
          started_at?: string
          status?: string
          summary?: string | null
          to_number?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "calls_organization_id_contact_id_fkey"
            columns: ["organization_id", "contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["organization_id", "id"]
          },
          {
            foreignKeyName: "calls_organization_id_conversation_id_fkey"
            columns: ["organization_id", "conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["organization_id", "id"]
          },
          {
            foreignKeyName: "calls_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calls_organization_id_phone_number_id_fkey"
            columns: ["organization_id", "phone_number_id"]
            isOneToOne: false
            referencedRelation: "phone_numbers"
            referencedColumns: ["organization_id", "id"]
          },
        ]
      }
      contact_channels: {
        Row: {
          consent_status: string
          contact_id: string
          created_at: string
          display_value: string
          id: string
          is_primary: boolean
          is_verified: boolean
          normalized_value: string
          organization_id: string
          type: string
          updated_at: string
        }
        Insert: {
          consent_status?: string
          contact_id: string
          created_at?: string
          display_value: string
          id?: string
          is_primary?: boolean
          is_verified?: boolean
          normalized_value: string
          organization_id: string
          type: string
          updated_at?: string
        }
        Update: {
          consent_status?: string
          contact_id?: string
          created_at?: string
          display_value?: string
          id?: string
          is_primary?: boolean
          is_verified?: boolean
          normalized_value?: string
          organization_id?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contact_channels_organization_id_contact_id_fkey"
            columns: ["organization_id", "contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["organization_id", "id"]
          },
          {
            foreignKeyName: "contact_channels_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          consent_status: string
          created_at: string
          deleted_at: string | null
          display_name: string
          first_name: string | null
          id: string
          is_demo: boolean
          last_name: string | null
          lifecycle_status: string
          metadata: Json
          organization_id: string
          preferred_language: string
          time_zone: string | null
          updated_at: string
        }
        Insert: {
          consent_status?: string
          created_at?: string
          deleted_at?: string | null
          display_name: string
          first_name?: string | null
          id?: string
          is_demo?: boolean
          last_name?: string | null
          lifecycle_status?: string
          metadata?: Json
          organization_id: string
          preferred_language?: string
          time_zone?: string | null
          updated_at?: string
        }
        Update: {
          consent_status?: string
          created_at?: string
          deleted_at?: string | null
          display_name?: string
          first_name?: string | null
          id?: string
          is_demo?: boolean
          last_name?: string | null
          lifecycle_status?: string
          metadata?: Json
          organization_id?: string
          preferred_language?: string
          time_zone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contacts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          assigned_member_id: string | null
          contact_id: string
          created_at: string
          id: string
          is_demo: boolean
          last_activity_at: string
          organization_id: string
          primary_channel: string
          status: string
          subject: string
          summary: string | null
          updated_at: string
        }
        Insert: {
          assigned_member_id?: string | null
          contact_id: string
          created_at?: string
          id?: string
          is_demo?: boolean
          last_activity_at: string
          organization_id: string
          primary_channel: string
          status?: string
          subject: string
          summary?: string | null
          updated_at?: string
        }
        Update: {
          assigned_member_id?: string | null
          contact_id?: string
          created_at?: string
          id?: string
          is_demo?: boolean
          last_activity_at?: string
          organization_id?: string
          primary_channel?: string
          status?: string
          subject?: string
          summary?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_organization_id_assigned_member_id_fkey"
            columns: ["organization_id", "assigned_member_id"]
            isOneToOne: false
            referencedRelation: "organization_members"
            referencedColumns: ["organization_id", "id"]
          },
          {
            foreignKeyName: "conversations_organization_id_contact_id_fkey"
            columns: ["organization_id", "contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["organization_id", "id"]
          },
          {
            foreignKeyName: "conversations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          body: string
          channel: string
          contact_id: string
          conversation_id: string
          created_at: string
          direction: string
          error_code: string | null
          failed_at: string | null
          id: string
          idempotency_key: string
          metadata: Json
          organization_id: string
          provider: string
          provider_message_id: string | null
          recipient: string
          recovery_case_id: string
          sent_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          body: string
          channel: string
          contact_id: string
          conversation_id: string
          created_at?: string
          direction: string
          error_code?: string | null
          failed_at?: string | null
          id?: string
          idempotency_key: string
          metadata?: Json
          organization_id: string
          provider: string
          provider_message_id?: string | null
          recipient: string
          recovery_case_id: string
          sent_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          body?: string
          channel?: string
          contact_id?: string
          conversation_id?: string
          created_at?: string
          direction?: string
          error_code?: string | null
          failed_at?: string | null
          id?: string
          idempotency_key?: string
          metadata?: Json
          organization_id?: string
          provider?: string
          provider_message_id?: string | null
          recipient?: string
          recovery_case_id?: string
          sent_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_organization_id_contact_id_fkey"
            columns: ["organization_id", "contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["organization_id", "id"]
          },
          {
            foreignKeyName: "messages_organization_id_conversation_id_fkey"
            columns: ["organization_id", "conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["organization_id", "id"]
          },
          {
            foreignKeyName: "messages_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_organization_id_recovery_case_id_fkey"
            columns: ["organization_id", "recovery_case_id"]
            isOneToOne: false
            referencedRelation: "recovery_cases"
            referencedColumns: ["organization_id", "id"]
          },
        ]
      }
      mock_message_attempts: {
        Row: {
          attempted_at: string
          created_at: string
          error_code: string | null
          id: string
          idempotency_key: string
          message_id: string
          organization_id: string
          outcome: string
          provider_message_id: string | null
        }
        Insert: {
          attempted_at: string
          created_at?: string
          error_code?: string | null
          id?: string
          idempotency_key: string
          message_id: string
          organization_id: string
          outcome: string
          provider_message_id?: string | null
        }
        Update: {
          attempted_at?: string
          created_at?: string
          error_code?: string | null
          id?: string
          idempotency_key?: string
          message_id?: string
          organization_id?: string
          outcome?: string
          provider_message_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mock_message_attempts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mock_message_attempts_organization_id_message_id_fkey"
            columns: ["organization_id", "message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["organization_id", "id"]
          },
        ]
      }
      organization_members: {
        Row: {
          clerk_membership_id: string
          created_at: string
          id: string
          job_title: string | null
          organization_id: string
          permissions: Json
          role: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          clerk_membership_id: string
          created_at?: string
          id?: string
          job_title?: string | null
          organization_id: string
          permissions?: Json
          role: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          clerk_membership_id?: string
          created_at?: string
          id?: string
          job_title?: string | null
          organization_id?: string
          permissions?: Json
          role?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          clerk_org_id: string
          created_at: string
          currency_code: string
          id: string
          locale: string
          name: string
          onboarding_state: string
          settings: Json
          slug: string
          status: string
          time_zone: string
          updated_at: string
        }
        Insert: {
          clerk_org_id: string
          created_at?: string
          currency_code?: string
          id?: string
          locale?: string
          name: string
          onboarding_state?: string
          settings?: Json
          slug: string
          status?: string
          time_zone?: string
          updated_at?: string
        }
        Update: {
          clerk_org_id?: string
          created_at?: string
          currency_code?: string
          id?: string
          locale?: string
          name?: string
          onboarding_state?: string
          settings?: Json
          slug?: string
          status?: string
          time_zone?: string
          updated_at?: string
        }
        Relationships: []
      }
      outbox_events: {
        Row: {
          aggregate_id: string
          aggregate_type: string
          attempt_count: number
          available_at: string
          created_at: string
          event_type: string
          id: string
          idempotency_key: string
          last_error_code: string | null
          locked_at: string | null
          organization_id: string
          payload: Json
          processed_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          aggregate_id: string
          aggregate_type: string
          attempt_count?: number
          available_at: string
          created_at?: string
          event_type: string
          id?: string
          idempotency_key: string
          last_error_code?: string | null
          locked_at?: string | null
          organization_id: string
          payload?: Json
          processed_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          aggregate_id?: string
          aggregate_type?: string
          attempt_count?: number
          available_at?: string
          created_at?: string
          event_type?: string
          id?: string
          idempotency_key?: string
          last_error_code?: string | null
          locked_at?: string | null
          organization_id?: string
          payload?: Json
          processed_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "outbox_events_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      phone_numbers: {
        Row: {
          created_at: string
          e164_number: string
          friendly_name: string
          id: string
          is_demo: boolean
          organization_id: string
          provider: string
          provider_phone_number_id: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          e164_number: string
          friendly_name: string
          id?: string
          is_demo?: boolean
          organization_id: string
          provider: string
          provider_phone_number_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          e164_number?: string
          friendly_name?: string
          id?: string
          is_demo?: boolean
          organization_id?: string
          provider?: string
          provider_phone_number_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "phone_numbers_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      recovery_case_events: {
        Row: {
          actor_type: string
          actor_user_id: string | null
          created_at: string
          description: string
          event_type: string
          id: string
          metadata: Json
          occurred_at: string
          organization_id: string
          recovery_case_id: string
          source_id: string | null
          source_type: string
        }
        Insert: {
          actor_type: string
          actor_user_id?: string | null
          created_at?: string
          description: string
          event_type: string
          id?: string
          metadata?: Json
          occurred_at: string
          organization_id: string
          recovery_case_id: string
          source_id?: string | null
          source_type: string
        }
        Update: {
          actor_type?: string
          actor_user_id?: string | null
          created_at?: string
          description?: string
          event_type?: string
          id?: string
          metadata?: Json
          occurred_at?: string
          organization_id?: string
          recovery_case_id?: string
          source_id?: string | null
          source_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "recovery_case_events_actor_user_id_fkey"
            columns: ["actor_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recovery_case_events_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recovery_case_events_organization_id_recovery_case_id_fkey"
            columns: ["organization_id", "recovery_case_id"]
            isOneToOne: false
            referencedRelation: "recovery_cases"
            referencedColumns: ["organization_id", "id"]
          },
        ]
      }
      recovery_cases: {
        Row: {
          assigned_member_id: string | null
          attribution_level: string
          category: string
          contact_id: string
          conversation_id: string
          created_at: string
          currency_code: string
          estimated_value_minor: number
          id: string
          is_demo: boolean
          lost_reason: string | null
          next_action_due_at: string | null
          next_action_type: string | null
          opened_at: string
          organization_id: string
          reason: string
          reference: string
          resolution_type: string | null
          resolved_at: string | null
          source_call_id: string
          status: string
          updated_at: string
          urgency: string
        }
        Insert: {
          assigned_member_id?: string | null
          attribution_level?: string
          category: string
          contact_id: string
          conversation_id: string
          created_at?: string
          currency_code: string
          estimated_value_minor?: number
          id?: string
          is_demo?: boolean
          lost_reason?: string | null
          next_action_due_at?: string | null
          next_action_type?: string | null
          opened_at: string
          organization_id: string
          reason: string
          reference: string
          resolution_type?: string | null
          resolved_at?: string | null
          source_call_id: string
          status?: string
          updated_at?: string
          urgency?: string
        }
        Update: {
          assigned_member_id?: string | null
          attribution_level?: string
          category?: string
          contact_id?: string
          conversation_id?: string
          created_at?: string
          currency_code?: string
          estimated_value_minor?: number
          id?: string
          is_demo?: boolean
          lost_reason?: string | null
          next_action_due_at?: string | null
          next_action_type?: string | null
          opened_at?: string
          organization_id?: string
          reason?: string
          reference?: string
          resolution_type?: string | null
          resolved_at?: string | null
          source_call_id?: string
          status?: string
          updated_at?: string
          urgency?: string
        }
        Relationships: [
          {
            foreignKeyName: "recovery_cases_organization_id_assigned_member_id_fkey"
            columns: ["organization_id", "assigned_member_id"]
            isOneToOne: false
            referencedRelation: "organization_members"
            referencedColumns: ["organization_id", "id"]
          },
          {
            foreignKeyName: "recovery_cases_organization_id_contact_id_fkey"
            columns: ["organization_id", "contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["organization_id", "id"]
          },
          {
            foreignKeyName: "recovery_cases_organization_id_conversation_id_fkey"
            columns: ["organization_id", "conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["organization_id", "id"]
          },
          {
            foreignKeyName: "recovery_cases_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recovery_cases_organization_id_source_call_id_fkey"
            columns: ["organization_id", "source_call_id"]
            isOneToOne: true
            referencedRelation: "calls"
            referencedColumns: ["organization_id", "id"]
          },
        ]
      }
      revenue_attributions: {
        Row: {
          amount_minor: number
          attributed_at: string
          confidence: number | null
          created_at: string
          currency_code: string
          evidence_reference: string | null
          evidence_type: string
          id: string
          level: string
          organization_id: string
          recovery_case_id: string
        }
        Insert: {
          amount_minor: number
          attributed_at: string
          confidence?: number | null
          created_at?: string
          currency_code: string
          evidence_reference?: string | null
          evidence_type: string
          id?: string
          level: string
          organization_id: string
          recovery_case_id: string
        }
        Update: {
          amount_minor?: number
          attributed_at?: string
          confidence?: number | null
          created_at?: string
          currency_code?: string
          evidence_reference?: string | null
          evidence_type?: string
          id?: string
          level?: string
          organization_id?: string
          recovery_case_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "revenue_attributions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "revenue_attributions_organization_id_recovery_case_id_fkey"
            columns: ["organization_id", "recovery_case_id"]
            isOneToOne: false
            referencedRelation: "recovery_cases"
            referencedColumns: ["organization_id", "id"]
          },
        ]
      }
      tasks: {
        Row: {
          assigned_member_id: string | null
          completed_at: string | null
          contact_id: string | null
          conversation_id: string | null
          created_at: string
          created_by_user_id: string | null
          description: string | null
          due_at: string | null
          id: string
          organization_id: string
          priority: string
          recovery_case_id: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          assigned_member_id?: string | null
          completed_at?: string | null
          contact_id?: string | null
          conversation_id?: string | null
          created_at?: string
          created_by_user_id?: string | null
          description?: string | null
          due_at?: string | null
          id?: string
          organization_id: string
          priority?: string
          recovery_case_id?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          assigned_member_id?: string | null
          completed_at?: string | null
          contact_id?: string | null
          conversation_id?: string | null
          created_at?: string
          created_by_user_id?: string | null
          description?: string | null
          due_at?: string | null
          id?: string
          organization_id?: string
          priority?: string
          recovery_case_id?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_organization_id_assigned_member_id_fkey"
            columns: ["organization_id", "assigned_member_id"]
            isOneToOne: false
            referencedRelation: "organization_members"
            referencedColumns: ["organization_id", "id"]
          },
          {
            foreignKeyName: "tasks_organization_id_contact_id_fkey"
            columns: ["organization_id", "contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["organization_id", "id"]
          },
          {
            foreignKeyName: "tasks_organization_id_conversation_id_fkey"
            columns: ["organization_id", "conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["organization_id", "id"]
          },
          {
            foreignKeyName: "tasks_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_organization_id_recovery_case_id_fkey"
            columns: ["organization_id", "recovery_case_id"]
            isOneToOne: false
            referencedRelation: "recovery_cases"
            referencedColumns: ["organization_id", "id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          clerk_user_id: string
          created_at: string
          display_name: string | null
          id: string
          last_seen_at: string | null
          primary_email: string | null
          status: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          clerk_user_id: string
          created_at?: string
          display_name?: string | null
          id?: string
          last_seen_at?: string | null
          primary_email?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          clerk_user_id?: string
          created_at?: string
          display_name?: string | null
          id?: string
          last_seen_at?: string | null
          primary_email?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      webhook_events: {
        Row: {
          attempt_count: number
          created_at: string
          event_type: string
          id: string
          last_error_code: string | null
          organization_id: string
          payload_hash: string
          processed_at: string | null
          provider: string
          provider_event_id: string
          raw_payload: Json
          received_at: string
          signature_verified: boolean
          status: string
          updated_at: string
        }
        Insert: {
          attempt_count?: number
          created_at?: string
          event_type: string
          id?: string
          last_error_code?: string | null
          organization_id: string
          payload_hash: string
          processed_at?: string | null
          provider: string
          provider_event_id: string
          raw_payload: Json
          received_at: string
          signature_verified: boolean
          status?: string
          updated_at?: string
        }
        Update: {
          attempt_count?: number
          created_at?: string
          event_type?: string
          id?: string
          last_error_code?: string | null
          organization_id?: string
          payload_hash?: string
          processed_at?: string | null
          provider?: string
          provider_event_id?: string
          raw_payload?: Json
          received_at?: string
          signature_verified?: boolean
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "webhook_events_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
