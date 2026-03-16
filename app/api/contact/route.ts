import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, email, message, honeypot } = body

  // Spam protection
  if (honeypot) return NextResponse.json({ error: 'Spam detected' }, { status: 400 })

  // Server-side validation
  if (!name || !email || !message) {
    return NextResponse.json({ error: 'All fields required' }, { status: 400 })
  }
  if (!/\S+@\S+\.\S+/.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  // Save to Supabase
  const { error } = await supabase.from('leads').insert([
    { name, email, message, sent_confirmation: false }
  ])

  if (error) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }

  return NextResponse.json({ success: true }, { status: 200 })
}