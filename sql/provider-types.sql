-- Create provider_types table
CREATE TABLE IF NOT EXISTS provider_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add unique constraint on name
ALTER TABLE provider_types ADD CONSTRAINT provider_types_name_unique UNIQUE (name);

-- Insert initial provider types
INSERT INTO provider_types (name, description) VALUES
  ('Creative & Design', 'Graphic design, UI/UX design, branding, and creative services'),
  ('Web & Software Development', 'Web development, mobile apps, software engineering, and technical implementation'),
  ('Other', 'Other professional services not listed in the categories above')
ON CONFLICT (name) DO NOTHING;

-- Add provider_type_id to providers table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'providers' AND column_name = 'provider_type_id'
  ) THEN
    ALTER TABLE providers ADD COLUMN provider_type_id UUID REFERENCES provider_types(id);
  END IF;
END
$$;

-- Create index on provider_type_id
CREATE INDEX IF NOT EXISTS providers_provider_type_id_idx ON providers(provider_type_id);
