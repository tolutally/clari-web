-- Demo request submissions from /book-demo
-- Run this in Supabase SQL Editor after restoring the project

CREATE TABLE IF NOT EXISTS demo_requests (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name    text NOT NULL,
  last_name     text NOT NULL,
  email         text NOT NULL,
  phone         text,
  company       text,
  comment       text,
  source        text DEFAULT 'book-demo',     -- where the form was submitted from
  ip_hash       text,                          -- SHA-256 of IP for rate limiting (not raw IP)
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- Index for duplicate / rate-limit checks
CREATE INDEX IF NOT EXISTS idx_demo_requests_email ON demo_requests (email);
CREATE INDEX IF NOT EXISTS idx_demo_requests_ip_hash ON demo_requests (ip_hash, created_at);
CREATE INDEX IF NOT EXISTS idx_demo_requests_created_at ON demo_requests (created_at);

-- Row-level security: only service_role can insert
ALTER TABLE demo_requests ENABLE ROW LEVEL SECURITY;

-- No public access — all writes go through the API route using service_role key
CREATE POLICY "Service role full access" ON demo_requests
  FOR ALL
  USING (true)
  WITH CHECK (true);
