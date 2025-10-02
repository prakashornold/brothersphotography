/*
  # Create Blog System Tables

  1. New Tables
    - `blog_posts`
      - `id` (uuid, primary key)
      - `title` (text)
      - `slug` (text, unique)
      - `excerpt` (text)
      - `content` (text)
      - `category` (text)
      - `tags` (text array)
      - `featured_image` (text)
      - `author` (text)
      - `published` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `images`
      - `id` (uuid, primary key)
      - `name` (text)
      - `url` (text)
      - `size` (integer)
      - `uploaded_at` (timestamptz)

    - `page_content`
      - `id` (uuid, primary key)
      - `page_id` (text, unique)
      - `title` (text)
      - `subtitle` (text)
      - `content` (jsonb)
      - `images` (text array)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access
    - Add policies for authenticated write access (admin)
*/

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text NOT NULL,
  content text NOT NULL,
  category text NOT NULL,
  tags text[] DEFAULT '{}',
  featured_image text NOT NULL,
  author text DEFAULT 'Admin',
  published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create images table
CREATE TABLE IF NOT EXISTS images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  url text NOT NULL,
  size integer DEFAULT 0,
  uploaded_at timestamptz DEFAULT now()
);

-- Create page_content table
CREATE TABLE IF NOT EXISTS page_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id text UNIQUE NOT NULL,
  title text,
  subtitle text,
  content jsonb DEFAULT '{}',
  images text[] DEFAULT '{}',
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE images ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public can read published blog posts"
  ON blog_posts FOR SELECT
  USING (published = true);

CREATE POLICY "Public can read images"
  ON images FOR SELECT
  USING (true);

CREATE POLICY "Public can read page content"
  ON page_content FOR SELECT
  USING (true);

-- Admin write policies (allowing all operations without auth for now)
CREATE POLICY "Allow all blog post operations"
  ON blog_posts FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all image operations"
  ON images FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all page content operations"
  ON page_content FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON blog_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_content_page_id ON page_content(page_id);
