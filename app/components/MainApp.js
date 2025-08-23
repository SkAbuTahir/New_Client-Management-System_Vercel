'use client'
import { useState, useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import NavigationBar from './Navbar'
import Sidebar from './Sidebar'
import Dashboard from './Dashboard'
import ClientManagement from './ClientManagement'
import Communications from './Communications'
import ProjectManagement from './ProjectManagement'
import InvoiceManagement from './InvoiceManagement'
import LoginForm from './LoginForm'

export default function MainApp() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const { user, loading } = useAuth()

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
        return <Dashboard />
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
      <NavigationBar />
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