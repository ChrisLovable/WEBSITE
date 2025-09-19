import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200/60 bg-white/90 backdrop-blur">
      <div className="container-max flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="inline-block h-8 w-8 rounded bg-brand-600"></span>
          <span>My AI Partner</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="#services" className="hover:text-brand-600">Services</Link>
          <Link href="#industries" className="hover:text-brand-600">Industries</Link>
          <Link href="#about" className="hover:text-brand-600">About</Link>
          <Link href="#contact" className="hover:text-brand-600">Contact</Link>
          <Link href="/interest" className="btn-primary">Get Started</Link>
        </nav>
      </div>
    </header>
  );
}


