import React from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../../context/ContentContext';
import { Check, Info, ArrowUpRight } from 'lucide-react';

export const PricingSection: React.FC = () => {
  const { content, isSectionVisible } = useContent();

  if (!isSectionVisible('pricing')) return null;

  const settings = content?.settings;
  const heading = settings?.pricingHeading || 'Custom Sketch Pricing & Size Guide';
  const subheading =
    settings?.pricingSubheading ||
    'Transparent starting rates tailored to your choice of scale and detail.';
  const pricingNote =
    settings?.pricingNote ||
    'Final pricing may vary depending on complexity, number of subjects, and additional customization.';
  const pricingRules = content?.pricing || [];
  const currencySymbol = settings?.currencySymbol || '$';

  return (
    <section id="pricing" className="py-20 lg:py-28 bg-studio-ivory border-b border-studio-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="text-[11px] uppercase tracking-widest text-studio-gold font-semibold">
            Scale &amp; Investment
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-studio-charcoal">
            {heading}
          </h2>
          <p className="text-sm sm:text-base text-studio-taupe font-light">
            {subheading}
          </p>
          <div className="w-12 h-0.5 bg-studio-gold mx-auto mt-4" />
        </div>

        {/* Pricing Cards Grid (4 columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pricingRules.map((rule, idx) => {
            const isPopular = rule.paperSize === 'A4' || rule.paperSize === 'A3';

            return (
              <div
                key={rule.id}
                className={`relative rounded-sm border transition-all duration-300 flex flex-col justify-between p-6 sm:p-7 ${
                  isPopular
                    ? 'bg-studio-card border-studio-gold shadow-elevated -translate-y-1'
                    : 'bg-studio-card border-studio-border shadow-soft hover:shadow-elevated'
                }`}
              >
                {/* Popular Pill */}
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-studio-gold text-studio-charcoal text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                    {rule.paperSize === 'A4' ? 'Most Popular' : 'Collector Choice'}
                  </div>
                )}

                <div className="space-y-6">
                  {/* Size Title & Dimensions */}
                  <div className="border-b border-studio-border/60 pb-5 text-center">
                    <span className="text-xs uppercase tracking-widest text-studio-taupe font-semibold">
                      Format Size
                    </span>
                    <h3 className="font-serif text-3xl font-bold text-studio-charcoal mt-1">
                      {rule.paperSize}
                    </h3>
                    <p className="text-xs text-studio-taupe mt-1 font-light">
                      {rule.dimensions}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="text-center">
                    <div className="text-xs text-studio-taupe uppercase tracking-wider">
                      Starting At
                    </div>
                    <div className="font-serif text-4xl font-bold text-studio-charcoal mt-1">
                      {currencySymbol}{rule.basePrice.toFixed(0)}
                    </div>
                    <div className="text-[11px] text-studio-taupe mt-1">
                      Includes 1 subject on 300gsm cotton
                    </div>
                  </div>

                  {/* Feature Breakdown */}
                  <div className="space-y-2.5 text-xs text-studio-charcoal/80 pt-2 border-t border-studio-border/60">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-studio-gold shrink-0" />
                      <span>{rule.maxDefaultSubjects} subject included</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-studio-gold shrink-0" />
                      <span>+{currencySymbol}{rule.extraSubjectPrice.toFixed(0)} per extra person/pet</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-studio-gold shrink-0" />
                      <span>Custom frame option (+{currencySymbol}{rule.framingPrice.toFixed(0)})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-studio-gold shrink-0" />
                      <span>Est. Turnaround: {rule.estimatedDays}</span>
                    </div>
                  </div>
                </div>

                {/* Card Action */}
                <div className="pt-6 mt-6 border-t border-studio-border/60">
                  <Link
                    to={`/order?size=${rule.paperSize}`}
                    className={`w-full py-3 px-4 rounded-sm text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-colors ${
                      isPopular
                        ? 'bg-studio-charcoal text-studio-ivory hover:bg-studio-gold shadow-sm'
                        : 'bg-studio-ivory hover:bg-studio-charcoal text-studio-charcoal hover:text-studio-ivory border border-studio-border'
                    }`}
                  >
                    <span>Select {rule.paperSize}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pricing Note */}
        <div className="mt-12 p-4 rounded-sm bg-studio-beige/40 border border-studio-border max-w-2xl mx-auto flex items-start gap-3 text-xs text-studio-taupe">
          <Info className="w-4 h-4 text-studio-gold shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <span className="font-semibold text-studio-charcoal">Studio Note: </span>
            {pricingNote}
          </p>
        </div>

      </div>
    </section>
  );
};
