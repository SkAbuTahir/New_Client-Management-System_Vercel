'use client'
import { useState, useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { Container, Row, Col, Nav, Navbar, Dropdown } from 'react-bootstrap'
import { User, Settings, LogOut } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import Sidebar from './Sidebar'
import Dashboard from './Dashboard'
import ClientManagement from './ClientManagement'
import Communications from './Communications'
import ProjectManagement from './ProjectManagement'
import InvoiceManagement from './InvoiceManagement'
import LoginForm from './LoginForm'

function NavigationBar({ user, logout, activeTab, setActiveTab }) {
  const navItems = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'clients', label: 'Clients' },
    { key: 'communications', label: 'Communications' },
    { key: 'projects', label: 'Projects' },
    { key: 'invoices', label: 'Invoices' }
  ]

  return (
    <Navbar className="bg-primary" variant="dark" expand="lg">
      <Navbar.Brand className="fw-bold text-white">
        ClientPro
      </Navbar.Brand>
      
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto d-lg-none">
          {navItems.map(({ key, label }) => (
            <Nav.Link
              key={key}
              className={`text-white ${activeTab === key ? 'active' : ''}`}
              onClick={() => setActiveTab(key)}
            >
              {label}
            </Nav.Link>
          ))}
        </Nav>
        <Nav className="ms-auto">
          {user && (
            <Dropdown align="end">
              <Dropdown.Toggle variant="outline-light" id="user-dropdown">
                <User size={18} className="me-2" />
                {user.name}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item>
                  <Settings size={16} className="me-2" />
                  Settings
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={logout}>
                  <LogOut size={16} className="me-2" />
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default function MainApp() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const { user, loading, logout } = useAuth()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('bootstrap/dist/js/bootstrap.bundle.min.js')
    }
  }, [])

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoginForm />
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard setActiveTab={setActiveTab} />
      case 'clients':
        return <ClientManagement />
      case 'communications':
        return <Communications />
      case 'projects':
        return <ProjectManagement />
      case 'invoices':
        return <InvoiceManagement />
      case 'settings':
        return (
          <Container fluid className="p-4">
            <h2 className="fw-bold mb-4">Settings</h2>
            <div className="alert alert-info">
              <h5>Settings Panel</h5>
              <p className="mb-0">Settings functionality can be implemented here.</p>
            </div>
          </Container>
        )
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="min-vh-100 bg-light">
      <NavigationBar user={user} logout={logout} activeTab={activeTab} setActiveTab={setActiveTab} />
      <Container fluid className="p-0">
        <Row className="g-0">
          <Col lg={2} className="d-none d-lg-block">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          </Col>
          <Col lg={10}>
            <main className="bg-white min-vh-100">
              {renderContent()}
            </main>
          </Col>
        </Row>
      </Container>
    </div>
  )
}