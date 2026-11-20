import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../../context/ContentContext';
import { Mail, Phone, MessageSquare, MapPin, Instagram, Facebook, ArrowUpRight, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { content, isSectionVisible } = useContent();
  const [modalType, setModalType] = useState<'privacy' | 'terms' | null>(null);

  if (!isSectionVisible('footer')) return null;

  const settings = content?.settings;
  const studioName = settings?.studioName || 'STROKE & SOUL';
  const artistName = settings?.artistName || 'Alex Morgan';
  const email = settings?.contactEmail || 'hello@strokeandsoul.art';
  const phone = settings?.contactPhone || '+1 (555) 234-5678';
  const whatsapp = settings?.whatsappNumber || '+15552345678';
  const address = settings?.businessAddress || 'Studio 4B, Artisan Quarter, New York, NY';
  const instagram = settings?.instagramUrl || 'https://instagram.com';
  const pinterest = settings?.pinterestUrl || 'https://pinterest.com';
  const facebook = settings?.facebookUrl || 'https://facebook.com';

  return (
    <footer className="bg-studio-charcoal text-studio-ivory pt-16 pb-12 border-t border-studio-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-14 border-b border-white/10">
          {/* Col 1: Studio Profile */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <span className="font-serif text-2xl tracking-tight font-bold text-studio-ivory">
                {studioName}
              </span>
              <span className="block text-[10px] tracking-[0.25em] text-studio-gold uppercase -mt-0.5 font-medium">
                Fine Art &amp; Graphite Studio
              </span>
            </Link>
            <p className="text-xs text-studio-ivory/70 leading-relaxed font-light pr-4">
              Handcrafted pencil portraits preserving your most sacred memories. Created with archival-grade materials, precision, and heartfelt dedication by artist {artistName}.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <a
                href={instagram}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:text-studio-gold hover:border-studio-gold transition-colors"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={pinterest}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:text-studio-gold hover:border-studio-gold transition-colors"
                title="Pinterest"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0a12 12 0 0 0-4.37 23.18c-.06-.94-.1-2.38.02-3.41.13-.93.85-6.07.85-6.07s-.22-.44-.22-1.08c0-1.01.59-1.77 1.32-1.77.62 0 .92.47.92 1.03 0 .63-.4 1.57-.61 2.44-.17.73.37 1.32 1.09 1.32 1.31 0 2.31-1.38 2.31-3.37 0-1.76-1.27-2.99-3.08-2.99-2.25 0-3.57 1.69-3.57 3.43 0 .68.26 1.41.59 1.81.06.08.07.15.05.23-.06.24-.19.77-.21.88-.04.14-.13.17-.29.1-1.09-.51-1.77-2.1-1.77-3.38 0-2.75 2-5.28 5.77-5.28 3.03 0 5.39 2.16 5.39 5.05 0 3.01-1.9 5.43-4.53 5.43-.89 0-1.72-.46-2-.99l-.55 2.08c-.2 1.03-.73 2.32-1.09 3.07A12 12 0 1 0 12 0z"/>
                </svg>
              </a>
              <a
                href={facebook}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:text-studio-gold hover:border-studio-gold transition-colors"
                title="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Studio Navigation */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-studio-gold font-semibold mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs text-studio-ivory/80">
              <li>
                <a href="/#gallery" className="hover:text-studio-gold transition-colors flex items-center gap-1.5">
                  <span>Artwork Gallery</span>
                </a>
              </li>
              <li>
                <a href="/#about" className="hover:text-studio-gold transition-colors">
                  About the Artist
                </a>
              </li>
              <li>
                <a href="/#services" className="hover:text-studio-gold transition-colors">
                  Commission Services
                </a>
              </li>
              <li>
                <a href="/#how-it-works" className="hover:text-studio-gold transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="/#pricing" className="hover:text-studio-gold transition-colors">
                  Pricing &amp; Size Guide
                </a>
              </li>
              <li>
                <a href="/#faq" className="hover:text-studio-gold transition-colors">
                  Commission FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Services Quick Links */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-studio-gold font-semibold mb-4">
              Portraits
            </h4>
            <ul className="space-y-2.5 text-xs text-studio-ivory/80">
              <li>
                <Link to="/order?service=single-portrait" className="hover:text-studio-gold transition-colors">
                  Single Portrait Sketch
                </Link>
              </li>
              <li>
                <Link to="/order?service=couple-portrait" className="hover:text-studio-gold transition-colors">
                  Couple &amp; Anniversary Art
                </Link>
              </li>
              <li>
                <Link to="/order?service=family-portrait" className="hover:text-studio-gold transition-colors">
                  Family Legacy Portraits
                </Link>
              </li>
              <li>
                <Link to="/order?service=pet-portrait" className="hover:text-studio-gold transition-colors">
                  Hand-Drawn Pet Portraits
                </Link>
              </li>
              <li>
                <Link to="/order?service=custom-artwork" className="hover:text-studio-gold transition-colors">
                  Custom &amp; Architectural Fine Art
                </Link>
              </li>
              <li>
                <Link to="/order?service=gift-portrait" className="hover:text-studio-gold transition-colors">
                  Gift Sketches &amp; Packaging
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Studio Contact & WhatsApp */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-studio-gold font-semibold mb-4">
              Get in Touch
            </h4>
            <div className="space-y-3 text-xs text-studio-ivory/80">
              <a href={`mailto:${email}`} className="flex items-start gap-2.5 hover:text-studio-gold transition-colors">
                <Mail className="w-4 h-4 text-studio-gold shrink-0 mt-0.5" />
                <span>{email}</span>
              </a>
              <a href={`tel:${phone}`} className="flex items-start gap-2.5 hover:text-studio-gold transition-colors">
                <Phone className="w-4 h-4 text-studio-gold shrink-0 mt-0.5" />
                <span>{phone}</span>
              </a>
              <a
                href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-sm bg-emerald-800/40 text-emerald-300 hover:bg-emerald-800/60 border border-emerald-600/30 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat via WhatsApp</span>
                <ArrowUpRight className="w-3 h-3 opacity-70" />
              </a>
              <div className="flex items-start gap-2.5 text-studio-ivory/60 pt-1">
                <MapPin className="w-4 h-4 text-studio-gold shrink-0 mt-0.5" />
                <span>{address}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-studio-ivory/50 gap-4">
          <div className="flex items-center gap-2">
            <span>&copy; {new Date().getFullYear()} {studioName}. All rights reserved.</span>
            <span className="hidden sm:inline">&bull;</span>
            <span className="hidden sm:inline">Handcrafted with graphite &amp; passion.</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setModalType('privacy')}
              className="hover:text-studio-gold transition-colors underline-offset-4 hover:underline"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => setModalType('terms')}
              className="hover:text-studio-gold transition-colors underline-offset-4 hover:underline"
            >
              Terms &amp; Commission Conditions
            </button>
            <Link
              to="/admin/login"
              className="hover:text-studio-gold transition-colors text-[11px] opacity-60 hover:opacity-100 flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Studio Portal</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Modal for Privacy & Terms */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-studio-card text-studio-charcoal max-w-2xl w-full p-6 sm:p-8 rounded-sm shadow-2xl max-h-[85vh] overflow-y-auto border border-studio-border relative">
            <button
              onClick={() => setModalType(null)}
              className="absolute top-4 right-4 text-studio-taupe hover:text-studio-charcoal text-lg font-bold"
            >
              &times;
            </button>

            {modalType === 'privacy' ? (
              <div className="space-y-4">
                <h3 className="font-serif text-2xl font-bold text-studio-charcoal">
                  Privacy Policy &amp; Image Protection
                </h3>
                <p className="text-xs text-studio-taupe leading-relaxed">
                  At {studioName}, client confidentiality and personal photograph protection are our highest priorities.
                </p>
                <div className="space-y-3 text-xs text-studio-charcoal/80 leading-relaxed">
                  <h4 className="font-semibold text-studio-charcoal text-sm">1. Reference Photograph Usage</h4>
                  <p>
                    All photographs uploaded for sketch commissions are stored in our secure database and used strictly for artistic reference by artist {artistName}. We will never share, sell, or disclose your personal photographs to third parties.
                  </p>
                  <h4 className="font-semibold text-studio-charcoal text-sm">2. Artwork Exhibition Permission</h4>
                  <p>
                    Finished portraits are only exhibited in our public studio gallery or social channels with your explicit prior consent. If a commission is a gift or private heirloom, it remains 100% confidential.
                  </p>
                  <h4 className="font-semibold text-studio-charcoal text-sm">3. Data Retention</h4>
                  <p>
                    Customer contact details are stored solely to coordinate your commission, send digital proofs, and arrange tracked delivery. You may request deletion of your photographs at any time after completion.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="font-serif text-2xl font-bold text-studio-charcoal">
                  Terms of Commission &amp; Authenticity
                </h3>
                <div className="space-y-3 text-xs text-studio-charcoal/80 leading-relaxed">
                  <h4 className="font-semibold text-studio-charcoal text-sm">1. Handcrafted Authenticity</h4>
                  <p>
                    Every portrait commissioned through {studioName} is 100% hand-drawn using artist-grade graphite pencils, charcoal powders, and archival cotton papers. No digital filters or automated printing are ever used.
                  </p>
                  <h4 className="font-semibold text-studio-charcoal text-sm">2. Commission Process &amp; Approval</h4>
                  <p>
                    After your enquiry is received, we confirm photograph feasibility, final composition, and delivery schedules. Before shipping, a high-resolution digital proof is emailed for your review.
                  </p>
                  <h4 className="font-semibold text-studio-charcoal text-sm">3. Packaging &amp; Safe Arrival Guarantee</h4>
                  <p>
                    Each artwork is sealed with protective acid-free glassine, encased in waterproof shielding, and shipped inside reinforced rigid mailers or custom-cushioned wooden framing crates with full postal insurance.
                  </p>
                </div>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-studio-border text-right">
              <button
                onClick={() => setModalType(null)}
                className="px-5 py-2 bg-studio-charcoal text-studio-ivory text-xs uppercase tracking-wider font-medium hover:bg-studio-gold transition-colors"
              >
                Close Statement
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
