import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yvgowejvyvqdckjfabag.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2Z293ZWp2eXZxZGNramZhYmFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzODQ3NDIsImV4cCI6MjA1OTk2MDc0Mn0.-KPnr9Zv50c6zOM5VuqXEXSTo74mYllgLrvduR9QKH4';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);