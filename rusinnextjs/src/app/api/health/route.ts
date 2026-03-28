import { NextResponse } from "next/server";

export async function GET() {
  // A simple, database-free ping to tell AWS the container is alive
  return NextResponse.json({ status: "healthy" }, { status: 200 });
}
