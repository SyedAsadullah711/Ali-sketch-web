import React, { useState, useEffect } from 'react';
import { Testimonial } from '../../types';
import { adminApi } from '../../api/client';
import { useContent } from '../../context/ContentContext';
import { Plus, Edit, Trash2, Star, Eye, EyeOff, Sparkles, X, Loader2 } from 'lucide-react';

export const ReviewsManager: React.FC = () => {
  const { refreshContent } = useContent();
  const [reviews, setReviews] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Testimonial | null>(null);

  // Form states
  const [customerName, setCustomerName] = useState('');
  const [location, setLocation] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState('5');
  const [sketchType, setSketchType] = useState('Portrait Sketch');
  const [dateString, setDateString] = useState('Recent Commission');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isDemo, setIsDemo] = useState(true);
  const [customerImageUrl, setCustomerImageUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const data = await adminApi.getTestimonials();
      setReviews(data);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const openCreateModal = () => {
    setEditingReview(null);
    setCustomerName('');
    setLocation('New York, NY');
    setReviewText('');
    setRating('5');
    setSketchType('Single Portrait (A3)');
    setDateString('Recent Commission');
    setIsFeatured(false);
    setIsVisible(true);
    setIsDemo(false);
    setCustomerImageUrl('');
    setIsModalOpen(true);
  };

  const openEditModal = (rev: Testimonial) => {
    setEditingReview(rev);
    setCustomerName(rev.customerName);
    setLocation(rev.location);
    setReviewText(rev.reviewText);
    setRating(String(rev.rating));
    setSketchType(rev.sketchType);
    setDateString(rev.dateString);
    setIsFeatured(rev.isFeatured);
    setIsVisible(rev.isVisible);
    setIsDemo(rev.isDemo);
    setCustomerImageUrl(rev.customerImageUrl || '');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const payload: Partial<Testimonial> = {
        customerName,
        location,
        reviewText,
        rating: parseInt(rating, 10) || 5,
        sketchType,
        dateString,
        isFeatured,
        isVisible,
        isDemo,
        customerImageUrl,
      };

      if (editingReview) {
        await adminApi.updateTestimonial(editingReview.id, payload);
      } else {
        await adminApi.createTestimonial(payload);
      }

      setIsModalOpen(false);
      await fetchReviews();
      await refreshContent();
    } catch (err: any) {
      alert(err.message || 'Failed to save review.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      await adminApi.deleteTestimonial(id);
      await fetchReviews();
      await refreshContent();
    } catch (err: any) {
      alert(err.message || 'Failed to delete review.');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-studio-card p-6 rounded-sm border border-studio-border shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-studio-charcoal">
            Testimonials &amp; Client Reviews
          </h1>
          <p className="text-xs text-studio-taupe">
            Manage genuine client reviews, star ratings, visibility switches, and featured feedback.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-studio-charcoal hover:bg-studio-gold text-studio-ivory text-xs uppercase tracking-wider font-semibold rounded-sm transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4 text-studio-gold" />
          <span>Add Client Review</span>
        </button>
      </div>

      {/* Grid of Reviews */}
      {isLoading ? (
        <div className="py-20 text-center text-studio-taupe flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-studio-gold mb-2" />
          <span className="text-xs">Loading reviews...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className={`bg-studio-card p-6 rounded-sm border shadow-soft flex flex-col justify-between transition-all ${
                !rev.isVisible ? 'opacity-50 border-dashed border-stone-400' : 'border-studio-border'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'fill-stone-200 text-stone-200'
                        }`}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    {rev.isDemo && (
                      <span className="text-[9px] uppercase tracking-wider bg-studio-beige text-studio-taupe px-1.5 py-0.5 rounded font-medium">
                        Demo
                      </span>
                    )}
                    {rev.isFeatured && (
                      <span className="text-[9px] uppercase tracking-wider bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5 text-studio-gold" />
                        Featured
                      </span>
                    )}
                    <span
                      className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded font-semibold ${
                        rev.isVisible
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      {rev.isVisible ? 'Visible' : 'Hidden'}
                    </span>
                  </div>
                </div>

                <p className="font-serif italic text-sm text-studio-charcoal leading-relaxed">
                  &ldquo;{rev.reviewText}&rdquo;
                </p>

                <div className="text-xs text-studio-taupe pt-1">
                  <strong className="text-studio-charcoal">{rev.customerName}</strong> &bull; {rev.location} ({rev.sketchType})
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-studio-border/60 flex items-center justify-between">
                <span className="text-[10px] text-studio-taupe">{rev.dateString}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(rev)}
                    className="p-1 text-studio-charcoal hover:text-studio-gold"
                    title="Edit review"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(rev.id)}
                    className="p-1 text-red-500 hover:text-red-700"
                    title="Delete review"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-studio-card text-studio-charcoal max-w-lg w-full rounded-sm border border-studio-border shadow-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-studio-border pb-3">
              <h2 className="font-serif text-xl font-bold text-studio-charcoal">
                {editingReview ? 'Edit Review' : 'Add Client Review'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-studio-taupe hover:text-studio-charcoal">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
                    Customer Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Eleanor Vance"
                    className="w-full px-3.5 py-2 bg-studio-ivory border border-studio-border rounded-sm text-xs focus:outline-none focus:border-studio-gold"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
                    Location / City
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Boston, MA"
                    className="w-full px-3.5 py-2 bg-studio-ivory border border-studio-border rounded-sm text-xs focus:outline-none focus:border-studio-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
                  Review Text <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="The portrait was absolutely beautiful. Every little detail was captured perfectly..."
                  className="w-full px-3.5 py-2 bg-studio-ivory border border-studio-border rounded-sm text-xs font-serif italic focus:outline-none focus:border-studio-gold"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
                    Star Rating (1-5)
                  </label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full px-3 py-1.5 bg-studio-ivory border border-studio-border rounded-sm text-xs font-bold"
                  >
                    <option value="5">5 Stars (Masterpiece)</option>
                    <option value="4">4 Stars (Great)</option>
                    <option value="3">3 Stars (Good)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
                    Commission Type
                  </label>
                  <input
                    type="text"
                    value={sketchType}
                    onChange={(e) => setSketchType(e.target.value)}
                    placeholder="Single Portrait (A3)"
                    className="w-full px-3 py-1.5 bg-studio-ivory border border-studio-border rounded-sm text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
                    Commission Date
                  </label>
                  <input
                    type="text"
                    value={dateString}
                    onChange={(e) => setDateString(e.target.value)}
                    placeholder="October 2026"
                    className="w-full px-3 py-1.5 bg-studio-ivory border border-studio-border rounded-sm text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
                  Customer Avatar Image URL (Optional)
                </label>
                <input
                  type="text"
                  value={customerImageUrl}
                  onChange={(e) => setCustomerImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2 bg-studio-ivory border border-studio-border rounded-sm text-xs focus:outline-none focus:border-studio-gold"
                />
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 text-studio-gold rounded border-studio-border"
                  />
                  <span className="text-xs font-semibold text-studio-charcoal">Featured on Homepage</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isVisible}
                    onChange={(e) => setIsVisible(e.target.checked)}
                    className="w-4 h-4 text-studio-gold rounded border-studio-border"
                  />
                  <span className="text-xs font-semibold text-studio-charcoal">Publicly Visible</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isDemo}
                    onChange={(e) => setIsDemo(e.target.checked)}
                    className="w-4 h-4 text-studio-gold rounded border-studio-border"
                  />
                  <span className="text-xs font-semibold text-studio-taupe">Mark as Demo Content</span>
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
                  <span>{editingReview ? 'Save Updates' : 'Add Review'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
