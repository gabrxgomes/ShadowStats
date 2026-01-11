-- ShadowStats Database Schema
-- Supabase PostgreSQL

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (linked to wallet)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_analysis_at TIMESTAMP WITH TIME ZONE,
  settings JSONB DEFAULT '{}'::jsonb
);

-- Create index for wallet lookups
CREATE INDEX idx_users_wallet ON users(wallet_address);

-- Reports table
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,

  -- Report metadata
  title TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_public BOOLEAN DEFAULT true,

  -- Stats ranges (what's shown publicly)
  volume_range TEXT NOT NULL,
  trade_count_range TEXT NOT NULL,
  win_rate_range TEXT NOT NULL,
  avg_trade_size_range TEXT NOT NULL,
  trading_period_days INTEGER NOT NULL,

  -- ZK Proof data
  proof_hash TEXT NOT NULL,
  compressed_account_address TEXT,
  verification_tx TEXT,

  -- Privacy metadata
  wallet_hash TEXT NOT NULL,

  CONSTRAINT unique_proof UNIQUE(proof_hash)
);

-- Create indexes
CREATE INDEX idx_reports_user ON reports(user_id);
CREATE INDEX idx_reports_proof ON reports(proof_hash);
CREATE INDEX idx_reports_created ON reports(created_at DESC);

-- Analytics cache (optional, for faster repeat analysis)
CREATE TABLE analytics_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,

  -- Cache metadata
  cached_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
  tx_count INTEGER NOT NULL,
  last_tx_signature TEXT,

  -- Cached analytics (encrypted or hashed)
  analytics_data JSONB NOT NULL,

  CONSTRAINT one_cache_per_user UNIQUE(user_id)
);

-- Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_cache ENABLE ROW LEVEL SECURITY;

-- Policies for users table
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (wallet_address = current_setting('app.wallet_address', true));

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (wallet_address = current_setting('app.wallet_address', true));

CREATE POLICY "Users can insert own data" ON users
  FOR INSERT WITH CHECK (wallet_address = current_setting('app.wallet_address', true));

-- Policies for reports table
CREATE POLICY "Anyone can read public reports" ON reports
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can read own reports" ON reports
  FOR SELECT USING (
    user_id IN (
      SELECT id FROM users WHERE wallet_address = current_setting('app.wallet_address', true)
    )
  );

CREATE POLICY "Users can create reports" ON reports
  FOR INSERT WITH CHECK (
    user_id IN (
      SELECT id FROM users WHERE wallet_address = current_setting('app.wallet_address', true)
    )
  );

-- Policies for analytics_cache table
CREATE POLICY "Users can read own cache" ON analytics_cache
  FOR SELECT USING (
    user_id IN (
      SELECT id FROM users WHERE wallet_address = current_setting('app.wallet_address', true)
    )
  );

CREATE POLICY "Users can manage own cache" ON analytics_cache
  FOR ALL USING (
    user_id IN (
      SELECT id FROM users WHERE wallet_address = current_setting('app.wallet_address', true)
    )
  );

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on users table
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
