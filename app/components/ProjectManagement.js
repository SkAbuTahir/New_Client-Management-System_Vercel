'use client'
import { useState } from 'react'
import { Container, Row, Col, Card, Button, Form, Table, Modal, Badge, InputGroup, ProgressBar } from 'react-bootstrap'
import { Plus, Search, FolderOpen, Calendar, User } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'

export default function ProjectManagement() {
  const [projects, setProjects] = useLocalStorage('projects', [])
  const [clients] = useLocalStorage('clients', [])
  const [showModal, setShowModal] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  
  const [formData, setFormData] = useState({
    name: '',
    clientId: '',
    description: '',
    status: 'Planning',
    priority: 'Medium',
    startDate: '',
    endDate: '',
    budget: '',
    progress: 0
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const selectedClient = clients.find(c => c.id === parseInt(formData.clientId))
    
    if (editingProject) {
      setProjects(projects.map(project => 
        project.id === editingProject.id 
          ? { ...formData, id: editingProject.id, clientName: selectedClient?.name, updatedAt: new Date().toISOString() }
          : project
      ))
    } else {
      const newProject = {
        ...formData,
        clientName: selectedClient?.name || '',
        id: Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      setProjects([...projects, newProject])
    }
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name: '',
      clientId: '',
      description: '',
      status: 'Planning',
      priority: 'Medium',
      startDate: '',
      endDate: '',
      budget: '',
      progress: 0
    })
    setEditingProject(null)
    setShowModal(false)
  }

  const handleEdit = (project) => {
    setFormData(project)
    setEditingProject(project)
    setShowModal(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      setProjects(projects.filter(project => project.id !== id))
    }
  }

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.clientName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'All' || project.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusBadge = (status) => {
    const variants = {
      'Planning': 'secondary',
      'In Progress': 'primary',
      'On Hold': 'warning',
      'Completed': 'success',
      'Cancelled': 'danger'
    }
    return variants[status] || 'secondary'
  }

  const getPriorityBadge = (priority) => {
    const variants = {
      'Low': 'success',
      'Medium': 'warning',
      'High': 'danger'
    }
    return variants[priority] || 'secondary'
  }

  return (
    <Container fluid className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Project Management</h2>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          <Plus size={18} className="me-2" />
          New Project
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
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={3}>
              <Form.Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="All">All Status</option>
                <option value="Planning">Planning</option>
                <option value="In Progress">In Progress</option>
                <option value="On Hold">On Hold</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </Form.Select>
            </Col>
            <Col md={3}>
              <div className="text-muted small">
                Showing {filteredProjects.length} of {projects.length} projects
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Row>
        {filteredProjects.map((project) => (
          <Col lg={6} xl={4} key={project.id} className="mb-4">
            <Card className="h-100 shadow-sm border-0 card-hover">
              <Card.Header className="bg-white border-bottom">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 className="fw-bold mb-1">{project.name}</h6>
                    <div className="d-flex align-items-center text-muted small">
                      <User size={14} className="me-1" />
                      {project.clientName}
                    </div>
                  </div>
                  <div className="d-flex gap-2">
                    <Button variant="outline-primary" size="sm" onClick={() => handleEdit(project)}>
                      Edit
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(project.id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              </Card.Header>
              <Card.Body>
                <p className="text-muted small mb-3">{project.description}</p>
                
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <small className="text-muted">Progress</small>
                    <small className="text-muted">{project.progress}%</small>
                  </div>
                  <ProgressBar now={project.progress} variant="primary" />
                </div>

                <div className="d-flex flex-wrap gap-2 mb-3">
                  <Badge bg={getStatusBadge(project.status)} className="status-badge">
                    {project.status}
                  </Badge>
                  <Badge bg={getPriorityBadge(project.priority)} className="status-badge">
                    {project.priority} Priority
                  </Badge>
                </div>

                <div className="d-flex justify-content-between text-muted small">
                  <div>
                    <Calendar size={14} className="me-1" />
                    {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'No start date'}
                  </div>
                  <div>
                    Budget: ${project.budget || 'Not set'}
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {filteredProjects.length === 0 && (
        <Card className="shadow-sm border-0">
          <Card.Body className="text-center py-5">
            <FolderOpen size={48} className="text-muted mb-3" />
            <h5 className="text-muted">No projects found</h5>
            <p className="text-muted">Create your first project to get started</p>
          </Card.Body>
        </Card>
      )}

      {/* Project Modal */}
      <Modal show={showModal} onHide={resetForm} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingProject ? 'Edit Project' : 'New Project'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Project Name *</Form.Label>
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
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </Form.Group>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="Planning">Planning</option>
                    <option value="In Progress">In Progress</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Priority</Form.Label>
                  <Form.Select
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Progress (%)</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    max="100"
                    value={formData.progress}
                    onChange={(e) => setFormData({...formData, progress: parseInt(e.target.value) || 0})}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Budget ($)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    value={formData.budget}
                    onChange={(e) => setFormData({...formData, budget: e.target.value})}
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
              {editingProject ? 'Update Project' : 'Create Project'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  )
}
