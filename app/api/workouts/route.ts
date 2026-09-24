import { NextResponse } from 'next/server'
import { fallbackWorkouts, normalizeWorkouts } from '@/lib/fitlog-data'

export async function GET() {
  try {
    const response = await fetch('https://api.abcz.workers.dev/api/fitlog', { next: { revalidate: 300 } })
    if (!response.ok) throw new Error('API unavailable')
    return NextResponse.json(normalizeWorkouts(await response.json()))
  } catch {
    return NextResponse.json(fallbackWorkouts)
  }
}
