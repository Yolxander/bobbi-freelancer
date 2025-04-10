import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    const sqlPath = path.join(process.cwd(), "sql", "provider-types.sql")
    const sql = fs.readFileSync(sqlPath, "utf8")

    return NextResponse.json({ sql })
  } catch (error) {
    console.error("Error reading SQL file:", error)
    return NextResponse.json({ error: "Failed to read migration SQL file" }, { status: 500 })
  }
}
