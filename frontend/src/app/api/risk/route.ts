// src/app/api/risk/route.ts
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const lat   = searchParams.get('lat')
  const lon   = searchParams.get('lon')
  const tone  = searchParams.get('tone')
  const gender= searchParams.get('gender')

  if (!lat || !lon || !tone || !gender) {
    return NextResponse.json({ error: 'missing params' }, { status: 400 })
  }

  // Render/FastAPI URL
  const BACKEND = process.env.BACKEND_URL!

  // call the FastAPI /predict endpoint
  const resp = await fetch(`${BACKEND}/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      lat:   parseFloat(lat),
      lon:   parseFloat(lon),
      skinTone: parseInt(tone, 10),
      gender
    })
  })

  if (!resp.ok) {
    const text = await resp.text()
    return NextResponse.json({ error: text }, { status: resp.status })
  }

  //const { prob, recommendation } = await resp.json()

  //const score = Math.round(prob * 100)

  const { score, advice } = await resp.json()
  return NextResponse.json({ score, advice })

  //return NextResponse.json({ score, advice: recommendation })
}
