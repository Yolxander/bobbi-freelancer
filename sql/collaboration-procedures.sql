-- Create a function to handle accepting a collaboration invitation in a transaction
CREATE OR REPLACE FUNCTION accept_collaboration_invite(invite_id UUID, provider_id UUID)
RETURNS VOID AS $$
DECLARE
  invite_record RECORD;
BEGIN
  -- Get the invitation
  SELECT * INTO invite_record FROM collaboration_invitations 
  WHERE id = invite_id AND recipient_id = provider_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invitation not found';
  END IF;
  
  IF invite_record.status != 'pending' THEN
    RAISE EXCEPTION 'Invitation has already been processed';
  END IF;
  
  -- Update the invitation status
  UPDATE collaboration_invitations 
  SET status = 'accepted' 
  WHERE id = invite_id;
  
  -- Create the collaboration
  INSERT INTO provider_collaborations (
    project_id,
    owner_id,
    collaborator_id,
    status,
    role,
    permissions
  ) VALUES (
    invite_record.project_id,
    invite_record.sender_id,
    invite_record.recipient_id,
    'active',
    invite_record.role,
    invite_record.permissions
  );
END;
$$ LANGUAGE plpgsql;
