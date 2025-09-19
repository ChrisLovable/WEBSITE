import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-neutral-950/80 backdrop-blur">
      <div className="container-max flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-3 font-semibold text-white">
          <span className="inline-block h-6 w-6 rounded-sm bg-brand-600"></span>
          <span className="tracking-tight">myaipartner.co.za</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="#services" className="text-gray-300 hover:text-white">Services</Link>
          <Link href="#industries" className="text-gray-300 hover:text-white">Industries</Link>
          <Link href="#about" className="text-gray-300 hover:text-white">About</Link>
          <Link href="#contact" className="text-gray-300 hover:text-white">Contact</Link>
          <Link href="/interest" className="btn-primary">Get Started</Link>
        </nav>
      </div>
    </header>
  );
}


