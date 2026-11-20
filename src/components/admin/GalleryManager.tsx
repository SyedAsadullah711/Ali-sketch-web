import React, { useState, useEffect } from 'react';
import { GalleryImage, GalleryCategory } from '../../types';
import { adminApi } from '../../api/client';
import { useContent } from '../../context/ContentContext';
import {
  Upload,
  Plus,
  Trash2,
  Edit,
  Sparkles,
  Eye,
  EyeOff,
  Check,
  X,
  Loader2,
  Tag,
} from 'lucide-react';

export const GalleryManager: React.FC = () => {
  const { refreshContent } = useContent();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Upload/Create Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<number>(1);
  const [imageUrl, setImageUrl] = useState('');
  const [beforeImageUrl, setBeforeImageUrl] = useState('');
  const [tags, setTags] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Category Add
  const [newCatName, setNewCatName] = useState('');
  const [isAddingCat, setIsAddingCat] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [imgs, cats] = await Promise.all([
        adminApi.getGallery(),
        adminApi.getCategories(),
      ]);
      setImages(imgs);
      setCategories(cats);
      if (cats.length > 0 && !categoryId) {
        setCategoryId(cats[0].id);
      }
    } catch (err) {
      console.error('Error fetching gallery:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateModal = () => {
    setEditingImage(null);
    setTitle('');
    setDescription('');
    setImageUrl('');
    setBeforeImageUrl('');
    setTags('');
    setIsFeatured(false);
    setIsActive(true);
    setSelectedFile(null);
    setFilePreview(null);
    if (categories.length > 0) setCategoryId(categories[0].id);
    setIsModalOpen(true);
  };

  const openEditModal = (img: GalleryImage) => {
    setEditingImage(img);
    setTitle(img.title);
    setDescription(img.description);
    setCategoryId(img.categoryId);
    setImageUrl(img.imageUrl);
    setBeforeImageUrl(img.beforeImageUrl || '');
    setTags(img.tags || '');
    setIsFeatured(img.isFeatured);
    setIsActive(img.isActive);
    setSelectedFile(null);
    setFilePreview(null);
    setIsModalOpen(true);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setFilePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);

      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('categoryId', String(categoryId));
      formData.append('beforeImageUrl', beforeImageUrl);
      formData.append('tags', tags);
      formData.append('isFeatured', String(isFeatured));
      formData.append('isActive', String(isActive));

      if (selectedFile) {
        formData.append('imageFile', selectedFile);
      } else if (imageUrl) {
        formData.append('imageUrl', imageUrl);
      } else if (!editingImage) {
        alert('Please choose an image file or provide an image URL.');
        setIsSaving(false);
        return;
      }

      if (editingImage) {
        await adminApi.updateArtwork(editingImage.id, formData);
      } else {
        await adminApi.createArtwork(formData);
      }

      setIsModalOpen(false);
      await fetchData();
      await refreshContent();
    } catch (err: any) {
      alert(err.message || 'Failed to save artwork.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to remove this artwork from the gallery?')) return;
    try {
      await adminApi.deleteArtwork(id);
      await fetchData();
      await refreshContent();
    } catch (err: any) {
      alert(err.message || 'Failed to delete artwork.');
    }
  };

  const handleToggleActive = async (img: GalleryImage) => {
    try {
      await adminApi.updateArtwork(img.id, { isActive: !img.isActive });
      setImages((prev) =>
        prev.map((i) => (i.id === img.id ? { ...i, isActive: !i.isActive } : i))
      );
      await refreshContent();
    } catch (err) {
      alert('Failed to update artwork status.');
    }
  };

  const handleToggleFeatured = async (img: GalleryImage) => {
    try {
      await adminApi.updateArtwork(img.id, { isFeatured: !img.isFeatured });
      setImages((prev) =>
        prev.map((i) => (i.id === img.id ? { ...i, isFeatured: !i.isFeatured } : i))
      );
      await refreshContent();
    } catch (err) {
      alert('Failed to update featured flag.');
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    try {
      setIsAddingCat(true);
      await adminApi.createCategory({ name: newCatName.trim() });
      setNewCatName('');
      await fetchData();
      await refreshContent();
    } catch (err: any) {
      alert(err.message || 'Failed to add category.');
    } finally {
      setIsAddingCat(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="bg-studio-card p-6 rounded-sm border border-studio-border shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-studio-charcoal">
            Artwork &amp; Gallery Management
          </h1>
          <p className="text-xs text-studio-taupe">
            Upload new pencil sketches, categorize studies, configure before/after photographs, and set featured works.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-studio-charcoal hover:bg-studio-gold text-studio-ivory text-xs uppercase tracking-wider font-semibold rounded-sm transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4 text-studio-gold" />
          <span>Upload New Artwork</span>
        </button>
      </div>

      {/* Category Creation Pill Strip */}
      <div className="bg-studio-card p-4 rounded-sm border border-studio-border shadow-soft flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-studio-charcoal uppercase tracking-wider">
            Categories ({categories.length}):
          </span>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((c) => (
              <span
                key={c.id}
                className="bg-studio-beige text-studio-charcoal px-2.5 py-1 rounded text-xs"
              >
                {c.name} {c._count?.images !== undefined ? `(${c._count.images})` : ''}
              </span>
            ))}
          </div>
        </div>

        <form onSubmit={handleCreateCategory} className="flex items-center gap-2">
          <input
            type="text"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            placeholder="Add new category..."
            className="px-3 py-1.5 bg-studio-ivory border border-studio-border rounded-sm text-xs focus:outline-none focus:border-studio-gold"
          />
          <button
            type="submit"
            disabled={isAddingCat || !newCatName.trim()}
            className="px-3 py-1.5 bg-studio-charcoal text-studio-ivory hover:bg-studio-gold text-xs font-semibold rounded-sm transition-colors disabled:opacity-50"
          >
            {isAddingCat ? 'Adding...' : 'Add'}
          </button>
        </form>
      </div>

      {/* Artworks Grid */}
      {isLoading ? (
        <div className="py-20 text-center text-studio-taupe flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-studio-gold mb-2" />
          <span className="text-xs">Loading artwork gallery...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {images.map((img) => (
            <div
              key={img.id}
              className={`bg-studio-card rounded-sm border overflow-hidden shadow-soft flex flex-col justify-between transition-all ${
                !img.isActive ? 'opacity-60 border-dashed border-stone-400' : 'border-studio-border'
              }`}
            >
              <div>
                {/* Artwork Thumbnail */}
                <div className="aspect-[4/5] bg-studio-beige relative overflow-hidden group">
                  <img
                    src={img.imageUrl}
                    alt={img.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleToggleFeatured(img)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-colors ${
                        img.isFeatured
                          ? 'bg-amber-400 text-stone-900 shadow-sm'
                          : 'bg-black/50 text-white/80 hover:bg-black/70'
                      }`}
                      title="Click to toggle featured badge"
                    >
                      <Sparkles className="w-3 h-3 text-studio-gold" />
                      <span>{img.isFeatured ? 'Featured' : 'Standard'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleActive(img)}
                      className={`p-1 rounded text-[10px] ${
                        img.isActive ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                      }`}
                      title={img.isActive ? 'Active (Click to Hide)' : 'Hidden (Click to Publish)'}
                    >
                      {img.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {img.beforeImageUrl && (
                    <div className="absolute bottom-2 left-2 bg-black/70 text-studio-gold text-[9px] px-1.5 py-0.5 rounded">
                      Before/After Linked
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-4 space-y-1.5">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-studio-gold block">
                    {img.category?.name || 'Artwork'}
                  </span>
                  <h3 className="font-serif text-sm font-bold text-studio-charcoal truncate">
                    {img.title}
                  </h3>
                  <p className="text-[11px] text-studio-taupe line-clamp-2 leading-relaxed">
                    {img.description || 'No description provided.'}
                  </p>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="p-3 border-t border-studio-border/60 bg-studio-ivory/50 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => openEditModal(img)}
                  className="inline-flex items-center gap-1 text-xs text-studio-charcoal hover:text-studio-gold font-semibold"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(img.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                  title="Delete artwork"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-studio-card text-studio-charcoal max-w-2xl w-full rounded-sm border border-studio-border shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between border-b border-studio-border pb-3">
              <h2 className="font-serif text-xl font-bold text-studio-charcoal">
                {editingImage ? 'Edit Artwork Details' : 'Upload New Artwork to Gallery'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-studio-taupe hover:text-studio-charcoal">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
                  Artwork Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Lillian in Contemplation"
                  className="w-full px-3.5 py-2 bg-studio-ivory border border-studio-border rounded-sm text-xs focus:outline-none focus:border-studio-gold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
                    Gallery Category
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(parseInt(e.target.value, 10))}
                    className="w-full px-3.5 py-2 bg-studio-ivory border border-studio-border rounded-sm text-xs focus:outline-none focus:border-studio-gold"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
                    Tags (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="graphite, portrait, female, realism"
                    className="w-full px-3.5 py-2 bg-studio-ivory border border-studio-border rounded-sm text-xs focus:outline-none focus:border-studio-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
                  Description &amp; Medium Notes
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Tonal graphite study emphasizing subtle facial shadows..."
                  className="w-full px-3.5 py-2 bg-studio-ivory border border-studio-border rounded-sm text-xs focus:outline-none focus:border-studio-gold"
                />
              </div>

              {/* Upload image File or image URL */}
              <div className="space-y-3 pt-1 border-t border-studio-border/60">
                <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal">
                  Artwork Image File or URL
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <label className="border border-dashed border-studio-border hover:border-studio-gold p-4 text-center rounded cursor-pointer bg-studio-ivory flex flex-col items-center justify-center">
                    <Upload className="w-6 h-6 text-studio-gold mb-1" />
                    <span className="text-xs font-semibold text-studio-charcoal">Choose Local File</span>
                    <span className="text-[10px] text-studio-taupe">PNG, JPG, WEBP</span>
                    <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                  </label>

                  <div>
                    <span className="text-[11px] text-studio-taupe block mb-1">Or paste direct image URL:</span>
                    <input
                      type="text"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3.5 py-2 bg-studio-ivory border border-studio-border rounded-sm text-xs focus:outline-none focus:border-studio-gold"
                    />
                  </div>
                </div>

                {(filePreview || imageUrl) && (
                  <div className="w-24 aspect-square rounded border border-studio-border overflow-hidden bg-studio-beige mt-2">
                    <img src={filePreview || imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Before/After Reference Photo URL */}
              <div className="pt-2">
                <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
                  Optional Original Reference Photo (Enables Before/After Toggle in Lightbox)
                </label>
                <input
                  type="text"
                  value={beforeImageUrl}
                  onChange={(e) => setBeforeImageUrl(e.target.value)}
                  placeholder="https://... (client photo URL)"
                  className="w-full px-3.5 py-2 bg-studio-ivory border border-studio-border rounded-sm text-xs focus:outline-none focus:border-studio-gold"
                />
              </div>

              {/* Flags */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 text-studio-gold rounded border-studio-border"
                  />
                  <span className="text-xs font-semibold text-studio-charcoal">Mark as Featured Artwork</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 text-studio-gold rounded border-studio-border"
                  />
                  <span className="text-xs font-semibold text-studio-charcoal">Visible on Public Gallery</span>
                </label>
              </div>

              {/* Submit Buttons */}
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
                  <span>{editingImage ? 'Save Updates' : 'Publish to Gallery'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
