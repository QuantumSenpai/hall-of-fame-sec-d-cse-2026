import React, { useState } from 'react';
import { Photo, Chapter } from '../types/index.ts';
import { adminAddPhoto, adminDeletePhoto } from '../lib/api.ts';
import { Plus, Trash2, Image, HardDrive } from 'lucide-react';

interface PhotosManagerProps {
  photos: Photo[];
  chapters: Chapter[];
  onRefresh: () => void;
}

export const PhotosManager: React.FC<PhotosManagerProps> = ({ photos, chapters, onRefresh }) => {
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [chapterId, setChapterId] = useState<number>(chapters[0]?.id || 1);
  const [layoutStyle, setLayoutStyle] = useState<'polaroid' | 'torn_edge' | 'vintage_frame' | 'full_bleed'>('polaroid');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) return;
    setIsSubmitting(true);
    await adminAddPhoto({
      title: title || 'Untitled Photo',
      caption,
      imageUrl,
      chapterId: Number(chapterId),
      layoutStyle,
    });
    setIsSubmitting(false);
    setTitle('');
    setCaption('');
    setImageUrl('');
    onRefresh();
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this photo?')) {
      await adminDeletePhoto(id);
      onRefresh();
    }
  };

  return (
    <div className="space-y-8">
      {/* Add Photo Form */}
      <form onSubmit={handleAdd} className="bg-[#1A1D1B] border border-[#B9905A]/40 p-6 rounded-lg space-y-4">
        <h3 className="font-serif text-lg font-bold text-[#EFE6CA] flex items-center space-x-2">
          <Plus className="w-5 h-5 text-[#B9905A]" />
          <span>Add New Photo (Google Drive / Direct URL Supported)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#B9905A] mb-1 font-semibold">
              Photo Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Cake Cutting Moment"
              className="w-full px-3 py-2 bg-[#292D2B] border border-[#B9905A]/40 rounded text-sm text-[#EFE6CA] focus:outline-none focus:border-[#B9905A]"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#B9905A] mb-1 font-semibold">
              Chapter Location
            </label>
            <select
              value={chapterId}
              onChange={(e) => setChapterId(Number(e.target.value))}
              className="w-full px-3 py-2 bg-[#292D2B] border border-[#B9905A]/40 rounded text-sm text-[#EFE6CA] focus:outline-none focus:border-[#B9905A]"
            >
              {chapters.map((ch) => (
                <option key={ch.id} value={ch.id}>
                  Ch 0{ch.chapterNumber}: {ch.title}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs uppercase tracking-wider text-[#B9905A] mb-1 font-semibold">
              Image URL / Google Drive Share Link *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://drive.google.com/file/d/... OR https://images.unsplash.com/..."
                className="w-full pl-9 pr-3 py-2 bg-[#292D2B] border border-[#B9905A]/40 rounded text-sm text-[#EFE6CA] focus:outline-none focus:border-[#B9905A]"
              />
              <HardDrive className="w-4 h-4 text-[#B9905A] absolute left-3 top-2.5" />
            </div>
            <p className="text-[11px] text-[#44636A] mt-1">
              Google Drive links are automatically converted to direct stream URLs.
            </p>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#B9905A] mb-1 font-semibold">
              Caption
            </label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="e.g. Captured at 11 AM"
              className="w-full px-3 py-2 bg-[#292D2B] border border-[#B9905A]/40 rounded text-sm text-[#EFE6CA] focus:outline-none focus:border-[#B9905A]"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#B9905A] mb-1 font-semibold">
              Presentation Frame Style
            </label>
            <select
              value={layoutStyle}
              onChange={(e) => setLayoutStyle(e.target.value as any)}
              className="w-full px-3 py-2 bg-[#292D2B] border border-[#B9905A]/40 rounded text-sm text-[#EFE6CA] focus:outline-none focus:border-[#B9905A]"
            >
              <option value="polaroid">Polaroid Frame</option>
              <option value="torn_edge">Torn Paper Edge</option>
              <option value="vintage_frame">Vintage Wooden Frame</option>
              <option value="full_bleed">Full Bleed</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-[#B9905A] text-[#1A1D1B] font-bold text-xs uppercase tracking-wider rounded hover:bg-[#D4AF77] transition-colors"
        >
          {isSubmitting ? 'Adding...' : 'Save & Publish Photo'}
        </button>
      </form>

      {/* Existing Photo List Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="bg-[#1A1D1B] border border-[#B9905A]/30 p-3 rounded-lg flex space-x-3 items-center"
          >
            <img
              src={photo.imageUrl}
              alt={photo.title}
              className="w-16 h-16 object-cover rounded bg-charcoal flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-serif text-sm font-bold text-[#EFE6CA] truncate">
                {photo.title}
              </h4>
              <p className="text-[11px] text-[#44636A] truncate">
                Style: {photo.layoutStyle}
              </p>
            </div>
            <button
              onClick={() => handleDelete(photo.id)}
              className="p-2 text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
