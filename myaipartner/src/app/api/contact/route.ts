import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, company, email, phone, notes, service, services } = body as {
      name: string;
      company?: string;
      email: string;
      phone?: string;
      notes?: string;
      service?: string;
      services?: string[];
    };
    const mergedServices = Array.from(
      new Set(
        [
          ...(Array.isArray(services) ? services : []),
          ...(service ? [service] : [])
        ].filter(Boolean)
      )
    );

    if (!name || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;
    if (supabaseUrl && supabaseServiceKey) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      const firstName = String((body as Record<string, unknown>).first_name || '').trim();
      const lastName = String((body as Record<string, unknown>).last_name || '').trim();
      const getText = (key: string) => {
        const value = (body as Record<string, unknown>)[key];
        return typeof value === 'string' ? value.trim() : '';
      };
      const getTextArray = (key: string) => {
        const value = (body as Record<string, unknown>)[key];
        return Array.isArray(value) ? value.map((v) => String(v || '').trim()).filter(Boolean) : [];
      };

      await supabase.from('interest_submissions').insert({
        first_name: firstName || String(name || '').split(' ').slice(0, 1).join(''),
        last_name: lastName || String(name || '').split(' ').slice(1).join(' '),
        email,
        phone: phone || '',
        company: company || '',
        industry: getText('industry') || 'Unknown',
        service_required: service || mergedServices[0] || 'Other / Not Sure Yet',
        description: getText('description') || notes || '',
        outcome: getText('outcome'),
        ai_maturity: getText('ai_maturity'),
        challenge: getText('challenge'),
        consulting_priority: getText('consulting_priority'),
        decision_stakeholders: getText('decision_stakeholders'),
        tech_stack: getText('tech_stack'),
        current_process: getText('current_process'),
        tools_involved: getText('tools_involved'),
        process_frequency: getText('process_frequency'),
        automation_volume: getText('automation_volume'),
        automation_urgency: getText('automation_urgency'),
        app_type: getTextArray('app_type'),
        app_users: getText('app_users'),
        expected_users: getText('expected_users'),
        deployment_preference: getText('deployment_preference'),
        compliance_needs: getText('compliance_needs'),
        features: getTextArray('features'),
        website_type: getText('website_type'),
        website_status: getText('website_status'),
        website_objective: getText('website_objective'),
        website_ai_features: getText('website_ai_features'),
        website_requirements: getText('website_requirements'),
        training_size: getText('training_size'),
        technical_level: getText('technical_level'),
        training_format: getText('training_format'),
        training_objective: getText('training_objective'),
        training_topics: getText('training_topics'),
        speaking_audience: getText('speaking_audience'),
        speaking_topic: getText('speaking_topic'),
        speaking_format: getText('speaking_format'),
        speaking_size: getText('speaking_size'),
        speaking_date: getText('speaking_date'),
        speaking_outcome: getText('speaking_outcome'),
        ediscovery_matter: getText('ediscovery_matter'),
        ediscovery_sources: getText('ediscovery_sources'),
        ediscovery_volume: getText('ediscovery_volume'),
        ediscovery_urgency: getText('ediscovery_urgency'),
        ediscovery_output: getText('ediscovery_output'),
        ediscovery_stakeholders: getText('ediscovery_stakeholders'),
        ediscovery_questions: getText('ediscovery_questions'),
        market_focus: getText('market_focus'),
        market_competitor_count: getText('market_competitor_count'),
        market_reporting_cadence: getText('market_reporting_cadence'),
        market_report_format: getText('market_report_format'),
        market_signals: getText('market_signals'),
        other_details: getText('other_details'),
        start_date: getText('start_date'),
        budget_range: getText('budget_range'),
        ideal_completion_date: getText('ideal_completion_date'),
        intended_users: getText('intended_users'),
        additional: getText('additional'),
        source_page: '/interest',
        referrer: request.headers.get('referer') || null,
        user_agent: request.headers.get('user-agent') || null,
        raw_payload: body
      });
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
    const text = `A new interest form submission was received.\n\nName: ${name}\nCompany: ${company || ''}\nEmail: ${email}\nPhone: ${phone || ''}\n\nServices:\n${mergedServices.map(s => '- ' + s).join('\n')}\n\nNotes:\n${notes || ''}`;

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


