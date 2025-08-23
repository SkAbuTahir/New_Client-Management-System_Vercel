'use client'
import { Navbar, Nav, Dropdown } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { User, LogOut, Settings } from 'lucide-react'

export default function NavigationBar() {
  const { user, logout } = useAuth()

  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="px-3 shadow-sm">
      <Navbar.Brand href="/" className="fw-bold">
        <span className="text-white">ClientPro</span>
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
