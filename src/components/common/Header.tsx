import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useContent } from '../../context/ContentContext';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, ArrowUpRight, Shield } from 'lucide-react';

export const Header: React.FC = () => {
  const { content } = useContent();
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const settings = content?.settings;
  const studioName = settings?.studioName || 'STROKE & SOUL';
  const logoText = settings?.logoText || studioName;
  const logoImageUrl = settings?.logoImageUrl;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Parse custom nav items or use defaults
  let navItems = [
    { label: 'Home', href: '/' },
    { label: 'Gallery', href: '/#gallery' },
    { label: 'About', href: '/#about' },
    { label: 'Services', href: '/#services' },
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'Reviews', href: '/#reviews' },
    { label: 'Pricing Guide', href: '/#pricing' },
    { label: 'FAQ', href: '/#faq' },
    { label: 'Contact', href: '/#contact' },
  ];

  if (settings?.navItems) {
    try {
      const parsed = JSON.parse(settings.navItems);
      if (Array.isArray(parsed) && parsed.length > 0) {
        navItems = parsed;
      }
    } catch {
      // fallback to default
    }
  }

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    if (href.startsWith('/#') && location.pathname === '/') {
      const el = document.getElementById(href.replace('/#', ''));
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-studio-ivory/90 backdrop-blur-md shadow-soft border-b border-studio-border/70 py-3.5'
          : 'bg-studio-ivory/95 border-b border-studio-border/40 py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo / Brand Name */}
          <Link
            to="/"
            className="group flex items-center gap-3 transition-opacity duration-200 hover:opacity-90"
          >
            {logoImageUrl ? (
              <img src={logoImageUrl} alt={studioName} className="h-10 w-auto object-contain" />
            ) : (
              <div className="flex flex-col">
                <span className="font-serif text-2xl sm:text-3xl tracking-tight text-studio-charcoal font-bold">
                  {logoText}
                </span>
                <span className="text-[10px] tracking-[0.28em] text-studio-taupe uppercase -mt-1 font-medium">
                  Fine Art &amp; Portraiture
                </span>
              </div>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-7">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => {
                  if (item.href.startsWith('/#') && location.pathname === '/') {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }
                }}
                className="text-xs uppercase tracking-widest font-medium text-studio-taupe hover:text-studio-charcoal transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-studio-gold hover:after:w-full after:transition-all after:duration-200"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right Action / CTA */}
          <div className="hidden sm:flex items-center gap-3">
            {isAuthenticated && (
              <Link
                to="/admin/dashboard"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium text-studio-charcoal bg-studio-beige/80 hover:bg-studio-beige border border-studio-border transition-colors"
                title="Go to Admin CMS"
              >
                <Shield className="w-3.5 h-3.5 text-studio-gold" />
                <span>Admin CMS</span>
              </Link>
            )}

            <Link
              to="/order"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-studio-charcoal text-studio-ivory text-xs uppercase tracking-widest font-medium hover:bg-studio-gold transition-colors duration-200 shadow-sm group"
            >
              <span>Order Your Sketch</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-studio-gold group-hover:text-white transition-colors" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 sm:hidden">
            <Link
              to="/order"
              className="px-3.5 py-1.5 bg-studio-charcoal text-white text-[11px] uppercase tracking-wider font-medium rounded-sm"
            >
              Order
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-studio-charcoal hover:text-studio-gold transition-colors focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-studio-border bg-studio-ivory px-6 py-6 mt-3 space-y-4 shadow-elevated transition-all animate-fadeIn">
          <div className="flex flex-col space-y-3.5">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => {
                  if (item.href.startsWith('/#') && location.pathname === '/') {
                    e.preventDefault();
                    handleNavClick(item.href);
                  } else {
                    setMobileMenuOpen(false);
                  }
                }}
                className="text-sm uppercase tracking-wider font-medium text-studio-charcoal hover:text-studio-gold py-1 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="pt-4 border-t border-studio-border/60 flex flex-col gap-3">
            <Link
              to="/order"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-3 bg-studio-charcoal text-studio-ivory text-xs uppercase tracking-widest font-medium rounded-sm hover:bg-studio-gold transition-colors"
            >
              Order Your Custom Sketch
            </Link>

            {isAuthenticated ? (
              <Link
                to="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 bg-studio-beige text-studio-charcoal text-xs uppercase tracking-wider font-medium rounded-sm border border-studio-border"
              >
                Go to Admin Portal
              </Link>
            ) : (
              <Link
                to="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center text-xs text-studio-taupe hover:text-studio-charcoal py-1"
              >
                Studio Admin Portal
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
