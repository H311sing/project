import { Database as SupabaseDatabase } from './supabase';

export type Database = SupabaseDatabase;

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Contest = Database['public']['Tables']['contests']['Row'];
export type Idea = Database['public']['Tables']['ideas']['Row'];

export type Tables = Database['public']['Tables'];