import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase"

export async function GET() {
  const supabase = createAdminClient()

  try {
    const { data, error } = await supabase.from("provider_types").select("*").order("name")

    if (error) throw error

    return NextResponse.json({ data })
  } catch (error) {
    console.error("Error getting provider types:", error)
    return NextResponse.json({ message: `Error getting provider types: ${error.message}` }, { status: 500 })
  }
}
