import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const filePath = join(process.cwd(), 'data', 'users.json')

export async function POST(req) {
  try {
    const { username, name, email, password, role } = await req.json()

    if (!username || !name || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    const users = JSON.parse(readFileSync(filePath, 'utf-8'))

    if (users.find(u => u.username === username)) {
      return NextResponse.json({ error: 'Username already exists' }, { status: 409 })
    }
    if (users.find(u => u.email === email)) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
    }

    const hashed = await bcrypt.hash(password, 10)
    const newUser = {
      id: Date.now().toString(),
      username,
      name,
      email,
      password: hashed,
      role: role || 'Employee'
    }

    users.push(newUser)
    writeFileSync(filePath, JSON.stringify(users, null, 2))

    return NextResponse.json({ message: 'Account created successfully' }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
