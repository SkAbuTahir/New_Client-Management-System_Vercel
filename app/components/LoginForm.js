'use client'
import { useState } from 'react'
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap'
import { User, Lock, Eye, EyeOff, Mail, UserPlus, BarChart3 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function LoginForm() {
  const [tab, setTab] = useState('login')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  const [loginData, setLoginData] = useState({ username: '', password: '' })
  const [registerData, setRegisterData] = useState({ username: '', name: '', email: '', password: '', role: 'Employee' })

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await login(loginData)
    setLoading(false)
    if (result?.error) setError('Invalid username or password')
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData)
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }
      setSuccess('Account created! You can now sign in.')
      setTab('login')
      setLoginData({ username: registerData.username, password: '' })
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: 'linear-gradient(160deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)' }}>
      <Container>
        <Row className="justify-content-center">
          <Col lg={5} md={7}>
            {/* Brand */}
            <div className="text-center mb-4">
              <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3" style={{ width: 56, height: 56, background: 'rgba(255,255,255,0.15)' }}>
                <BarChart3 size={28} color="#fff" />
              </div>
              <h3 className="fw-700 text-white mb-1">ClientPro</h3>
              <p className="mb-0" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}>Client Management System</p>
            </div>

            <Card className="shadow-lg border-0 rounded-2xl">
              <Card.Body className="p-4 p-md-5">
                {/* Tabs */}
                <div className="d-flex mb-4 rounded-xl overflow-hidden" style={{ background: '#f1f5f9' }}>
                  {['login', 'register'].map(t => (
                    <button
                      key={t}
                      className="flex-fill py-2 border-0 fw-600 text-sm"
                      style={{
                        background: tab === t ? '#fff' : 'transparent',
                        color: tab === t ? '#4f46e5' : '#64748b',
                        boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                        borderRadius: 8,
                        margin: 4,
                        transition: 'all 0.2s',
                        cursor: 'pointer'
                      }}
                      onClick={() => { setTab(t); setError(''); setSuccess('') }}
                    >
                      {t === 'login' ? 'Sign In' : 'Register'}
                    </button>
                  ))}
                </div>

                {error && <Alert variant="danger" className="py-2 text-sm">{error}</Alert>}
                {success && <Alert variant="success" className="py-2 text-sm">{success}</Alert>}

                {tab === 'login' ? (
                  <Form onSubmit={handleLogin}>
                    <Form.Group className="mb-3">
                      <Form.Label className="text-sm fw-600">Username</Form.Label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0"><User size={15} className="text-muted" /></span>
                        <Form.Control
                          type="text" required placeholder="Enter username"
                          className="border-start-0 ps-0"
                          value={loginData.username}
                          onChange={e => setLoginData({ ...loginData, username: e.target.value })}
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label className="text-sm fw-600">Password</Form.Label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0"><Lock size={15} className="text-muted" /></span>
                        <Form.Control
                          type={showPassword ? 'text' : 'password'} required placeholder="Enter password"
                          className="border-start-0 border-end-0 ps-0"
                          value={loginData.password}
                          onChange={e => setLoginData({ ...loginData, password: e.target.value })}
                        />
                        <button type="button" className="input-group-text bg-light border-start-0" onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <EyeOff size={15} className="text-muted" /> : <Eye size={15} className="text-muted" />}
                        </button>
                      </div>
                    </Form.Group>

                    <Button variant="primary" type="submit" className="w-100 fw-600" disabled={loading}
                      style={{ background: 'linear-gradient(90deg,#4f46e5,#7c3aed)', border: 'none', padding: '10px' }}>
                      {loading ? 'Signing in…' : 'Sign In'}
                    </Button>

                    <div className="mt-4 p-3 rounded-xl" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                      <div className="text-xs fw-600 mb-2" style={{ color: '#64748b' }}>DEMO CREDENTIALS</div>
                      {[['Admin', 'admin', 'admin123'], ['Manager', 'manager', 'manager123'], ['Employee', 'employee', 'employee123']].map(([role, u, p]) => (
                        <div key={role} className="d-flex justify-content-between align-items-center mb-1">
                          <span className="text-xs" style={{ color: '#64748b' }}>{role}</span>
                          <button type="button" className="btn btn-link btn-sm p-0 text-xs text-decoration-none" style={{ color: '#4f46e5' }}
                            onClick={() => setLoginData({ username: u, password: p })}>
                            {u} / {p}
                          </button>
                        </div>
                      ))}
                    </div>
                  </Form>
                ) : (
                  <Form onSubmit={handleRegister}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="text-sm fw-600">Full Name</Form.Label>
                          <div className="input-group">
                            <span className="input-group-text bg-light border-end-0"><User size={15} className="text-muted" /></span>
                            <Form.Control type="text" required placeholder="John Doe" className="border-start-0 ps-0"
                              value={registerData.name} onChange={e => setRegisterData({ ...registerData, name: e.target.value })} />
                          </div>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="text-sm fw-600">Username</Form.Label>
                          <div className="input-group">
                            <span className="input-group-text bg-light border-end-0"><UserPlus size={15} className="text-muted" /></span>
                            <Form.Control type="text" required placeholder="johndoe" className="border-start-0 ps-0"
                              value={registerData.username} onChange={e => setRegisterData({ ...registerData, username: e.target.value })} />
                          </div>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-3">
                      <Form.Label className="text-sm fw-600">Email</Form.Label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0"><Mail size={15} className="text-muted" /></span>
                        <Form.Control type="email" required placeholder="john@example.com" className="border-start-0 ps-0"
                          value={registerData.email} onChange={e => setRegisterData({ ...registerData, email: e.target.value })} />
                      </div>
                    </Form.Group>

                    <Row>
                      <Col md={7}>
                        <Form.Group className="mb-3">
                          <Form.Label className="text-sm fw-600">Password</Form.Label>
                          <div className="input-group">
                            <span className="input-group-text bg-light border-end-0"><Lock size={15} className="text-muted" /></span>
                            <Form.Control type={showPassword ? 'text' : 'password'} required placeholder="Min 6 chars" className="border-start-0 border-end-0 ps-0"
                              minLength={6} value={registerData.password} onChange={e => setRegisterData({ ...registerData, password: e.target.value })} />
                            <button type="button" className="input-group-text bg-light border-start-0" onClick={() => setShowPassword(!showPassword)}>
                              {showPassword ? <EyeOff size={15} className="text-muted" /> : <Eye size={15} className="text-muted" />}
                            </button>
                          </div>
                        </Form.Group>
                      </Col>
                      <Col md={5}>
                        <Form.Group className="mb-3">
                          <Form.Label className="text-sm fw-600">Role</Form.Label>
                          <Form.Select value={registerData.role} onChange={e => setRegisterData({ ...registerData, role: e.target.value })}>
                            <option value="Employee">Employee</option>
                            <option value="Manager">Manager</option>
                            <option value="Admin">Admin</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Button variant="primary" type="submit" className="w-100 fw-600" disabled={loading}
                      style={{ background: 'linear-gradient(90deg,#4f46e5,#7c3aed)', border: 'none', padding: '10px' }}>
                      {loading ? 'Creating account…' : 'Create Account'}
                    </Button>
                  </Form>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
