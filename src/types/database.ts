import type { CategoryType } from "@/types/category";
import type { PaymentMethod } from "@/types/transaction";

export type Database = {
  public: {
    Tables: {
      app_settings: {
        Row: {
          id: string;
          currency: "KRW";
          default_payment_method: PaymentMethod;
          last_used_category_id: string | null;
          updated_at: string;
        };
        Insert: {
          id: string;
          currency?: "KRW";
          default_payment_method?: PaymentMethod;
          last_used_category_id?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          currency?: "KRW";
          default_payment_method?: PaymentMethod;
          last_used_category_id?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "app_settings_last_used_category_id_fkey";
            columns: ["last_used_category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          }
        ];
      };
      budgets: {
        Row: {
          id: string;
          month: string;
          category_id: string | null;
          amount: number;
          created_at: string;
        };
        Insert: {
          id: string;
          month: string;
          category_id?: string | null;
          amount: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          month?: string;
          category_id?: string | null;
          amount?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "budgets_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          }
        ];
      };
      categories: {
        Row: {
          id: string;
          name: string;
          type: CategoryType;
          color: string;
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          type: CategoryType;
          color: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          type?: CategoryType;
          color?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      transactions: {
        Row: {
          id: string;
          type: CategoryType;
          amount: number;
          category_id: string;
          payment_method: PaymentMethod;
          memo: string;
          transaction_date: string;
          created_at: string;
        };
        Insert: {
          id: string;
          type: CategoryType;
          amount: number;
          category_id: string;
          payment_method: PaymentMethod;
          memo?: string;
          transaction_date: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          type?: CategoryType;
          amount?: number;
          category_id?: string;
          payment_method?: PaymentMethod;
          memo?: string;
          transaction_date?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "transactions_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
