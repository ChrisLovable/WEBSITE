import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t border-gray-200/60">
      <div className="container-max py-10 text-sm">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-semibold">
              <span className="inline-block h-8 w-8 rounded bg-brand-600"></span>
              <span>My AI Partner</span>
            </div>
            <p className="text-gray-600">Your partner in AI transformation.</p>
          </div>
          <div>
            <div className="font-semibold mb-3">Company</div>
            <ul className="space-y-2 text-gray-600">
              <li><Link href="#about" className="hover:text-brand-600">About</Link></li>
              <li><Link href="#services" className="hover:text-brand-600">Services</Link></li>
              <li><Link href="#industries" className="hover:text-brand-600">Industries</Link></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-3">Legal</div>
            <ul className="space-y-2 text-gray-600">
              <li><Link href="#" className="hover:text-brand-600">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-brand-600">Terms</Link></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-3">Get in touch</div>
            <ul className="space-y-2 text-gray-600">
              <li>Email: <a className="hover:text-brand-600" href="mailto:info@myaipartner.co.za">info@myaipartner.co.za</a></li>
              <li>Phone: <a className="hover:text-brand-600" href="tel:+27XXXXXXXXX">+27 X XX XX XXXX</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 flex items-center justify-between text-gray-500">
          <p>© {year} My AI Partner. All rights reserved.</p>
          <Link href="/interest" className="hover:text-brand-600">Work with us →</Link>
        </div>
      </div>
    </footer>
  );
}


