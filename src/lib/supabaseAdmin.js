// File: src/lib/supabaseAdmin.js
import { createClient } from "@supabase/supabase-js";

// Perhatikan: kita tidak menggunakan NEXT_PUBLIC_ di sini
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error(
    "Supabase URL and Service Role Key are required for admin client."
  );
}

// Inisialisasi client dengan kunci admin
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);
