import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t border-white/10">
      <div className="container-max py-10 text-sm text-gray-300">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-semibold text-white">
              <span className="inline-block h-6 w-6 rounded-sm bg-brand-600"></span>
              <span>myaipartner.co.za</span>
            </div>
            <p className="text-gray-400">Your partner in AI transformation.</p>
          </div>
          <div>
            <div className="font-semibold mb-3 text-white">Company</div>
            <ul className="space-y-2">
              <li><Link href="#about" className="hover:text-white">About</Link></li>
              <li><Link href="#services" className="hover:text-white">Services</Link></li>
              <li><Link href="#industries" className="hover:text-white">Industries</Link></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-3 text-white">Legal</div>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-white">Terms</Link></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-3 text-white">Get in touch</div>
            <ul className="space-y-2">
              <li>Email: <a className="hover:text-white" href="mailto:info@myaipartner.co.za">info@myaipartner.co.za</a></li>
              <li>Phone: <a className="hover:text-white" href="tel:+27XXXXXXXXX">+27 X XX XX XXXX</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 flex items-center justify-between text-gray-500">
          <p>© {year} My AI Partner. All rights reserved.</p>
          <Link href="/interest" className="hover:text-white">Work with us →</Link>
        </div>
      </div>
    </footer>
  );
}


