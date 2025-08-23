'use client'
import { useState, useEffect } from 'react'
import { Container, Row, Col, Button, Form, Table, Modal, Badge, InputGroup, Card, Nav, Navbar, Dropdown, ProgressBar, Alert } from 'react-bootstrap'
import { 
  Users, MessageSquare, FolderOpen, FileText, BarChart3, Settings, 
  Plus, Search, Edit, Trash2, Phone, Mail, Building, Calendar,
  User, LogOut, DollarSign, TrendingUp, Download, Send, Lock, Eye, EyeOff
} from 'lucide-react'

// Custom hook for localStorage
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(initialValue)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const item = window.localStorage.getItem(key)
        if (item) {
          setStoredValue(JSON.parse(item))
        }
      } catch (error) {
        console.error(`Error reading localStorage key "${key}":`, error)
      }
    }
  }, [key])

  const setValue = (value) => {
    try {
      setStoredValue(value)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(value))
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }

  return [storedValue, setValue]
}

// Auth Context
function useAuth() {
  const [user, setUser] = useLocalStorage('user', null)
  
  const login = (userData) => {
    setUser(userData)
  }

  const logout = () => {
    setUser(null)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('clients')
      localStorage.removeItem('communications')
      localStorage.removeItem('projects')
      localStorage.removeItem('invoices')
    }
  }

  return { user, login, logout }
}

// Navigation Bar Component
function NavigationBar({ user, logout }) {
  return (
    <Navbar className="bg-primary" variant="dark" expand="lg" style={{ padding: '0.5rem 1rem' }}>
      <Navbar.Brand href="/" className="fw-bold text-white">
        ClientPro
      </Navbar.Brand>
      
      <Navbar.Toggle />
      <Navbar.Collapse className="justify-content-end">
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
      </Navbar.Collapse>
    </Navbar>
  )
}

// Sidebar Component
function Sidebar({ activeTab, setActiveTab }) {
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
              activeTab === key ? ' bg-opacity-20' : ''
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

// Dashboard Component
function Dashboard() {
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
            <Card className={`border-0 shadow-sm card-hover h-100`} style={{ borderLeft: `4px solid var(--bs-${stat.color})` }}>
              <Card.Body className="d-flex align-items-center">
                <div className={`p-3 rounded-circle me-3`} style={{ backgroundColor: `rgba(var(--bs-${stat.color}-rgb), 0.1)` }}>
                  <stat.icon size={24} style={{ color: `var(--bs-${stat.color})` }} />
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
                <p className="text-muted text-center py-4">No recent communications</p>
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

// Client Management Component
function ClientManagement() {
  const [clients, setClients] = useLocalStorage('clients', [])
  const [showModal, setShowModal] = useState(false)
  const [editingClient, setEditingClient] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    status: 'Active',
    notes: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingClient) {
      setClients(clients.map(client => 
        client.id === editingClient.id 
          ? { ...formData, id: editingClient.id, updatedAt: new Date().toISOString() }
          : client
      ))
    } else {
      const newClient = {
        ...formData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      setClients([...clients, newClient])
    }
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      address: '',
      status: 'Active',
      notes: ''
    })
    setEditingClient(null)
    setShowModal(false)
  }

  const handleEdit = (client) => {
    setFormData(client)
    setEditingClient(client)
    setShowModal(true)
  }

  const handleDelete = (id) => {
    if (typeof window !== 'undefined' && window.confirm('Are you sure you want to delete this client?')) {
      setClients(clients.filter(client => client.id !== id))
    }
  }

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'All' || client.status === filterStatus
    return matchesSearch && matchesFilter
  })

  return (
    <Container fluid className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Client Management</h2>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          <Plus size={18} className="me-2" />
          Add Client
        </Button>
      </div>

      <Card className="shadow-sm border-0 mb-4">
        <Card.Body>
          <Row>
            <Col md={6}>
              <InputGroup className="mb-3">
                <InputGroup.Text>
                  <Search size={16} />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search clients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={3}>
              <Form.Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Pending">Pending</option>
              </Form.Select>
            </Col>
            <Col md={3}>
              <div className="text-muted small">
                Showing {filteredClients.length} of {clients.length} clients
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card className="shadow-sm border-0">
        <Card.Body className="p-0">
          {filteredClients.length > 0 ? (
            <div className="table-responsive">
              <Table className="mb-0" hover>
                <thead className="table-light">
                  <tr>
                    <th>Client</th>
                    <th>Contact</th>
                    <th>Company</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.map((client) => (
                    <tr key={client.id}>
                      <td>
                        <div className="fw-medium">{client.name}</div>
                        <div className="text-muted small">{client.email}</div>
                      </td>
                      <td>
                        <div className="d-flex flex-column gap-1">
                          <div className="d-flex align-items-center">
                            <Phone size={14} className="me-1 text-muted" />
                            <small>{client.phone}</small>
                          </div>
                          <div className="d-flex align-items-center">
                            <Mail size={14} className="me-1 text-muted" />
                            <small>{client.email}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <Building size={14} className="me-1 text-muted" />
                          {client.company}
                        </div>
                      </td>
                      <td>
                        <Badge 
                          bg={client.status === 'Active' ? 'success' : 
                              client.status === 'Inactive' ? 'danger' : 'warning'}
                          className="status-badge"
                        >
                          {client.status}
                        </Badge>
                      </td>
                      <td className="text-muted small">
                        {new Date(client.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleEdit(client)}
                          >
                            <Edit size={14} />
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(client.id)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-5">
              <Users size={48} className="text-muted mb-3" />
              <h5 className="text-muted">No clients found</h5>
              <p className="text-muted">Add your first client to get started</p>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Client Modal */}
      <Modal show={showModal} onHide={resetForm} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingClient ? 'Edit Client' : 'Add New Client'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Name *</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email *</Form.Label>
                  <Form.Control
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Company</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Pending">Pending</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Additional notes about the client..."
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={resetForm}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingClient ? 'Update Client' : 'Add Client'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  )
}

// Login Form Component
function LoginForm({ onLogin }) {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    const validCredentials = [
      { username: 'admin', password: 'admin123', name: 'Admin User', role: 'Admin' },
      { username: 'manager', password: 'manager123', name: 'Manager User', role: 'Manager' },
      { username: 'employee', password: 'employee123', name: 'Employee User', role: 'Employee' }
    ]

    const user = validCredentials.find(
      cred => cred.username === formData.username && cred.password === formData.password
    )

    if (user) {
      onLogin({
        username: user.username,
        name: user.name,
        role: user.role
      })
    } else {
      setError('Invalid username or password')
    }
  }

  return (
    <div className="min-vh-100 d-flex align-items-center" style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <Container>
        <Row className="justify-content-center">
          <Col lg={5} md={7}>
            <Card className="shadow-lg border-0">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <div className="p-3 rounded-circle bg-primary bg-opacity-10 d-inline-flex mb-3">
                    <User size={32} className="text-primary" />
                  </div>
                  <h3 className="fw-bold">Welcome to ClientPro</h3>
                  <p className="text-muted">Sign in to your account</p>
                </div>

                {error && (
                  <Alert variant="danger" className="mb-3">
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <User size={16} className="text-muted" />
                      </span>
                      <Form.Control
                        type="text"
                        required
                        value={formData.username}
                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                        className="border-start-0 ps-0"
                        placeholder="Enter your username"
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Password</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <Lock size={16} className="text-muted" />
                      </span>
                      <Form.Control
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="border-start-0 border-end-0 ps-0"
                        placeholder="Enter your password"
                      />
                      <Button
                        variant="outline-light"
                        className="border-start-0"
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </Button>
                    </div>
                  </Form.Group>

                  <Button variant="primary" type="submit" className="w-100 mb-3">
                    Sign In
                  </Button>
                </Form>

                <div className="mt-4 p-3 bg-light rounded">
                  <h6 className="fw-semibold mb-2">Demo Credentials:</h6>
                  <div className="small text-muted">
                    <div><strong>Admin:</strong> admin / admin123</div>
                    <div><strong>Manager:</strong> manager / manager123</div>
                    <div><strong>Employee:</strong> employee / employee123</div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

// Main App Component
export default function ClientApp() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const { user, login, logout } = useAuth()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
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
    return <LoginForm onLogin={login} />
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />
      case 'clients':
        return <ClientManagement />
      case 'communications':
        return (
          <Container fluid className="p-4">
            <h2 className="fw-bold mb-4">Communications</h2>
            <div className="alert alert-info">
              <h5>Communications Panel</h5>
              <p className="mb-0">Communication tracking functionality would be implemented here.</p>
            </div>
          </Container>
        )
      case 'projects':
        return (
          <Container fluid className="p-4">
            <h2 className="fw-bold mb-4">Project Management</h2>
            <div className="alert alert-info">
              <h5>Project Management Panel</h5>
              <p className="mb-0">Project management functionality would be implemented here.</p>
            </div>
          </Container>
        )
      case 'invoices':
        return (
          <Container fluid className="p-4">
            <h2 className="fw-bold mb-4">Invoice Management</h2>
            <div className="alert alert-info">
              <h5>Invoice Management Panel</h5>
              <p className="mb-0">Invoice management functionality would be implemented here.</p>
            </div>
          </Container>
        )
      case 'settings':
        return (
          <Container fluid className="p-4">
            <h2 className="fw-bold mb-4">Settings</h2>
            <div className="alert alert-info">
              <h5>Settings Panel</h5>
              <p className="mb-0">Settings functionality would be implemented here.</p>
            </div>
          </Container>
        )
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="min-vh-100 bg-light">
      <NavigationBar user={user} logout={logout} />
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