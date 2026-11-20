import React from 'react';
import { useContent } from '../../context/ContentContext';
import { UploadCloud, Layers, PenTool, PackageCheck } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const { content, isSectionVisible } = useContent();

  if (!isSectionVisible('how_it_works')) return null;

  const settings = content?.settings;
  const heading = settings?.howItWorksHeading || 'How It Works';
  const subheading =
    settings?.howItWorksSubheading ||
    'A simple four-step process to transform your memories into timeless art.';

  const steps = [
    {
      number: '01',
      title: 'Share Your Photograph',
      description:
        'Submit your favorite high-resolution photo through our online order portal along with any custom composition notes or requests.',
      icon: UploadCloud,
    },
    {
      number: '02',
      title: 'Select Your Sketch Size',
      description:
        'Choose from curated international sizes (A5 to A2), specify framing requirements, and preview real-time estimated pricing.',
      icon: Layers,
    },
    {
      number: '03',
      title: 'Artist Handcrafts Your Artwork',
      description:
        'Every line and tonal shadow is drawn by hand using premium artist-grade graphite pencils on 300gsm heavyweight cotton paper.',
      icon: PenTool,
    },
    {
      number: '04',
      title: 'Receive Your Finished Sketch',
      description:
        'Approve your digital proof before shipment, followed by tracked, fully insured delivery in archival presentation packaging.',
      icon: PackageCheck,
    },
  ];

  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-studio-ivory border-b border-studio-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="text-[11px] uppercase tracking-widest text-studio-gold font-semibold">
            The Commission Journey
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-studio-charcoal">
            {heading}
          </h2>
          <p className="text-sm sm:text-base text-studio-taupe font-light">
            {subheading}
          </p>
          <div className="w-12 h-0.5 bg-studio-gold mx-auto mt-4" />
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="relative bg-studio-card p-6 sm:p-8 rounded-sm border border-studio-border shadow-soft hover:shadow-elevated transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Step Number Watermark */}
                <span className="font-serif text-5xl font-bold text-studio-beige/80 group-hover:text-studio-gold/20 transition-colors absolute top-4 right-4 pointer-events-none select-none">
                  {step.number}
                </span>

                <div className="space-y-4 relative z-10">
                  <div className="w-12 h-12 rounded-full bg-studio-beige flex items-center justify-center text-studio-gold group-hover:bg-studio-charcoal group-hover:text-studio-gold transition-colors duration-300">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="font-serif text-lg font-bold text-studio-charcoal group-hover:text-studio-gold transition-colors">
                    {step.title}
                  </h3>

                  <p className="text-xs text-studio-taupe leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="pt-6 mt-4 border-t border-studio-border/60 text-[10px] uppercase tracking-widest font-semibold text-studio-gold flex items-center gap-1.5">
                  <span>Step {idx + 1} of 4</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
