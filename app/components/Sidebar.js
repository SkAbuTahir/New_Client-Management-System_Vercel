'use client'
import { BarChart3, Users, MessageSquare, FolderOpen, FileText, Settings, ChevronLeft, X } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const navItems = [
  { key: 'dashboard',      icon: BarChart3,     label: 'Dashboard',      section: 'MAIN' },
  { key: 'clients',        icon: Users,          label: 'Clients',        section: 'MANAGE' },
  { key: 'communications', icon: MessageSquare,  label: 'Communications', section: 'MANAGE' },
  { key: 'projects',       icon: FolderOpen,     label: 'Projects',       section: 'MANAGE' },
  { key: 'invoices',       icon: FileText,       label: 'Invoices',       section: 'MANAGE' },
  { key: 'settings',       icon: Settings,       label: 'Settings',       section: 'OTHER' },
]

const roleColors  = { Admin: '#ef4444', Manager: '#f59e0b', Employee: '#10b981' }
const roleBg      = { Admin: 'rgba(239,68,68,0.15)', Manager: 'rgba(245,158,11,0.15)', Employee: 'rgba(16,185,129,0.15)' }

export default function Sidebar({ activeTab, setActiveTab, mobileOpen, collapsed, onClose }) {
  const { user } = useAuth()

  // Group nav items by section
  const sections = ['MAIN', 'MANAGE', 'OTHER']

  return (
    <aside className={`app-sidebar ${mobileOpen ? 'mobile-open' : ''} ${collapsed ? 'collapsed' : ''}`}>
      {/* Mobile close button */}
      <button className="sidebar-close-btn d-lg-none" onClick={onClose} aria-label="Close menu">
        <X size={18} color="rgba(255,255,255,0.8)" />
      </button>

      {/* User profile */}
      {user && (
        <div className="sidebar-profile">
          <div
            className="sidebar-avatar"
            style={{ background: roleBg[user.role] || 'rgba(255,255,255,0.15)', border: `2px solid ${roleColors[user.role] || '#6b7280'}` }}
          >
            {user.name?.charAt(0).toUpperCase()}
          </div>
          {!collapsed && (
            <div className="sidebar-profile-info">
              <div className="sidebar-username">{user.name}</div>
              <span className="sidebar-role-badge" style={{ background: roleBg[user.role], color: roleColors[user.role] }}>
                {user.role}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Nav */}
      <nav className="sidebar-nav">
        {sections.map(section => {
          const items = navItems.filter(i => i.section === section)
          return (
            <div key={section} className="sidebar-section">
              {!collapsed && <div className="sidebar-section-label">{section}</div>}
              {items.map(({ key, icon: Icon, label }) => (
                <button
                  key={key}
                  className={`sidebar-nav-item ${activeTab === key ? 'active' : ''}`}
                  onClick={() => setActiveTab(key)}
                  title={collapsed ? label : undefined}
                >
                  <span className="sidebar-nav-icon"><Icon size={18} /></span>
                  {!collapsed && <span className="sidebar-nav-label">{label}</span>}
                  {activeTab === key && <span className="sidebar-active-bar" />}
                </button>
              ))}
            </div>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        {!collapsed && <span className="sidebar-version">ClientPro v1.0</span>}
      </div>
    </aside>
  )
}
