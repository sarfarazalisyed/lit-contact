import { NextRequest, NextResponse } from 'next/server'

// Rate limiting: simple in-memory store (resets on deploy/restart)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_MAX = 5
const RATE_LIMIT_WINDOW_MS = 60 * 1000 // 1 minute

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS })
    return false
  }

  entry.count++
  return entry.count > RATE_LIMIT_MAX
}

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many submissions. Please wait a moment and try again.' },
        { status: 429 }
      )
    }

    // Parse body safely
    let body: Record<string, unknown>
    try {
      body = await req.json()
    } catch {
      return NextResponse.json(
        { error: 'Invalid request body. Please try again.' },
        { status: 400 }
      )
    }

    const { email, honeypot } = body as {
      email?: string
      honeypot?: string
    }

    // Spam protection (honeypot field)
    if (honeypot) {
      return NextResponse.json({ success: true }, { status: 200 })
    }

    // Sanitize & validate email
    const cleanEmail = (email || '').trim().replace(/<[^>]*>/g, '').toLowerCase()

    if (!cleanEmail) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
    }

    // Save to Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase environment variables are not configured')
      return NextResponse.json(
        { error: 'Server configuration error. Please contact support.' },
        { status: 500 }
      )
    }

    const supabaseResponse = await fetch(`${supabaseUrl}/rest/v1/newsletter_subscribers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({
        email: cleanEmail,
      }),
    })

    if (!supabaseResponse.ok) {
      const errorText = await supabaseResponse.text()
      console.error('Supabase insert error:', supabaseResponse.status, errorText)

      // Handle duplicate email
      if (supabaseResponse.status === 409 || errorText.includes('duplicate')) {
        return NextResponse.json(
          { error: 'This email is already subscribed.' },
          { status: 409 }
        )
      }

      if (supabaseResponse.status === 401 || supabaseResponse.status === 403) {
        return NextResponse.json(
          { error: 'Database access denied. Please contact support.' },
          { status: 500 }
        )
      }

      return NextResponse.json(
        { error: 'Failed to subscribe. Please try again later.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err) {
    console.error('Unexpected error in newsletter API:', err)
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again later.' },
      { status: 500 }
    )
  }
}
