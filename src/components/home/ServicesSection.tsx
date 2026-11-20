import React from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../../context/ContentContext';
import { Clock, ArrowRight, Layers } from 'lucide-react';

export const ServicesSection: React.FC = () => {
  const { content, isSectionVisible } = useContent();

  if (!isSectionVisible('services')) return null;

  const services = content?.services || [];
  const currencySymbol = content?.settings?.currencySymbol || '$';

  return (
    <section id="services" className="py-20 lg:py-28 bg-studio-ivory border-b border-studio-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="text-[11px] uppercase tracking-widest text-studio-gold font-semibold">
            Bespoke Portraiture
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-studio-charcoal">
            Commission Services
          </h2>
          <p className="text-sm sm:text-base text-studio-taupe font-light">
            Each commission is tailored to your preferences, rendered on archival museum cotton, and packaged with heirloom care.
          </p>
          <div className="w-12 h-0.5 bg-studio-gold mx-auto mt-4" />
        </div>

        {/* Services Grid (3 cols on desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => {
            let sizes: string[] = [];
            try {
              sizes = JSON.parse(service.availableSizes);
            } catch {
              sizes = ['A4', 'A3'];
            }

            return (
              <div
                key={service.id}
                className="group bg-studio-card rounded-sm border border-studio-border overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Service Image with zoom on hover */}
                  <div className="aspect-[4/3] overflow-hidden bg-studio-beige relative">
                    <img
                      src={service.imageUrl}
                      alt={service.title}
                      className="w-full h-full object-cover filter contrast-105 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-studio-charcoal/80 backdrop-blur-sm text-studio-ivory text-xs px-2.5 py-1 rounded-sm font-medium">
                      From {currencySymbol}{service.startingPrice.toFixed(0)}
                    </div>
                  </div>

                  {/* Content Details */}
                  <div className="p-6 space-y-3.5">
                    <h3 className="font-serif text-xl font-bold text-studio-charcoal group-hover:text-studio-gold transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-xs text-studio-taupe leading-relaxed line-clamp-3">
                      {service.description}
                    </p>

                    {/* Meta: Sizes & Turnaround */}
                    <div className="pt-2 space-y-2 border-t border-studio-border/60">
                      <div className="flex items-center gap-2 text-[11px] text-studio-taupe">
                        <Layers className="w-3.5 h-3.5 text-studio-gold shrink-0" />
                        <span>Sizes: {sizes.join(', ')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-studio-taupe">
                        <Clock className="w-3.5 h-3.5 text-studio-gold shrink-0" />
                        <span>Est. Turnaround: {service.estimatedTime}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-6 pt-0">
                  <Link
                    to={`/order?service=${service.slug}`}
                    className="w-full py-2.5 px-4 bg-studio-ivory hover:bg-studio-charcoal text-studio-charcoal hover:text-studio-ivory border border-studio-border hover:border-studio-charcoal transition-all duration-200 text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 rounded-sm group-hover:bg-studio-charcoal group-hover:text-studio-ivory"
                  >
                    <span>Commission This Style</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
