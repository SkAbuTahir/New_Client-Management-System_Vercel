import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

export async function POST(req) {
  try {
    const { username, name, email, password, role } = await req.json()

    if (!username || !name || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    const supabase = createClient()

    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .or(`username.eq.${username},email.eq.${email}`)
      .single()

    if (existing) {
      return NextResponse.json({ error: 'Username or email already exists' }, { status: 409 })
    }

    const hashed = await bcrypt.hash(password, 10)
    const { error } = await supabase.from('users').insert([{
      username,
      name,
      email,
      password: hashed,
      role: role || 'Employee'
    }])

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ message: 'Account created successfully' }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
