-- Function to update client user_id that bypasses RLS
CREATE OR REPLACE FUNCTION update_client_user_id(p_client_id UUID, p_user_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE clients
  SET user_id = p_user_id, updated_at = NOW()
  WHERE id = p_client_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION update_client_user_id TO authenticated;
GRANT EXECUTE ON FUNCTION update_client_user_id TO service_role;
