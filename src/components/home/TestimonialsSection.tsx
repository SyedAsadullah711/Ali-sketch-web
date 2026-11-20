import React from 'react';
import { useContent } from '../../context/ContentContext';
import { Star, Quote, Info } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const { content, isSectionVisible } = useContent();

  if (!isSectionVisible('reviews')) return null;

  const testimonials = content?.testimonials || [];

  return (
    <section id="reviews" className="py-20 lg:py-28 bg-studio-beige/30 border-b border-studio-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="text-[11px] uppercase tracking-widest text-studio-gold font-semibold">
            Client Experiences
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-studio-charcoal">
            Customer Reviews &amp; Testimonials
          </h2>
          <p className="text-sm sm:text-base text-studio-taupe font-light">
            Read heartfelt thoughts from collectors and patrons who trusted us with their precious memories.
          </p>
          <div className="w-12 h-0.5 bg-studio-gold mx-auto mt-4" />
        </div>

        {/* Demo Content Transparency Badge */}
        <div className="max-w-xl mx-auto mb-10 p-3 rounded bg-studio-card border border-studio-border flex items-center justify-center gap-2 text-xs text-studio-taupe text-center">
          <Info className="w-4 h-4 text-studio-gold shrink-0" />
          <span>The reviews below are demonstration content representative of our studio commissions.</span>
        </div>

        {/* Testimonials Grid (2 cols on tablet, 2 or 4 cols) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((review) => (
            <div
              key={review.id}
              className="bg-studio-card p-8 rounded-sm border border-studio-border shadow-soft flex flex-col justify-between relative group hover:shadow-elevated transition-all"
            >
              <Quote className="w-10 h-10 text-studio-beige absolute top-6 right-6 pointer-events-none group-hover:text-studio-gold/20 transition-colors" />

              <div className="space-y-4 relative z-10">
                {/* Star Rating */}
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-stone-200 text-stone-200'
                      }`}
                    />
                  ))}
                  <span className="text-xs text-studio-taupe ml-2 font-medium">5.0 / 5.0</span>
                </div>

                {/* Review Text */}
                <p className="font-serif text-base sm:text-lg text-studio-charcoal italic leading-relaxed">
                  &ldquo;{review.reviewText}&rdquo;
                </p>
              </div>

              {/* Reviewer Details */}
              <div className="pt-6 mt-6 border-t border-studio-border/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {review.customerImageUrl ? (
                    <img
                      src={review.customerImageUrl}
                      alt={review.customerName}
                      className="w-11 h-11 rounded-full object-cover border border-studio-gold/30"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-studio-beige flex items-center justify-center font-serif text-studio-charcoal font-bold text-sm">
                      {review.customerName.charAt(0)}
                    </div>
                  )}

                  <div>
                    <h4 className="font-serif text-sm font-bold text-studio-charcoal">
                      {review.customerName}
                    </h4>
                    <p className="text-[11px] text-studio-taupe">
                      {review.location} &bull; {review.sketchType}
                    </p>
                  </div>
                </div>

                <div className="text-[10px] text-studio-taupe text-right">
                  <span>{review.dateString}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
