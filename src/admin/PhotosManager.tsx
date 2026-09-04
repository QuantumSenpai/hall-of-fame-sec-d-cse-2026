import React, { useState } from 'react';
import { Photo, Chapter } from '../types/index.ts';
import { adminAddPhoto, adminUpdatePhoto, adminDeletePhoto } from '../lib/api.ts';
import { Plus, Trash2, Edit3, Image, HardDrive, Star, Check, X } from 'lucide-react';

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
  chapters: Chapter[];
  onRefresh: () => void;
}

export const PhotosManager: React.FC<PhotosManagerProps> = ({ photos, chapters, onRefresh }) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('MEMORIES');
  const [date, setDate] = useState('September 4, 2026');
  const [location, setLocation] = useState('College Auditorium');
  const [imageUrl, setImageUrl] = useState('');
  const [chapterId, setChapterId] = useState<number>(chapters[0]?.id || 1);
  const [layoutStyle, setLayoutStyle] = useState<'polaroid' | 'torn_edge' | 'vintage_frame' | 'full_bleed'>('vintage_frame');
  const [isFeatured, setIsFeatured] = useState(true);
  const [displayOrder, setDisplayOrder] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setCaption('');
    setDescription('');
    setCategory('MEMORIES');
    setDate('September 4, 2026');
    setLocation('College Auditorium');
    setImageUrl('');
    setChapterId(chapters[0]?.id || 1);
    setLayoutStyle('vintage_frame');
    setIsFeatured(true);
    setDisplayOrder(photos.length + 1);
  };

  const startEdit = (photo: Photo) => {
    setEditingId(photo.id);
    setTitle(photo.title);
    setCaption(photo.caption || '');
    setDescription(photo.description || '');
    setCategory(photo.category || 'MEMORIES');
    setDate(photo.date || 'September 4, 2026');
    setLocation(photo.location || '');
    setImageUrl(photo.imageUrl);
    setChapterId(photo.chapterId || chapters[0]?.id || 1);
    setLayoutStyle((photo.layoutStyle as any) || 'vintage_frame');
    setIsFeatured(photo.isFeatured);
    setDisplayOrder(photo.displayOrder || 1);
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) return;
    setIsSubmitting(true);

    const payload = {
      title: title || 'Untitled Memory',
      caption,
      description,
      imageUrl,
      category,
      date,
      location,
      chapterId: Number(chapterId),
      layoutStyle,
      isFeatured,
      displayOrder: Number(displayOrder),
    };

    if (editingId) {
      await adminUpdatePhoto(editingId, payload);
    } else {
      await adminAddPhoto(payload);
    }

    setIsSubmitting(false);
    resetForm();
    onRefresh();
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this photo memory?')) {
      await adminDeletePhoto(id);
      if (editingId === id) resetForm();
      onRefresh();
    }
  };

  return (
    <div className="space-y-8">
      {/* Add / Edit Photo Form */}
      <form onSubmit={handleSubmit} className="bg-[#16060b] border border-[rgba(201,164,99,0.25)] p-6 rounded-xl space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-[rgba(201,164,99,0.2)] pb-3">
          <h3 className="font-serif text-lg font-bold text-[#f2e8d5] flex items-center space-x-2">
            {editingId ? (
              <>
                <Edit3 className="w-5 h-5 text-[#e2c27e]" />
                <span>Edit Photo Memory #{editingId}</span>
              </>
            ) : (
              <>
                <Plus className="w-5 h-5 text-[#c9a463]" />
                <span>Add New 3D Gallery Memory (Google Drive / Unsplash / Direct URL)</span>
              </>
            )}
          </h3>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="text-xs text-[rgba(201,164,99,0.7)] hover:text-[#e2c27e] flex items-center space-x-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Cancel Edit</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#c9a463] mb-1 font-semibold">
              Photo Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Standing Ovation & Warm Hugs"
              className="w-full px-3.5 py-2.5 bg-[#220a12] border border-[rgba(201,164,99,0.3)] rounded-lg text-sm text-[#f2e8d5] placeholder:text-[rgba(242,232,213,0.3)] focus:outline-none focus:border-[#c9a463] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#c9a463] mb-1 font-semibold">
              Gallery Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#220a12] border border-[rgba(201,164,99,0.3)] rounded-lg text-sm text-[#f2e8d5] focus:outline-none focus:border-[#c9a463] transition-colors"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#c9a463] mb-1 font-semibold">
              Book Chapter Location
            </label>
            <select
              value={chapterId}
              onChange={(e) => setChapterId(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-[#220a12] border border-[rgba(201,164,99,0.3)] rounded-lg text-sm text-[#f2e8d5] focus:outline-none focus:border-[#c9a463] transition-colors"
            >
              {chapters.map((ch) => (
                <option key={ch.id} value={ch.id}>
                  Ch 0{ch.chapterNumber}: {ch.title}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2 lg:col-span-3">
            <label className="block text-xs uppercase tracking-wider text-[#c9a463] mb-1 font-semibold">
              Image URL / Google Drive Share Link *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://drive.google.com/file/d/... OR https://images.unsplash.com/..."
                className="w-full pl-10 pr-3.5 py-2.5 bg-[#220a12] border border-[rgba(201,164,99,0.3)] rounded-lg text-sm text-[#f2e8d5] placeholder:text-[rgba(242,232,213,0.3)] focus:outline-none focus:border-[#c9a463] transition-colors"
              />
              <HardDrive className="w-4 h-4 text-[#c9a463] absolute left-3.5 top-3" />
            </div>
            <p className="text-[11px] text-[rgba(201,164,99,0.7)] mt-1">
              Supports direct URLs and public Google Drive view/share links.
            </p>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#c9a463] mb-1 font-semibold">
              Short Caption
            </label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="e.g. “An afternoon we'll never forget.”"
              className="w-full px-3.5 py-2.5 bg-[#220a12] border border-[rgba(201,164,99,0.3)] rounded-lg text-sm text-[#f2e8d5] placeholder:text-[rgba(242,232,213,0.3)] focus:outline-none focus:border-[#c9a463] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#c9a463] mb-1 font-semibold">
              Date / Timestamp
            </label>
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="e.g. September 4, 2026 • 05:00 PM"
              className="w-full px-3.5 py-2.5 bg-[#220a12] border border-[rgba(201,164,99,0.3)] rounded-lg text-sm text-[#f2e8d5] placeholder:text-[rgba(242,232,213,0.3)] focus:outline-none focus:border-[#c9a463] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#c9a463] mb-1 font-semibold">
              Location / Hall
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Main Auditorium, Block C"
              className="w-full px-3.5 py-2.5 bg-[#220a12] border border-[rgba(201,164,99,0.3)] rounded-lg text-sm text-[#f2e8d5] placeholder:text-[rgba(242,232,213,0.3)] focus:outline-none focus:border-[#c9a463] transition-colors"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs uppercase tracking-wider text-[#c9a463] mb-1 font-semibold">
              Detailed Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Four years of CSE Section-D coming together in gratitude and lifelong brotherhood."
              className="w-full px-3.5 py-2.5 bg-[#220a12] border border-[rgba(201,164,99,0.3)] rounded-lg text-sm text-[#f2e8d5] placeholder:text-[rgba(242,232,213,0.3)] focus:outline-none focus:border-[#c9a463] transition-colors"
            />
          </div>

          <div className="flex items-center space-x-6 pt-2 sm:col-span-2 lg:col-span-3">
            <label className="flex items-center space-x-2 text-sm text-[#f2e8d5] cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="rounded border-[rgba(201,164,99,0.4)] text-[#c9a463] focus:ring-0 bg-[#220a12]"
              />
              <span className="flex items-center space-x-1">
                <Star className="w-3.5 h-3.5 text-[#c9a463]" />
                <span>Featured in Primary 3D Carousel</span>
              </span>
            </label>
          </div>
        </div>

        <div className="flex items-center space-x-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-gradient-to-r from-[#c9a463] to-[#b88d48] text-[#0e0407] font-bold text-xs uppercase tracking-wider rounded-lg hover:brightness-110 transition-all shadow-[0_2px_12px_rgba(201,164,99,0.25)] flex items-center space-x-2"
          >
            <Check className="w-4 h-4" />
            <span>{isSubmitting ? 'Saving...' : editingId ? 'Update Photo' : 'Save & Publish Photo'}</span>
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2.5 bg-[#220a12] border border-[rgba(201,164,99,0.3)] text-[#f2e8d5] text-xs uppercase tracking-wider rounded-lg hover:bg-[#320f18] transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Existing Photo List Grid */}
      <div>
        <h4 className="font-serif text-base font-bold text-[#c9a463] mb-3">
          Manage Photos ({photos.length} Live Items)
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className={`bg-[#16060b] border ${
                editingId === photo.id ? 'border-[#e2c27e] shadow-[0_0_15px_rgba(201,164,99,0.3)]' : 'border-[rgba(201,164,99,0.22)]'
              } p-3 rounded-xl flex space-x-3 items-center hover:border-[rgba(201,164,99,0.45)] transition-all shadow-md`}
            >
              <img
                src={photo.imageUrl}
                alt={photo.title}
                className="w-16 h-16 object-cover rounded-lg bg-[#220912] flex-shrink-0 border border-[rgba(201,164,99,0.2)]"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-serif text-sm font-bold text-[#f2e8d5] truncate">
                  {photo.title}
                </h4>
                <div className="flex items-center space-x-2 text-[10px] text-[rgba(201,164,99,0.8)] mt-0.5">
                  <span className="px-1.5 py-0.5 rounded bg-[rgba(201,164,99,0.12)] font-semibold uppercase">
                    {photo.category || 'MEMORIES'}
                  </span>
                  {photo.likes ? <span>♥ {photo.likes}</span> : null}
                </div>
                {photo.caption && (
                  <p className="text-[11px] text-[rgba(242,232,213,0.5)] truncate mt-0.5 italic">
                    "{photo.caption}"
                  </p>
                )}
              </div>
              <div className="flex flex-col space-y-1">
                <button
                  onClick={() => startEdit(photo)}
                  className="p-1.5 text-[#c9a463] hover:text-[#e2c27e] hover:bg-[#2a0e18] rounded-lg transition-colors"
                  title="Edit Photo"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(photo.id)}
                  className="p-1.5 text-red-400 hover:text-red-300 hover:bg-[#320f18] rounded-lg transition-colors"
                  title="Delete Photo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
