import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: deliverable, error } = await supabase
      .from('deliverables')
      .select(`
        *,
        tasks (*),
        proposal_content (
          proposal (
            project (*)
          )
        )
      `)
      .eq('id', params.id)
      .single()

    if (error) {
      console.error('Error fetching deliverable:', error)
      return NextResponse.json({ error: 'Failed to fetch deliverable' }, { status: 500 })
    }

    if (!deliverable) {
      return NextResponse.json({ error: 'Deliverable not found' }, { status: 404 })
    }

    return NextResponse.json(deliverable)
  } catch (error) {
    console.error('Error fetching deliverable:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description } = body

    const { data: deliverable, error } = await supabase
      .from('deliverables')
      .update({ title, description })
      .eq('id', params.id)
      .select(`
        *,
        tasks (*),
        proposal_content (
          proposal (
            project (*)
          )
        )
      `)
      .single()

    if (error) {
      console.error('Error updating deliverable:', error)
      return NextResponse.json({ error: 'Failed to update deliverable' }, { status: 500 })
    }

    return NextResponse.json(deliverable)
  } catch (error) {
    console.error('Error updating deliverable:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { error } = await supabase
      .from('deliverables')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('Error deleting deliverable:', error)
      return NextResponse.json({ error: 'Failed to delete deliverable' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting deliverable:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 