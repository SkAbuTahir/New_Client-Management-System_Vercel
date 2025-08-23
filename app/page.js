// 'use client'
// import dynamic from 'next/dynamic'

// const ClientApp = dynamic(() => import('./components/ClientApp'), {
//   ssr: false,
//   loading: () => (
//     <div className="min-vh-100 d-flex align-items-center justify-content-center">
//       <div className="text-center">
//         <div className="spinner-border text-primary mb-3" role="status">
//           <span className="visually-hidden">Loading...</span>
//         </div>
//         <p className="text-muted">Loading application...</p>
//       </div>
//     </div>
//   )
// })

// export default function Home() {
//   return <ClientApp />
// }

'use client'
import { useState, useEffect } from 'react'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import { Container, Row, Col } from 'react-bootstrap'
import { useAuth } from './contexts/AuthContext'
import NavigationBar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import ClientManagement from './components/ClientManagement'
import Communications from './components/Communications'
import ProjectManagement from './components/ProjectManagement'
import InvoiceManagement from './components/InvoiceManagement'
import LoginForm from './components/LoginForm'

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard')
  // const { user, loading } = useAuth()
  const { user, loading, login, logout } = useAuth();

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
              <p className="mb-0">Settings functionality can be implemented here. This could include user preferences, system configuration, backup/restore options, etc.</p>
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
