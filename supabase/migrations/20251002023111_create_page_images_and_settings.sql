/*
  # Create Page Images and Site Settings Tables

  1. New Tables
    - `landing_page_images`
      - `id` (uuid, primary key)
      - `image_url` (text) - Image URL or base64 data
      - `image_name` (text) - Original filename
      - `alt_text` (text) - Accessibility text
      - `file_size` (integer) - File size in bytes
      - `display_order` (integer) - Order priority for display
      - `section` (text) - Which section (hero, gallery, etc.)
      - `is_active` (boolean) - Active/inactive status
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `home_page_images`
      - `id` (uuid, primary key)
      - `image_url` (text)
      - `image_name` (text)
      - `alt_text` (text)
      - `file_size` (integer)
      - `display_order` (integer)
      - `category` (text) - hero, gallery, testimonials, features, etc.
      - `caption` (text) - Optional caption/description
      - `is_active` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `site_settings`
      - `id` (uuid, primary key)
      - `setting_key` (text, unique) - Setting identifier (logo, site_title, etc.)
      - `setting_value` (text) - Setting value
      - `setting_type` (text) - Type of setting (image, text, json, etc.)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Public read access
    - Allow all operations for admin management
*/

-- Create landing_page_images table
CREATE TABLE IF NOT EXISTS landing_page_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  image_name text NOT NULL,
  alt_text text DEFAULT '',
  file_size integer DEFAULT 0,
  display_order integer DEFAULT 0,
  section text DEFAULT 'hero',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create home_page_images table
CREATE TABLE IF NOT EXISTS home_page_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  image_name text NOT NULL,
  alt_text text DEFAULT '',
  file_size integer DEFAULT 0,
  display_order integer DEFAULT 0,
  category text DEFAULT 'gallery',
  caption text DEFAULT '',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create site_settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key text UNIQUE NOT NULL,
  setting_value text NOT NULL,
  setting_type text DEFAULT 'text',
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE landing_page_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE home_page_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public can read active landing page images"
  ON landing_page_images FOR SELECT
  USING (is_active = true);

CREATE POLICY "Public can read active home page images"
  ON home_page_images FOR SELECT
  USING (is_active = true);

CREATE POLICY "Public can read site settings"
  ON site_settings FOR SELECT
  USING (true);

-- Admin write policies (allowing all operations)
CREATE POLICY "Allow all landing page images operations"
  ON landing_page_images FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all home page images operations"
  ON home_page_images FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all site settings operations"
  ON site_settings FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_landing_images_section ON landing_page_images(section);
CREATE INDEX IF NOT EXISTS idx_landing_images_order ON landing_page_images(display_order);
CREATE INDEX IF NOT EXISTS idx_landing_images_active ON landing_page_images(is_active);

CREATE INDEX IF NOT EXISTS idx_home_images_category ON home_page_images(category);
CREATE INDEX IF NOT EXISTS idx_home_images_order ON home_page_images(display_order);
CREATE INDEX IF NOT EXISTS idx_home_images_active ON home_page_images(is_active);

CREATE INDEX IF NOT EXISTS idx_site_settings_key ON site_settings(setting_key);

-- Insert default logo setting
INSERT INTO site_settings (setting_key, setting_value, setting_type)
VALUES ('site_logo', 'https://images.pexels.com/photos/1983032/pexels-photo-1983032.jpeg', 'image')
ON CONFLICT (setting_key) DO NOTHING;
