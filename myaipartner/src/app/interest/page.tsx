"use client";
import { useMemo, useState } from 'react';
import Link from 'next/link';
import Shell from '@/components/Shell';
import { services as allServices } from '@/data/services';

export default function InterestPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle'|'sending'|'sent'|'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const toggle = (item: string) => {
    setSelected((prev) => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('sending');
    setError(null);

    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get('name') || ''),
      company: String(form.get('company') || ''),
      email: String(form.get('email') || ''),
      phone: String(form.get('phone') || ''),
      notes: String(form.get('notes') || ''),
      services: selected
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to submit');
      setStatus('sent');
    } catch (e: any) {
      setStatus('error');
      setError(e?.message || 'Something went wrong');
    }
  };

  const categories = useMemo(() => allServices, []);

  return (
    <Shell>
      <div className="container-max py-24">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold">Declare Your Interest</h1>
          <p className="text-gray-600 mt-3">Select the services you’re interested in and tell us a bit about your needs. We’ll get back to you within one business day.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            {categories.map((cat) => (
              <div key={cat.category} className="card p-6">
                <h3 className="font-semibold mb-3">{cat.category}</h3>
                <div className="grid sm:grid-cols-2 gap-2">
                  {cat.items.map((item) => (
                    <label key={item} className={`flex items-center gap-2 rounded border p-3 text-sm ${selected.includes(item) ? 'border-brand-500 bg-brand-50' : 'border-gray-200'}`}>
                      <input type="checkbox" className="h-4 w-4" checked={selected.includes(item)} onChange={() => toggle(item)} />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="card p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input name="name" required className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"/>
              </div>
              <div>
                <label className="block text-sm font-medium">Company</label>
                <input name="company" className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"/>
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
                <label className="block text-sm font-medium">Notes</label>
                <textarea name="notes" rows={5} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"/>
              </div>

              <button disabled={status==='sending'} className="btn-primary w-full">
                {status === 'sending' ? 'Sending…' : 'Submit'}
              </button>
              {status === 'sent' && (
                <p className="text-green-700 text-sm">Thank you! We’ll be in touch shortly.</p>
              )}
              {status === 'error' && (
                <p className="text-red-600 text-sm">{error}</p>
              )}
              <p className="text-xs text-gray-500">By submitting, you agree to our privacy policy.</p>
            </div>
            <Link href="/" className="text-sm text-brand-700">← Back to Home</Link>
          </div>
        </form>
      </div>
    </Shell>
  );
}


