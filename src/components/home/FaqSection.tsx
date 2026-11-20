import React, { useState } from 'react';
import { useContent } from '../../context/ContentContext';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const { content, isSectionVisible } = useContent();
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First open by default

  if (!isSectionVisible('faq')) return null;

  const faqs = content?.faqs || [];
  const settings = content?.settings;
  const heading = settings?.faqHeading || 'Frequently Asked Questions';
  const subheading =
    settings?.faqSubheading || 'Everything you need to know about commissioning your custom sketch.';

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 lg:py-28 bg-studio-beige/30 border-b border-studio-border/60">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="text-[11px] uppercase tracking-widest text-studio-gold font-semibold">
            Common Inquiries
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-studio-charcoal">
            {heading}
          </h2>
          <p className="text-sm sm:text-base text-studio-taupe font-light">
            {subheading}
          </p>
          <div className="w-12 h-0.5 bg-studio-gold mx-auto mt-4" />
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={faq.id}
                className="bg-studio-card rounded-sm border border-studio-border overflow-hidden transition-all duration-200 shadow-soft"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full py-5 px-6 sm:px-8 text-left flex items-center justify-between gap-4 focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif text-base sm:text-lg font-bold text-studio-charcoal">
                    {faq.question}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full bg-studio-beige flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 bg-studio-gold text-white' : 'text-studio-charcoal'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 sm:px-8 pb-6 pt-1 border-t border-studio-border/40 text-xs sm:text-sm text-studio-taupe leading-relaxed animate-fadeIn">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Contact fallback */}
        <div className="mt-12 text-center text-xs text-studio-taupe flex items-center justify-center gap-2">
          <HelpCircle className="w-4 h-4 text-studio-gold" />
          <span>Have an unusual photo or question? </span>
          <a href="#contact" className="text-studio-charcoal font-semibold hover:text-studio-gold underline underline-offset-4">
            Contact Alex directly
          </a>
        </div>

      </div>
    </section>
  );
};
