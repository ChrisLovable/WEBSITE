import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, company, email, phone, notes, services } = body as {
      name: string; company?: string; email: string; phone?: string; notes?: string; services?: string[];
    };

    if (!name || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const to = process.env.CONTACT_TO || 'info@myaipartner.co.za';

    let transporter: nodemailer.Transporter;
    if (!host || !user || !pass) {
      // Ethereal fallback for local/dev
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: { user: testAccount.user, pass: testAccount.pass }
      });
    } else {
      transporter = nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass } });
    }

    const subject = `New Interest Submission – ${name}`;
    const text = `A new interest form submission was received.\n\nName: ${name}\nCompany: ${company || ''}\nEmail: ${email}\nPhone: ${phone || ''}\n\nServices:\n${(services || []).map(s => '- ' + s).join('\n')}\n\nNotes:\n${notes || ''}`;

    const info = await transporter.sendMail({
      from: `My AI Partner <${user || 'no-reply@myaipartner.co.za'}>`,
      to,
      subject,
      text
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);
    return NextResponse.json({ ok: true, previewUrl });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 });
  }
}


