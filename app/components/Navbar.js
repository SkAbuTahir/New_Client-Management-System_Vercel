'use client'
import { Dropdown } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { LogOut, Settings, BarChart3, Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react'

const roleColors = { Admin: '#ef4444', Manager: '#f59e0b', Employee: '#10b981' }

export default function Navbar({ sidebarCollapsed, onToggleMobile, onToggleDesktop }) {
  const { user, logout } = useAuth()

  return (
    <header className="app-navbar d-flex align-items-center px-3 px-lg-4" style={{ height: 56, position: 'sticky', top: 0, zIndex: 1030 }}>
      {/* Desktop collapse toggle */}
      <button
        className="navbar-icon-btn d-none d-lg-flex me-3"
        onClick={onToggleDesktop}
        aria-label="Toggle sidebar"
        title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {sidebarCollapsed ? <PanelLeftOpen size={20} color="rgba(255,255,255,0.85)" /> : <PanelLeftClose size={20} color="rgba(255,255,255,0.85)" />}
      </button>

      {/* Mobile hamburger */}
      <button
        className="navbar-icon-btn d-flex d-lg-none me-3"
        onClick={onToggleMobile}
        aria-label="Open menu"
      >
        <Menu size={20} color="rgba(255,255,255,0.85)" />
      </button>

      {/* Brand */}
      <div className="d-flex align-items-center gap-2 me-auto">
        <div className="d-flex align-items-center justify-content-center rounded-lg" style={{ width: 28, height: 28, background: 'rgba(255,255,255,0.18)' }}>
          <BarChart3 size={15} color="#fff" />
        </div>
        <span className="fw-700 text-white" style={{ fontSize: '1.05rem', letterSpacing: '-0.02em' }}>ClientPro</span>
      </div>

      {user && (
        <div className="d-flex align-items-center gap-2 gap-sm-3">
          <span
            className="d-none d-sm-inline px-2 py-1 rounded-pill fw-600"
            style={{ background: roleColors[user.role] || '#6b7280', color: '#fff', fontSize: '0.68rem' }}
          >
            {user.role}
          </span>

          <Dropdown align="end">
            <Dropdown.Toggle
              as="button"
              className="d-flex align-items-center gap-2 border-0 bg-transparent p-0"
              style={{ boxShadow: 'none', cursor: 'pointer' }}
            >
              <div
                className="rounded-circle d-flex align-items-center justify-content-center fw-700 text-white flex-shrink-0"
                style={{ width: 32, height: 32, background: 'rgba(255,255,255,0.22)', fontSize: 13, border: '2px solid rgba(255,255,255,0.3)' }}
              >
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <span className="text-white fw-600 d-none d-md-inline" style={{ fontSize: '0.875rem' }}>{user.name}</span>
            </Dropdown.Toggle>

            <Dropdown.Menu className="shadow-lg border-0 rounded-xl mt-1" style={{ minWidth: 190 }}>
              <div className="px-3 py-2 border-bottom">
                <div className="fw-600 text-sm" style={{ color: '#1e293b' }}>{user.name}</div>
                <div className="text-xs" style={{ color: '#94a3b8' }}>@{user.username}</div>
              </div>
              <Dropdown.Item className="d-flex align-items-center gap-2 py-2 text-sm">
                <Settings size={14} style={{ color: '#64748b' }} /> Settings
              </Dropdown.Item>
              <Dropdown.Divider className="my-1" />
              <Dropdown.Item className="d-flex align-items-center gap-2 py-2 text-sm text-danger" onClick={logout}>
                <LogOut size={14} /> Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      )}
    </header>
  )
}
