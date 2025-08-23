// app/components/Dashboard.js
'use client'
import { Container, Row, Col, Card } from 'react-bootstrap'
import { Users, MessageSquare, FolderOpen, DollarSign, TrendingUp, Calendar } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'

export default function Dashboard() {
  const [clients] = useLocalStorage('clients', [])
  const [communications] = useLocalStorage('communications', [])
  const [projects] = useLocalStorage('projects', [])
  const [invoices] = useLocalStorage('invoices', [])

  const activeClients = clients.filter(c => c.status === 'Active').length
  const totalRevenue = invoices.filter(i => i.status === 'Paid').reduce((sum, inv) => sum + parseFloat(inv.amount || 0), 0)
  const recentCommunications = communications.slice(-5)
  const pendingProjects = projects.filter(p => p.status === 'In Progress').length

  const stats = [
    { icon: Users, label: 'Total Clients', value: clients.length, color: 'primary' },
    { icon: Users, label: 'Active Clients', value: activeClients, color: 'success' },
    { icon: FolderOpen, label: 'Active Projects', value: pendingProjects, color: 'warning' },
    { icon: DollarSign, label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, color: 'info' }
  ]

  return (
    <Container fluid className="p-4">
      <h2 className="mb-4 fw-bold">Dashboard</h2>
      
      <Row className="mb-4">
        {stats.map((stat, index) => (
          <Col md={3} key={index} className="mb-3">
            <Card className={`border-0 shadow-sm card-hover h-100 border-start border-${stat.color} border-4`}>
              <Card.Body className="d-flex align-items-center">
                <div className={`p-3 rounded-circle bg-${stat.color} bg-opacity-10 me-3`}>
                  <stat.icon size={24} className={`text-${stat.color}`} />
                </div>
                <div>
                  <h3 className="h4 mb-0 fw-bold">{stat.value}</h3>
                  <p className="text-muted mb-0 small">{stat.label}</p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row>
        <Col lg={8}>
          <Card className="shadow-sm border-0 mb-4">
            <Card.Header className="bg-white border-bottom-0 py-3">
              <h5 className="mb-0 fw-semibold d-flex align-items-center">
                <TrendingUp size={20} className="me-2 text-primary" />
                Recent Activity
              </h5>
            </Card.Header>
            <Card.Body>
              {recentCommunications.length > 0 ? (
                recentCommunications.map((comm, index) => (
                  <div key={index} className="d-flex align-items-center mb-3 pb-3 border-bottom">
                    <div className="p-2 rounded-circle bg-primary bg-opacity-10 me-3">
                      <MessageSquare size={16} className="text-primary" />
                    </div>
                    <div className="flex-grow-1">
                      <div className="fw-medium">{comm.type} with {comm.clientName}</div>
                      <div className="text-muted small">{comm.subject}</div>
                      <div className="text-muted small">{new Date(comm.date).toLocaleDateString()}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-5">
                  <MessageSquare size={48} className="text-muted mb-3" />
                  <h5 className="text-muted">No communications found</h5>
                  <p className="text-muted">Log your first communication to get started</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={4}>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-white border-bottom-0 py-3">
              <h5 className="mb-0 fw-semibold d-flex align-items-center">
                <Calendar size={20} className="me-2 text-success" />
                Quick Actions
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                <button className="btn btn-outline-primary btn-sm">Add New Client</button>
                <button className="btn btn-outline-success btn-sm">Log Communication</button>
                <button className="btn btn-outline-warning btn-sm">Create Project</button>
                <button className="btn btn-outline-info btn-sm">Generate Invoice</button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}