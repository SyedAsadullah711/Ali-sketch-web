import React, { useState, useEffect } from 'react';
import { WebsiteSettings, PageSection } from '../../types';
import { adminApi } from '../../api/client';
import { useContent } from '../../context/ContentContext';
import { Save, Check, AlertCircle, Eye, EyeOff, Sparkles, Loader2 } from 'lucide-react';

export const CmsContentManager: React.FC = () => {
  const { refreshContent } = useContent();
  const [settings, setSettings] = useState<Partial<WebsiteSettings>>({});
  const [sections, setSections] = useState<PageSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'announcement' | 'hero' | 'about' | 'cta' | 'sections' | 'nav'>('hero');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [settingsData, sectionsData] = await Promise.all([
          adminApi.getSettings(),
          adminApi.getSections(),
        ]);
        setSettings(settingsData);
        setSections(sectionsData);
      } catch (err: any) {
        setErrorMsg('Failed to load CMS content.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSettingsChange = (field: keyof WebsiteSettings, value: any) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      setErrorMsg(null);
      await adminApi.updateSettings(settings);
      await refreshContent();
      setSuccessMsg('Website content successfully saved and published!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save settings.');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleSectionVisibility = async (id: number, currentVisible: boolean) => {
    try {
      await adminApi.updateSection(id, { isVisible: !currentVisible });
      setSections((prev) =>
        prev.map((s) => (s.id === id ? { ...s, isVisible: !currentVisible } : s))
      );
      await refreshContent();
    } catch (err) {
      alert('Failed to update section visibility');
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center text-studio-taupe flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-studio-gold mb-2" />
        <span className="text-xs">Loading CMS configuration...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-studio-card p-6 rounded-sm border border-studio-border shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-studio-charcoal">
            Website Content Management (CMS)
          </h1>
          <p className="text-xs text-studio-taupe">
            Live editable control over public hero sections, artist biography, announcement bar, and section ordering.
          </p>
        </div>

        <button
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-studio-charcoal hover:bg-studio-gold text-studio-ivory text-xs uppercase tracking-widest font-semibold rounded-sm transition-colors shadow-sm disabled:opacity-60"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 text-studio-gold" />}
          <span>Publish Changes</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-sm bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 rounded-sm bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Sub Tabs */}
      <div className="flex border-b border-studio-border bg-studio-card px-4 gap-2 overflow-x-auto text-xs font-semibold">
        {[
          { id: 'hero', label: 'Hero Section' },
          { id: 'about', label: 'About the Artist' },
          { id: 'announcement', label: 'Announcement Bar' },
          { id: 'cta', label: 'Final CTA & Note' },
          { id: 'sections', label: 'Section Visibility' },
          { id: 'nav', label: 'Navigation Labels' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-3.5 px-4 border-b-2 uppercase tracking-wider transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-studio-gold text-studio-charcoal font-bold'
                : 'border-transparent text-studio-taupe hover:text-studio-charcoal'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Form Panels */}
      <form onSubmit={handleSaveSettings} className="bg-studio-card p-6 sm:p-8 rounded-sm border border-studio-border shadow-soft space-y-6">
        
        {/* TAB 1: HERO */}
        {activeTab === 'hero' && (
          <div className="space-y-5 animate-fadeIn">
            <h3 className="font-serif text-lg font-bold text-studio-charcoal border-b border-studio-border/60 pb-2">
              Hero Header Configuration
            </h3>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
                Main Headline
              </label>
              <input
                type="text"
                value={settings.heroHeading || ''}
                onChange={(e) => handleSettingsChange('heroHeading', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-studio-ivory border border-studio-border rounded-sm text-xs font-serif text-base text-studio-charcoal focus:outline-none focus:border-studio-gold"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
                Subheading / Description
              </label>
              <textarea
                rows={3}
                value={settings.heroSubheading || ''}
                onChange={(e) => handleSettingsChange('heroSubheading', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-studio-ivory border border-studio-border rounded-sm text-xs text-studio-charcoal focus:outline-none focus:border-studio-gold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
                  Primary Button Text
                </label>
                <input
                  type="text"
                  value={settings.heroPrimaryCtaText || ''}
                  onChange={(e) => handleSettingsChange('heroPrimaryCtaText', e.target.value)}
                  className="w-full px-3.5 py-2 bg-studio-ivory border border-studio-border rounded-sm text-xs focus:outline-none focus:border-studio-gold"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
                  Primary Button Link
                </label>
                <input
                  type="text"
                  value={settings.heroPrimaryCtaLink || ''}
                  onChange={(e) => handleSettingsChange('heroPrimaryCtaLink', e.target.value)}
                  className="w-full px-3.5 py-2 bg-studio-ivory border border-studio-border rounded-sm text-xs focus:outline-none focus:border-studio-gold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
                  Secondary Button Text
                </label>
                <input
                  type="text"
                  value={settings.heroSecondaryCtaText || ''}
                  onChange={(e) => handleSettingsChange('heroSecondaryCtaText', e.target.value)}
                  className="w-full px-3.5 py-2 bg-studio-ivory border border-studio-border rounded-sm text-xs focus:outline-none focus:border-studio-gold"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
                  Secondary Button Link
                </label>
                <input
                  type="text"
                  value={settings.heroSecondaryCtaLink || ''}
                  onChange={(e) => handleSettingsChange('heroSecondaryCtaLink', e.target.value)}
                  className="w-full px-3.5 py-2 bg-studio-ivory border border-studio-border rounded-sm text-xs focus:outline-none focus:border-studio-gold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
                Hero Pencil Artwork Image URL
              </label>
              <input
                type="text"
                value={settings.heroImageUrl || ''}
                onChange={(e) => handleSettingsChange('heroImageUrl', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-studio-ivory border border-studio-border rounded-sm text-xs focus:outline-none focus:border-studio-gold"
              />
              {settings.heroImageUrl && (
                <div className="mt-3 w-32 aspect-[4/5] rounded border border-studio-border overflow-hidden">
                  <img src={settings.heroImageUrl} alt="Hero Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: ABOUT */}
        {activeTab === 'about' && (
          <div className="space-y-5 animate-fadeIn">
            <h3 className="font-serif text-lg font-bold text-studio-charcoal border-b border-studio-border/60 pb-2">
              About the Artist Section
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
                  Artist Full Name
                </label>
                <input
                  type="text"
                  value={settings.artistName || ''}
                  onChange={(e) => handleSettingsChange('artistName', e.target.value)}
                  className="w-full px-3.5 py-2 bg-studio-ivory border border-studio-border rounded-sm text-xs focus:outline-none focus:border-studio-gold"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
                  Years of Experience
                </label>
                <input
                  type="number"
                  value={settings.aboutYearsExperience || 12}
                  onChange={(e) => handleSettingsChange('aboutYearsExperience', parseInt(e.target.value, 10))}
                  className="w-full px-3.5 py-2 bg-studio-ivory border border-studio-border rounded-sm text-xs focus:outline-none focus:border-studio-gold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
                Section Heading
              </label>
              <input
                type="text"
                value={settings.aboutHeading || ''}
                onChange={(e) => handleSettingsChange('aboutHeading', e.target.value)}
                className="w-full px-3.5 py-2 bg-studio-ivory border border-studio-border rounded-sm text-xs focus:outline-none focus:border-studio-gold"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
                Artistic Journey &amp; Story
              </label>
              <textarea
                rows={3}
                value={settings.aboutStory || ''}
                onChange={(e) => handleSettingsChange('aboutStory', e.target.value)}
                className="w-full px-3.5 py-2 bg-studio-ivory border border-studio-border rounded-sm text-xs focus:outline-none focus:border-studio-gold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
                  Experience Summary
                </label>
                <textarea
                  rows={2}
                  value={settings.aboutExperience || ''}
                  onChange={(e) => handleSettingsChange('aboutExperience', e.target.value)}
                  className="w-full px-3.5 py-2 bg-studio-ivory border border-studio-border rounded-sm text-xs focus:outline-none focus:border-studio-gold"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
                  Specialization
                </label>
                <textarea
                  rows={2}
                  value={settings.aboutSpecialization || ''}
                  onChange={(e) => handleSettingsChange('aboutSpecialization', e.target.value)}
                  className="w-full px-3.5 py-2 bg-studio-ivory border border-studio-border rounded-sm text-xs focus:outline-none focus:border-studio-gold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
                Creative Philosophy
              </label>
              <textarea
                rows={2}
                value={settings.aboutPhilosophy || ''}
                onChange={(e) => handleSettingsChange('aboutPhilosophy', e.target.value)}
                className="w-full px-3.5 py-2 bg-studio-ivory border border-studio-border rounded-sm text-xs focus:outline-none focus:border-studio-gold"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
                Personal Signed Quote Message
              </label>
              <textarea
                rows={2}
                value={settings.aboutPersonalMessage || ''}
                onChange={(e) => handleSettingsChange('aboutPersonalMessage', e.target.value)}
                className="w-full px-3.5 py-2 bg-studio-ivory border border-studio-border rounded-sm text-xs font-serif italic focus:outline-none focus:border-studio-gold"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
                Artist Studio Photograph URL
              </label>
              <input
                type="text"
                value={settings.aboutImageUrl || ''}
                onChange={(e) => handleSettingsChange('aboutImageUrl', e.target.value)}
                className="w-full px-3.5 py-2 bg-studio-ivory border border-studio-border rounded-sm text-xs focus:outline-none focus:border-studio-gold"
              />
            </div>
          </div>
        )}

        {/* TAB 3: ANNOUNCEMENT BAR */}
        {activeTab === 'announcement' && (
          <div className="space-y-5 animate-fadeIn">
            <h3 className="font-serif text-lg font-bold text-studio-charcoal border-b border-studio-border/60 pb-2">
              Top Announcement Bar
            </h3>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={settings.announcementVisible ?? true}
                  onChange={(e) => handleSettingsChange('announcementVisible', e.target.checked)}
                  className="w-4 h-4 text-studio-gold rounded border-studio-border"
                />
                <span className="text-xs font-semibold text-studio-charcoal">
                  Show Top Announcement Bar on Public Website
                </span>
              </label>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
                Announcement Message Text
              </label>
              <input
                type="text"
                value={settings.announcementText || ''}
                onChange={(e) => handleSettingsChange('announcementText', e.target.value)}
                className="w-full px-3.5 py-2 bg-studio-ivory border border-studio-border rounded-sm text-xs focus:outline-none focus:border-studio-gold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
                  Background Color (HEX)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={settings.announcementBg || '#292722'}
                    onChange={(e) => handleSettingsChange('announcementBg', e.target.value)}
                    className="w-9 h-9 p-0.5 rounded border border-studio-border cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.announcementBg || '#292722'}
                    onChange={(e) => handleSettingsChange('announcementBg', e.target.value)}
                    className="flex-1 px-3 py-2 bg-studio-ivory border border-studio-border rounded-sm text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
                  Text Color (HEX)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={settings.announcementTextColor || '#F7F3EB'}
                    onChange={(e) => handleSettingsChange('announcementTextColor', e.target.value)}
                    className="w-9 h-9 p-0.5 rounded border border-studio-border cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.announcementTextColor || '#F7F3EB'}
                    onChange={(e) => handleSettingsChange('announcementTextColor', e.target.value)}
                    className="flex-1 px-3 py-2 bg-studio-ivory border border-studio-border rounded-sm text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CTA & NOTES */}
        {activeTab === 'cta' && (
          <div className="space-y-5 animate-fadeIn">
            <h3 className="font-serif text-lg font-bold text-studio-charcoal border-b border-studio-border/60 pb-2">
              Call to Action &amp; Disclaimers
            </h3>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
                CTA Headline
              </label>
              <input
                type="text"
                value={settings.ctaHeading || ''}
                onChange={(e) => handleSettingsChange('ctaHeading', e.target.value)}
                className="w-full px-3.5 py-2 bg-studio-ivory border border-studio-border rounded-sm text-xs focus:outline-none focus:border-studio-gold"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
                CTA Description
              </label>
              <textarea
                rows={2}
                value={settings.ctaDescription || ''}
                onChange={(e) => handleSettingsChange('ctaDescription', e.target.value)}
                className="w-full px-3.5 py-2 bg-studio-ivory border border-studio-border rounded-sm text-xs focus:outline-none focus:border-studio-gold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
                  CTA Button Label
                </label>
                <input
                  type="text"
                  value={settings.ctaButtonText || ''}
                  onChange={(e) => handleSettingsChange('ctaButtonText', e.target.value)}
                  className="w-full px-3.5 py-2 bg-studio-ivory border border-studio-border rounded-sm text-xs focus:outline-none focus:border-studio-gold"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
                  CTA Button Link
                </label>
                <input
                  type="text"
                  value={settings.ctaButtonLink || ''}
                  onChange={(e) => handleSettingsChange('ctaButtonLink', e.target.value)}
                  className="w-full px-3.5 py-2 bg-studio-ivory border border-studio-border rounded-sm text-xs focus:outline-none focus:border-studio-gold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
                Pricing Variance Note Disclaimer
              </label>
              <textarea
                rows={2}
                value={settings.pricingNote || ''}
                onChange={(e) => handleSettingsChange('pricingNote', e.target.value)}
                className="w-full px-3.5 py-2 bg-studio-ivory border border-studio-border rounded-sm text-xs focus:outline-none focus:border-studio-gold"
              />
            </div>
          </div>
        )}

        {/* TAB 5: SECTIONS VISIBILITY */}
        {activeTab === 'sections' && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="font-serif text-lg font-bold text-studio-charcoal border-b border-studio-border/60 pb-2">
              Section Visibility &amp; Ordering
            </h3>
            <p className="text-xs text-studio-taupe">
              Instantly show or hide any public website section without touching code.
            </p>

            <div className="divide-y divide-studio-border/60">
              {sections.map((section) => (
                <div
                  key={section.id}
                  className="py-3 flex items-center justify-between hover:bg-studio-ivory/50 px-2 rounded transition-colors"
                >
                  <div>
                    <h4 className="text-xs font-bold text-studio-charcoal">{section.title}</h4>
                    <span className="text-[10px] text-studio-taupe font-mono">
                      key: {section.sectionKey}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleSectionVisibility(section.id, section.isVisible)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                      section.isVisible
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {section.isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span>{section.isVisible ? 'Visible' : 'Hidden'}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: NAV LABELS */}
        {activeTab === 'nav' && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="font-serif text-lg font-bold text-studio-charcoal border-b border-studio-border/60 pb-2">
              Navigation Menu Items (JSON)
            </h3>
            <p className="text-xs text-studio-taupe">
              Customize header navigation labels and destinations. Format: Array of &#123; label: string, href: string &#125;.
            </p>
            <textarea
              rows={8}
              value={settings.navItems || ''}
              onChange={(e) => handleSettingsChange('navItems', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-studio-ivory border border-studio-border rounded-sm text-xs font-mono focus:outline-none focus:border-studio-gold"
            />
          </div>
        )}

        {/* Bottom Save Action */}
        <div className="pt-4 border-t border-studio-border/60 flex items-center justify-end gap-3">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 bg-studio-charcoal hover:bg-studio-gold text-studio-ivory text-xs uppercase tracking-widest font-semibold rounded-sm transition-colors shadow-sm disabled:opacity-60 flex items-center gap-2"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 text-studio-gold" />}
            <span>Save &amp; Publish Website Changes</span>
          </button>
        </div>

      </form>
    </div>
  );
};
