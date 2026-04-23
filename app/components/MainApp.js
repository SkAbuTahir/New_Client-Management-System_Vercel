'use client'
import { useState, useEffect } from 'react'
import { Container } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import Dashboard from './Dashboard'
import ClientManagement from './ClientManagement'
import Communications from './Communications'
import ProjectManagement from './ProjectManagement'
import InvoiceManagement from './InvoiceManagement'
import LoginForm from './LoginForm'

export default function MainApp() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)      // mobile drawer
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false) // desktop collapse
  const { user, loading, logout } = useAuth()

  // Close mobile drawer on tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setSidebarOpen(false)
  }

  // Close drawer on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 992) setSidebarOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('bootstrap/dist/js/bootstrap.bundle.min.js')
    }
  }, [])

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: '#f8fafc' }}>
        <div className="text-center">
          <div className="spinner-border mb-3" role="status" style={{ color: '#4f46e5' }} />
          <p className="text-muted text-sm">Loading…</p>
        </div>
      </div>
    )
  }

  if (!user) return <LoginForm />

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':      return <Dashboard setActiveTab={handleTabChange} />
      case 'clients':        return <ClientManagement />
      case 'communications': return <Communications />
      case 'projects':       return <ProjectManagement />
      case 'invoices':       return <InvoiceManagement />
      case 'settings':       return (
        <Container fluid className="p-4">
          <h2 className="fw-700 mb-4" style={{ color: '#1e293b' }}>Settings</h2>
          <div className="alert alert-info rounded-xl">Settings functionality coming soon.</div>
        </Container>
      )
      default: return <Dashboard setActiveTab={handleTabChange} />
    }
  }

  return (
    <div className="min-vh-100" style={{ background: '#f8fafc' }}>
      <Navbar
        sidebarCollapsed={sidebarCollapsed}
        onToggleMobile={() => setSidebarOpen(o => !o)}
        onToggleDesktop={() => setSidebarCollapsed(c => !c)}
      />

      {/* Mobile overlay backdrop */}
      {sidebarOpen && (
        <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="d-flex" style={{ minHeight: 'calc(100vh - 56px)' }}>
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          mobileOpen={sidebarOpen}
          collapsed={sidebarCollapsed}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main content */}
        <main
          className="flex-grow-1 overflow-auto"
          style={{
            background: '#f8fafc',
            minHeight: 'calc(100vh - 56px)',
            transition: 'margin-left 0.3s ease',
          }}
        >
          {renderContent()}
        </main>
      </div>
    </div>
  )
}
