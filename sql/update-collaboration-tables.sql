-- Remove any email-related fields from collaboration_invitations table
ALTER TABLE IF EXISTS collaboration_invitations 
DROP COLUMN IF EXISTS email_sent;
