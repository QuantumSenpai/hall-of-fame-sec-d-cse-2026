import React, { useState } from 'react';
import { Video, Chapter } from '../types/index.ts';
import { adminAddVideo, adminDeleteVideo } from '../lib/api.ts';
import { Plus, Trash2, Youtube } from 'lucide-react';

interface VideosManagerProps {
  videos: Video[];
  chapters: Chapter[];
  onRefresh: () => void;
}

export const VideosManager: React.FC<VideosManagerProps> = ({ videos, chapters, onRefresh }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [chapterId, setChapterId] = useState<number>(chapters[0]?.id || 1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!youtubeUrl) return;
    setIsSubmitting(true);
    await adminAddVideo({
      title: title || 'YouTube Highlight Video',
      description,
      youtubeUrl,
      chapterId: Number(chapterId),
    });
    setIsSubmitting(false);
    setTitle('');
    setDescription('');
    setYoutubeUrl('');
    onRefresh();
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this video?')) {
      await adminDeleteVideo(id);
      onRefresh();
    }
  };

  return (
    <div className="space-y-8">
      {/* Add Video Form */}
      <form onSubmit={handleAdd} className="bg-[#1A1D1B] border border-[#B9905A]/40 p-6 rounded-lg space-y-4">
        <h3 className="font-serif text-lg font-bold text-[#EFE6CA] flex items-center space-x-2">
          <Plus className="w-5 h-5 text-[#B9905A]" />
          <span>Add YouTube Video (Supports Watch URLs, Embeds & Shorts)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#B9905A] mb-1 font-semibold">
              Video Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Surprise Dance Reel"
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
              YouTube Video URL *
            </label>
            <div className="relative">
              <input
                type="url"
                required
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=... OR https://youtube.com/shorts/..."
                className="w-full pl-9 pr-3 py-2 bg-[#292D2B] border border-[#B9905A]/40 rounded text-sm text-[#EFE6CA] focus:outline-none focus:border-[#B9905A]"
              />
              <Youtube className="w-4 h-4 text-red-500 absolute left-3 top-2.5" />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs uppercase tracking-wider text-[#B9905A] mb-1 font-semibold">
              Short Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. 3-minute highlight performance..."
              className="w-full px-3 py-2 bg-[#292D2B] border border-[#B9905A]/40 rounded text-sm text-[#EFE6CA] focus:outline-none focus:border-[#B9905A]"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-[#B9905A] text-[#1A1D1B] font-bold text-xs uppercase tracking-wider rounded hover:bg-[#D4AF77] transition-colors"
        >
          {isSubmitting ? 'Adding...' : 'Save & Embed Video'}
        </button>
      </form>

      {/* Existing Video List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {videos.map((video) => (
          <div
            key={video.id}
            className="bg-[#1A1D1B] border border-[#B9905A]/30 p-3 rounded-lg flex space-x-3 items-center"
          >
            <img
              src={video.thumbnailUrl || `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
              alt={video.title}
              className="w-24 h-16 object-cover rounded bg-charcoal flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-serif text-sm font-bold text-[#EFE6CA] truncate">
                {video.title}
              </h4>
              <p className="text-[11px] text-[#44636A] truncate">
                ID: {video.youtubeId}
              </p>
            </div>
            <button
              onClick={() => handleDelete(video.id)}
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
