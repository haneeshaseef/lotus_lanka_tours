-- Lotus Lanka Tours - Initial Database Schema
-- Run this in Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─────────────────────────────────────────────
-- TOURS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tours (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug            TEXT UNIQUE NOT NULL,
  title           JSONB NOT NULL,           -- { en: "", si: "", ta: "" }
  description     JSONB NOT NULL,
  category        TEXT NOT NULL CHECK (category IN ('cultural','wildlife','beach','adventure','daytrip','multiday')),
  duration_days   INTEGER NOT NULL DEFAULT 1,
  max_group_size  INTEGER NOT NULL DEFAULT 12,
  difficulty      TEXT CHECK (difficulty IN ('easy','moderate','challenging')),
  price_per_person NUMERIC(10,2),
  price_private   NUMERIC(10,2),
  cover_image_url TEXT,
  gallery_images  TEXT[] DEFAULT '{}',
  itinerary       JSONB DEFAULT '[]',       -- [{ day, title: {en,si,ta}, description: {en,si,ta} }]
  includes        TEXT[] DEFAULT '{}',
  excludes        TEXT[] DEFAULT '{}',
  is_published    BOOLEAN DEFAULT FALSE,
  is_featured     BOOLEAN DEFAULT FALSE,
  meta_title      JSONB,
  meta_description JSONB,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- BLOG POSTS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS blog_posts (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug            TEXT UNIQUE NOT NULL,
  title           JSONB NOT NULL,
  content         JSONB NOT NULL,
  author          TEXT NOT NULL DEFAULT 'Lotus Lanka Team',
  category        TEXT,
  tags            TEXT[] DEFAULT '{}',
  cover_image_url TEXT,
  is_published    BOOLEAN DEFAULT FALSE,
  meta_title      JSONB,
  meta_description JSONB,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- REVIEWS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reviews (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tour_id          UUID REFERENCES tours(id) ON DELETE SET NULL,
  reviewer_name    TEXT NOT NULL,
  reviewer_country TEXT,
  rating           INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment          TEXT,
  is_approved      BOOLEAN DEFAULT FALSE,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- INQUIRIES
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS inquiries (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name           TEXT NOT NULL,
  email          TEXT NOT NULL,
  phone          TEXT,
  tour_id        UUID REFERENCES tours(id) ON DELETE SET NULL,
  tour_name_text TEXT,
  travel_date    DATE,
  guests         INTEGER DEFAULT 1,
  message        TEXT,
  locale         TEXT DEFAULT 'en',
  status         TEXT DEFAULT 'new' CHECK (status IN ('new','replied','closed')),
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- CUSTOM TOUR REQUESTS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS custom_tour_requests (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name             TEXT NOT NULL,
  email            TEXT NOT NULL,
  phone            TEXT,
  destinations     TEXT[] DEFAULT '{}',
  duration_days    INTEGER,
  travel_date      DATE,
  guests           INTEGER DEFAULT 1,
  interests        TEXT[] DEFAULT '{}',
  budget_tier      TEXT,
  budget_lkr       NUMERIC(12,2),
  special_requests TEXT,
  status           TEXT DEFAULT 'new' CHECK (status IN ('new','in-progress','quoted','closed')),
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- MEDIA
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS media (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename    TEXT NOT NULL,
  url         TEXT NOT NULL,
  bucket      TEXT NOT NULL DEFAULT 'media',
  size_bytes  INTEGER,
  mime_type   TEXT,
  alt_text    TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- INDEXES
-- ─────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_tours_slug ON tours(slug);
CREATE INDEX IF NOT EXISTS idx_tours_category ON tours(category);
CREATE INDEX IF NOT EXISTS idx_tours_published ON tours(is_published);
CREATE INDEX IF NOT EXISTS idx_blog_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_published ON blog_posts(is_published);
CREATE INDEX IF NOT EXISTS idx_reviews_tour ON reviews(tour_id);
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON reviews(is_approved);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_created ON inquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_custom_status ON custom_tour_requests(status);

-- ─────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ─────────────────────────────────────────────
ALTER TABLE tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_tour_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read published tours" ON tours FOR SELECT USING (is_published = TRUE);
CREATE POLICY "Public read published posts" ON blog_posts FOR SELECT USING (is_published = TRUE);
CREATE POLICY "Public read approved reviews" ON reviews FOR SELECT USING (is_approved = TRUE);
CREATE POLICY "Public read media" ON media FOR SELECT USING (TRUE);

-- Public insert (inquiries, reviews, custom requests)
CREATE POLICY "Anyone can submit inquiry" ON inquiries FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Anyone can submit review" ON reviews FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Anyone can submit custom request" ON custom_tour_requests FOR INSERT WITH CHECK (TRUE);

-- Service role full access (used by admin client with service_role key)
CREATE POLICY "Service role full access tours" ON tours USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access blog" ON blog_posts USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access reviews" ON reviews USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access inquiries" ON inquiries USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access custom" ON custom_tour_requests USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access media" ON media USING (auth.role() = 'service_role');

-- ─────────────────────────────────────────────
-- STORAGE BUCKET
-- ─────────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', TRUE)
ON CONFLICT DO NOTHING;

CREATE POLICY "Public read media storage"
ON storage.objects FOR SELECT
USING (bucket_id = 'media');

CREATE POLICY "Service role upload media"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'media' AND auth.role() = 'service_role');

CREATE POLICY "Service role delete media"
ON storage.objects FOR DELETE
USING (bucket_id = 'media' AND auth.role() = 'service_role');

-- ─────────────────────────────────────────────
-- UPDATED AT TRIGGER
-- ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tours_updated_at BEFORE UPDATE ON tours FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER blog_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
