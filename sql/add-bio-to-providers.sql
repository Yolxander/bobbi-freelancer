-- Add bio column to providers table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'providers' AND column_name = 'bio'
  ) THEN
    ALTER TABLE providers ADD COLUMN bio TEXT;
  END IF;
END
$$;
