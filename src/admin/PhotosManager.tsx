import React, { useState } from 'react';
import { Photo } from '../types/index.ts';
import { adminAddPhoto, adminUpdatePhoto, adminDeletePhoto } from '../lib/api.ts';
import { Plus, Trash2, Edit3, Image, Star, Check, X, RefreshCw, AlertCircle } from 'lucide-react';

const CATEGORIES = [
  'OUR STORY',
  'TEACHERS',
  'GREAT MOMENTS',
  'STUDENTS',
  'ACTIVITIES',
  'GIFTS',
  'CANDID',
  'MEMORIES',
  'BEHIND THE SCENES',
];

interface PhotosManagerProps {
  photos: Photo[];
  onRefresh: () => void;
}

export const PhotosManager: React.FC<PhotosManagerProps> = ({ photos, onRefresh }) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState('MEMORIES');
  const [imageUrl, setImageUrl] = useState('');
  const [isFeatured, setIsFeatured] = useState(true);
  const [displayOrder, setDisplayOrder] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setCaption('');
    setCategory('MEMORIES');
    setImageUrl('');
    setIsFeatured(true);
    setDisplayOrder(photos.length + 1);
    setError(null);
  };

  const startEdit = (photo: Photo) => {
    setEditingId(photo.id);
    setTitle(photo.title);
    setCaption(photo.caption || '');
    setCategory(photo.category || 'MEMORIES');
    setImageUrl(photo.imageUrl);
    setIsFeatured(photo.isFeatured);
    setDisplayOrder(photo.displayOrder || 1);
    setError(null);
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) {
      setError('Image URL is required.');
      return;
    }
    setIsSubmitting(true);
    setError(null);

    const payload = {
      title: title || 'A Frozen Moment',
      caption,
      imageUrl,
      category,
      isFeatured,
      displayOrder: Number(displayOrder),
    };

    try {
      if (editingId) {
        const res = await adminUpdatePhoto(editingId, payload);
        if (res.success) {
          resetForm();
          onRefresh();
        } else {
          setError(res.error || 'Failed to update photo.');
        }
      } else {
        const res = await adminAddPhoto(payload);
        if (res.success) {
          resetForm();
          onRefresh();
        } else {
          setError(res.error || 'Failed to add photo.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number, photoTitle: string) => {
    if (confirm(`Are you sure you want to remove "${photoTitle}"?`)) {
      try {
        const res = await adminDeletePhoto(id);
        if (res.success) {
          onRefresh();
        } else {
          alert(res.error || 'Failed to delete photo.');
        }
      } catch (err: any) {
        alert(err.message || 'An error occurred.');
      }
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="border-b border-[#C9A05C]/20 pb-5">
        <div className="inline-flex items-center space-x-2 text-[#C9A05C] text-xs font-semibold uppercase tracking-widest mb-1">
          <Image className="w-3.5 h-3.5" />
          <span>Bento Grid Collection</span>
        </div>
        <h2 className="font-serif text-2xl font-bold text-[#F5EFE1]">Photos Gallery CMS</h2>
        <p className="text-xs text-[#F5EFE1]/60 mt-1">
          Manage photos displayed in the high-contrast Bento Grid. Each photo has a short label and italic one-line description.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl flex items-center space-x-3 text-sm bg-rose-950/40 border border-rose-500/30 text-rose-300">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Add/Edit Photo Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-[#16130E] border border-[#C9A05C]/25 p-6 rounded-xl space-y-5 shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-[#C9A05C]/20 pb-3">
          <h3 className="font-serif text-base font-bold text-[#F5EFE1] flex items-center space-x-2">
            {editingId ? (
              <>
                <Edit3 className="w-4 h-4 text-[#C9A05C]" />
                <span>Edit Photo #{editingId}</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 text-[#C9A05C]" />
                <span>Add New Photo to Bento Gallery</span>
              </>
            )}
          </h3>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="text-xs text-[#C9A05C] hover:text-[#F5EFE1] flex items-center space-x-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Cancel Edit</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#C9A05C] mb-1 font-semibold">
              Short Label / Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. A Frozen Moment"
              className="w-full px-3.5 py-2.5 bg-[#0D0B08] border border-[#C9A05C]/30 rounded-lg text-sm text-[#F5EFE1] placeholder:text-[#F5EFE1]/30 focus:outline-none focus:border-[#C9A05C] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#C9A05C] mb-1 font-semibold">
              Category Filter
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#0D0B08] border border-[#C9A05C]/30 rounded-lg text-sm text-[#F5EFE1] focus:outline-none focus:border-[#C9A05C] transition-colors"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs uppercase tracking-wider text-[#C9A05C] mb-1 font-semibold">
              Image URL * (Google Drive link or direct image link)
            </label>
            <input
              type="text"
              required
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://drive.google.com/file/d/... OR https://images.unsplash.com/..."
              className="w-full px-3.5 py-2.5 bg-[#0D0B08] border border-[#C9A05C]/30 rounded-lg text-sm text-[#F5EFE1] placeholder:text-[#F5EFE1]/30 focus:outline-none focus:border-[#C9A05C] transition-colors font-mono text-xs"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs uppercase tracking-wider text-[#C9A05C] mb-1 font-semibold">
              Short Description (Italic in public lightbox / card)
            </label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="e.g. Early morning floral foyer before the arrival of our mentors."
              className="w-full px-3.5 py-2.5 bg-[#0D0B08] border border-[#C9A05C]/30 rounded-lg text-sm text-[#F5EFE1] placeholder:text-[#F5EFE1]/30 focus:outline-none focus:border-[#C9A05C] transition-colors italic"
            />
          </div>
        </div>

        <div className="flex items-center space-x-6 pt-2">
          <label className="flex items-center space-x-2 text-xs text-[#F5EFE1] cursor-pointer">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="rounded accent-[#C9A05C] w-4 h-4"
            />
            <span>Featured in Bento Grid (Large Cell)</span>
          </label>
        </div>

        <div className="flex justify-end space-x-3 pt-2">
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 rounded-lg border border-[#C9A05C]/30 text-xs text-[#F5EFE1]/80 hover:bg-[#1E1B15]"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center space-x-2 px-6 py-2.5 bg-[#C9A05C] hover:bg-[#D4AF6A] text-[#0D0B08] font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow-md disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Saving Photo...</span>
              </>
            ) : (
              <>
                {editingId ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                <span>{editingId ? 'Update Photo' : 'Add Photo'}</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Existing Photos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="bg-[#16130E] border border-[#C9A05C]/20 rounded-xl overflow-hidden group hover:border-[#C9A05C]/50 transition-colors flex flex-col justify-between"
          >
            <div className="aspect-[4/3] bg-black relative overflow-hidden">
              <img
                src={photo.imageUrl}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => ((e.target as HTMLElement).style.display = 'none')}
              />
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[10px] uppercase font-bold text-[#C9A05C] tracking-wider">
                {photo.category || 'MEMORIES'}
              </div>
              {photo.isFeatured && (
                <div className="absolute top-2 right-2 p-1 rounded-full bg-[#C9A05C] text-[#0D0B08]">
                  <Star className="w-3 h-3 fill-current" />
                </div>
              )}
            </div>

            <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
              <div>
                <h4 className="font-serif font-bold text-sm text-[#F5EFE1] truncate">
                  {photo.title}
                </h4>
                {photo.caption && (
                  <p className="text-xs text-[#F5EFE1]/70 italic truncate mt-0.5">
                    {photo.caption}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#C9A05C]/10 text-xs text-[#F5EFE1]/60">
                <span>{photo.likes || 0} likes</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => startEdit(photo)}
                    className="p-1.5 rounded hover:bg-[#C9A05C]/20 text-[#C9A05C] transition-colors"
                    title="Edit Photo"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(photo.id, photo.title)}
                    className="p-1.5 rounded hover:bg-rose-950/40 text-rose-400 transition-colors"
                    title="Delete Photo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
