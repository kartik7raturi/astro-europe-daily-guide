export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      ashtakoot_analysis: {
        Row: {
          bhakoot_points: number | null
          compatibility_reading_id: string
          created_at: string
          gana_points: number | null
          graha_maitri_points: number | null
          id: string
          nadi_points: number | null
          tara_points: number | null
          total_points: number | null
          varna_points: number | null
          vashya_points: number | null
          yoni_points: number | null
        }
        Insert: {
          bhakoot_points?: number | null
          compatibility_reading_id: string
          created_at?: string
          gana_points?: number | null
          graha_maitri_points?: number | null
          id?: string
          nadi_points?: number | null
          tara_points?: number | null
          total_points?: number | null
          varna_points?: number | null
          vashya_points?: number | null
          yoni_points?: number | null
        }
        Update: {
          bhakoot_points?: number | null
          compatibility_reading_id?: string
          created_at?: string
          gana_points?: number | null
          graha_maitri_points?: number | null
          id?: string
          nadi_points?: number | null
          tara_points?: number | null
          total_points?: number | null
          varna_points?: number | null
          vashya_points?: number | null
          yoni_points?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ashtakoot_analysis_compatibility_reading_id_fkey"
            columns: ["compatibility_reading_id"]
            isOneToOne: false
            referencedRelation: "compatibility_readings"
            referencedColumns: ["id"]
          },
        ]
      }
      astology: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      compatibility_readings: {
        Row: {
          advice: string | null
          challenges: string[] | null
          compatibility_score: number
          created_at: string
          detailed_analysis: string | null
          id: string
          matching_qualities: number
          partner_dob: string
          partner_name: string
          partner_place_of_birth: string
          partner_time_of_birth: string | null
          soulmate_sketch: string | null
          strengths: string[] | null
          total_qualities: number
          user_id: string
        }
        Insert: {
          advice?: string | null
          challenges?: string[] | null
          compatibility_score?: number
          created_at?: string
          detailed_analysis?: string | null
          id?: string
          matching_qualities?: number
          partner_dob: string
          partner_name: string
          partner_place_of_birth: string
          partner_time_of_birth?: string | null
          soulmate_sketch?: string | null
          strengths?: string[] | null
          total_qualities?: number
          user_id: string
        }
        Update: {
          advice?: string | null
          challenges?: string[] | null
          compatibility_score?: number
          created_at?: string
          detailed_analysis?: string | null
          id?: string
          matching_qualities?: number
          partner_dob?: string
          partner_name?: string
          partner_place_of_birth?: string
          partner_time_of_birth?: string | null
          soulmate_sketch?: string | null
          strengths?: string[] | null
          total_qualities?: number
          user_id?: string
        }
        Relationships: []
      }
      daily_readings: {
        Row: {
          advice: string | null
          career_guidance: string | null
          challenges: string | null
          created_at: string
          health_guidance: string | null
          id: string
          love_guidance: string | null
          lucky_numbers: number[]
          overview: string
          power_colors: string[]
          reading_date: string
          solutions: string | null
          user_id: string
        }
        Insert: {
          advice?: string | null
          career_guidance?: string | null
          challenges?: string | null
          created_at?: string
          health_guidance?: string | null
          id?: string
          love_guidance?: string | null
          lucky_numbers?: number[]
          overview: string
          power_colors?: string[]
          reading_date?: string
          solutions?: string | null
          user_id: string
        }
        Update: {
          advice?: string | null
          career_guidance?: string | null
          challenges?: string | null
          created_at?: string
          health_guidance?: string | null
          id?: string
          love_guidance?: string | null
          lucky_numbers?: number[]
          overview?: string
          power_colors?: string[]
          reading_date?: string
          solutions?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          date_of_birth: string
          full_name: string
          id: string
          latitude: number | null
          longitude: number | null
          place_of_birth: string
          questions: string | null
          time_of_birth: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date_of_birth: string
          full_name: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          place_of_birth: string
          questions?: string | null
          time_of_birth?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date_of_birth?: string
          full_name?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          place_of_birth?: string
          questions?: string | null
          time_of_birth?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
