import React, { useState, useEffect } from 'react';
import { Service } from '../../types';
import { adminApi } from '../../api/client';
import { useContent } from '../../context/ContentContext';
import { Plus, Edit, Trash2, Eye, EyeOff, Loader2, X, Upload } from 'lucide-react';

export const ServicesManager: React.FC = () => {
  const { refreshContent } = useContent();
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [startingPrice, setStartingPrice] = useState('120');
  const [availableSizes, setAvailableSizes] = useState<string[]>(['A4', 'A3']);
  const [estimatedTime, setEstimatedTime] = useState('3 - 5 Business Days');
  const [isActive, setIsActive] = useState(true);
  const [imageUrl, setImageUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const allPossibleSizes = ['A5', 'A4', 'A3', 'A2', 'Custom Size'];

  const fetchServices = async () => {
    try {
      setIsLoading(true);
      const data = await adminApi.getServices();
      setServices(data);
    } catch (err) {
      console.error('Error fetching services:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openCreateModal = () => {
    setEditingService(null);
    setTitle('');
    setSlug('');
    setDescription('');
    setStartingPrice('120');
    setAvailableSizes(['A4', 'A3']);
    setEstimatedTime('3 - 5 Business Days');
    setIsActive(true);
    setImageUrl('');
    setSelectedFile(null);
    setFilePreview(null);
    setIsModalOpen(true);
  };

  const openEditModal = (service: Service) => {
    setEditingService(service);
    setTitle(service.title);
    setSlug(service.slug);
    setDescription(service.description);
    setStartingPrice(String(service.startingPrice));
    try {
      setAvailableSizes(JSON.parse(service.availableSizes));
    } catch {
      setAvailableSizes(['A4', 'A3']);
    }
    setEstimatedTime(service.estimatedTime);
    setIsActive(service.isActive);
    setImageUrl(service.imageUrl);
    setSelectedFile(null);
    setFilePreview(null);
    setIsModalOpen(true);
  };

  const toggleSize = (size: string) => {
    if (availableSizes.includes(size)) {
      setAvailableSizes(availableSizes.filter((s) => s !== size));
    } else {
      setAvailableSizes([...availableSizes, size]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);

      const formData = new FormData();
      formData.append('title', title);
      formData.append('slug', slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
      formData.append('description', description);
      formData.append('startingPrice', startingPrice);
      formData.append('availableSizes', JSON.stringify(availableSizes));
      formData.append('estimatedTime', estimatedTime);
      formData.append('isActive', String(isActive));

      if (selectedFile) {
        formData.append('imageFile', selectedFile);
      } else if (imageUrl) {
        formData.append('imageUrl', imageUrl);
      }

      if (editingService) {
        await adminApi.updateService(editingService.id, formData);
      } else {
        await adminApi.createService(formData);
      }

      setIsModalOpen(false);
      await fetchServices();
      await refreshContent();
    } catch (err: any) {
      alert(err.message || 'Failed to save service.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this commission service?')) return;
    try {
      await adminApi.deleteService(id);
      await fetchServices();
      await refreshContent();
    } catch (err: any) {
      alert(err.message || 'Failed to delete service.');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-studio-card p-6 rounded-sm border border-studio-border shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-studio-charcoal">
            Commission Services Management
          </h1>
          <p className="text-xs text-studio-taupe">
            Configure offered portrait types, starting base rates, available paper dimensions, and production turnaround times.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-studio-charcoal hover:bg-studio-gold text-studio-ivory text-xs uppercase tracking-wider font-semibold rounded-sm transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4 text-studio-gold" />
          <span>Add Commission Service</span>
        </button>
      </div>

      {/* Services List */}
      {isLoading ? (
        <div className="py-20 text-center text-studio-taupe flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-studio-gold mb-2" />
          <span className="text-xs">Loading services...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            let sizes: string[] = [];
            try {
              sizes = JSON.parse(service.availableSizes);
            } catch {
              sizes = [];
            }

            return (
              <div
                key={service.id}
                className={`bg-studio-card rounded-sm border overflow-hidden shadow-soft flex flex-col justify-between transition-all ${
                  !service.isActive ? 'opacity-60 border-dashed border-stone-400' : 'border-studio-border'
                }`}
              >
                <div>
                  <div className="aspect-[4/3] bg-studio-beige relative overflow-hidden">
                    <img
                      src={service.imageUrl}
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2.5 right-2.5 bg-studio-charcoal/80 text-white text-xs px-2.5 py-1 rounded font-bold">
                      From ${service.startingPrice.toFixed(0)}
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif text-base font-bold text-studio-charcoal">
                        {service.title}
                      </h3>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase ${
                          service.isActive
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {service.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <p className="text-xs text-studio-taupe line-clamp-2 leading-relaxed">
                      {service.description}
                    </p>

                    <div className="text-[11px] text-studio-taupe pt-2 border-t border-studio-border/60 space-y-1">
                      <div>
                        <strong>Sizes: </strong>
                        {sizes.join(', ')}
                      </div>
                      <div>
                        <strong>Turnaround: </strong>
                        {service.estimatedTime}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-3 border-t border-studio-border/60 bg-studio-ivory/50 flex items-center justify-between">
                  <button
                    onClick={() => openEditModal(service)}
                    className="inline-flex items-center gap-1 text-xs text-studio-charcoal hover:text-studio-gold font-semibold"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit Service</span>
                  </button>

                  <button
                    onClick={() => handleDelete(service.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="Delete service"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-studio-card text-studio-charcoal max-w-xl w-full rounded-sm border border-studio-border shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between border-b border-studio-border pb-3">
              <h2 className="font-serif text-xl font-bold text-studio-charcoal">
                {editingService ? 'Edit Commission Service' : 'Add New Commission Service'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-studio-taupe hover:text-studio-charcoal">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
                  Service Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Single Portrait Sketch"
                  className="w-full px-3.5 py-2 bg-studio-ivory border border-studio-border rounded-sm text-xs focus:outline-none focus:border-studio-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
                    Starting Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={startingPrice}
                    onChange={(e) => setStartingPrice(e.target.value)}
                    className="w-full px-3.5 py-2 bg-studio-ivory border border-studio-border rounded-sm text-xs focus:outline-none focus:border-studio-gold font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
                    Est. Turnaround
                  </label>
                  <input
                    type="text"
                    value={estimatedTime}
                    onChange={(e) => setEstimatedTime(e.target.value)}
                    placeholder="3 - 5 Business Days"
                    className="w-full px-3.5 py-2 bg-studio-ivory border border-studio-border rounded-sm text-xs focus:outline-none focus:border-studio-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1">
                  Service Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed description of the medium, style, and heirloom quality..."
                  className="w-full px-3.5 py-2 bg-studio-ivory border border-studio-border rounded-sm text-xs focus:outline-none focus:border-studio-gold"
                />
              </div>

              {/* Supported Sizes */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-1.5">
                  Available Formats &amp; Sizes
                </label>
                <div className="flex flex-wrap gap-2">
                  {allPossibleSizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => toggleSize(size)}
                      className={`px-3 py-1 text-xs rounded border transition-all ${
                        availableSizes.includes(size)
                          ? 'bg-studio-charcoal text-white border-studio-charcoal font-semibold'
                          : 'bg-studio-ivory text-studio-taupe border-studio-border hover:border-studio-charcoal'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Image Input */}
              <div className="space-y-2 pt-2 border-t border-studio-border/60">
                <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal">
                  Service Showcase Image
                </label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://... (or choose local file below)"
                  className="w-full px-3.5 py-2 bg-studio-ivory border border-studio-border rounded-sm text-xs focus:outline-none focus:border-studio-gold"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setSelectedFile(e.target.files[0]);
                      setFilePreview(URL.createObjectURL(e.target.files[0]));
                    }
                  }}
                  className="text-xs text-studio-taupe"
                />
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
                    Active / Display on Public Website
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
                  <span>{editingService ? 'Save Changes' : 'Create Service'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
