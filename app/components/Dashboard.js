'use client'
import { Container, Row, Col, Card, Badge, ProgressBar } from 'react-bootstrap'
import {
  Users, MessageSquare, FolderOpen, DollarSign,
  TrendingUp, TrendingDown, ArrowRight,
  AlertCircle, Clock, Activity, Zap
} from 'lucide-react'
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { useSupabase } from '../hooks/useSupabase'

function KpiCard({ icon: Icon, label, value, sub, iconBg, trend, trendLabel }) {
  return (
    <Card className="kpi-card shadow-sm card-hover h-100">
      <Card.Body className="p-4">
        <div className="d-flex align-items-start justify-content-between mb-3">
          <div className={`kpi-icon ${iconBg}`}>
            <Icon size={22} color="#fff" />
          </div>
          {trend !== undefined && (
            <span className={trend > 0 ? 'trend-up' : trend < 0 ? 'trend-down' : 'trend-neutral'}>
              {trend > 0 ? <TrendingUp size={14} className="me-1" /> : trend < 0 ? <TrendingDown size={14} className="me-1" /> : null}
              {trendLabel}
            </span>
          )}
        </div>
        <div className="h3 fw-700 mb-1" style={{ color: '#1e293b' }}>{value}</div>
        <div className="text-sm fw-600" style={{ color: '#475569' }}>{label}</div>
        {sub && <div className="text-xs mt-1" style={{ color: '#94a3b8' }}>{sub}</div>}
      </Card.Body>
    </Card>
  )
}

function MiniProgress({ label, value, max, variant = 'primary', suffix = '' }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div className="mb-3">
      <div className="d-flex justify-content-between mb-1">
        <span className="text-sm" style={{ color: '#475569' }}>{label}</span>
        <span className="text-sm fw-600" style={{ color: '#1e293b' }}>{value}{suffix} <span style={{ color: '#94a3b8' }}>/ {max}{suffix}</span></span>
      </div>
      <ProgressBar now={pct} variant={variant} style={{ height: 6 }} />
    </div>
  )
}

const commTypeColor = { Email: 'bg-gradient-primary', Phone: 'bg-gradient-success', Meeting: 'bg-gradient-warning', SMS: 'bg-gradient-info' }
const commTypeIcon = { Email: '✉', Phone: '📞', Meeting: '🤝', SMS: '💬' }

export default function Dashboard({ setActiveTab }) {
  const [clients] = useSupabase('clients', [])
  const [communications] = useSupabase('communications', [])
  const [projects] = useSupabase('projects', [])
  const [invoices] = useSupabase('invoices', [])

  const activeClients = clients.filter(c => c.status === 'Active').length
  const pendingClients = clients.filter(c => c.status === 'Pending').length

  const totalRevenue = invoices.reduce((s, i) => s + parseFloat(i.amount || 0), 0)
  const paidRevenue = invoices.filter(i => i.status === 'Paid').reduce((s, i) => s + parseFloat(i.amount || 0), 0)
  const overdueInvoices = invoices.filter(i => i.status === 'Overdue').length
  const collectionRate = totalRevenue > 0 ? Math.round((paidRevenue / totalRevenue) * 100) : 0

  const completedProjects = projects.filter(p => p.status === 'Completed').length
  const inProgressProjects = projects.filter(p => p.status === 'In Progress').length
  const avgProgress = projects.length > 0
    ? Math.round(projects.reduce((s, p) => s + (parseInt(p.progress) || 0), 0) / projects.length)
    : 0

  const recentComms = [...communications].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6)

  // Revenue by month (last 6 months)
  const revenueByMonth = (() => {
    const months = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date()
      d.setMonth(d.getMonth() - i)
      const key = d.toLocaleString('default', { month: 'short' })
      const year = d.getFullYear()
      const month = d.getMonth()
      const total = invoices
        .filter(inv => { const id = new Date(inv.issueDate); return id.getMonth() === month && id.getFullYear() === year })
        .reduce((s, inv) => s + parseFloat(inv.amount || 0), 0)
      const paid = invoices
        .filter(inv => { const id = new Date(inv.issueDate); return inv.status === 'Paid' && id.getMonth() === month && id.getFullYear() === year })
        .reduce((s, inv) => s + parseFloat(inv.amount || 0), 0)
      months.push({ month: key, Total: total, Paid: paid })
    }
    return months
  })()

  // Invoice status pie data
  const invoiceStatusData = [
    { name: 'Paid',    value: invoices.filter(i => i.status === 'Paid').length,      color: '#10b981' },
    { name: 'Sent',    value: invoices.filter(i => i.status === 'Sent').length,      color: '#4f46e5' },
    { name: 'Draft',   value: invoices.filter(i => i.status === 'Draft').length,     color: '#94a3b8' },
    { name: 'Overdue', value: invoices.filter(i => i.status === 'Overdue').length,   color: '#ef4444' },
  ].filter(d => d.value > 0)

  // Top clients by invoice amount
  const clientRevenue = clients.map(c => ({
    ...c,
    revenue: invoices.filter(i => i.clientId == c.id || i.clientName === c.name)
                     .reduce((s, i) => s + parseFloat(i.amount || 0), 0)
  })).sort((a, b) => b.revenue - a.revenue).slice(0, 5)

  const kpis = [
    {
      icon: Users, label: 'Total Clients', value: clients.length,
      sub: `${activeClients} active · ${pendingClients} pending`,
      iconBg: 'bg-gradient-primary', trend: 1, trendLabel: `${activeClients} active`
    },
    {
      icon: FolderOpen, label: 'Projects', value: projects.length,
      sub: `${inProgressProjects} in progress · ${completedProjects} done`,
      iconBg: 'bg-gradient-warning', trend: inProgressProjects > 0 ? 1 : 0, trendLabel: `${inProgressProjects} active`
    },
    {
      icon: DollarSign, label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`,
      sub: `$${paidRevenue.toLocaleString()} collected`,
      iconBg: 'bg-gradient-success', trend: collectionRate >= 70 ? 1 : -1, trendLabel: `${collectionRate}% collected`
    },
    {
      icon: AlertCircle, label: 'Overdue Invoices', value: overdueInvoices,
      sub: overdueInvoices === 0 ? 'All invoices on track' : 'Needs attention',
      iconBg: overdueInvoices > 0 ? 'bg-gradient-danger' : 'bg-gradient-success',
      trend: overdueInvoices > 0 ? -1 : 1, trendLabel: overdueInvoices > 0 ? 'Action needed' : 'All clear'
    },
    {
      icon: MessageSquare, label: 'Communications', value: communications.length,
      sub: `${recentComms.length} recent interactions`,
      iconBg: 'bg-gradient-info', trend: 0, trendLabel: 'logged'
    },
    {
      icon: Activity, label: 'Avg Project Progress', value: `${avgProgress}%`,
      sub: `${completedProjects} of ${projects.length} completed`,
      iconBg: 'bg-gradient-primary', trend: avgProgress >= 50 ? 1 : -1, trendLabel: `${avgProgress}% avg`
    }
  ]

  return (
    <Container fluid className="p-4" style={{ background: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <div className="page-header d-flex align-items-center justify-content-between">
        <div>
          <h2 className="fw-700 mb-1" style={{ color: '#1e293b' }}>Dashboard</h2>
          <p className="text-sm mb-0" style={{ color: '#64748b' }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-sm btn-primary px-3" onClick={() => setActiveTab('clients')}>
            <Zap size={14} className="me-1" /> Quick Add
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <Row className="mb-4 g-3">
        {kpis.map((kpi, i) => (
          <Col xs={12} sm={6} xl={4} key={i}>
            <KpiCard {...kpi} />
          </Col>
        ))}
      </Row>

      <Row className="g-3 mb-4">
        {/* Revenue & Project Health */}
        <Col lg={5}>
          <Card className="shadow-sm border-0 rounded-xl h-100">
            <Card.Header className="bg-white border-0 pt-4 pb-2 px-4">
              <h6 className="fw-700 mb-0" style={{ color: '#1e293b' }}>
                <TrendingUp size={16} className="me-2 text-primary" />
                Business Health
              </h6>
            </Card.Header>
            <Card.Body className="px-4 pb-4">
              <MiniProgress label="Revenue Collected" value={paidRevenue} max={totalRevenue || 1} variant="success" />
              <MiniProgress label="Active Clients" value={activeClients} max={clients.length || 1} variant="primary" />
              <MiniProgress label="Projects Completed" value={completedProjects} max={projects.length || 1} variant="warning" />
              <MiniProgress label="Avg Project Progress" value={avgProgress} max={100} variant="info" suffix="%" />

              <div className="mt-3 pt-3 border-top d-flex gap-3">
                <div className="text-center flex-fill">
                  <div className="h5 fw-700 mb-0" style={{ color: '#10b981' }}>{collectionRate}%</div>
                  <div className="text-xs" style={{ color: '#94a3b8' }}>Collection Rate</div>
                </div>
                <div className="text-center flex-fill">
                  <div className="h5 fw-700 mb-0" style={{ color: '#4f46e5' }}>{projects.length > 0 ? Math.round((completedProjects / projects.length) * 100) : 0}%</div>
                  <div className="text-xs" style={{ color: '#94a3b8' }}>Completion Rate</div>
                </div>
                <div className="text-center flex-fill">
                  <div className="h5 fw-700 mb-0" style={{ color: overdueInvoices > 0 ? '#ef4444' : '#10b981' }}>{overdueInvoices}</div>
                  <div className="text-xs" style={{ color: '#94a3b8' }}>Overdue</div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Top Clients */}
        <Col lg={7}>
          <Card className="shadow-sm border-0 rounded-xl h-100">
            <Card.Header className="bg-white border-0 pt-4 pb-2 px-4 d-flex justify-content-between align-items-center">
              <h6 className="fw-700 mb-0" style={{ color: '#1e293b' }}>
                <Users size={16} className="me-2 text-primary" />
                Top Clients by Revenue
              </h6>
              <button className="btn btn-link btn-sm p-0 text-decoration-none" onClick={() => setActiveTab('clients')}>
                View all <ArrowRight size={14} />
              </button>
            </Card.Header>
            <Card.Body className="px-4 pb-4">
              {clientRevenue.length > 0 ? (
                clientRevenue.map((client, i) => (
                  <div key={client.id} className="d-flex align-items-center mb-3">
                    <div className="me-3 fw-700 text-sm" style={{ color: '#94a3b8', width: 20 }}>#{i + 1}</div>
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center me-3 fw-700 text-white text-sm flex-shrink-0"
                      style={{ width: 36, height: 36, background: ['#4f46e5','#7c3aed','#0284c7','#059669','#d97706'][i % 5] }}
                    >
                      {client.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-grow-1">
                      <div className="text-sm fw-600" style={{ color: '#1e293b' }}>{client.name}</div>
                      <div className="text-xs" style={{ color: '#94a3b8' }}>{client.company || 'No company'}</div>
                    </div>
                    <div className="text-end">
                      <div className="text-sm fw-700" style={{ color: '#1e293b' }}>${client.revenue.toLocaleString()}</div>
                      <Badge bg={client.status === 'Active' ? 'success' : client.status === 'Inactive' ? 'danger' : 'warning'} className="status-badge">
                        {client.status}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <Users size={36} className="text-muted mb-2" />
                  <p className="text-muted text-sm mb-0">No clients yet. Add your first client!</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts Row */}
      <Row className="g-3 mb-4">
        <Col lg={8}>
          <Card className="shadow-sm border-0 rounded-xl">
            <Card.Header className="bg-white border-0 pt-4 pb-2 px-4">
              <h6 className="fw-700 mb-0" style={{ color: '#1e293b' }}>
                <TrendingUp size={16} className="me-2 text-primary" />
                Revenue — Last 6 Months
              </h6>
            </Card.Header>
            <Card.Body className="px-2 pb-3">
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={revenueByMonth} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradPaid" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v >= 1000 ? (v/1000).toFixed(0)+'k' : v}`} />
                  <Tooltip formatter={(v) => [`$${v.toLocaleString()}`, undefined]} contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', fontSize: 13 }} />
                  <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                  <Area type="monotone" dataKey="Total" stroke="#4f46e5" strokeWidth={2} fill="url(#gradTotal)" dot={false} />
                  <Area type="monotone" dataKey="Paid"  stroke="#10b981" strokeWidth={2} fill="url(#gradPaid)"  dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="shadow-sm border-0 rounded-xl h-100">
            <Card.Header className="bg-white border-0 pt-4 pb-2 px-4">
              <h6 className="fw-700 mb-0" style={{ color: '#1e293b' }}>
                <DollarSign size={16} className="me-2 text-primary" />
                Invoice Status
              </h6>
            </Card.Header>
            <Card.Body className="d-flex flex-column align-items-center justify-content-center pb-3">
              {invoiceStatusData.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie data={invoiceStatusData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                        {invoiceStatusData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                      <Tooltip formatter={(v, n) => [v, n]} contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', fontSize: 13 }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="d-flex flex-wrap justify-content-center gap-2 mt-1">
                    {invoiceStatusData.map(d => (
                      <div key={d.name} className="d-flex align-items-center gap-1">
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: d.color }} />
                        <span className="text-xs" style={{ color: '#64748b' }}>{d.name} ({d.value})</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <DollarSign size={36} className="text-muted mb-2" />
                  <p className="text-muted text-sm mb-0">No invoices yet</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-3">
        {/* Activity Timeline */}
        <Col lg={8}>
          <Card className="shadow-sm border-0 rounded-xl">
            <Card.Header className="bg-white border-0 pt-4 pb-2 px-4 d-flex justify-content-between align-items-center">
              <h6 className="fw-700 mb-0" style={{ color: '#1e293b' }}>
                <Clock size={16} className="me-2 text-primary" />
                Recent Activity
              </h6>
              <button className="btn btn-link btn-sm p-0 text-decoration-none" onClick={() => setActiveTab('communications')}>
                View all <ArrowRight size={14} />
              </button>
            </Card.Header>
            <Card.Body className="px-4 pb-4">
              {recentComms.length > 0 ? (
                recentComms.map((comm, i) => (
                  <div key={i} className="activity-item mb-3">
                    <div className={`activity-dot ${commTypeColor[comm.type] || 'bg-gradient-primary'}`} style={{ fontSize: 10 }}>
                      <span>{commTypeIcon[comm.type] || '📌'}</span>
                    </div>
                    <div className="d-flex align-items-start justify-content-between">
                      <div>
                        <div className="text-sm fw-600" style={{ color: '#1e293b' }}>
                          {comm.type} with {comm.clientName}
                        </div>
                        <div className="text-xs" style={{ color: '#64748b' }}>{comm.subject}</div>
                      </div>
                      <div className="text-xs flex-shrink-0 ms-3" style={{ color: '#94a3b8' }}>
                        {new Date(comm.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <MessageSquare size={36} className="text-muted mb-2" />
                  <p className="text-muted text-sm mb-0">No communications yet. Log your first interaction!</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Quick Actions */}
        <Col lg={4}>
          <Card className="shadow-sm border-0 rounded-xl h-100">
            <Card.Header className="bg-white border-0 pt-4 pb-2 px-4">
              <h6 className="fw-700 mb-0" style={{ color: '#1e293b' }}>
                <Zap size={16} className="me-2 text-warning" />
                Quick Actions
              </h6>
            </Card.Header>
            <Card.Body className="px-4 pb-4 d-flex flex-column gap-2">
              {[
                { label: 'Add New Client', tab: 'clients', icon: Users, color: '#4f46e5' },
                { label: 'Log Communication', tab: 'communications', icon: MessageSquare, color: '#0284c7' },
                { label: 'Create Project', tab: 'projects', icon: FolderOpen, color: '#d97706' },
                { label: 'Generate Invoice', tab: 'invoices', icon: DollarSign, color: '#059669' },
              ].map(({ label, tab, icon: Icon, color }) => (
                <button
                  key={tab}
                  className="btn btn-light text-start d-flex align-items-center gap-3 px-3 py-2 rounded-xl"
                  style={{ border: '1px solid #e2e8f0', transition: 'all 0.2s' }}
                  onClick={() => setActiveTab(tab)}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.background = `${color}10` }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '' }}
                >
                  <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: 32, height: 32, background: `${color}20` }}>
                    <Icon size={15} style={{ color }} />
                  </div>
                  <span className="text-sm fw-600" style={{ color: '#1e293b' }}>{label}</span>
                  <ArrowRight size={14} className="ms-auto" style={{ color: '#94a3b8' }} />
                </button>
              ))}

              {/* Invoice status summary */}
              <div className="mt-2 p-3 rounded-xl" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <div className="text-xs fw-600 mb-2" style={{ color: '#64748b' }}>INVOICE SUMMARY</div>
                {[
                  { label: 'Draft', count: invoices.filter(i => i.status === 'Draft').length, color: '#94a3b8' },
                  { label: 'Sent', count: invoices.filter(i => i.status === 'Sent').length, color: '#4f46e5' },
                  { label: 'Paid', count: invoices.filter(i => i.status === 'Paid').length, color: '#10b981' },
                  { label: 'Overdue', count: invoices.filter(i => i.status === 'Overdue').length, color: '#ef4444' },
                ].map(({ label, count, color }) => (
                  <div key={label} className="d-flex justify-content-between align-items-center mb-1">
                    <span className="text-xs" style={{ color: '#64748b' }}>{label}</span>
                    <span className="text-xs fw-700" style={{ color }}>{count}</span>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}
