import { createClient } from "@supabase/supabase-js"



  // Henter URL og API-nøgle til Supabase fra .env
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseKey = import.meta.env.VITE_SUPABASE_KEY
  
  const supabase = createClient(supabaseUrl, supabaseKey);

  export default supabase;