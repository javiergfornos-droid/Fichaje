-- ¡FICHAJE! Database Schema
-- Run this in Supabase SQL Editor to set up the database

-- Countries (static reference table)
CREATE TABLE countries (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  flag TEXT NOT NULL,
  continent TEXT NOT NULL,
  geo_points JSONB NOT NULL,
  flag_center JSONB NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Clubs
CREATE TABLE clubs (
  id TEXT PRIMARY KEY,
  country_id TEXT NOT NULL REFERENCES countries(id),
  name TEXT NOT NULL,
  badge_emoji TEXT NOT NULL,
  badge_url TEXT,
  color TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Shirts (the core product table)
CREATE TABLE shirts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id TEXT NOT NULL REFERENCES clubs(id),
  seller_id UUID REFERENCES auth.users(id),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  season TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Local', 'Visitante', 'Especial')),
  brand TEXT NOT NULL,
  size TEXT NOT NULL CHECK (size IN ('S', 'M', 'L', 'XL', 'XXL')),
  player_name TEXT,
  overall INT NOT NULL CHECK (overall BETWEEN 1 AND 100),
  brightness INT NOT NULL CHECK (brightness BETWEEN 1 AND 100),
  color_integrity INT NOT NULL CHECK (color_integrity BETWEEN 1 AND 100),
  special_features INT NOT NULL CHECK (special_features BETWEEN 1 AND 100),
  stars INT NOT NULL CHECK (stars BETWEEN 1 AND 5),
  price_cents INT NOT NULL,
  currency TEXT DEFAULT 'EUR',
  min_offer_pct INT DEFAULT 80,
  is_sold BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  is_drop BOOLEAN DEFAULT false,
  drop_date TIMESTAMPTZ,
  description TEXT,
  story TEXT,
  fts TSVECTOR GENERATED ALWAYS AS (
    setweight(to_tsvector('spanish', coalesce(name, '')), 'A') ||
    setweight(to_tsvector('spanish', coalesce(player_name, '')), 'B') ||
    setweight(to_tsvector('spanish', coalesce(description, '')), 'C') ||
    setweight(to_tsvector('spanish', coalesce(story, '')), 'D')
  ) STORED,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX shirts_fts ON shirts USING gin(fts);
CREATE INDEX shirts_club ON shirts(club_id);
CREATE INDEX shirts_sold ON shirts(is_sold);

-- Shirt images (multiple per shirt)
CREATE TABLE shirt_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shirt_id UUID NOT NULL REFERENCES shirts(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text TEXT,
  position INT DEFAULT 0,
  is_front BOOLEAN DEFAULT false,
  is_back BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Offers
CREATE TABLE offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shirt_id UUID NOT NULL REFERENCES shirts(id),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  amount_cents INT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'expired')),
  created_at TIMESTAMPTZ DEFAULT now(),
  responded_at TIMESTAMPTZ
);

-- Orders (completed purchases)
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shirt_id UUID NOT NULL REFERENCES shirts(id),
  buyer_id UUID NOT NULL REFERENCES auth.users(id),
  seller_id UUID REFERENCES auth.users(id),
  amount_cents INT NOT NULL,
  currency TEXT DEFAULT 'EUR',
  stripe_session_id TEXT,
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- User profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  is_seller BOOLEAN DEFAULT false,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Collections (for gamification — future phase)
CREATE TABLE collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  name TEXT NOT NULL,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE collection_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  shirt_id UUID REFERENCES shirts(id),
  team TEXT,
  season TEXT,
  size TEXT,
  condition_grade INT,
  purchase_price_cents INT,
  is_owned_externally BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Row Level Security
ALTER TABLE shirts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read available shirts" ON shirts FOR SELECT USING (is_sold = false);
CREATE POLICY "Sellers manage own shirts" ON shirts FOR ALL USING (
  seller_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own offers" ON offers FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Sellers see shirt offers" ON offers FOR SELECT USING (
  EXISTS (SELECT 1 FROM shirts WHERE shirts.id = shirt_id AND shirts.seller_id = auth.uid())
);

ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public collections visible" ON collections FOR SELECT USING (is_public = true OR user_id = auth.uid());
CREATE POLICY "Users manage own collections" ON collections FOR ALL USING (user_id = auth.uid());
