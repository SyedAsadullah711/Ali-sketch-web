import React, { useState, useEffect } from 'react';
import { FAQ } from '../../types';
import { adminApi } from '../../api/client';
import { useContent } from '../../context/ContentContext';
import { Plus, Edit, Trash2, Eye, EyeOff, Loader2, X } from 'lucide-react';

export const FaqManager: React.FC = () => {
  const { refreshContent } = useContent();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);

  // Form states
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('General');
  const [isVisible, setIsVisible] = useState(true);
  const [displayOrder, setDisplayOrder] = useState('0');
  const [isSaving, setIsSaving] = useState(false);

  const fetchFaqs = async () => {
    try {
      setIsLoading(true);
      const data = await adminApi.getFaqs();
      setFaqs(data);
    } catch (err) {
      console.error('Error fetching FAQs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const openCreateModal = () => {
    setEditingFaq(null);
    setQuestion('');
    setAnswer('');
    setCategory('General');
    setIsVisible(true);
    setDisplayOrder(String(faqs.length + 1));
    setIsModalOpen(true);
  };

  const openEditModal = (faq: FAQ) => {
    setEditingFaq(faq);
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setCategory(faq.category);
    setIsVisible(faq.isVisible);
    setDisplayOrder(String(faq.displayOrder));
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const payload: Partial<FAQ> = {
        question,
        answer,
        category,
        isVisible,
        displayOrder: parseInt(displayOrder, 10) || 0,
      };

      if (editingFaq) {
        await adminApi.updateFaq(editingFaq.id, payload);
      } else {
        await adminApi.createFaq(payload);
      }

      setIsModalOpen(false);
      await fetchFaqs();
      await refreshContent();
    } catch (err: any) {
      alert(err.message || 'Failed to save FAQ.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;
    try {
      await adminApi.deleteFaq(id);
      await fetchFaqs();
      await refreshContent();
    } catch (err: any) {
      alert(err.message || 'Failed to delete FAQ.');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-studio-card p-6 rounded-sm border border-studio-border shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-studio-charcoal">
            FAQ Management
          </h1>
          <p className="text-xs text-studio-taupe">
            Manage answers to common questions about commission processes, photograph requirements, framing, and shipping.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-studio-charcoal hover:bg-studio-gold text-studio-ivory text-xs uppercase tracking-wider font-semibold rounded-sm transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4 text-studio-gold" />
          <span>Add New FAQ</span>
        </button>
      </div>

      {/* FAQs List */}
      <div className="bg-studio-card rounded-sm border border-studio-border shadow-soft overflow-hidden">
        {isLoading ? (
          <div className="py-16 text-center text-studio-taupe flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-studio-gold mb-2" />
            <span className="text-xs">Loading FAQs...</span>
          </div>
        ) : (
          <div className="divide-y divide-studio-border/50">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className={`p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 hover:bg-studio-ivory/60 transition-colors ${
                  !faq.isVisible ? 'opacity-50' : ''
                }`}
              >
                <div className="space-y-1.5 flex-1 pr-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-wider font-semibold bg-studio-beige text-studio-taupe px-2 py-0.5 rounded">
                      {faq.category}
                    </span>
                    <span
                      className={`text-[9px] uppercase font-semibold px-1.5 py-0.5 rounded ${
                        faq.isVisible ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      {faq.isVisible ? 'Visible' : 'Hidden'}
                    </span>
                  </div>

                  <h3 className="font-serif text-base font-bold text-studio-charcoal">
                    {faq.question}
                  </h3>

                  <p className="text-xs text-studio-taupe leading-relaxed">
                    {faq.answer}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => openEditModal(faq)}
                    className="p-1.5 text-studio-charcoal hover:text-studio-gold"
                    title="Edit FAQ"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(faq.id)}
                    className="p-1.5 text-red-500 hover:text-red-700"
                    title="Delete FAQ"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-studio-card text-studio-charcoal max-w-lg w-full rounded-sm border border-studio-border shadow-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-studio-border pb-3">
              <h2 className="font-serif text-xl font-bold text-studio-charcoal">
                {editingFaq ? 'Edit FAQ' : 'Add FAQ'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-studio-taupe hover:text-studio-charcoal">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
                  Question <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="e.g. How long does a sketch take?"
                  className="w-full px-3.5 py-2 bg-studio-ivory border border-studio-border rounded-sm text-xs focus:outline-none focus:border-studio-gold"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
                  Answer <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Detailed answer for clients..."
                  className="w-full px-3.5 py-2 bg-studio-ivory border border-studio-border rounded-sm text-xs focus:outline-none focus:border-studio-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
                    Category Tag
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="General / Ordering / Shipping"
                    className="w-full px-3.5 py-2 bg-studio-ivory border border-studio-border rounded-sm text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(e.target.value)}
                    className="w-full px-3.5 py-2 bg-studio-ivory border border-studio-border rounded-sm text-xs font-mono"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isVisible}
                    onChange={(e) => setIsVisible(e.target.checked)}
                    className="w-4 h-4 text-studio-gold rounded border-studio-border"
                  />
                  <span className="text-xs font-semibold text-studio-charcoal">
                    Visible in FAQ Accordion on Public Website
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
                  <span>{editingFaq ? 'Save FAQ' : 'Create FAQ'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
