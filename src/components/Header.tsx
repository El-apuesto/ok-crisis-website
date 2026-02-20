import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const navItems = [
  { label: 'All', href: '/' },
  { label: 'World', href: '/?category=World' },
  { label: 'National', href: '/?category=National' },
  { label: 'Entertainment', href: '/?category=Entertainment' },
  { label: 'Sports', href: '/?category=Sports' },
  { label: 'Lifestyle', href: '/?category=Lifestyle' },
  { label: 'Opinion', href: '/opinion' },
];

const secondaryNav = [
  { label: 'Archives', href: '/archives' },
  { label: 'Comics', href: '/comics' },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/' && !location.search;
    }
    if (href.startsWith('/?')) {
      const category = new URLSearchParams(href.split('?')[1]).get('category');
      const currentCategory = new URLSearchParams(location.search).get('category');
      return location.pathname === '/' && currentCategory === category;
    }
    return location.pathname === href;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-background/90 backdrop-blur-md py-3 shadow-lg'
          : 'bg-transparent py-6'
      }`}
    >
      {/* Noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Masthead */}
        <div className={`text-center transition-all duration-500 ${isScrolled ? 'mb-4' : 'mb-8'}`}>
          <Link to="/" className="inline-block">
            <h1
              className={`font-serif font-bold tracking-[0.2em] uppercase transition-all duration-500 ${
                isScrolled ? 'text-2xl md:text-3xl' : 'text-4xl md:text-6xl'
              }`}
            >
              The Breakdown
            </h1>
          </Link>
          {!isScrolled && (
            <>
              <p className="mt-2 text-sm md:text-base text-muted-foreground italic tracking-wide">
                "Panic you can plan. Chaos you can trust."
              </p>
              <p className="mt-1 text-xs text-accent tracking-[0.3em] uppercase">
                OK Crisis
              </p>
            </>
          )}
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center justify-center gap-1 border-t border-border pt-4">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className={`px-4 py-2 text-sm tracking-wide uppercase transition-all duration-200 hover:text-accent relative group ${
                isActive(item.href)
                  ? 'text-accent'
                  : 'text-muted-foreground'
              }`}
            >
              {item.label}
              <span
                className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[1px] bg-accent transition-all duration-200 ${
                  isActive(item.href) ? 'w-full' : 'w-0 group-hover:w-full'
                }`}
              />
            </Link>
          ))}
          <span className="mx-2 text-border">|</span>
          {secondaryNav.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className={`px-4 py-2 text-sm tracking-wide uppercase transition-all duration-200 hover:text-accent relative group ${
                isActive(item.href)
                  ? 'text-accent'
                  : 'text-muted-foreground'
              }`}
            >
              {item.label}
              <span
                className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[1px] bg-accent transition-all duration-200 ${
                  isActive(item.href) ? 'w-full' : 'w-0 group-hover:w-full'
                }`}
              />
            </Link>
          ))}
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden absolute right-4 top-1/2 -translate-y-1/2 p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border">
          <nav className="flex flex-col py-4">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className={`px-6 py-3 text-sm tracking-wide uppercase transition-colors ${
                  isActive(item.href)
                    ? 'text-accent bg-accent/5'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/5'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="my-2 border-t border-border" />
            {secondaryNav.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className={`px-6 py-3 text-sm tracking-wide uppercase transition-colors ${
                  isActive(item.href)
                    ? 'text-accent bg-accent/5'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/5'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
