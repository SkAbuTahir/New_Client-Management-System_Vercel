import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req) {
  try {
    const { invoice, clientEmail } = await req.json()

    if (!invoice || !clientEmail) {
      return NextResponse.json({ error: 'Invoice and client email are required' }, { status: 400 })
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ error: 'Email service not configured. Add RESEND_API_KEY to .env.local' }, { status: 503 })
    }

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'ClientPro <onboarding@resend.dev>',
      to: clientEmail,
      subject: `Invoice ${invoice.invoiceNumber} from ClientPro`,
      html: `
        <div style="font-family:-apple-system,sans-serif;max-width:600px;margin:0 auto;padding:32px 24px;background:#fff;">
          <div style="background:linear-gradient(90deg,#1e1b4b,#4338ca);padding:24px;border-radius:12px;margin-bottom:32px;">
            <h1 style="color:#fff;margin:0;font-size:24px;font-weight:700;">ClientPro</h1>
            <p style="color:rgba(255,255,255,0.7);margin:4px 0 0;font-size:14px;">Invoice Notification</p>
          </div>

          <p style="color:#475569;font-size:15px;">Hi ${invoice.clientName},</p>
          <p style="color:#475569;font-size:15px;">Please find your invoice details below.</p>

          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:24px;margin:24px 0;">
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="color:#94a3b8;font-size:13px;padding:6px 0;">Invoice Number</td><td style="color:#1e293b;font-weight:600;font-size:13px;text-align:right;">${invoice.invoiceNumber}</td></tr>
              <tr><td style="color:#94a3b8;font-size:13px;padding:6px 0;">Description</td><td style="color:#1e293b;font-size:13px;text-align:right;">${invoice.description || '—'}</td></tr>
              <tr><td style="color:#94a3b8;font-size:13px;padding:6px 0;">Issue Date</td><td style="color:#1e293b;font-size:13px;text-align:right;">${new Date(invoice.issueDate).toLocaleDateString()}</td></tr>
              <tr><td style="color:#94a3b8;font-size:13px;padding:6px 0;">Due Date</td><td style="color:#1e293b;font-size:13px;text-align:right;">${invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : '—'}</td></tr>
              <tr style="border-top:2px solid #e2e8f0;">
                <td style="color:#1e293b;font-weight:700;font-size:16px;padding-top:12px;">Total Amount</td>
                <td style="color:#4f46e5;font-weight:700;font-size:20px;text-align:right;padding-top:12px;">$${parseFloat(invoice.amount).toLocaleString()}</td>
              </tr>
            </table>
          </div>

          ${invoice.notes ? `<p style="color:#64748b;font-size:13px;background:#f8fafc;padding:12px 16px;border-radius:8px;border-left:3px solid #4f46e5;">${invoice.notes}</p>` : ''}

          <p style="color:#94a3b8;font-size:12px;margin-top:32px;padding-top:16px;border-top:1px solid #e2e8f0;">
            This invoice was sent via ClientPro. Please contact us if you have any questions.
          </p>
        </div>
      `
    })

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ message: 'Invoice sent successfully', id: data?.id })
  } catch {
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
