import React, { useState } from 'react';
import { Video } from '../types/index.ts';
import { adminAddVideo, adminDeleteVideo } from '../lib/api.ts';
import { Plus, Trash2, Film, RefreshCw, AlertCircle, Play } from 'lucide-react';

interface VideosManagerProps {
  videos: Video[];
  onRefresh: () => void;
}

export const VideosManager: React.FC<VideosManagerProps> = ({ videos, onRefresh }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoInput, setVideoInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoInput.trim()) {
      setError('Please provide a YouTube URL or 11-character video ID.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await adminAddVideo({
        title: title || 'Celebration Short Video',
        description,
        youtubeUrl: videoInput.trim(),
      });

      if (res.success) {
        setTitle('');
        setDescription('');
        setVideoInput('');
        onRefresh();
      } else {
        setError(res.error || 'Failed to add video.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while adding video.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number, videoTitle: string) => {
    if (confirm(`Are you sure you want to remove "${videoTitle}"?`)) {
      try {
        const res = await adminDeleteVideo(id);
        if (res.success) {
          onRefresh();
        } else {
          alert(res.error || 'Failed to delete video.');
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
          <Film className="w-3.5 h-3.5" />
          <span>Shorts, Reels & Films</span>
        </div>
        <h2 className="font-serif text-2xl font-bold text-[#F5EFE1]">Edits & Moments CMS</h2>
        <p className="text-xs text-[#F5EFE1]/60 mt-1">
          Add video entries by pasting either a full YouTube link (watch, share, shorts) or a bare 11-character video ID.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl flex items-center space-x-3 text-sm bg-rose-950/40 border border-rose-500/30 text-rose-300">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Add Video Form */}
      <form
        onSubmit={handleAdd}
        className="bg-[#16130E] border border-[#C9A05C]/25 p-6 rounded-xl space-y-4 shadow-xl"
      >
        <h3 className="font-serif text-base font-bold text-[#F5EFE1] flex items-center space-x-2 border-b border-[#C9A05C]/20 pb-3">
          <Plus className="w-4 h-4 text-[#C9A05C]" />
          <span>Add New Edit or Video Moment</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#C9A05C] mb-1 font-semibold">
              Video Title / Short Label *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Official Celebration Highlight Reel"
              className="w-full px-3.5 py-2.5 bg-[#0D0B08] border border-[#C9A05C]/30 rounded-lg text-sm text-[#F5EFE1] placeholder:text-[#F5EFE1]/30 focus:outline-none focus:border-[#C9A05C] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#C9A05C] mb-1 font-semibold">
              YouTube Link OR Video ID *
            </label>
            <input
              type="text"
              required
              value={videoInput}
              onChange={(e) => setVideoInput(e.target.value)}
              placeholder="e.g. https://youtu.be/dQw4w9WgXcQ OR dQw4w9WgXcQ"
              className="w-full px-3.5 py-2.5 bg-[#0D0B08] border border-[#C9A05C]/30 rounded-lg text-sm text-[#F5EFE1] placeholder:text-[#F5EFE1]/30 focus:outline-none focus:border-[#C9A05C] transition-colors"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs uppercase tracking-wider text-[#C9A05C] mb-1 font-semibold">
              Short Description (Italic in public view)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. A cinematic tribute capturing the essence and emotion of Teachers' Day 2026."
              className="w-full px-3.5 py-2.5 bg-[#0D0B08] border border-[#C9A05C]/30 rounded-lg text-sm text-[#F5EFE1] placeholder:text-[#F5EFE1]/30 focus:outline-none focus:border-[#C9A05C] transition-colors italic"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center space-x-2 px-6 py-2.5 bg-[#C9A05C] hover:bg-[#D4AF6A] text-[#0D0B08] font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow-md disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Saving Video...</span>
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" />
              <span>Save & Embed Video</span>
            </>
          )}
        </button>
      </form>

      {/* Existing Video List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {videos.map((video) => (
          <div
            key={video.id}
            className="bg-[#16130E] border border-[#C9A05C]/20 p-4 rounded-xl flex space-x-3 items-center hover:border-[#C9A05C]/40 transition-all shadow-md group"
          >
            <div className="relative w-28 h-18 rounded-lg overflow-hidden bg-black flex-shrink-0 border border-[#C9A05C]/20">
              <img
                src={video.thumbnailUrl || `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                alt={video.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <Play className="w-5 h-5 text-[#C9A05C] fill-current" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-serif text-sm font-bold text-[#F5EFE1] truncate">
                {video.title}
              </h4>
              {video.description && (
                <p className="text-xs text-[#F5EFE1]/70 italic truncate mt-0.5">
                  {video.description}
                </p>
              )}
              <p className="text-[10px] text-[#C9A05C]/80 font-mono mt-1">
                ID: {video.youtubeId}
              </p>
            </div>

            <button
              onClick={() => handleDelete(video.id, video.title)}
              className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg transition-colors"
              title="Delete video"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
