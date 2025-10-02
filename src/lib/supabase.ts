import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  featured_image: string;
  author: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Image {
  id: string;
  name: string;
  url: string;
  size: number;
  uploaded_at: string;
}

export interface PageContent {
  id: string;
  page_id: string;
  title?: string;
  subtitle?: string;
  content: Record<string, any>;
  images: string[];
  updated_at: string;
}
