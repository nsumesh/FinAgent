import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://aamdplumyfwulrvkuaxi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhbWRwbHVteWZ3dWxydmt1YXhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5NzAxOTYsImV4cCI6MjA2NDU0NjE5Nn0.uk0HxUNhhCrVm6Y_cfzX3wLO4pzTKclYmC191YUNIfk';

export const supabase = createClient(supabaseUrl, supabaseKey);
