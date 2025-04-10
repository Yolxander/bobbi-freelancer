-- Direct SQL to create the team_member_invitations table
CREATE OR REPLACE FUNCTION create_team_member_invitations_table()
RETURNS void AS $$
BEGIN
    -- Check if the table already exists
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'team_member_invitations') THEN
        -- Create the table
        CREATE TABLE public.team_member_invitations (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            team_member_id UUID NOT NULL REFERENCES public.client_team_member(id) ON DELETE CASCADE,
            project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
            token UUID NOT NULL UNIQUE,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            expires_at TIMESTAMPTZ NOT NULL,
            used_at TIMESTAMPTZ,
            UNIQUE(team_member_id, project_id, token)
        );

        -- Add RLS policies
        ALTER TABLE public.team_member_invitations ENABLE ROW LEVEL SECURITY;

        -- Create policy for service role access
        CREATE POLICY "Service role can do all" 
        ON public.team_member_invitations
        FOR ALL 
        TO service_role
        USING (true);

        -- Create policy for authenticated users to read their own invitations
        CREATE POLICY "Users can read their own invitations" 
        ON public.team_member_invitations
        FOR SELECT 
        TO authenticated
        USING (
            team_member_id IN (
                SELECT id FROM public.client_team_member 
                WHERE email = auth.jwt() ->> 'email'
            )
        );

        -- Add indexes
        CREATE INDEX idx_team_member_invitations_token ON public.team_member_invitations(token);
        CREATE INDEX idx_team_member_invitations_team_member_id ON public.team_member_invitations(team_member_id);
        CREATE INDEX idx_team_member_invitations_project_id ON public.team_member_invitations(project_id);
    END IF;
END;
$$ LANGUAGE plpgsql;
