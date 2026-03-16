import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, email, phone, dob, gender, location, enquiryType, courseInterest, message, honeypot } = body

  // Spam protection
  if (honeypot) return NextResponse.json({ error: 'Spam detected' }, { status: 400 })

  // Server-side validation
  if (!name || !email) {
    return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
  }
  if (!/\S+@\S+\.\S+/.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  // Save to Supabase
  const { error } = await supabase.from('leads').insert([
    {
      name,
      email,
      phone: phone || null,
      dob: dob || null,
      gender: gender || null,
      location: location || null,
      enquiry_type: enquiryType || null,
      course_interest: courseInterest || null,
      message: message || null,
      sent_confirmation: false,
    }
  ])

  if (error) {
    console.error('Supabase error:', error)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }

  return NextResponse.json({ success: true }, { status: 200 })
}