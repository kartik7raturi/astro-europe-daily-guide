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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      affiliate_orders: {
        Row: {
          affiliate_id: string
          commission_amount: number
          commission_paid: boolean
          created_at: string
          id: string
          order_amount: number
          order_id: string
        }
        Insert: {
          affiliate_id: string
          commission_amount: number
          commission_paid?: boolean
          created_at?: string
          id?: string
          order_amount: number
          order_id: string
        }
        Update: {
          affiliate_id?: string
          commission_amount?: number
          commission_paid?: boolean
          created_at?: string
          id?: string
          order_amount?: number
          order_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_orders_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "affiliate_orders_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliates: {
        Row: {
          affiliate_code: string
          commission_rate: number
          created_at: string
          id: string
          payment_details: Json | null
          pending_earnings: number
          status: string
          total_earnings: number
          total_referrals: number
          updated_at: string
          user_id: string
        }
        Insert: {
          affiliate_code: string
          commission_rate?: number
          created_at?: string
          id?: string
          payment_details?: Json | null
          pending_earnings?: number
          status?: string
          total_earnings?: number
          total_referrals?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          affiliate_code?: string
          commission_rate?: number
          created_at?: string
          id?: string
          payment_details?: Json | null
          pending_earnings?: number
          status?: string
          total_earnings?: number
          total_referrals?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
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
      astro_calendar: {
        Row: {
          avoid_activities: string[] | null
          created_at: string
          date: string
          energy_level: number | null
          good_activities: string[] | null
          id: string
          moon_phase: string | null
          planetary_transits: Json | null
        }
        Insert: {
          avoid_activities?: string[] | null
          created_at?: string
          date: string
          energy_level?: number | null
          good_activities?: string[] | null
          id?: string
          moon_phase?: string | null
          planetary_transits?: Json | null
        }
        Update: {
          avoid_activities?: string[] | null
          created_at?: string
          date?: string
          energy_level?: number | null
          good_activities?: string[] | null
          id?: string
          moon_phase?: string | null
          planetary_transits?: Json | null
        }
        Relationships: []
      }
      astro_journal: {
        Row: {
          created_at: string
          daily_events: string | null
          entry_date: string
          id: string
          mood_rating: number | null
          moon_phase: string | null
          personal_notes: string | null
          planetary_influences: string | null
          prediction_accuracy: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          daily_events?: string | null
          entry_date?: string
          id?: string
          mood_rating?: number | null
          moon_phase?: string | null
          personal_notes?: string | null
          planetary_influences?: string | null
          prediction_accuracy?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          daily_events?: string | null
          entry_date?: string
          id?: string
          mood_rating?: number | null
          moon_phase?: string | null
          personal_notes?: string | null
          planetary_influences?: string | null
          prediction_accuracy?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      astrologers: {
        Row: {
          availability: Json | null
          bio: string | null
          consultation_types: string[] | null
          created_at: string
          experience_years: number | null
          hourly_rate: number | null
          id: string
          image_url: string | null
          intro_video_url: string | null
          is_available: boolean | null
          languages: string[] | null
          name: string
          rating: number | null
          specialization: string | null
          status: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          availability?: Json | null
          bio?: string | null
          consultation_types?: string[] | null
          created_at?: string
          experience_years?: number | null
          hourly_rate?: number | null
          id?: string
          image_url?: string | null
          intro_video_url?: string | null
          is_available?: boolean | null
          languages?: string[] | null
          name: string
          rating?: number | null
          specialization?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          availability?: Json | null
          bio?: string | null
          consultation_types?: string[] | null
          created_at?: string
          experience_years?: number | null
          hourly_rate?: number | null
          id?: string
          image_url?: string | null
          intro_video_url?: string | null
          is_available?: boolean | null
          languages?: string[] | null
          name?: string
          rating?: number | null
          specialization?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      birth_charts: {
        Row: {
          aspects: Json | null
          chart_data: Json | null
          chart_type: string
          created_at: string
          houses: Json | null
          id: string
          planets: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          aspects?: Json | null
          chart_data?: Json | null
          chart_type?: string
          created_at?: string
          houses?: Json | null
          id?: string
          planets?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          aspects?: Json | null
          chart_data?: Json | null
          chart_type?: string
          created_at?: string
          houses?: Json | null
          id?: string
          planets?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          category: string | null
          content: string
          created_at: string
          excerpt: string | null
          featured_image: string | null
          id: string
          published: boolean | null
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          published?: boolean | null
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          published?: boolean | null
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          created_at: string
          id: string
          product_id: string
          quantity: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          quantity?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          quantity?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_conversations: {
        Row: {
          created_at: string
          id: string
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          role: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          role: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      color_therapy: {
        Row: {
          avoid_colors: string[]
          color_meanings: Json
          created_at: string
          date: string
          id: string
          primary_color: string
          secondary_colors: string[]
          usage_suggestions: string[]
          user_id: string
        }
        Insert: {
          avoid_colors: string[]
          color_meanings: Json
          created_at?: string
          date?: string
          id?: string
          primary_color: string
          secondary_colors: string[]
          usage_suggestions: string[]
          user_id: string
        }
        Update: {
          avoid_colors?: string[]
          color_meanings?: Json
          created_at?: string
          date?: string
          id?: string
          primary_color?: string
          secondary_colors?: string[]
          usage_suggestions?: string[]
          user_id?: string
        }
        Relationships: []
      }
      combo_offers: {
        Row: {
          created_at: string
          description: string | null
          discount_percentage: number
          id: string
          is_active: boolean | null
          min_quantity: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          discount_percentage: number
          id?: string
          is_active?: boolean | null
          min_quantity: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          discount_percentage?: number
          id?: string
          is_active?: boolean | null
          min_quantity?: number
          updated_at?: string
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
      consultation_bookings: {
        Row: {
          amount: number
          astrologer_earning: number
          astrologer_id: string
          consultation_type: string
          created_at: string
          duration_minutes: number
          id: string
          notes: string | null
          payment_id: string | null
          payment_status: string
          platform_commission: number
          rating: number | null
          review_text: string | null
          scheduled_at: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          astrologer_earning?: number
          astrologer_id: string
          consultation_type?: string
          created_at?: string
          duration_minutes?: number
          id?: string
          notes?: string | null
          payment_id?: string | null
          payment_status?: string
          platform_commission?: number
          rating?: number | null
          review_text?: string | null
          scheduled_at: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          astrologer_earning?: number
          astrologer_id?: string
          consultation_type?: string
          created_at?: string
          duration_minutes?: number
          id?: string
          notes?: string | null
          payment_id?: string | null
          payment_status?: string
          platform_commission?: number
          rating?: number | null
          review_text?: string | null
          scheduled_at?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "consultation_bookings_astrologer_id_fkey"
            columns: ["astrologer_id"]
            isOneToOne: false
            referencedRelation: "astrologers"
            referencedColumns: ["id"]
          },
        ]
      }
      consultation_messages: {
        Row: {
          booking_id: string
          created_at: string
          id: string
          is_read: boolean | null
          message: string
          message_type: string
          sender_id: string
        }
        Insert: {
          booking_id: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          message: string
          message_type?: string
          sender_id: string
        }
        Update: {
          booking_id?: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string
          message_type?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "consultation_messages_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "consultation_bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      consultations: {
        Row: {
          astrologer_name: string
          consultation_type: string
          created_at: string
          duration_minutes: number | null
          id: string
          notes: string | null
          price: number | null
          scheduled_at: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          astrologer_name: string
          consultation_type: string
          created_at?: string
          duration_minutes?: number | null
          id?: string
          notes?: string | null
          price?: number | null
          scheduled_at?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          astrologer_name?: string
          consultation_type?: string
          created_at?: string
          duration_minutes?: number | null
          id?: string
          notes?: string | null
          price?: number | null
          scheduled_at?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      coupon_codes: {
        Row: {
          applicable_to: string
          code: string
          created_at: string
          current_uses: number
          discount_amount: number | null
          discount_percentage: number
          discount_type: string
          expires_at: string | null
          id: string
          is_active: boolean
          max_uses: number
          updated_at: string
        }
        Insert: {
          applicable_to?: string
          code: string
          created_at?: string
          current_uses?: number
          discount_amount?: number | null
          discount_percentage: number
          discount_type?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          max_uses?: number
          updated_at?: string
        }
        Update: {
          applicable_to?: string
          code?: string
          created_at?: string
          current_uses?: number
          discount_amount?: number | null
          discount_percentage?: number
          discount_type?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          max_uses?: number
          updated_at?: string
        }
        Relationships: []
      }
      crush_analysis: {
        Row: {
          analysis_text: string | null
          compatibility_score: number | null
          created_at: string
          crush_birthdate: string | null
          crush_name: string
          daily_insight: string | null
          id: string
          thinking_about_you_percentage: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          analysis_text?: string | null
          compatibility_score?: number | null
          created_at?: string
          crush_birthdate?: string | null
          crush_name: string
          daily_insight?: string | null
          id?: string
          thinking_about_you_percentage?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          analysis_text?: string | null
          compatibility_score?: number | null
          created_at?: string
          crush_birthdate?: string | null
          crush_name?: string
          daily_insight?: string | null
          id?: string
          thinking_about_you_percentage?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      daily_affirmations: {
        Row: {
          affirmation_text: string
          created_at: string
          date: string
          id: string
          is_favorite: boolean | null
          numerology_number: number | null
          user_id: string
          zodiac_sign: string | null
        }
        Insert: {
          affirmation_text: string
          created_at?: string
          date?: string
          id?: string
          is_favorite?: boolean | null
          numerology_number?: number | null
          user_id: string
          zodiac_sign?: string | null
        }
        Update: {
          affirmation_text?: string
          created_at?: string
          date?: string
          id?: string
          is_favorite?: boolean | null
          numerology_number?: number | null
          user_id?: string
          zodiac_sign?: string | null
        }
        Relationships: []
      }
      daily_guidance: {
        Row: {
          created_at: string
          date: string
          focus_areas: string[]
          guidance_text: string
          id: string
          lucky_activities: string[]
          user_id: string
        }
        Insert: {
          created_at?: string
          date?: string
          focus_areas: string[]
          guidance_text: string
          id?: string
          lucky_activities: string[]
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          focus_areas?: string[]
          guidance_text?: string
          id?: string
          lucky_activities?: string[]
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
      life_career_analysis: {
        Row: {
          analysis_date: string
          career_predictions: string
          challenges: Json
          created_at: string
          financial_outlook: string
          id: string
          life_path_insights: string
          opportunities: Json
          recommendations: Json
          timing_predictions: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          analysis_date?: string
          career_predictions: string
          challenges?: Json
          created_at?: string
          financial_outlook: string
          id?: string
          life_path_insights: string
          opportunities?: Json
          recommendations?: Json
          timing_predictions?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          analysis_date?: string
          career_predictions?: string
          challenges?: Json
          created_at?: string
          financial_outlook?: string
          id?: string
          life_path_insights?: string
          opportunities?: Json
          recommendations?: Json
          timing_predictions?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      love_forecasts: {
        Row: {
          career_advice: string | null
          career_score: number | null
          created_at: string
          date: string
          finance_advice: string | null
          finance_score: number | null
          id: string
          love_advice: string | null
          love_score: number | null
          lucky_love_time: string | null
          soulmate_sketch: string | null
          user_id: string
        }
        Insert: {
          career_advice?: string | null
          career_score?: number | null
          created_at?: string
          date?: string
          finance_advice?: string | null
          finance_score?: number | null
          id?: string
          love_advice?: string | null
          love_score?: number | null
          lucky_love_time?: string | null
          soulmate_sketch?: string | null
          user_id: string
        }
        Update: {
          career_advice?: string | null
          career_score?: number | null
          created_at?: string
          date?: string
          finance_advice?: string | null
          finance_score?: number | null
          id?: string
          love_advice?: string | null
          love_score?: number | null
          lucky_love_time?: string | null
          soulmate_sketch?: string | null
          user_id?: string
        }
        Relationships: []
      }
      lucky_elements: {
        Row: {
          created_at: string
          date: string
          direction: string | null
          gemstone: string | null
          id: string
          lucky_color: string | null
          lucky_number: number | null
          lucky_time: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          date?: string
          direction?: string | null
          gemstone?: string | null
          id?: string
          lucky_color?: string | null
          lucky_number?: number | null
          lucky_time?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          direction?: string | null
          gemstone?: string | null
          id?: string
          lucky_color?: string | null
          lucky_number?: number | null
          lucky_time?: string | null
          user_id?: string
        }
        Relationships: []
      }
      lucky_numbers: {
        Row: {
          created_at: string
          daily_numbers: number[]
          date: string
          id: string
          lottery_numbers: number[]
          monthly_numbers: number[]
          user_id: string
          weekly_numbers: number[]
        }
        Insert: {
          created_at?: string
          daily_numbers: number[]
          date?: string
          id?: string
          lottery_numbers: number[]
          monthly_numbers: number[]
          user_id: string
          weekly_numbers: number[]
        }
        Update: {
          created_at?: string
          daily_numbers?: number[]
          date?: string
          id?: string
          lottery_numbers?: number[]
          monthly_numbers?: number[]
          user_id?: string
          weekly_numbers?: number[]
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          subscribed: boolean
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          subscribed?: boolean
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          subscribed?: boolean
        }
        Relationships: []
      }
      numerology_reports: {
        Row: {
          created_at: string
          destiny_number: number | null
          detailed_report: string | null
          id: string
          life_path_number: number | null
          name_analysis: Json | null
          personality_number: number | null
          soul_urge_number: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          destiny_number?: number | null
          detailed_report?: string | null
          id?: string
          life_path_number?: number | null
          name_analysis?: Json | null
          personality_number?: number | null
          soul_urge_number?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          destiny_number?: number | null
          detailed_report?: string | null
          id?: string
          life_path_number?: number | null
          name_analysis?: Json | null
          personality_number?: number | null
          soul_urge_number?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          affiliate_code: string | null
          amount: number
          created_at: string
          currency: string
          customer_email: string | null
          customer_name: string | null
          customer_phone: string | null
          id: string
          metadata: Json | null
          order_id: string | null
          order_type: string
          payment_id: string | null
          payment_provider: string
          quantity: number
          shipping_address: Json | null
          status: string
          status_history: Json | null
          tracking_number: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          affiliate_code?: string | null
          amount: number
          created_at?: string
          currency?: string
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          id?: string
          metadata?: Json | null
          order_id?: string | null
          order_type: string
          payment_id?: string | null
          payment_provider?: string
          quantity?: number
          shipping_address?: Json | null
          status?: string
          status_history?: Json | null
          tracking_number?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          affiliate_code?: string | null
          amount?: number
          created_at?: string
          currency?: string
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          id?: string
          metadata?: Json | null
          order_id?: string | null
          order_type?: string
          payment_id?: string | null
          payment_provider?: string
          quantity?: number
          shipping_address?: Json | null
          status?: string
          status_history?: Json | null
          tracking_number?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      personal_readings: {
        Row: {
          created_at: string
          id: string
          priority: string
          questions: string[]
          reading_type: string
          responses: string[]
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          priority?: string
          questions: string[]
          reading_type: string
          responses: string[]
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          priority?: string
          questions?: string[]
          reading_type?: string
          responses?: string[]
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      platform_settings: {
        Row: {
          created_at: string
          id: string
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      predictions: {
        Row: {
          content: string
          created_at: string
          dasha_info: Json | null
          id: string
          numerology_forecast: Json | null
          period_end: string
          period_start: string
          prediction_type: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          dasha_info?: Json | null
          id?: string
          numerology_forecast?: Json | null
          period_end: string
          period_start: string
          prediction_type: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          dasha_info?: Json | null
          id?: string
          numerology_forecast?: Json | null
          period_end?: string
          period_start?: string
          prediction_type?: string
          user_id?: string
        }
        Relationships: []
      }
      pricing_plans: {
        Row: {
          created_at: string
          credits: number | null
          description: string | null
          display_order: number | null
          features: string[]
          gradient: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          is_popular: boolean | null
          name: string
          period: string
          price: number
          sketches: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          credits?: number | null
          description?: string | null
          display_order?: number | null
          features?: string[]
          gradient?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          is_popular?: boolean | null
          name: string
          period?: string
          price?: number
          sketches?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          credits?: number | null
          description?: string | null
          display_order?: number | null
          features?: string[]
          gradient?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          is_popular?: boolean | null
          name?: string
          period?: string
          price?: number
          sketches?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      problem_solutions: {
        Row: {
          astrological_solution: string
          created_at: string
          id: string
          problem_category: string
          problem_description: string
          recommended_actions: string[]
          status: string
          timeline: string
          updated_at: string
          urgency_level: string
          user_id: string
        }
        Insert: {
          astrological_solution: string
          created_at?: string
          id?: string
          problem_category: string
          problem_description: string
          recommended_actions: string[]
          status?: string
          timeline: string
          updated_at?: string
          urgency_level?: string
          user_id: string
        }
        Update: {
          astrological_solution?: string
          created_at?: string
          id?: string
          problem_category?: string
          problem_description?: string
          recommended_actions?: string[]
          status?: string
          timeline?: string
          updated_at?: string
          urgency_level?: string
          user_id?: string
        }
        Relationships: []
      }
      product_reviews: {
        Row: {
          created_at: string
          id: string
          product_id: string
          rating: number
          review_text: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          rating: number
          review_text?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          rating?: number
          review_text?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          additional_images: string[] | null
          category: string | null
          created_at: string
          description: string | null
          features: Json | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          price: number
          updated_at: string
        }
        Insert: {
          additional_images?: string[] | null
          category?: string | null
          created_at?: string
          description?: string | null
          features?: Json | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          price: number
          updated_at?: string
        }
        Update: {
          additional_images?: string[] | null
          category?: string | null
          created_at?: string
          description?: string | null
          features?: Json | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          price?: number
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          date_of_birth: string
          full_name: string
          gender: string | null
          id: string
          latitude: number | null
          longitude: number | null
          place_of_birth: string
          profile_picture: string | null
          questions: string | null
          time_of_birth: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date_of_birth: string
          full_name: string
          gender?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          place_of_birth: string
          profile_picture?: string | null
          questions?: string | null
          time_of_birth?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date_of_birth?: string
          full_name?: string
          gender?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          place_of_birth?: string
          profile_picture?: string | null
          questions?: string | null
          time_of_birth?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      quiz_results: {
        Row: {
          answers: Json
          created_at: string
          id: string
          quiz_id: string
          result_text: string | null
          score: number | null
          shareable_result: string | null
          user_id: string
        }
        Insert: {
          answers: Json
          created_at?: string
          id?: string
          quiz_id: string
          result_text?: string | null
          score?: number | null
          shareable_result?: string | null
          user_id: string
        }
        Update: {
          answers?: Json
          created_at?: string
          id?: string
          quiz_id?: string
          result_text?: string | null
          score?: number | null
          shareable_result?: string | null
          user_id?: string
        }
        Relationships: []
      }
      saved_items: {
        Row: {
          created_at: string
          id: string
          item_id: string
          item_type: string
          title: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          item_id: string
          item_type: string
          title?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          item_id?: string
          item_type?: string
          title?: string | null
          user_id?: string
        }
        Relationships: []
      }
      soulmate_readings: {
        Row: {
          created_at: string
          generation_date: string | null
          id: string
          karmic_bond_reading: string | null
          love_percentage: number | null
          meeting_place_prediction: string | null
          meeting_time_prediction: string | null
          soulmate_description: string | null
          soulmate_sketch_url: string | null
          twin_flame_analysis: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          generation_date?: string | null
          id?: string
          karmic_bond_reading?: string | null
          love_percentage?: number | null
          meeting_place_prediction?: string | null
          meeting_time_prediction?: string | null
          soulmate_description?: string | null
          soulmate_sketch_url?: string | null
          twin_flame_analysis?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          generation_date?: string | null
          id?: string
          karmic_bond_reading?: string | null
          love_percentage?: number | null
          meeting_place_prediction?: string | null
          meeting_time_prediction?: string | null
          soulmate_description?: string | null
          soulmate_sketch_url?: string | null
          twin_flame_analysis?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      sponsors: {
        Row: {
          created_at: string
          display_order: number | null
          id: string
          image_url: string
          is_active: boolean | null
          link_url: string
          name: string
          pages: string[] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number | null
          id?: string
          image_url: string
          is_active?: boolean | null
          link_url: string
          name: string
          pages?: string[] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number | null
          id?: string
          image_url?: string
          is_active?: boolean | null
          link_url?: string
          name?: string
          pages?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          stripe_customer_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_tier: string | null
          trial_end: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          trial_end?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          trial_end?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      support_messages: {
        Row: {
          created_at: string
          id: string
          is_read: boolean | null
          message: string
          sender_id: string
          sender_type: string
          ticket_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message: string
          sender_id: string
          sender_type: string
          ticket_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string
          sender_id?: string
          sender_type?: string
          ticket_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_messages_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          created_at: string
          id: string
          priority: string | null
          status: string
          subject: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          priority?: string | null
          status?: string
          subject: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          priority?: string | null
          status?: string
          subject?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_credits: {
        Row: {
          created_at: string
          credits_remaining: number
          id: string
          last_updated: string
          total_credits_purchased: number
          user_id: string
        }
        Insert: {
          created_at?: string
          credits_remaining?: number
          id?: string
          last_updated?: string
          total_credits_purchased?: number
          user_id: string
        }
        Update: {
          created_at?: string
          credits_remaining?: number
          id?: string
          last_updated?: string
          total_credits_purchased?: number
          user_id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string
          daily_notifications: boolean | null
          horoscope_type: string | null
          id: string
          language: string | null
          monthly_notifications: boolean | null
          notification_time: string | null
          theme: string | null
          theme_color: string | null
          updated_at: string
          user_id: string
          weekly_notifications: boolean | null
        }
        Insert: {
          created_at?: string
          daily_notifications?: boolean | null
          horoscope_type?: string | null
          id?: string
          language?: string | null
          monthly_notifications?: boolean | null
          notification_time?: string | null
          theme?: string | null
          theme_color?: string | null
          updated_at?: string
          user_id: string
          weekly_notifications?: boolean | null
        }
        Update: {
          created_at?: string
          daily_notifications?: boolean | null
          horoscope_type?: string | null
          id?: string
          language?: string | null
          monthly_notifications?: boolean | null
          notification_time?: string | null
          theme?: string | null
          theme_color?: string | null
          updated_at?: string
          user_id?: string
          weekly_notifications?: boolean | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          created_at: string
          default_address: Json | null
          display_name: string | null
          id: string
          language: string | null
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          default_address?: Json | null
          display_name?: string | null
          id?: string
          language?: string | null
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          default_address?: Json | null
          display_name?: string | null
          id?: string
          language?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_streaks: {
        Row: {
          created_at: string
          current_streak: number | null
          id: string
          last_visit_date: string | null
          longest_streak: number | null
          reward_points: number | null
          streak_type: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_streak?: number | null
          id?: string
          last_visit_date?: string | null
          longest_streak?: number | null
          reward_points?: number | null
          streak_type?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_streak?: number | null
          id?: string
          last_visit_date?: string | null
          longest_streak?: number | null
          reward_points?: number | null
          streak_type?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      wallet_transactions: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          reference_id: string | null
          type: string
          user_id: string
          wallet_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          id?: string
          reference_id?: string | null
          type: string
          user_id: string
          wallet_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          reference_id?: string | null
          type?: string
          user_id?: string
          wallet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallet_transactions_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      wallets: {
        Row: {
          balance: number
          created_at: string
          id: string
          total_earned: number
          total_withdrawn: number
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number
          created_at?: string
          id?: string
          total_earned?: number
          total_withdrawn?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number
          created_at?: string
          id?: string
          total_earned?: number
          total_withdrawn?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      wishlist: {
        Row: {
          created_at: string
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlist_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      withdrawal_requests: {
        Row: {
          admin_notes: string | null
          amount: number
          created_at: string
          id: string
          payment_details: Json | null
          payment_method: string | null
          processed_at: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          amount: number
          created_at?: string
          id?: string
          payment_details?: Json | null
          payment_method?: string | null
          processed_at?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          amount?: number
          created_at?: string
          id?: string
          payment_details?: Json | null
          payment_method?: string | null
          processed_at?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      product_reviews_with_profiles: {
        Row: {
          created_at: string | null
          id: string | null
          product_id: string | null
          rating: number | null
          review_text: string | null
          reviewer_name: string | null
          updated_at: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      request_http: {
        Args: { body?: string; headers?: Json; method?: string; url: string }
        Returns: Json
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
