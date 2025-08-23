'use client'
import { useState } from 'react'
import { Container, Row, Col, Card, Button, Form, Table, Modal, Badge, InputGroup } from 'react-bootstrap'
import { Plus, Search, FileText, DollarSign, Download, Send } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'

export default function InvoiceManagement() {
  const [invoices, setInvoices] = useLocalStorage('invoices', [])
  const [clients] = useLocalStorage('clients', [])
  const [projects] = useLocalStorage('projects', [])
  const [showModal, setShowModal] = useState(false)
  const [editingInvoice, setEditingInvoice] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  
  const [formData, setFormData] = useState({
    clientId: '',
    projectId: '',
    invoiceNumber: '',
    amount: '',
    description: '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    status: 'Draft',
    notes: ''
  })

  const generateInvoiceNumber = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const count = invoices.length + 1
    return `INV-${year}${month}-${String(count).padStart(3, '0')}`
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const selectedClient = clients.find(c => c.id === parseInt(formData.clientId))
    const selectedProject = projects.find(p => p.id === parseInt(formData.projectId))
    
    if (editingInvoice) {
      setInvoices(invoices.map(invoice => 
        invoice.id === editingInvoice.id 
          ? { 
              ...formData, 
              id: editingInvoice.id, 
              clientName: selectedClient?.name,
              projectName: selectedProject?.name,
              updatedAt: new Date().toISOString() 
            }
          : invoice
      ))
    } else {
      const newInvoice = {
        ...formData,
        invoiceNumber: formData.invoiceNumber || generateInvoiceNumber(),
        clientName: selectedClient?.name || '',
        projectName: selectedProject?.name || '',
        id: Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      setInvoices([...invoices, newInvoice])
    }
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      clientId: '',
      projectId: '',
      invoiceNumber: '',
      amount: '',
      description: '',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: '',
      status: 'Draft',
      notes: ''
    })
    setEditingInvoice(null)
    setShowModal(false)
  }

  const handleEdit = (invoice) => {
    setFormData(invoice)
    setEditingInvoice(invoice)
    setShowModal(true)
  }

  const handleDelete = (id) => {
    if (typeof window !== 'undefined' && window.confirm('Are you sure you want to delete this invoice?')) {
      setInvoices(invoices.filter(invoice => invoice.id !== id))
    }
  }

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'All' || invoice.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusBadge = (status) => {
    const variants = {
      'Draft': 'secondary',
      'Sent': 'primary',
      'Paid': 'success',
      'Overdue': 'danger',
      'Cancelled': 'dark'
    }
    return variants[status] || 'secondary'
  }

  const totalAmount = filteredInvoices.reduce((sum, inv) => sum + parseFloat(inv.amount || 0), 0)
  const paidAmount = filteredInvoices.filter(inv => inv.status === 'Paid').reduce((sum, inv) => sum + parseFloat(inv.amount || 0), 0)
  const pendingAmount = totalAmount - paidAmount

  return (
    <Container fluid className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Invoice Management</h2>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          <Plus size={18} className="me-2" />
          New Invoice
        </Button>
      </div>

      {/* Summary Cards */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="border-0 shadow-sm card-hover">
            <Card.Body className="d-flex align-items-center">
              <div className="p-3 rounded-circle bg-primary bg-opacity-10 me-3">
                <DollarSign size={24} className="text-primary" />
              </div>
              <div>
                <h4 className="fw-bold mb-0">${totalAmount.toLocaleString()}</h4>
                <p className="text-muted mb-0 small">Total Amount</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm card-hover">
            <Card.Body className="d-flex align-items-center">
              <div className="p-3 rounded-circle bg-success bg-opacity-10 me-3">
                <DollarSign size={24} className="text-success" />
              </div>
              <div>
                <h4 className="fw-bold mb-0">${paidAmount.toLocaleString()}</h4>
                <p className="text-muted mb-0 small">Paid Amount</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm card-hover">
            <Card.Body className="d-flex align-items-center">
              <div className="p-3 rounded-circle bg-warning bg-opacity-10 me-3">
                <DollarSign size={24} className="text-warning" />
              </div>
              <div>
                <h4 className="fw-bold mb-0">${pendingAmount.toLocaleString()}</h4>
                <p className="text-muted mb-0 small">Pending Amount</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="shadow-sm border-0 mb-4">
        <Card.Body>
          <Row>
            <Col md={6}>
              <InputGroup className="mb-3">
                <InputGroup.Text>
                  <Search size={16} />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search invoices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={3}>
              <Form.Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="All">All Status</option>
                <option value="Draft">Draft</option>
                <option value="Sent">Sent</option>
                <option value="Paid">Paid</option>
                <option value="Overdue">Overdue</option>
                <option value="Cancelled">Cancelled</option>
              </Form.Select>
            </Col>
            <Col md={3}>
              <div className="text-muted small">
                Showing {filteredInvoices.length} of {invoices.length} invoices
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card className="shadow-sm border-0">
        <Card.Body className="p-0">
          {filteredInvoices.length > 0 ? (
            <div className="table-responsive">
              <Table className="mb-0" hover>
                <thead className="table-light">
                  <tr>
                    <th>Invoice #</th>
                    <th>Client</th>
                    <th>Project</th>
                    <th>Amount</th>
                    <th>Issue Date</th>
                    <th>Due Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice.id}>
                      <td className="fw-medium">{invoice.invoiceNumber}</td>
                      <td>{invoice.clientName}</td>
                      <td>{invoice.projectName || '-'}</td>
                      <td className="fw-bold">${parseFloat(invoice.amount || 0).toLocaleString()}</td>
                      <td className="text-muted small">
                        {new Date(invoice.issueDate).toLocaleDateString()}
                      </td>
                      <td className="text-muted small">
                        {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : '-'}
                      </td>
                      <td>
                        <Badge bg={getStatusBadge(invoice.status)} className="status-badge">
                          {invoice.status}
                        </Badge>
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <Button variant="outline-primary" size="sm" onClick={() => handleEdit(invoice)}>
                            Edit
                          </Button>
                          <Button variant="outline-success" size="sm" title="Download">
                            <Download size={14} />
                          </Button>
                          <Button variant="outline-info" size="sm" title="Send">
                            <Send size={14} />
                          </Button>
                          <Button variant="outline-danger" size="sm" onClick={() => handleDelete(invoice.id)}>
                            Delete
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
              <FileText size={48} className="text-muted mb-3" />
              <h5 className="text-muted">No invoices found</h5>
              <p className="text-muted">Create your first invoice to get started</p>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Invoice Modal */}
      <Modal show={showModal} onHide={resetForm} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingInvoice ? 'Edit Invoice' : 'New Invoice'}</Modal.Title>
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
                  <Form.Label>Project</Form.Label>
                  <Form.Select
                    value={formData.projectId}
                    onChange={(e) => setFormData({...formData, projectId: e.target.value})}
                  >
                    <option value="">Select a project (optional)</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>{project.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Invoice Number</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.invoiceNumber}
                    onChange={(e) => setFormData({...formData, invoiceNumber: e.target.value})}
                    placeholder="Auto-generated if empty"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Amount *</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Invoice description or services provided"
              />
            </Form.Group>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Issue Date *</Form.Label>
                  <Form.Control
                    type="date"
                    required
                    value={formData.issueDate}
                    onChange={(e) => setFormData({...formData, issueDate: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Due Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="Draft">Draft</option>
                    <option value="Sent">Sent</option>
                    <option value="Paid">Paid</option>
                    <option value="Overdue">Overdue</option>
                    <option value="Cancelled">Cancelled</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Additional notes or terms"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={resetForm}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingInvoice ? 'Update Invoice' : 'Create Invoice'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  )
}