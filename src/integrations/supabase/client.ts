// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://pfrnsaftvtkaeimcwgbd.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmcm5zYWZ0dnRrYWVpbWN3Z2JkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0NzE3MjcsImV4cCI6MjA2NjA0NzcyN30.CnxfjchEWPQTcjcyDYiuAqOF6J7e_oyNIk9fA61Ixqw";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);