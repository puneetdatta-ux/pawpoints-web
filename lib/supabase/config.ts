// Public anon credentials — safe to ship to the browser; access is governed by RLS.
export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ohvndmcybxvahjmmjujn.supabase.co";
export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9odm5kbWN5Ynh2YWhqbW1qdWpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5MzU5NDksImV4cCI6MjA5MjUxMTk0OX0.nEhbefpd_I3ES_s23ocM8Z-hLY8eCirQ03Sr1BN1JRg";
