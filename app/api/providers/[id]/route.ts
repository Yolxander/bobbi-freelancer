import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const userId = params.id

  if (!userId) {
    return NextResponse.json({ message: "User ID is required" }, { status: 400 })
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/providers/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        // Record not found
        return NextResponse.json({ message: "Provider not found" }, { status: 404 })
      }

      throw new Error(`Error getting provider: ${response.statusText}`)
    }

    const data = await response.json()
    return NextResponse.json({ data })
  } catch (error) {
    console.error("Error getting provider:", error)
    return NextResponse.json({ message: `Error getting provider: ${error.message}` }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const userId = params.id

  if (!userId) {
    return NextResponse.json({ message: "User ID is required" }, { status: 400 })
  }

  try {
    const body = await request.json()

    // Map the incoming data to our API schema
    const providerData = {
      user_id: userId,
      email: body.email,
      name: body.name || null,
      provider_type_id: body.provider_type_id || null,
      bio: body.description || null,
      phone: body.phone || null,
      website: body.website || null,
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/providers/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(providerData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Error updating provider: ${errorData.message || response.statusText}`)
    }

    const data = await response.json()
    return NextResponse.json({
      message: "Provider profile updated successfully",
      data,
    })
  } catch (error) {
    console.error("Error updating provider:", error)
    return NextResponse.json({ message: `Error updating provider: ${error.message}` }, { status: 500 })
  }
}
