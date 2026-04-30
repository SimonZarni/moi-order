import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';

export const supabaseClient = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

export const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-e3052afd`;
