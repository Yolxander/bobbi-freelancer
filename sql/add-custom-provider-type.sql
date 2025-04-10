-- Add custom_provider_type column to providers table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'providers' AND column_name = 'custom_provider_type'
  ) THEN
    ALTER TABLE providers ADD COLUMN custom_provider_type TEXT;
  END IF;
END
$$;

-- Insert "Other" provider type if it doesn't exist
INSERT INTO provider_types (name, description)
VALUES ('Other', 'Other professional services not listed in the categories above')
ON CONFLICT (name) DO NOTHING;
