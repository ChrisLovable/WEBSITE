"use client";
import { useState } from 'react';

export default function ContactSection() {
  const [status, setStatus] = useState<'idle'|'sending'|'sent'|'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');
    setError(null);
    const data = new FormData(e.currentTarget);
    const payload = {
      name: String(data.get('name')||''),
      email: String(data.get('email')||''),
      phone: String(data.get('phone')||''),
      notes: String(data.get('message')||'')
    };
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error('Failed to send');
      setStatus('sent');
    } catch (err: any) {
      setStatus('error');
      setError(err?.message || 'Something went wrong');
    }
  };

  return (
    <section id="contact" className="section">
      <div className="container-max grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-semibold">Contact Us</h2>
          <p className="text-gray-600">We’d love to hear about your AI goals.</p>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-center gap-2">Johannesburg, South Africa</li>
            <li className="flex items-center gap-2"><a href="mailto:info@myaipartner.co.za" className="hover:text-brand-700">info@myaipartner.co.za</a></li>
            <li className="flex items-center gap-2"><a href="tel:+27XXXXXXXXX" className="hover:text-brand-700">+27 X XX XX XXXX</a></li>
          </ul>
          <div className="flex items-center gap-4 pt-2 text-sm text-gray-600">
            <a href="#" aria-label="LinkedIn" className="hover:text-brand-700">LinkedIn</a>
            <a href="#" aria-label="Twitter" className="hover:text-brand-700">Twitter</a>
          </div>
        </div>

        <form onSubmit={onSubmit} className="card p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input name="name" required className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"/>
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input type="email" name="email" required className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"/>
          </div>
          <div>
            <label className="block text-sm font-medium">Phone</label>
            <input name="phone" className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"/>
          </div>
          <div>
            <label className="block text-sm font-medium">Message</label>
            <textarea name="message" rows={5} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"/>
          </div>
          <button disabled={status==='sending'} className="btn-primary w-full">{status==='sending' ? 'Sending…' : 'Send message'}</button>
          {status==='sent' && <p className="text-green-700 text-sm">Thanks! We’ll be in touch.</p>}
          {status==='error' && <p className="text-red-600 text-sm">{error}</p>}
        </form>
      </div>
    </section>
  );
}


