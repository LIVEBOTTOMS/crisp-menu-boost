-- Create customer_leads table to track QR code scans/lead capture
CREATE TABLE IF NOT EXISTS customer_leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    phone TEXT,
    email TEXT,
    source TEXT DEFAULT 'qr_scan', 
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE customer_leads ENABLE ROW LEVEL SECURITY;

-- Policy: Allow ANYONE to insert (since leads come from unauthenticated QR scans)
-- We use 'true' to allow public inserts.
DROP POLICY IF EXISTS "Allow public inserts" ON customer_leads;
CREATE POLICY "Allow public inserts" ON customer_leads
    FOR INSERT
    WITH CHECK (true);

-- Policy: Only Authenticated users (Admins) can view leads
DROP POLICY IF EXISTS "Allow authenticated view" ON customer_leads;
CREATE POLICY "Allow authenticated view" ON customer_leads
    FOR SELECT
    USING (auth.role() = 'authenticated');
