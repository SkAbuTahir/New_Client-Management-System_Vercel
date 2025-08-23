'use client'
import { useState } from 'react'
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap'
import { User, Lock, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function LoginForm() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    // Simple authentication - in production, this would be handled by a proper backend
    const validCredentials = [
      { username: 'admin', password: 'admin123', name: 'Admin User', role: 'Admin' },
      { username: 'manager', password: 'manager123', name: 'Manager User', role: 'Manager' },
      { username: 'employee', password: 'employee123', name: 'Employee User', role: 'Employee' }
    ]

    const user = validCredentials.find(
      cred => cred.username === formData.username && cred.password === formData.password
    )

    if (user) {
      login({
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