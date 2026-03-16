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

    const { name, email, phone, dob, gender, location, enquiryType, courseInterest, message, honeypot } = body as {
      name?: string
      email?: string
      phone?: string
      dob?: string
      gender?: string
      location?: string
      enquiryType?: string
      courseInterest?: string
      message?: string
      honeypot?: string
    }

    // Spam protection (honeypot field)
    if (honeypot) {
      // Return success to not tip off bots
      return NextResponse.json({ success: true }, { status: 200 })
    }

    // Sanitize inputs
    const sanitize = (val: string | undefined | null): string =>
      (val || '').trim().replace(/<[^>]*>/g, '')

    const cleanName = sanitize(name)
    const cleanEmail = sanitize(email)?.toLowerCase()
    const cleanPhone = sanitize(phone)
    const cleanDob = sanitize(dob)
    const cleanGender = sanitize(gender)
    const cleanLocation = sanitize(location)
    const cleanEnquiryType = sanitize(enquiryType)
    const cleanCourseInterest = sanitize(courseInterest)
    const cleanMessage = sanitize(message)

    // Server-side validation
    const errors: string[] = []
    if (!cleanName) errors.push('Full name is required')
    if (cleanName.length > 200) errors.push('Name is too long')
    if (!cleanEmail) errors.push('Email is required')
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) errors.push('Invalid email address')
    if (!cleanPhone) errors.push('Phone number is required')
    else if (!/^[\d\s\+\-\(\)]{7,20}$/.test(cleanPhone)) errors.push('Invalid phone number')
    if (cleanDob && !/^\d{4}-\d{2}-\d{2}$/.test(cleanDob)) errors.push('Invalid date of birth format')
    if (cleanMessage.length > 2000) errors.push('Message is too long (max 2000 characters)')

    // Validate gender if provided
    const allowedGenders = ['male', 'female', 'other', 'prefer_not_to_say', '']
    if (cleanGender && !allowedGenders.includes(cleanGender)) {
      errors.push('Invalid gender selection')
    }

    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join('. ') }, { status: 400 })
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

    // Build a comprehensive message that includes all form fields
    // (the leads table only has: id, name, email, message, created_at, sent_confirmation)
    const messageParts: string[] = []
    if (cleanPhone) messageParts.push(`Phone: ${cleanPhone}`)
    if (cleanDob) messageParts.push(`DOB: ${cleanDob}`)
    if (cleanGender) messageParts.push(`Gender: ${cleanGender}`)
    if (cleanLocation) messageParts.push(`Location: ${cleanLocation}`)
    if (cleanEnquiryType) messageParts.push(`Enquiry Type: ${cleanEnquiryType}`)
    if (cleanCourseInterest) messageParts.push(`Course Interest: ${cleanCourseInterest}`)
    if (cleanMessage) messageParts.push(`\nMessage:\n${cleanMessage}`)

    const fullMessage = messageParts.join('\n') || 'No additional details provided'

    // Use fetch directly to Supabase REST API for more control
    const supabaseResponse = await fetch(`${supabaseUrl}/rest/v1/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({
        name: cleanName,
        email: cleanEmail,
        message: fullMessage,
        sent_confirmation: false,
      }),
    })

    if (!supabaseResponse.ok) {
      const errorText = await supabaseResponse.text()
      console.error('Supabase insert error:', supabaseResponse.status, errorText)

      // Provide user-friendly messages based on the error
      if (supabaseResponse.status === 401 || supabaseResponse.status === 403) {
        return NextResponse.json(
          { error: 'Database access denied. Please contact support.' },
          { status: 500 }
        )
      }
      if (supabaseResponse.status === 404) {
        return NextResponse.json(
          { error: 'Database table not found. Please contact support.' },
          { status: 500 }
        )
      }

      return NextResponse.json(
        { error: 'Failed to save your enquiry. Please try again or contact us directly.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err) {
    console.error('Unexpected error in contact API:', err)
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again later.' },
      { status: 500 }
    )
  }
}