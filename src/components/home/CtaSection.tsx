import React from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../../context/ContentContext';
import { ArrowUpRight, Sparkles } from 'lucide-react';

export const CtaSection: React.FC = () => {
  const { content, isSectionVisible } = useContent();

  if (!isSectionVisible('cta')) return null;

  const settings = content?.settings;
  const heading = settings?.ctaHeading || 'Have a Special Moment Worth Turning Into Art?';
  const description =
    settings?.ctaDescription ||
    'Let us transform your favorite photograph into a beautiful handcrafted sketch.';
  const buttonText = settings?.ctaButtonText || 'Request Your Custom Sketch';
  const buttonLink = settings?.ctaButtonLink || '/order';

  return (
    <section className="relative overflow-hidden bg-studio-charcoal text-studio-ivory py-20 lg:py-28 border-b border-studio-dark-border">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-studio-gold/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] uppercase tracking-widest text-studio-gold font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Limited Monthly Commission Slots</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
          {heading}
        </h2>

        <p className="text-sm sm:text-base text-studio-ivory/70 max-w-2xl mx-auto font-light leading-relaxed">
          {description}
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to={buttonLink}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-studio-gold text-studio-charcoal font-semibold text-xs uppercase tracking-widest hover:bg-studio-ivory transition-colors duration-200 shadow-xl rounded-sm group"
          >
            <span>{buttonText}</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>

          <a
            href="#gallery"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 bg-transparent text-studio-ivory text-xs uppercase tracking-widest font-medium border border-white/20 hover:border-white hover:bg-white/5 transition-all duration-200 rounded-sm"
          >
            <span>View Recent Artworks</span>
          </a>
        </div>

        <div className="pt-8 text-xs text-studio-ivory/50 flex items-center justify-center gap-6">
          <span>&bull; Free insured worldwide shipping</span>
          <span>&bull; Archival 300gsm paper</span>
          <span>&bull; Proof review before delivery</span>
        </div>
      </div>
    </section>
  );
};
