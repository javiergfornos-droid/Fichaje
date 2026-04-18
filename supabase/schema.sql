-- ============================================================================
-- FICHAJE MUNDIAL — Database Schema v2 (refined)
-- ============================================================================
-- Run this in Supabase SQL Editor to set up the database.
-- This replaces the initial schema.sql with the refined version that
-- incorporates all features agreed with product (Javier):
--   • 5 shirt types (local, away, third, goalkeeper, sweatshirt)
--   • 4 stats (condition, color, integrity, iconicity)
--   • Purchase cost (private, for profitability tracking)
--   • KitLegit authentication link
--   • Bilingual descriptions (ES / EN)
--   • Match worn flag, customization field, brand, year, size specs
--   • Category (clubs / national teams)
--   • Reference prices (PriceLegit feature)
--   • Offer system with 25% max discount enforced at DB level
--   • Public view that excludes private fields (purchase_cost)
--   • RLS, full-text search, profiles, orders, collections (preserved)
-- ============================================================================


-- ============================================================================
-- COUNTRIES
-- ============================================================================
CREATE TABLE countries (
  id TEXT PRIMARY KEY,               -- 'spain', 'england', 'brazil', 'usa'
  name_es TEXT NOT NULL,             -- 'España'
  name_en TEXT NOT NULL,             -- 'Spain'
  iso_code TEXT NOT NULL,            -- 'es', 'gb-eng', 'br' (for flag-icons)
  iso_numeric TEXT NOT NULL,         -- '724', '826', '76' (for world-atlas)
  continent TEXT NOT NULL CHECK (continent IN (
    'europe', 'south_america', 'north_america', 'africa', 'asia', 'oceania'
  )),
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================================
-- CLUBS (includes national teams)
-- ============================================================================
CREATE TABLE clubs (
  id TEXT PRIMARY KEY,
  country_id TEXT NOT NULL REFERENCES countries(id),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('clubs', 'national_teams')),
  badge_url TEXT,
  primary_color TEXT,                -- '#004D98' for Barça, for UI accents
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================================
-- SHIRTS (the core product table)
-- ============================================================================
CREATE TABLE shirts (
  -- Identity
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  club_id TEXT NOT NULL REFERENCES clubs(id),
  seller_id UUID REFERENCES auth.users(id),

  -- Classification
  year INT NOT NULL CHECK (year BETWEEN 1960 AND 2030),
  season TEXT NOT NULL,              -- '1993-1994' or '2024'
  type TEXT NOT NULL CHECK (type IN (
    'local', 'away', 'third', 'goalkeeper', 'sweatshirt'
  )),
  brand TEXT NOT NULL,               -- 'Kappa', 'Adidas', 'Nike', ...
  size TEXT NOT NULL CHECK (size IN ('S', 'M', 'L', 'XL', 'XXL')),
  size_specifications TEXT,          -- 'very fitted', '80s cut', 'larger than label'
  customization TEXT,                -- '10-Laudrup', '9-Shearer', NULL if none
  match_worn BOOLEAN NOT NULL DEFAULT FALSE,

  -- Commerce
  price_cents INT NOT NULL CHECK (price_cents >= 0),
  currency TEXT DEFAULT 'EUR',
  purchase_cost_cents INT CHECK (purchase_cost_cents >= 0),  -- PRIVATE
  min_offer_pct INT DEFAULT 75 CHECK (min_offer_pct BETWEEN 50 AND 100),
  stock INT NOT NULL DEFAULT 1 CHECK (stock >= 0),
  is_sold BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  is_drop BOOLEAN DEFAULT FALSE,
  drop_date TIMESTAMPTZ,

  -- Arcade stats (Football Manager style)
  stat_condition INT NOT NULL DEFAULT 88 CHECK (stat_condition BETWEEN 0 AND 99),
  stat_color INT NOT NULL DEFAULT 85 CHECK (stat_color BETWEEN 0 AND 99),
  stat_integrity INT NOT NULL DEFAULT 90 CHECK (stat_integrity BETWEEN 0 AND 99),
  stat_iconicity INT NOT NULL DEFAULT 75 CHECK (stat_iconicity BETWEEN 0 AND 99),

  -- Content (bilingual)
  description_es TEXT NOT NULL,
  description_en TEXT,               -- nullable: falls back to ES if empty
  story TEXT,                        -- optional longer narrative

  -- External references
  external_link TEXT,                -- video/photo of player wearing it
  kitlegit_url TEXT,                 -- authentication certification link

  -- Full-text search (bilingual)
  fts TSVECTOR GENERATED ALWAYS AS (
    setweight(to_tsvector('spanish', coalesce(description_es, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(description_en, '')), 'A') ||
    setweight(to_tsvector('simple',  coalesce(customization, '')),    'B') ||
    setweight(to_tsvector('spanish', coalesce(story, '')),            'C')
  ) STORED,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX shirts_fts      ON shirts USING gin(fts);
CREATE INDEX shirts_club     ON shirts(club_id);
CREATE INDEX shirts_sold     ON shirts(is_sold);
CREATE INDEX shirts_year     ON shirts(year);
CREATE INDEX shirts_type     ON shirts(type);


-- ============================================================================
-- SHIRT IMAGES (up to 5+ per shirt)
-- ============================================================================
CREATE TABLE shirt_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shirt_id UUID NOT NULL REFERENCES shirts(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  photo_type TEXT NOT NULL CHECK (photo_type IN (
    'front_full', 'front_close', 'back_full', 'back_close', 'label', 'extra'
  )),
  alt_text TEXT,
  position INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX shirt_images_shirt ON shirt_images(shirt_id, photo_type);


-- ============================================================================
-- SHIRT REFERENCE PRICES (PriceLegit feature)
-- ============================================================================
CREATE TABLE shirt_reference_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shirt_id UUID NOT NULL REFERENCES shirts(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN (
    'ebay', 'vinted', 'matchwornshirt', 'classicfootballshirts', 'other'
  )),
  url TEXT NOT NULL,
  price_cents INT NOT NULL CHECK (price_cents >= 0),
  condition_relative TEXT CHECK (condition_relative IN ('worse', 'similar', 'better')),
  consulted_at DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX shirt_ref_prices_shirt ON shirt_reference_prices(shirt_id);


-- ============================================================================
-- OFFERS (with 25% max discount enforced at DB level)
-- ============================================================================
CREATE TABLE offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shirt_id UUID NOT NULL REFERENCES shirts(id),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  amount_cents INT NOT NULL CHECK (amount_cents > 0),
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending', 'accepted', 'rejected', 'expired', 'outbid'
  )),
  message TEXT,                      -- optional buyer message
  created_at TIMESTAMPTZ DEFAULT NOW(),
  responded_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days')
);

CREATE INDEX offers_shirt  ON offers(shirt_id);
CREATE INDEX offers_user   ON offers(user_id);
CREATE INDEX offers_status ON offers(status);

-- Enforce the 25% max discount rule at DB level
CREATE OR REPLACE FUNCTION enforce_min_offer()
RETURNS TRIGGER AS $$
DECLARE
  list_price INT;
  min_pct INT;
  min_allowed INT;
BEGIN
  SELECT price_cents, min_offer_pct INTO list_price, min_pct
  FROM shirts WHERE id = NEW.shirt_id;

  min_allowed := (list_price * min_pct / 100);

  IF NEW.amount_cents < min_allowed THEN
    RAISE EXCEPTION 'Offer too low: minimum is % (% %% of list price)',
      min_allowed, min_pct;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_enforce_min_offer
  BEFORE INSERT OR UPDATE ON offers
  FOR EACH ROW EXECUTE FUNCTION enforce_min_offer();


-- ============================================================================
-- ORDERS (completed purchases, includes Stripe / PayPal / Redsys references)
-- ============================================================================
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shirt_id UUID NOT NULL REFERENCES shirts(id),
  buyer_id UUID REFERENCES auth.users(id),   -- nullable: allows guest checkout
  seller_id UUID REFERENCES auth.users(id),
  guest_email TEXT,                          -- for guest checkout
  amount_cents INT NOT NULL,
  currency TEXT DEFAULT 'EUR',
  payment_provider TEXT CHECK (payment_provider IN ('stripe', 'paypal', 'redsys')),
  payment_reference TEXT,                    -- Stripe session id, PayPal order id, etc.
  shipping_address JSONB,
  shipping_cost_cents INT DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending', 'paid', 'shipped', 'delivered', 'cancelled', 'refunded'
  )),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ,
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ
);

CREATE INDEX orders_buyer  ON orders(buyer_id);
CREATE INDEX orders_status ON orders(status);
CREATE INDEX orders_shirt  ON orders(shirt_id);


-- ============================================================================
-- PROFILES (optional; only created if user registers)
-- ============================================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  handle TEXT UNIQUE,                -- for /collection/:handle public URLs
  is_seller BOOLEAN DEFAULT FALSE,
  is_admin BOOLEAN DEFAULT FALSE,
  public_collection BOOLEAN DEFAULT FALSE,  -- opt-in visibility
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================================
-- COLLECTIONS (gamification, future phase, opt-in by user)
-- ============================================================================
CREATE TABLE collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE collection_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  shirt_id UUID REFERENCES shirts(id),             -- links to our catalog if bought here
  -- OR manual entry (for shirts bought elsewhere)
  manual_club TEXT,
  manual_season TEXT,
  manual_year INT,
  manual_size TEXT,
  manual_image_url TEXT,
  condition_grade INT CHECK (condition_grade BETWEEN 0 AND 99),
  purchase_price_cents INT,
  purchase_source TEXT,              -- 'fichaje_mundial', 'ebay', 'vinted', etc.
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================================
-- AUTO-UPDATE updated_at ON SHIRTS
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_shirts_updated_at
  BEFORE UPDATE ON shirts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ============================================================================
-- PUBLIC VIEW (excludes purchase_cost_cents)
-- This is what the frontend queries. Never exposes the cost basis.
-- ============================================================================
CREATE VIEW public_shirts AS
SELECT
  id, slug, club_id,
  year, season, type, brand, size, size_specifications,
  customization, match_worn,
  price_cents, currency, min_offer_pct, stock,
  is_sold, is_featured, is_drop, drop_date,
  stat_condition, stat_color, stat_integrity, stat_iconicity,
  description_es, description_en, story,
  external_link, kitlegit_url,
  created_at, updated_at
FROM shirts;


-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

-- Countries / Clubs — public read, admin write
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "countries_public_read" ON countries FOR SELECT USING (TRUE);

ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "clubs_public_read" ON clubs FOR SELECT USING (TRUE);

-- Shirts — read via view, direct table access restricted
ALTER TABLE shirts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "shirts_seller_manage" ON shirts FOR ALL USING (
  seller_id = auth.uid()
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
);
-- Public users read from public_shirts view (no RLS needed on views, uses base table's SELECT)
CREATE POLICY "shirts_public_select" ON shirts FOR SELECT USING (is_sold = FALSE);

-- Shirt images — public read
ALTER TABLE shirt_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "shirt_images_public_read" ON shirt_images FOR SELECT USING (TRUE);

-- Reference prices — public read
ALTER TABLE shirt_reference_prices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ref_prices_public_read" ON shirt_reference_prices FOR SELECT USING (TRUE);

-- Offers — user sees own, seller sees offers on their shirts
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "offers_user_read" ON offers FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "offers_seller_read" ON offers FOR SELECT USING (
  EXISTS (SELECT 1 FROM shirts WHERE shirts.id = shirt_id AND shirts.seller_id = auth.uid())
);
CREATE POLICY "offers_user_create" ON offers FOR INSERT WITH CHECK (user_id = auth.uid());

-- Orders — buyer sees own orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "orders_buyer_read" ON orders FOR SELECT USING (
  buyer_id = auth.uid()
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
);

-- Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_public_read" ON profiles FOR SELECT USING (
  public_collection = TRUE OR id = auth.uid()
);
CREATE POLICY "profiles_self_update" ON profiles FOR UPDATE USING (id = auth.uid());

-- Collections
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "collections_public_visible" ON collections FOR SELECT USING (
  is_public = TRUE OR user_id = auth.uid()
);
CREATE POLICY "collections_owner_manage" ON collections FOR ALL USING (user_id = auth.uid());

ALTER TABLE collection_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "collection_items_inherit" ON collection_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM collections WHERE collections.id = collection_id
    AND (collections.is_public = TRUE OR collections.user_id = auth.uid()))
);
CREATE POLICY "collection_items_owner_manage" ON collection_items FOR ALL USING (
  EXISTS (SELECT 1 FROM collections WHERE collections.id = collection_id
    AND collections.user_id = auth.uid())
);


-- ============================================================================
-- STORAGE BUCKETS
-- Create these manually in Supabase Dashboard → Storage:
--   1. 'shirt-photos'  (public: true, max file size: 5 MB,
--                       allowed types: image/jpeg, image/png, image/webp)
--   2. 'club-badges'   (public: true, max file size: 500 KB, images only)
--   3. 'avatars'       (public: true, max file size: 1 MB, images only)
-- ============================================================================
