import React, { useState, useEffect } from 'react';
import { WebsiteSettings } from '../../types';
import { adminApi, authApi } from '../../api/client';
import { useContent } from '../../context/ContentContext';
import { Save, Check, AlertCircle, Lock, Shield, Loader2 } from 'lucide-react';

export const SettingsManager: React.FC = () => {
  const { refreshContent } = useContent();
  const [settings, setSettings] = useState<Partial<WebsiteSettings>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Password Update
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const data = await adminApi.getSettings();
        setSettings(data);
      } catch (err) {
        setErrorMsg('Failed to load settings.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (field: keyof WebsiteSettings, value: any) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      setErrorMsg(null);
      await adminApi.updateSettings(settings);
      await refreshContent();
      setSuccessMsg('Studio settings successfully updated!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save settings.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    try {
      setIsUpdatingPassword(true);
      await authApi.updatePassword({ currentPassword, newPassword });
      setPasswordSuccess('Password successfully updated!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(null), 3000);
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to update password.');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center text-studio-taupe flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-studio-gold mb-2" />
        <span className="text-xs">Loading studio settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="bg-studio-card p-6 rounded-sm border border-studio-border shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-studio-charcoal">
            Studio &amp; System Settings
          </h1>
          <p className="text-xs text-studio-taupe">
            Manage global branding, studio contact endpoints, WhatsApp channel, SEO meta tags, and security credentials.
          </p>
        </div>

        <button
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-studio-charcoal hover:bg-studio-gold text-studio-ivory text-xs uppercase tracking-widest font-semibold rounded-sm transition-colors shadow-sm disabled:opacity-60"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 text-studio-gold" />}
          <span>Save Studio Settings</span>
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

      <form onSubmit={handleSaveSettings} className="space-y-8">
        
        {/* 1. BRANDING & STUDIO IDENTITY */}
        <div className="bg-studio-card p-6 sm:p-8 rounded-sm border border-studio-border shadow-soft space-y-5">
          <h2 className="font-serif text-lg font-bold text-studio-charcoal border-b border-studio-border/60 pb-2">
            Studio Identity &amp; Branding
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
                Studio Name
              </label>
              <input
                type="text"
                value={settings.studioName || ''}
                onChange={(e) => handleChange('studioName', e.target.value)}
                className="w-full px-3.5 py-2 bg-studio-ivory border border-studio-border rounded-sm text-xs font-serif font-bold text-studio-charcoal focus:outline-none focus:border-studio-gold"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
                Artist Name
              </label>
              <input
                type="text"
                value={settings.artistName || ''}
                onChange={(e) => handleChange('artistName', e.target.value)}
                className="w-full px-3.5 py-2 bg-studio-ivory border border-studio-border rounded-sm text-xs focus:outline-none focus:border-studio-gold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
                Logo Text (When Image Logo is blank)
              </label>
              <input
                type="text"
                value={settings.logoText || ''}
                onChange={(e) => handleChange('logoText', e.target.value)}
                className="w-full px-3.5 py-2 bg-studio-ivory border border-studio-border rounded-sm text-xs focus:outline-none focus:border-studio-gold"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
                Logo Image URL (Optional)
              </label>
              <input
                type="text"
                value={settings.logoImageUrl || ''}
                onChange={(e) => handleChange('logoImageUrl', e.target.value)}
                placeholder="https://... (leave blank to use typography logo)"
                className="w-full px-3.5 py-2 bg-studio-ivory border border-studio-border rounded-sm text-xs focus:outline-none focus:border-studio-gold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
              Studio Tagline
            </label>
            <input
              type="text"
              value={settings.tagline || ''}
              onChange={(e) => handleChange('tagline', e.target.value)}
              className="w-full px-3.5 py-2 bg-studio-ivory border border-studio-border rounded-sm text-xs focus:outline-none focus:border-studio-gold"
            />
          </div>
        </div>

        {/* 2. CONTACT DETAILS & WHATSAPP */}
        <div className="bg-studio-card p-6 sm:p-8 rounded-sm border border-studio-border shadow-soft space-y-5">
          <h2 className="font-serif text-lg font-bold text-studio-charcoal border-b border-studio-border/60 pb-2">
            Contact Channels &amp; Business Address
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
                Contact Email
              </label>
              <input
                type="email"
                value={settings.contactEmail || ''}
                onChange={(e) => handleChange('contactEmail', e.target.value)}
                className="w-full px-3.5 py-2 bg-studio-ivory border border-studio-border rounded-sm text-xs focus:outline-none focus:border-studio-gold"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
                Contact Phone
              </label>
              <input
                type="text"
                value={settings.contactPhone || ''}
                onChange={(e) => handleChange('contactPhone', e.target.value)}
                className="w-full px-3.5 py-2 bg-studio-ivory border border-studio-border rounded-sm text-xs focus:outline-none focus:border-studio-gold"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
                WhatsApp Number (with Country Code)
              </label>
              <input
                type="text"
                value={settings.whatsappNumber || ''}
                onChange={(e) => handleChange('whatsappNumber', e.target.value)}
                placeholder="+15552345678"
                className="w-full px-3.5 py-2 bg-studio-ivory border border-studio-border rounded-sm text-xs focus:outline-none focus:border-studio-gold font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
              Physical Studio Address
            </label>
            <input
              type="text"
              value={settings.businessAddress || ''}
              onChange={(e) => handleChange('businessAddress', e.target.value)}
              className="w-full px-3.5 py-2 bg-studio-ivory border border-studio-border rounded-sm text-xs focus:outline-none focus:border-studio-gold"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
                Instagram URL
              </label>
              <input
                type="text"
                value={settings.instagramUrl || ''}
                onChange={(e) => handleChange('instagramUrl', e.target.value)}
                className="w-full px-3.5 py-2 bg-studio-ivory border border-studio-border rounded-sm text-xs focus:outline-none focus:border-studio-gold"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
                Pinterest URL
              </label>
              <input
                type="text"
                value={settings.pinterestUrl || ''}
                onChange={(e) => handleChange('pinterestUrl', e.target.value)}
                className="w-full px-3.5 py-2 bg-studio-ivory border border-studio-border rounded-sm text-xs focus:outline-none focus:border-studio-gold"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
                Facebook URL
              </label>
              <input
                type="text"
                value={settings.facebookUrl || ''}
                onChange={(e) => handleChange('facebookUrl', e.target.value)}
                className="w-full px-3.5 py-2 bg-studio-ivory border border-studio-border rounded-sm text-xs focus:outline-none focus:border-studio-gold"
              />
            </div>
          </div>
        </div>

        {/* 3. SEO & META */}
        <div className="bg-studio-card p-6 sm:p-8 rounded-sm border border-studio-border shadow-soft space-y-5">
          <h2 className="font-serif text-lg font-bold text-studio-charcoal border-b border-studio-border/60 pb-2">
            SEO, Currency &amp; Regional
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
                Currency Symbol
              </label>
              <input
                type="text"
                value={settings.currencySymbol || '$'}
                onChange={(e) => handleChange('currencySymbol', e.target.value)}
                className="w-full px-3.5 py-2 bg-studio-ivory border border-studio-border rounded-sm text-xs font-mono focus:outline-none focus:border-studio-gold"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
                Default Country
              </label>
              <input
                type="text"
                value={settings.defaultCountry || 'United States'}
                onChange={(e) => handleChange('defaultCountry', e.target.value)}
                className="w-full px-3.5 py-2 bg-studio-ivory border border-studio-border rounded-sm text-xs focus:outline-none focus:border-studio-gold"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
                Timezone
              </label>
              <input
                type="text"
                value={settings.timezone || 'America/New_York'}
                onChange={(e) => handleChange('timezone', e.target.value)}
                className="w-full px-3.5 py-2 bg-studio-ivory border border-studio-border rounded-sm text-xs focus:outline-none focus:border-studio-gold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
              Global SEO Title Tag
            </label>
            <input
              type="text"
              value={settings.seoTitle || ''}
              onChange={(e) => handleChange('seoTitle', e.target.value)}
              className="w-full px-3.5 py-2 bg-studio-ivory border border-studio-border rounded-sm text-xs focus:outline-none focus:border-studio-gold"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
              Meta Description
            </label>
            <textarea
              rows={2}
              value={settings.seoDescription || ''}
              onChange={(e) => handleChange('seoDescription', e.target.value)}
              className="w-full px-3.5 py-2 bg-studio-ivory border border-studio-border rounded-sm text-xs focus:outline-none focus:border-studio-gold"
            />
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={settings.maintenanceMode ?? false}
                onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
                className="w-4 h-4 text-studio-gold rounded border-studio-border"
              />
              <span className="text-xs font-semibold text-red-600">
                Enable Website Maintenance Mode (Shows Maintenance Notice to Public)
              </span>
            </label>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3 bg-studio-charcoal hover:bg-studio-gold text-studio-ivory text-xs uppercase tracking-widest font-semibold rounded-sm transition-colors shadow-sm disabled:opacity-60 flex items-center gap-2"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 text-studio-gold" />}
            <span>Save All Studio Settings</span>
          </button>
        </div>

      </form>

      {/* 4. SECURITY & ADMIN PASSWORD CHANGE */}
      <div className="bg-studio-card p-6 sm:p-8 rounded-sm border border-studio-border shadow-soft space-y-5">
        <div className="border-b border-studio-border/60 pb-2 flex items-center gap-2">
          <Shield className="w-4 h-4 text-studio-gold" />
          <h2 className="font-serif text-lg font-bold text-studio-charcoal">
            Administrator Security Credentials
          </h2>
        </div>

        {passwordSuccess && (
          <div className="p-3.5 rounded-sm bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{passwordSuccess}</span>
          </div>
        )}

        {passwordError && (
          <div className="p-3.5 rounded-sm bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{passwordError}</span>
          </div>
        )}

        <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-xl">
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
              Current Password
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3.5 py-2 bg-studio-ivory border border-studio-border rounded-sm text-xs focus:outline-none focus:border-studio-gold"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
                New Password (Min 8 Chars)
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3.5 py-2 bg-studio-ivory border border-studio-border rounded-sm text-xs focus:outline-none focus:border-studio-gold"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3.5 py-2 bg-studio-ivory border border-studio-border rounded-sm text-xs focus:outline-none focus:border-studio-gold"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isUpdatingPassword}
            className="px-5 py-2.5 bg-studio-charcoal hover:bg-studio-gold text-studio-ivory text-xs uppercase tracking-wider font-semibold rounded-sm transition-colors flex items-center gap-2"
          >
            {isUpdatingPassword ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Lock className="w-3.5 h-3.5" />}
            <span>Update Admin Password</span>
          </button>
        </form>
      </div>

    </div>
  );
};
