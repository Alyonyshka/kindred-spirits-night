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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      adventure_plans: {
        Row: {
          created_at: string
          id: string
          plan_text: string
          user1_id: string
          user2_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          plan_text?: string
          user1_id: string
          user2_id: string
        }
        Update: {
          created_at?: string
          id?: string
          plan_text?: string
          user1_id?: string
          user2_id?: string
        }
        Relationships: []
      }
      blocked_users: {
        Row: {
          blocked_id: string
          blocker_id: string
          created_at: string
          id: string
        }
        Insert: {
          blocked_id: string
          blocker_id: string
          created_at?: string
          id?: string
        }
        Update: {
          blocked_id?: string
          blocker_id?: string
          created_at?: string
          id?: string
        }
        Relationships: []
      }
      bug_reports: {
        Row: {
          created_at: string
          description: string
          id: string
          screen_url: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string
          id?: string
          screen_url?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          screen_url?: string
          user_id?: string | null
        }
        Relationships: []
      }
      event_participants: {
        Row: {
          event_id: string
          id: string
          joined_at: string
          status: Database["public"]["Enums"]["event_status"] | null
          user_id: string
        }
        Insert: {
          event_id: string
          id?: string
          joined_at?: string
          status?: Database["public"]["Enums"]["event_status"] | null
          user_id: string
        }
        Update: {
          event_id?: string
          id?: string
          joined_at?: string
          status?: Database["public"]["Enums"]["event_status"] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_participants_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string
          creator_id: string
          date: string | null
          description: string | null
          drink: string | null
          hours: string | null
          id: string
          latitude: number | null
          location: string | null
          longitude: number | null
          max_participants: number | null
          phone: string | null
          status: Database["public"]["Enums"]["event_status"] | null
          time: string | null
          title: string
          updated_at: string
          website: string | null
        }
        Insert: {
          created_at?: string
          creator_id: string
          date?: string | null
          description?: string | null
          drink?: string | null
          hours?: string | null
          id?: string
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          max_participants?: number | null
          phone?: string | null
          status?: Database["public"]["Enums"]["event_status"] | null
          time?: string | null
          title: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          created_at?: string
          creator_id?: string
          date?: string | null
          description?: string | null
          drink?: string | null
          hours?: string | null
          id?: string
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          max_participants?: number | null
          phone?: string | null
          status?: Database["public"]["Enums"]["event_status"] | null
          time?: string | null
          title?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string
          favorite_user_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          favorite_user_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          favorite_user_id?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      meetings: {
        Row: {
          brudershaft_code: string | null
          brudershaft_initiator_id: string | null
          created_at: string
          id: string
          met_at: string | null
          receiver_id: string
          requester_id: string
          status: Database["public"]["Enums"]["meeting_status"] | null
          updated_at: string
        }
        Insert: {
          brudershaft_code?: string | null
          brudershaft_initiator_id?: string | null
          created_at?: string
          id?: string
          met_at?: string | null
          receiver_id: string
          requester_id: string
          status?: Database["public"]["Enums"]["meeting_status"] | null
          updated_at?: string
        }
        Update: {
          brudershaft_code?: string | null
          brudershaft_initiator_id?: string | null
          created_at?: string
          id?: string
          met_at?: string | null
          receiver_id?: string
          requester_id?: string
          status?: Database["public"]["Enums"]["meeting_status"] | null
          updated_at?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string
          edited: boolean | null
          id: string
          media_url: string | null
          read: boolean | null
          receiver_id: string
          reply_to_id: string | null
          sender_id: string
          type: string | null
        }
        Insert: {
          content?: string
          created_at?: string
          edited?: boolean | null
          id?: string
          media_url?: string | null
          read?: boolean | null
          receiver_id: string
          reply_to_id?: string | null
          sender_id: string
          type?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          edited?: boolean | null
          id?: string
          media_url?: string | null
          read?: boolean | null
          receiver_id?: string
          reply_to_id?: string | null
          sender_id?: string
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_reply_to_id_fkey"
            columns: ["reply_to_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          about: string | null
          age: number | null
          alcohol_level: string | null
          avatar_url: string | null
          city: string | null
          created_at: string
          drinks: string[] | null
          id: string
          interests: string[] | null
          name: string
          online: boolean | null
          rating: number | null
          rating_count: number | null
          updated_at: string
          user_id: string
          vibe: string | null
        }
        Insert: {
          about?: string | null
          age?: number | null
          alcohol_level?: string | null
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          drinks?: string[] | null
          id?: string
          interests?: string[] | null
          name?: string
          online?: boolean | null
          rating?: number | null
          rating_count?: number | null
          updated_at?: string
          user_id: string
          vibe?: string | null
        }
        Update: {
          about?: string | null
          age?: number | null
          alcohol_level?: string | null
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          drinks?: string[] | null
          id?: string
          interests?: string[] | null
          name?: string
          online?: boolean | null
          rating?: number | null
          rating_count?: number | null
          updated_at?: string
          user_id?: string
          vibe?: string | null
        }
        Relationships: []
      }
      user_ratings: {
        Row: {
          created_at: string
          id: string
          rated_id: string
          rater_id: string
          rating: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          rated_id: string
          rater_id: string
          rating: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          rated_id?: string
          rater_id?: string
          rating?: number
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      confirm_brudershaft: {
        Args: { _code: string; _meeting_id: string }
        Returns: boolean
      }
      get_my_profile_id: { Args: never; Returns: string }
      is_blocked: { Args: { _user1: string; _user2: string }; Returns: boolean }
      is_meeting_participant: {
        Args: { _meeting_id: string }
        Returns: boolean
      }
    }
    Enums: {
      event_status: "pending" | "confirmed" | "cancelled"
      meeting_status: "pending" | "confirmed" | "declined"
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
      event_status: ["pending", "confirmed", "cancelled"],
      meeting_status: ["pending", "confirmed", "declined"],
    },
  },
} as const
