import React from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../../context/ContentContext';
import { ArrowUpRight, Award, Sparkles, Feather } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { content, isSectionVisible } = useContent();

  if (!isSectionVisible('hero')) return null;

  const settings = content?.settings;
  const heading = settings?.heroHeading || 'Turning Your Precious Moments Into Timeless Art.';
  const subheading =
    settings?.heroSubheading ||
    'Handcrafted pencil portraits and personalized sketches, created with passion, precision, and attention to every detail.';
  const primaryCta = settings?.heroPrimaryCtaText || 'Explore Our Artwork';
  const primaryLink = settings?.heroPrimaryCtaLink || '#gallery';
  const secondaryCta = settings?.heroSecondaryCtaText || 'Order Your Custom Sketch';
  const secondaryLink = settings?.heroSecondaryCtaLink || '/order';
  const heroImage =
    settings?.heroImageUrl ||
    'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=85';

  return (
    <section className="relative overflow-hidden bg-studio-ivory pt-8 pb-16 lg:py-24 border-b border-studio-border/50">
      {/* Subtle textured background accents */}
      <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-studio-beige/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 rounded-full bg-studio-gold-light/40 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Editorial Text Column (7 cols) */}
          <div className="lg:col-span-7 space-y-8 pr-0 lg:pr-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-studio-beige border border-studio-border/80 text-[11px] uppercase tracking-widest text-studio-taupe font-medium">
              <Sparkles className="w-3.5 h-3.5 text-studio-gold" />
              <span>Independent Fine Art Studio</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-studio-charcoal leading-[1.12]">
              {heading}
            </h1>

            <p className="text-base sm:text-lg text-studio-taupe font-light leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {subheading}
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                to={secondaryLink}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-studio-charcoal text-studio-ivory text-xs uppercase tracking-widest font-semibold hover:bg-studio-gold transition-colors duration-200 shadow-md group rounded-sm"
              >
                <span>{secondaryCta}</span>
                <ArrowUpRight className="w-4 h-4 text-studio-gold group-hover:text-white transition-colors" />
              </Link>

              <a
                href={primaryLink}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 bg-transparent text-studio-charcoal text-xs uppercase tracking-widest font-medium border border-studio-charcoal/40 hover:border-studio-charcoal hover:bg-studio-charcoal/5 transition-all duration-200 rounded-sm"
              >
                <span>{primaryCta}</span>
              </a>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-studio-border/60 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 text-left">
              <div className="flex items-center gap-2">
                <Feather className="w-4 h-4 text-studio-gold shrink-0" />
                <span className="text-xs text-studio-taupe leading-tight">100% Hand-Drawn with Graphite</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-studio-gold shrink-0" />
                <span className="text-xs text-studio-taupe leading-tight">300gsm Archival Cotton Paper</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-studio-gold shrink-0" />
                <span className="text-xs text-studio-taupe leading-tight">Digital Proof Before Delivery</span>
              </div>
            </div>
          </div>

          {/* Right Imagery Column (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Outer decorative framing border */}
              <div className="absolute -inset-3 sm:-inset-4 border border-studio-gold/30 rounded-sm pointer-events-none transform rotate-1 transition-transform group-hover:rotate-0" />

              {/* Main Artwork Frame */}
              <div className="relative bg-studio-card p-3 sm:p-4 shadow-elevated rounded-sm border border-studio-border overflow-hidden">
                <div className="aspect-[4/5] overflow-hidden bg-studio-beige relative group">
                  <img
                    src={heroImage}
                    alt="Realistic Masterpiece Pencil Portrait Sketch"
                    className="w-full h-full object-cover grayscale contrast-110 hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
                  
                  <div className="absolute bottom-4 left-4 right-4 text-white text-xs flex items-center justify-between pointer-events-none">
                    <span className="font-serif italic tracking-wide text-sm">Graphite &amp; Charcoal Study</span>
                    <span className="text-[10px] uppercase tracking-wider text-studio-gold font-medium bg-black/60 px-2.5 py-1 rounded-sm backdrop-blur-sm">
                      Masterpiece
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating Artistic Seal Badge */}
              <div className="absolute -bottom-5 -left-4 sm:-left-6 bg-studio-card py-3 px-4 rounded-sm shadow-xl border border-studio-border flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-studio-gold/15 flex items-center justify-center text-studio-gold font-serif font-bold text-sm">
                  12+
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-widest font-semibold text-studio-charcoal">
                    Years of Mastery
                  </div>
                  <div className="text-[10px] text-studio-taupe">900+ Handcrafted Commissions</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
