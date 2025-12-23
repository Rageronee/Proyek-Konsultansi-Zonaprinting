import { createClient } from "@supabase/supabase-js";

// Connection string from user:
// postgresql://postgres:[YOUR-PASSWORD]@db.thakmfvzviqdnsmqmvvh.supabase.co:5432/postgres

// For the frontend client (supabase-js), we need the Project URL and the Anon Key.
// The URL is derived from the host above.

const supabaseUrl = "https://thakmfvzviqdnsmqmvvh.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRoYWttZnZ6dmlxZG5zbXFtdnZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0OTI2OTcsImV4cCI6MjA4MjA2ODY5N30.T2lsb_F5vUGPZEODqXCaOnsvv4FYLcel31402iO4leY";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
