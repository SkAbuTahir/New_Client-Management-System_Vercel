import './globals.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Inter } from 'next/font/google'
import Providers from './components/Providers'
import { AuthProvider } from './contexts/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'ClientPro — Client Management System',
  description: 'Professional client management and CRM solution',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <AuthProvider>
            {children}
          </AuthProvider>
        </Providers>
      </body>
    </html>
  )
}