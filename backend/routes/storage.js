const { createClient } = require('@supabase/supabase-js')

// Create a single supabase client for interacting with your database
const supabase = createClient('https://jrdvubrvartzcjhutrrw.supabase.co', process.env.SERVICE_RULE)
