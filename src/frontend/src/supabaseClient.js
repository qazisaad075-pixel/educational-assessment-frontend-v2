import { createClient } from "@supabase/supabase-js";

// ✅ ENV SAFE VERSION (BEST PRACTICE)
const supabaseUrl = "https://ntddhsbltawtgdvhnetq.supabase.co";
const supabaseAnonKey =
  "sb_publishable_VmuMzn6rayAbCZYYA7EV-w_LjawZPDs";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);