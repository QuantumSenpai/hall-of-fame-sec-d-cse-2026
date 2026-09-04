import React, { useState } from 'react';
import { Chapter } from '../types/index.ts';
import { adminAddChapter, adminDeleteChapter } from '../lib/api.ts';
import { Plus, Trash2, BookOpen } from 'lucide-react';

interface ChaptersManagerProps {
  chapters: Chapter[];
  onRefresh: () => void;
}

export const ChaptersManager: React.FC<ChaptersManagerProps> = ({ chapters, onRefresh }) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [layoutType, setLayoutType] = useState<Chapter['layoutType']>('editorial');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    setIsSubmitting(true);
    await adminAddChapter({
      title,
      subtitle,
      description,
      chapterNumber: chapters.length + 1,
      layoutType,
    });
    setIsSubmitting(false);
    setTitle('');
    setSubtitle('');
    setDescription('');
    onRefresh();
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this chapter? Photos & videos inside will also be unassigned.')) {
      await adminDeleteChapter(id);
      onRefresh();
    }
  };

  return (
    <div className="space-y-8">
      {/* Add Chapter Form */}
      <form onSubmit={handleAdd} className="bg-[#16060b] border border-[rgba(201,164,99,0.25)] p-6 rounded-xl space-y-4 shadow-xl">
        <h3 className="font-serif text-lg font-bold text-[#f2e8d5] flex items-center space-x-2 border-b border-[rgba(201,164,99,0.2)] pb-3">
          <Plus className="w-5 h-5 text-[#c9a463]" />
          <span>Add New Story Chapter</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#c9a463] mb-1 font-semibold">
              Chapter Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. MOMENTS OF JOY"
              className="w-full px-3.5 py-2.5 bg-[#220a12] border border-[rgba(201,164,99,0.3)] rounded-lg text-sm text-[#f2e8d5] placeholder:text-[rgba(242,232,213,0.3)] focus:outline-none focus:border-[#c9a463] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#c9a463] mb-1 font-semibold">
              Layout Presentation Style
            </label>
            <select
              value={layoutType}
              onChange={(e) => setLayoutType(e.target.value as any)}
              className="w-full px-3.5 py-2.5 bg-[#220a12] border border-[rgba(201,164,99,0.3)] rounded-lg text-sm text-[#f2e8d5] focus:outline-none focus:border-[#c9a463] transition-colors"
            >
              <option value="editorial">Editorial Grid</option>
              <option value="polaroid_stack">Polaroid Stack</option>
              <option value="video_theater">Video Theater</option>
              <option value="torn_collage">Torn Edge Collage</option>
              <option value="film_strip">Vintage Film Strip</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs uppercase tracking-wider text-[#c9a463] mb-1 font-semibold">
              Subtitle
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="e.g. Laughter, cake cutting, and melodies..."
              className="w-full px-3.5 py-2.5 bg-[#220a12] border border-[rgba(201,164,99,0.3)] rounded-lg text-sm text-[#f2e8d5] placeholder:text-[rgba(242,232,213,0.3)] focus:outline-none focus:border-[#c9a463] transition-colors"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs uppercase tracking-wider text-[#c9a463] mb-1 font-semibold">
              Chapter Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Introductory paragraph describing the chapter story..."
              className="w-full px-3.5 py-2.5 bg-[#220a12] border border-[rgba(201,164,99,0.3)] rounded-lg text-sm text-[#f2e8d5] placeholder:text-[rgba(242,232,213,0.3)] focus:outline-none focus:border-[#c9a463] transition-colors"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-gradient-to-r from-[#c9a463] to-[#b88d48] text-[#0e0407] font-bold text-xs uppercase tracking-wider rounded-lg hover:brightness-110 transition-all shadow-[0_2px_12px_rgba(201,164,99,0.25)]"
        >
          {isSubmitting ? 'Creating...' : 'Create Chapter'}
        </button>
      </form>

      {/* Chapters List */}
      <div className="space-y-3">
        {chapters.map((ch) => (
          <div
            key={ch.id}
            className="bg-[#16060b] border border-[rgba(201,164,99,0.22)] p-4 rounded-xl flex justify-between items-center hover:border-[rgba(201,164,99,0.45)] transition-all shadow-md"
          >
            <div className="flex items-center space-x-3">
              <span className="w-8 h-8 rounded-full border border-[#c9a463] text-[#c9a463] bg-[#220912] font-serif text-xs flex items-center justify-center font-bold">
                0{ch.chapterNumber}
              </span>
              <div>
                <h4 className="font-serif text-base font-bold text-[#f2e8d5]">
                  {ch.title}
                </h4>
                <p className="text-xs text-[rgba(201,164,99,0.7)] font-sans">
                  Layout: {ch.layoutType} • Subtitle: {ch.subtitle || 'None'}
                </p>
              </div>
            </div>
            <button
              onClick={() => handleDelete(ch.id)}
              className="p-2 text-red-400 hover:text-red-300 hover:bg-[#320f18] rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
