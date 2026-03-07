/* ─────────────────────────────────────────────────────────────
   Types générés depuis supabase/schema.sql
   Régénérer avec : npx supabase gen types typescript > src/lib/supabase/types.ts
───────────────────────────────────────────────────────────── */

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name: string;
          category: string;
          price: number;
          formats: string[];
          desc: string;
          available: boolean;
          tag: string;
          img: string;
          color: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'created_at'>;
        Update: Partial<Database['public']['Tables']['products']['Insert']>;
      };
      reviews: {
        Row: {
          id: string;
          name: string;
          text: string;
          rating: number;
          approved: boolean;
          date: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['reviews']['Row'], 'created_at'>;
        Update: Partial<Database['public']['Tables']['reviews']['Insert']>;
      };
      blogs: {
        Row: {
          id: string;
          title: string;
          category: string;
          content: string;
          published: boolean;
          date: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['blogs']['Row'], 'created_at'>;
        Update: Partial<Database['public']['Tables']['blogs']['Insert']>;
      };
      locations: {
        Row: {
          id: string;
          name: string;
          address: string;
          type: string;
          active: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['locations']['Row'], 'created_at'>;
        Update: Partial<Database['public']['Tables']['locations']['Insert']>;
      };
      subscribers: {
        Row: {
          id: string;
          email: string;
          date: string;
          active: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['subscribers']['Row'], 'created_at'>;
        Update: Partial<Database['public']['Tables']['subscribers']['Insert']>;
      };
      messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          message: string;
          read: boolean;
          responded: boolean;
          date: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['messages']['Row'], 'created_at'>;
        Update: Partial<Database['public']['Tables']['messages']['Insert']>;
      };
      activity: {
        Row: {
          id: string;
          action: string;
          detail: string;
          date: string;
          type: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['activity']['Row'], 'created_at'>;
        Update: Partial<Database['public']['Tables']['activity']['Insert']>;
      };
      settings: {
        Row: { id: number; data: Json };
        Insert: { id?: number; data: Json };
        Update: { data?: Json };
      };
    };
  };
}
