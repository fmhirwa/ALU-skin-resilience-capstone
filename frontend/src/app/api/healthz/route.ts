// app/api/healthz/route.ts  (Next 13/14 App Router)
import { NextResponse } from 'next/server'

export const runtime = 'edge';   // optional – runs on Vercel/Render edge

export async function GET() {
  // absolute URL of your FastAPI service
  const BACKEND = process.env.BACKEND_URL!    // https://skin-backend.onrender.com

  const resp = await fetch(`${BACKEND}/api/healthz`, { cache: 'no-store' })

  if (!resp.ok) {
    return NextResponse.json({ ok: false }, { status: resp.status })
  }
  return NextResponse.json({ ok: true })
}
