import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/client';
import { Upload, Copy, Check, Trash2, Loader2, Image as ImageIcon } from 'lucide-react';

interface MediaItem {
  id: number;
  filename: string;
  originalName: string;
  mimeType: string;
  fileSize: number;
  fileUrl: string;
  altText?: string;
  folder: string;
  createdAt: string;
}

export const MediaManager: React.FC = () => {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const fetchMedia = async () => {
    try {
      setIsLoading(true);
      const data = await adminApi.getMedia();
      setMedia(data);
    } catch (err) {
      console.error('Error fetching media:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    try {
      setIsUploading(true);
      const formData = new FormData();
      Array.from(e.target.files).forEach((file) => {
        formData.append('files', file);
      });

      await adminApi.uploadMedia(formData);
      await fetchMedia();
    } catch (err: any) {
      alert(err.message || 'Upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCopy = (item: MediaItem) => {
    navigator.clipboard.writeText(item.fileUrl);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this media file?')) return;
    try {
      await adminApi.deleteMedia(id);
      await fetchMedia();
    } catch (err: any) {
      alert(err.message || 'Failed to delete media item.');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-studio-card p-6 rounded-sm border border-studio-border shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-studio-charcoal">
            Central Media Library
          </h1>
          <p className="text-xs text-studio-taupe">
            Upload studio photography, pencil artwork scans, and copy permanent URLs for website content.
          </p>
        </div>

        <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-studio-charcoal hover:bg-studio-gold text-studio-ivory text-xs uppercase tracking-wider font-semibold rounded-sm transition-colors shadow-sm cursor-pointer">
          {isUploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Upload className="w-4 h-4 text-studio-gold" />
          )}
          <span>{isUploading ? 'Uploading...' : 'Upload Media Files'}</span>
          <input
            type="file"
            multiple
            accept="image/*"
            disabled={isUploading}
            onChange={handleUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Media Grid */}
      {isLoading ? (
        <div className="py-20 text-center text-studio-taupe flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-studio-gold mb-2" />
          <span className="text-xs">Loading media assets...</span>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {media.map((item) => (
            <div
              key={item.id}
              className="bg-studio-card rounded-sm border border-studio-border overflow-hidden shadow-soft flex flex-col justify-between group"
            >
              <div className="aspect-square bg-studio-beige relative overflow-hidden">
                <img
                  src={item.fileUrl}
                  alt={item.originalName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>

              <div className="p-2.5 bg-studio-card space-y-1">
                <div className="text-[11px] font-semibold text-studio-charcoal truncate" title={item.originalName}>
                  {item.originalName}
                </div>
                <div className="text-[10px] text-studio-taupe flex items-center justify-between">
                  <span>{(item.fileSize / 1024).toFixed(0)} KB</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleCopy(item)}
                      className="p-1 hover:text-studio-gold text-studio-taupe"
                      title="Copy URL"
                    >
                      {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1 hover:text-red-600 text-studio-taupe"
                      title="Delete file"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {media.length === 0 && (
            <div className="col-span-full py-16 text-center text-studio-taupe bg-studio-card rounded border border-studio-border">
              <ImageIcon className="w-8 h-8 mx-auto text-studio-taupe/40 mb-2" />
              <p className="text-xs">No media files uploaded to the central library yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
