# ClientPro — Full-Stack CRM System

A production-ready client management system built with Next.js 14, Supabase (PostgreSQL), and NextAuth.js. Manage clients, projects, communications, and invoices — with a real-time KPI dashboard, PDF export, and transactional email.

**[Live Demo](https://your-deployment.vercel.app) · [GitHub](https://github.com/your-username/clientpro)**

---

## Features

- **KPI Dashboard** — Revenue trend charts, invoice status breakdown, business health metrics, top clients by revenue, activity timeline
- **Client Management** — Full CRUD with search, filter, and status tracking
- **Project Management** — Progress tracking, priority levels, budget and timeline per project
- **Communications** — Log emails, calls, meetings, SMS with follow-up dates
- **Invoice Management** — Auto-numbered invoices, PDF export, email delivery via Resend, payment status tracking
- **Authentication** — NextAuth.js with bcrypt-hashed passwords, JWT sessions, role-based access (Admin / Manager / Employee)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Database | Supabase — PostgreSQL with RLS |
| Auth | NextAuth.js — Credentials + JWT |
| UI | React Bootstrap 5 + Tailwind CSS |
| Charts | Recharts |
| PDF Export | jsPDF |
| Email | Resend |
| Deployment | Vercel |

---

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/your-username/clientpro.git
cd clientpro
npm install
```

### 2. Set up environment variables

Create a `.env.local` file:

```env
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000

NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

RESEND_API_KEY=your-resend-api-key
EMAIL_FROM=ClientPro <you@yourdomain.com>
```

### 3. Set up the database

Run `supabase/schema.sql` in your Supabase project:

> Supabase Dashboard → SQL Editor → New Query → paste and run

### 4. Start the dev server

```bash
npm run dev
```

---

## Demo Credentials

| Role | Username | Password |
|---|---|---|
| Admin | `admin` | `admin123` |
| Manager | `manager` | `manager123` |
| Employee | `employee` | `employee123` |

---

## Project Structure

```
app/
├── api/
│   ├── auth/               # NextAuth + register endpoints
│   ├── clients/            # GET, POST, PUT, DELETE
│   ├── projects/           # GET, POST, PUT, DELETE
│   ├── communications/     # GET, POST, DELETE
│   └── invoices/           # GET, POST, PUT, DELETE + send-email
├── components/
│   ├── Dashboard.js        # KPI dashboard with Recharts
│   ├── ClientManagement.js
│   ├── ProjectManagement.js
│   ├── Communications.js
│   ├── InvoiceManagement.js # PDF export + email send
│   ├── LoginForm.js        # Login + Register tabs
│   ├── Sidebar.js          # Collapsible, responsive
│   ├── Navbar.js
│   └── MainApp.js
├── contexts/
│   └── AuthContext.js      # NextAuth session wrapper
├── hooks/
│   └── useSupabase.js      # Data fetching hook (API → localStorage fallback)
└── globals.css             # Design system
lib/
└── supabase/
    ├── client.js           # Browser client (@supabase/ssr)
    ├── server.js           # Server client (@supabase/ssr)
    └── middleware.js       # Session refresh
supabase/
└── schema.sql              # Tables, RLS policies, triggers
```

---

## Deployment

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add all `.env.local` variables in Vercel → Project Settings → Environment Variables
4. Deploy

---

## Browser Support

Chrome · Firefox · Safari · Edge · iOS Safari · Chrome Mobile
