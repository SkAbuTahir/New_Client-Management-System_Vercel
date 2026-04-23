'use client'
import { useState } from 'react'
import { Container, Row, Col, Card, Button, Form, Table, Badge, InputGroup, Modal } from 'react-bootstrap'
import { Plus, Search, MessageSquare, Phone, Mail, Calendar } from 'lucide-react'
import { useSupabase } from '../hooks/useSupabase'

export default function Communications() {
  const [communications, setCommunications] = useSupabase('communications', [])
  const [clients] = useSupabase('clients', [])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('All')
  const [showModal, setShowModal] = useState(false)
  
  const [formData, setFormData] = useState({
    clientId: '',
    clientName: '',
    type: 'Email',
    subject: '',
    notes: '',
    date: new Date().toISOString().split('T')[0],
    followUpDate: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const selectedClient = clients.find(c => c.id === parseInt(formData.clientId))
    
    const newCommunication = {
      ...formData,
      clientName: selectedClient?.name || '',
      id: Date.now(),
      createdAt: new Date().toISOString()
    }
    setCommunications([...communications, newCommunication])
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      clientId: '',
      clientName: '',
      type: 'Email',
      subject: '',
      notes: '',
      date: new Date().toISOString().split('T')[0],
      followUpDate: ''
    })
    setShowModal(false)
  }

  const filteredCommunications = communications.filter(comm => {
    const matchesSearch = comm.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comm.subject.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === 'All' || comm.type === filterType
    return matchesSearch && matchesFilter
  })

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Email': return <Mail size={16} />
      case 'Phone': return <Phone size={16} />
      case 'Meeting': return <Calendar size={16} />
      default: return <MessageSquare size={16} />
    }
  }

  const getTypeBadge = (type) => {
    const variants = {
      'Email': 'primary',
      'Phone': 'success',
      'Meeting': 'warning',
      'SMS': 'info'
    }
    return variants[type] || 'secondary'
  }

  return (
    <Container fluid className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Communications</h2>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          <Plus size={18} className="me-2" />
          Log Communication
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
                  placeholder="Search communications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={3}>
              <Form.Select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                <option value="All">All Types</option>
                <option value="Email">Email</option>
                <option value="Phone">Phone</option>
                <option value="Meeting">Meeting</option>
                <option value="SMS">SMS</option>
              </Form.Select>
            </Col>
            <Col md={3}>
              <div className="text-muted small">
                Showing {filteredCommunications.length} communications
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card className="shadow-sm border-0">
        <Card.Body className="p-0">
          {filteredCommunications.length > 0 ? (
            <div className="table-responsive">
              <Table className="mb-0" hover>
                <thead className="table-light">
                  <tr>
                    <th>Date</th>
                    <th>Client</th>
                    <th>Type</th>
                    <th>Subject</th>
                    <th>Follow Up</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCommunications.map((comm) => (
                    <tr key={comm.id}>
                      <td className="text-muted small">
                        {new Date(comm.date).toLocaleDateString()}
                      </td>
                      <td className="fw-medium">{comm.clientName}</td>
                      <td>
                        <Badge 
                          bg={getTypeBadge(comm.type)}
                          className="d-flex align-items-center gap-1 status-badge"
                        >
                          {getTypeIcon(comm.type)}
                          {comm.type}
                        </Badge>
                      </td>
                      <td>{comm.subject}</td>
                      <td className="text-muted small">
                        {comm.followUpDate ? new Date(comm.followUpDate).toLocaleDateString() : '-'}
                      </td>
                      <td>
                        <div className="text-truncate" style={{maxWidth: '200px'}} title={comm.notes}>
                          {comm.notes}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-5">
              <MessageSquare size={48} className="text-muted mb-3" />
              <h5 className="text-muted">No communications found</h5>
              <p className="text-muted">Start by logging your first communication with a client.</p>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Communication Modal */}
      <Modal show={showModal} onHide={resetForm} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Log Communication</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Client *</Form.Label>
                  <Form.Select
                    required
                    value={formData.clientId}
                    onChange={(e) => setFormData({...formData, clientId: e.target.value})}
                  >
                    <option value="">Select a client</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>{client.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Type</Form.Label>
                  <Form.Select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                  >
                    <option value="Email">Email</option>
                    <option value="Phone">Phone</option>
                    <option value="Meeting">Meeting</option>
                    <option value="SMS">SMS</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Subject *</Form.Label>
              <Form.Control
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Date *</Form.Label>
                  <Form.Control
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Follow Up Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.followUpDate}
                    onChange={(e) => setFormData({...formData, followUpDate: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={resetForm}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Log Communication
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  )
}