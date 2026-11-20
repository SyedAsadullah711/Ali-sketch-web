import React, { useState, useEffect } from 'react';
import { ServicePricing } from '../../types';
import { adminApi } from '../../api/client';
import { useContent } from '../../context/ContentContext';
import { Plus, Edit, Trash2, Check, X, Loader2, DollarSign } from 'lucide-react';

export const PricingRulesManager: React.FC = () => {
  const { refreshContent } = useContent();
  const [pricingRules, setPricingRules] = useState<ServicePricing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<ServicePricing | null>(null);

  // Form states
  const [paperSize, setPaperSize] = useState('A4');
  const [dimensions, setDimensions] = useState('');
  const [basePrice, setBasePrice] = useState('160');
  const [maxDefaultSubjects, setMaxDefaultSubjects] = useState('1');
  const [extraSubjectPrice, setExtraSubjectPrice] = useState('40');
  const [framingPrice, setFramingPrice] = useState('45');
  const [giftPackagingPrice, setGiftPackagingPrice] = useState('15');
  const [estimatedDays, setEstimatedDays] = useState('4 - 6 Days');
  const [isActive, setIsActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchPricing = async () => {
    try {
      setIsLoading(true);
      const data = await adminApi.getPricing();
      setPricingRules(data);
    } catch (err) {
      console.error('Error fetching pricing:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPricing();
  }, []);

  const openCreateModal = () => {
    setEditingRule(null);
    setPaperSize('A4');
    setDimensions('8.3 x 11.7 in (210 x 297 mm)');
    setBasePrice('160');
    setMaxDefaultSubjects('1');
    setExtraSubjectPrice('40');
    setFramingPrice('45');
    setGiftPackagingPrice('15');
    setEstimatedDays('4 - 6 Days');
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (rule: ServicePricing) => {
    setEditingRule(rule);
    setPaperSize(rule.paperSize);
    setDimensions(rule.dimensions);
    setBasePrice(String(rule.basePrice));
    setMaxDefaultSubjects(String(rule.maxDefaultSubjects));
    setExtraSubjectPrice(String(rule.extraSubjectPrice));
    setFramingPrice(String(rule.framingPrice));
    setGiftPackagingPrice(String(rule.giftPackagingPrice));
    setEstimatedDays(rule.estimatedDays);
    setIsActive(rule.isActive);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const payload: Partial<ServicePricing> = {
        paperSize,
        dimensions,
        basePrice: parseFloat(basePrice) || 120,
        maxDefaultSubjects: parseInt(maxDefaultSubjects, 10) || 1,
        extraSubjectPrice: parseFloat(extraSubjectPrice) || 25,
        framingPrice: parseFloat(framingPrice) || 35,
        giftPackagingPrice: parseFloat(giftPackagingPrice) || 15,
        estimatedDays,
        isActive,
      };

      if (editingRule) {
        await adminApi.updatePricing(editingRule.id, payload);
      } else {
        await adminApi.createPricing(payload);
      }

      setIsModalOpen(false);
      await fetchPricing();
      await refreshContent();
    } catch (err: any) {
      alert(err.message || 'Failed to save pricing rule.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this pricing rule?')) return;
    try {
      await adminApi.deletePricing(id);
      await fetchPricing();
      await refreshContent();
    } catch (err: any) {
      alert(err.message || 'Failed to delete pricing rule.');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-studio-card p-6 rounded-sm border border-studio-border shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-studio-charcoal">
            Dynamic Pricing &amp; Size Rules
          </h1>
          <p className="text-xs text-studio-taupe">
            Manage base prices, additional subject fees, framing add-ons, and gift packaging charges. Frontend calculator updates dynamically.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-studio-charcoal hover:bg-studio-gold text-studio-ivory text-xs uppercase tracking-wider font-semibold rounded-sm transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4 text-studio-gold" />
          <span>Add Pricing Rule</span>
        </button>
      </div>

      {/* Rules Table */}
      <div className="bg-studio-card rounded-sm border border-studio-border shadow-soft overflow-hidden">
        {isLoading ? (
          <div className="py-16 text-center text-studio-taupe flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-studio-gold mb-2" />
            <span className="text-xs">Loading pricing rules...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-studio-ivory text-studio-taupe uppercase tracking-wider font-semibold border-b border-studio-border">
                <tr>
                  <th className="py-3 px-4">Size</th>
                  <th className="py-3 px-4">Dimensions</th>
                  <th className="py-3 px-4">Base Price</th>
                  <th className="py-3 px-4">Default Subjects</th>
                  <th className="py-3 px-4">Extra Subject</th>
                  <th className="py-3 px-4">Frame Add-on</th>
                  <th className="py-3 px-4">Turnaround</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-studio-border/50">
                {pricingRules.map((rule) => (
                  <tr key={rule.id} className="hover:bg-studio-ivory/80 transition-colors">
                    <td className="py-3.5 px-4 font-serif font-bold text-sm text-studio-charcoal">
                      {rule.paperSize}
                    </td>
                    <td className="py-3.5 px-4 text-studio-taupe">{rule.dimensions}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-studio-charcoal">
                      ${rule.basePrice.toFixed(0)}
                    </td>
                    <td className="py-3.5 px-4 text-studio-taupe">{rule.maxDefaultSubjects}</td>
                    <td className="py-3.5 px-4 font-mono text-studio-gold font-semibold">
                      +${rule.extraSubjectPrice.toFixed(0)}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-studio-taupe">
                      +${rule.framingPrice.toFixed(0)}
                    </td>
                    <td className="py-3.5 px-4 text-studio-taupe">{rule.estimatedDays}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          rule.isActive
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {rule.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(rule)}
                          className="p-1 text-studio-charcoal hover:text-studio-gold"
                          title="Edit rule"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(rule.id)}
                          className="p-1 text-red-500 hover:text-red-700"
                          title="Delete rule"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-studio-card text-studio-charcoal max-w-lg w-full rounded-sm border border-studio-border shadow-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-studio-border pb-3">
              <h2 className="font-serif text-xl font-bold text-studio-charcoal">
                {editingRule ? `Edit ${editingRule.paperSize} Pricing Rule` : 'Add New Pricing Rule'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-studio-taupe hover:text-studio-charcoal">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
                    Paper Format Size
                  </label>
                  <input
                    type="text"
                    required
                    value={paperSize}
                    onChange={(e) => setPaperSize(e.target.value)}
                    placeholder="e.g. A4"
                    className="w-full px-3.5 py-2 bg-studio-ivory border border-studio-border rounded-sm text-xs focus:outline-none focus:border-studio-gold"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
                    Starting Base Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                    className="w-full px-3.5 py-2 bg-studio-ivory border border-studio-border rounded-sm text-xs font-mono font-bold focus:outline-none focus:border-studio-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
                  Physical Dimensions Description
                </label>
                <input
                  type="text"
                  value={dimensions}
                  onChange={(e) => setDimensions(e.target.value)}
                  placeholder="8.3 x 11.7 in (210 x 297 mm)"
                  className="w-full px-3.5 py-2 bg-studio-ivory border border-studio-border rounded-sm text-xs focus:outline-none focus:border-studio-gold"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
                    Included Subjects
                  </label>
                  <input
                    type="number"
                    value={maxDefaultSubjects}
                    onChange={(e) => setMaxDefaultSubjects(e.target.value)}
                    className="w-full px-3 py-1.5 bg-studio-ivory border border-studio-border rounded-sm text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
                    Extra Subject ($)
                  </label>
                  <input
                    type="number"
                    value={extraSubjectPrice}
                    onChange={(e) => setExtraSubjectPrice(e.target.value)}
                    className="w-full px-3 py-1.5 bg-studio-ivory border border-studio-border rounded-sm text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
                    Frame Add-on ($)
                  </label>
                  <input
                    type="number"
                    value={framingPrice}
                    onChange={(e) => setFramingPrice(e.target.value)}
                    className="w-full px-3 py-1.5 bg-studio-ivory border border-studio-border rounded-sm text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
                    Gift Wrap Add-on ($)
                  </label>
                  <input
                    type="number"
                    value={giftPackagingPrice}
                    onChange={(e) => setGiftPackagingPrice(e.target.value)}
                    className="w-full px-3.5 py-2 bg-studio-ivory border border-studio-border rounded-sm text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
                    Est. Turnaround
                  </label>
                  <input
                    type="text"
                    value={estimatedDays}
                    onChange={(e) => setEstimatedDays(e.target.value)}
                    placeholder="4 - 6 Days"
                    className="w-full px-3.5 py-2 bg-studio-ivory border border-studio-border rounded-sm text-xs"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 text-studio-gold rounded border-studio-border"
                  />
                  <span className="text-xs font-semibold text-studio-charcoal">
                    Rule Active &amp; Available on Website
                  </span>
                </label>
              </div>

              <div className="pt-4 border-t border-studio-border flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-studio-border text-xs uppercase tracking-wider font-semibold rounded-sm hover:bg-studio-ivory"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 bg-studio-charcoal hover:bg-studio-gold text-studio-ivory text-xs uppercase tracking-wider font-semibold rounded-sm transition-colors flex items-center gap-2"
                >
                  {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingRule ? 'Save Rule' : 'Create Rule'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
