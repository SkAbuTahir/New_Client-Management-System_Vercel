'use client'
import { Nav } from 'react-bootstrap'
import { Users, MessageSquare, FolderOpen, FileText, BarChart3, Settings } from 'lucide-react'
import { usePathname } from 'next/navigation'

export default function Sidebar({ activeTab, setActiveTab }) {
  const pathname = usePathname()

  const navItems = [
    { key: 'dashboard', icon: BarChart3, label: 'Dashboard' },
    { key: 'clients', icon: Users, label: 'Clients' },
    { key: 'communications', icon: MessageSquare, label: 'Communications' },
    { key: 'projects', icon: FolderOpen, label: 'Projects' },
    { key: 'invoices', icon: FileText, label: 'Invoices' },
    { key: 'settings', icon: Settings, label: 'Settings' }
  ]

  return (
    <div className="sidebar text-white p-3">
      <Nav className="flex-column">
        {navItems.map(({ key, icon: Icon, label }) => (
          <Nav.Link
            key={key}
            className={`text-white mb-2 rounded px-3 py-2 d-flex align-items-center ${
              activeTab === key ? 'bg-white bg-opacity-50' : 'hover:bg-white hover:bg-opacity-10'
            }`}
            onClick={() => setActiveTab(key)}
            style={{ cursor: 'pointer' }}
          >
            <Icon size={18} className="me-2" />
            {label}
          </Nav.Link>
        ))}
      </Nav>
    </div>
  )
}
