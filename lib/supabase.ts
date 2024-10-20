import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// biome-ignore lint/style/noNonNullAssertion: <explanation>
export const supabase = createClient(supabaseUrl!, supabaseKey!)
