import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { readFileSync } from 'fs'
import { join } from 'path'

function getUsers() {
  const filePath = join(process.cwd(), 'data', 'users.json')
  return JSON.parse(readFileSync(filePath, 'utf-8'))
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null

        const users = getUsers()
        const user = users.find(u => u.username === credentials.username)
        if (!user) return null

        const valid = await bcrypt.compare(credentials.password, user.password)
        if (!valid) return null

        return { id: user.id, name: user.name, email: user.email, username: user.username, role: user.role }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.username = user.username
      }
      return token
    },
    async session({ session, token }) {
      session.user.role = token.role
      session.user.username = token.username
      return session
    }
  },
  pages: {
    signIn: '/'
  },
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
