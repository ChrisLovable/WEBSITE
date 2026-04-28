import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const body = await request.json() as Record<string, unknown>;

    const g = (key: string) => String(body[key] || '').trim();
    const arr = (key: string) => Array.isArray(body[key]) ? (body[key] as string[]).filter(Boolean) : [];

    const firstName = g('first_name');
    const lastName  = g('last_name');
    const fullName  = `${firstName} ${lastName}`.trim() || g('name');
    const email     = g('email');
    const phone     = g('phone');
    const company   = g('company');

    if (!email) {
      return NextResponse.json({ error: 'Missing email' }, { status: 400 });
    }

    // ── Supabase insert ──────────────────────────────────────────────────────
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;
    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey, {
        auth: { persistSession: false, autoRefreshToken: false }
      });
      await supabase.from('interest_submissions').insert({
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        company,
        industry: g('industry') || 'Unknown',
        service_required: g('service') || 'Other / Not Sure Yet',
        description: g('description') || g('notes') || '',
        outcome: g('outcome'),
        ai_maturity: g('ai_maturity'),
        challenge: g('challenge'),
        consulting_priority: g('consulting_priority'),
        decision_stakeholders: g('decision_stakeholders'),
        tech_stack: g('tech_stack'),
        current_process: g('current_process'),
        tools_involved: g('tools_involved'),
        process_frequency: g('process_frequency'),
        automation_volume: g('automation_volume'),
        automation_urgency: g('automation_urgency'),
        app_type: arr('app_type'),
        app_users: g('app_users'),
        expected_users: g('expected_users'),
        deployment_preference: g('deployment_preference'),
        compliance_needs: g('compliance_needs'),
        features: arr('features'),
        website_type: g('website_type'),
        website_status: g('website_status'),
        website_objective: g('website_objective'),
        website_ai_features: g('website_ai_features'),
        website_requirements: g('website_requirements'),
        training_size: g('training_size'),
        technical_level: g('technical_level'),
        training_format: g('training_format'),
        training_objective: g('training_objective'),
        training_topics: g('training_topics'),
        speaking_audience: g('speaking_audience'),
        speaking_topic: g('speaking_topic'),
        speaking_format: g('speaking_format'),
        speaking_size: g('speaking_size'),
        speaking_date: g('speaking_date'),
        speaking_outcome: g('speaking_outcome'),
        ediscovery_matter: g('ediscovery_matter'),
        ediscovery_sources: g('ediscovery_sources'),
        ediscovery_volume: g('ediscovery_volume'),
        ediscovery_urgency: g('ediscovery_urgency'),
        ediscovery_output: g('ediscovery_output'),
        ediscovery_stakeholders: g('ediscovery_stakeholders'),
        ediscovery_questions: g('ediscovery_questions'),
        market_focus: g('market_focus'),
        market_competitor_count: g('market_competitor_count'),
        market_reporting_cadence: g('market_reporting_cadence'),
        market_report_format: g('market_report_format'),
        market_signals: g('market_signals'),
        other_details: g('other_details'),
        start_date: g('start_date'),
        budget_range: g('budget_range'),
        ideal_completion_date: g('ideal_completion_date'),
        intended_users: g('intended_users'),
        additional: g('additional'),
        source_page: '/interest',
        referrer: request.headers.get('referer') || null,
        user_agent: request.headers.get('user-agent') || null,
        raw_payload: body,
      });
    }

    // ── Email ─────────────────────────────────────────────────────────────────
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 465);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const to   = process.env.CONTACT_TO || 'info@myaipartner.co.za';

    if (!host || !user || !pass) {
      console.warn('[contact] SMTP not configured — saved to Supabase only');
      return NextResponse.json({ ok: true, warning: 'smtp_not_configured' });
    }

    // Build a comprehensive field table for the email
    const row = (label: string, value: string) =>
      value ? `<tr><td style="padding:6px 10px;color:#666;font-weight:600;white-space:nowrap;vertical-align:top;width:200px">${label}</td><td style="padding:6px 10px;color:#111">${value}</td></tr>` : '';

    const section = (title: string) =>
      `<tr><td colspan="2" style="padding:14px 10px 4px;font-weight:700;font-size:13px;color:#B8860B;border-top:2px solid #eee;text-transform:uppercase;letter-spacing:0.05em">${title}</td></tr>`;

    const service = g('service');
    const appTypes = arr('app_type');
    const features = arr('features');

    const rows = [
      section('Contact Details'),
      row('Name', fullName),
      row('Email', `<a href="mailto:${email}">${email}</a>`),
      row('Phone / WhatsApp', phone),
      row('Company', company),
      row('Industry', g('industry')),

      section('Project Overview'),
      row('Service Required', service),
      row('Project Description', g('description')),
      row('Desired Outcome', g('outcome')),
      row('Budget Range', g('budget_range')),
      row('Start Date', g('start_date')),
      row('Ideal Completion', g('ideal_completion_date')),
      row('Intended Users', g('intended_users')),
      row('Additional Notes', g('additional') || g('notes')),

      // Consulting
      ...(service.includes('Consult') ? [
        section('Consulting Details'),
        row('AI Maturity', g('ai_maturity')),
        row('Primary Challenge', g('challenge')),
        row('Strategic Priority', g('consulting_priority')),
        row('Decision Stakeholders', g('decision_stakeholders')),
        row('Tech Stack', g('tech_stack')),
      ] : []),

      // Automation
      ...(service.includes('Automat') ? [
        section('Automation Details'),
        row('Current Process', g('current_process')),
        row('Tools Involved', g('tools_involved')),
        row('Process Frequency', g('process_frequency')),
        row('Volume', g('automation_volume')),
        row('Urgency', g('automation_urgency')),
      ] : []),

      // App / Software
      ...(service.includes('App') || service.includes('Software') ? [
        section('App / Software Details'),
        row('App Type', appTypes.join(', ')),
        row('Primary Users', g('app_users')),
        row('Expected Users', g('expected_users')),
        row('Deployment', g('deployment_preference')),
        row('Compliance Needs', g('compliance_needs')),
        row('Features', features.join(', ')),
      ] : []),

      // Website
      ...(service.includes('Website') || service.includes('Web') ? [
        section('Website Details'),
        row('Website Type', g('website_type')),
        row('Current Status', g('website_status')),
        row('Primary Objective', g('website_objective')),
        row('AI Features', g('website_ai_features')),
        row('Requirements', g('website_requirements')),
      ] : []),

      // Training
      ...(service.includes('Train') ? [
        section('Training Details'),
        row('Group Size', g('training_size')),
        row('Technical Level', g('technical_level')),
        row('Format', g('training_format')),
        row('Objective', g('training_objective')),
        row('Topics', g('training_topics')),
      ] : []),

      // Speaking
      ...(service.includes('Speak') || service.includes('Keynote') ? [
        section('Speaking Engagement'),
        row('Audience Type', g('speaking_audience')),
        row('Topic', g('speaking_topic')),
        row('Format', g('speaking_format')),
        row('Audience Size', g('speaking_size')),
        row('Target Date', g('speaking_date')),
        row('Desired Outcome', g('speaking_outcome')),
      ] : []),

      // eDiscovery
      ...(service.includes('Discovery') || service.includes('eDiscovery') ? [
        section('eDiscovery Details'),
        row('Matter Type', g('ediscovery_matter')),
        row('Data Sources', g('ediscovery_sources')),
        row('Data Volume', g('ediscovery_volume')),
        row('Urgency', g('ediscovery_urgency')),
        row('Output Required', g('ediscovery_output')),
        row('Stakeholders', g('ediscovery_stakeholders')),
        row('Key Questions', g('ediscovery_questions')),
      ] : []),

      // Market Intelligence
      ...(service.includes('Market') ? [
        section('Market Intelligence'),
        row('Primary Focus', g('market_focus')),
        row('Competitor Count', g('market_competitor_count')),
        row('Reporting Cadence', g('market_reporting_cadence')),
        row('Report Format', g('market_report_format')),
        row('Key Signals', g('market_signals')),
      ] : []),
    ].filter(Boolean).join('');

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:680px;margin:0 auto;border:1px solid #eee;border-radius:8px;overflow:hidden">
        <div style="background:#1A1A2E;padding:20px 24px">
          <h2 style="margin:0;color:#fff;font-size:18px">New Enquiry — myAIpartner.co.za</h2>
          <p style="margin:4px 0 0;color:#B8860B;font-size:13px">${service || 'General Enquiry'} · ${new Date().toLocaleString('en-ZA', { timeZone: 'Africa/Johannesburg' })}</p>
        </div>
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          ${rows}
        </table>
        <div style="background:#f9f9f9;padding:12px 16px;font-size:11px;color:#999;border-top:1px solid #eee">
          Submitted via myaipartner.co.za/interest
        </div>
      </div>
    `;

    const transporter = nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass } });

    await transporter.sendMail({
      from: `myAIpartner <${user}>`,
      to,
      subject: `New Enquiry – ${fullName}${company ? ` (${company})` : ''} – ${service || 'General'}`,
      text: `New enquiry from ${fullName}\nEmail: ${email}\nPhone: ${phone}\nCompany: ${company}\nService: ${service}\n\nDescription:\n${g('description')}\n\nOutcome:\n${g('outcome')}`,
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[contact] Error:', error);
    return NextResponse.json({ error: 'Failed to process submission' }, { status: 500 });
  }
}
