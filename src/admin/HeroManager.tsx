import React, { useState, useEffect } from 'react';
import { HeroContent } from '../types/index.ts';
import { fetchHero, updateHero } from '../lib/api.ts';
import { Sparkles, Save, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';

interface HeroManagerProps {
  onRefresh: () => void;
}

export const HeroManager: React.FC<HeroManagerProps> = ({ onRefresh }) => {
  const [formData, setFormData] = useState<HeroContent>({
    badgeText: '',
    titleLine1: '',
    titleLine2: '',
    titleLine3: '',
    subtitle: '',
    bookImage: '',
    bookCaption: '',
    quoteHeading: '',
    quoteSubtext: '',
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const hero = await fetchHero();
    if (hero) {
      setFormData(hero);
    }
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await updateHero(formData);
      if (res.success) {
        setMessage({ type: 'success', text: 'Hero content updated and committed successfully!' });
        onRefresh();
      } else {
        setMessage({ type: 'error', text: res.error || 'Failed to update hero content.' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'An error occurred while updating hero.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-[#C9A05C]">
        <RefreshCw className="w-6 h-6 animate-spin mr-3" />
        <span className="font-serif">Loading hero configuration...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#C9A05C]/20 pb-5">
        <div>
          <div className="inline-flex items-center space-x-2 text-[#C9A05C] text-xs font-semibold uppercase tracking-widest mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Top of Page</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#F5EFE1]">Hero Section CMS</h2>
          <p className="text-xs text-[#F5EFE1]/60 mt-1">
            Customize typography, badge pill, open-book illustration image, and reflective quotes.
          </p>
        </div>
        <button
          type="button"
          onClick={loadData}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-[#C9A05C]/30 text-xs text-[#C9A05C] hover:bg-[#1E1B15] transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reload</span>
        </button>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl flex items-start space-x-3 text-sm ${
            message.type === 'success'
              ? 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-300'
              : 'bg-rose-950/40 border border-rose-500/30 text-rose-300'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Badge & Subtitle */}
        <div className="bg-[#16130E] border border-[#C9A05C]/20 rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#C9A05C]">Badge & Description</h3>

          <div>
            <label className="block text-xs font-semibold text-[#F5EFE1]/80 mb-1.5">
              Badge Label Text
            </label>
            <input
              type="text"
              name="badgeText"
              value={formData.badgeText}
              onChange={handleChange}
              placeholder="e.g. Dedicated to Our Mentors • CSE Sec-D 2026"
              className="w-full bg-[#0D0B08] border border-[#C9A05C]/30 rounded-lg px-3.5 py-2.5 text-sm text-[#F5EFE1] placeholder-[#F5EFE1]/30 focus:outline-none focus:border-[#C9A05C]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#F5EFE1]/80 mb-1.5">
              Hero Subtitle / Description
            </label>
            <textarea
              name="subtitle"
              rows={3}
              value={formData.subtitle}
              onChange={handleChange}
              placeholder="Descriptive sentence below the main 3-line title..."
              className="w-full bg-[#0D0B08] border border-[#C9A05C]/30 rounded-lg px-3.5 py-2.5 text-sm text-[#F5EFE1] placeholder-[#F5EFE1]/30 focus:outline-none focus:border-[#C9A05C]"
              required
            />
          </div>
        </div>

        {/* 3-Line Heading */}
        <div className="bg-[#16130E] border border-[#C9A05C]/20 rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#C9A05C]">
            Hero Title Lines (3D Kinetic Letter Swap)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#F5EFE1]/80 mb-1.5">
                Line 1 (Top)
              </label>
              <input
                type="text"
                name="titleLine1"
                value={formData.titleLine1}
                onChange={handleChange}
                placeholder="TEACHERS' DAY"
                className="w-full bg-[#0D0B08] border border-[#C9A05C]/30 rounded-lg px-3.5 py-2 text-sm text-[#F5EFE1] focus:outline-none focus:border-[#C9A05C]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#F5EFE1]/80 mb-1.5">
                Line 2 (Middle)
              </label>
              <input
                type="text"
                name="titleLine2"
                value={formData.titleLine2}
                onChange={handleChange}
                placeholder="2026 DIGITAL"
                className="w-full bg-[#0D0B08] border border-[#C9A05C]/30 rounded-lg px-3.5 py-2 text-sm text-[#F5EFE1] focus:outline-none focus:border-[#C9A05C]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#F5EFE1]/80 mb-1.5">
                Line 3 (Bottom)
              </label>
              <input
                type="text"
                name="titleLine3"
                value={formData.titleLine3}
                onChange={handleChange}
                placeholder="MEMORY BOOK"
                className="w-full bg-[#0D0B08] border border-[#C9A05C]/30 rounded-lg px-3.5 py-2 text-sm text-[#F5EFE1] focus:outline-none focus:border-[#C9A05C]"
                required
              />
            </div>
          </div>
        </div>

        {/* Book Illustration Content */}
        <div className="bg-[#16130E] border border-[#C9A05C]/20 rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#C9A05C]">
            Open Book Illustration Content
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Page */}
            <div className="space-y-4">
              <span className="text-xs font-bold text-[#C9A05C]/90 uppercase">Left Page (Nature/Calm Image)</span>
              <div>
                <label className="block text-xs font-semibold text-[#F5EFE1]/80 mb-1.5">
                  Book Image URL (Unsplash or GDrive)
                </label>
                <input
                  type="text"
                  name="bookImage"
                  value={formData.bookImage}
                  onChange={handleChange}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full bg-[#0D0B08] border border-[#C9A05C]/30 rounded-lg px-3.5 py-2 text-sm text-[#F5EFE1] focus:outline-none focus:border-[#C9A05C]"
                  required
                />
              </div>

              {formData.bookImage && (
                <div className="relative aspect-video rounded-lg overflow-hidden border border-[#C9A05C]/30 bg-black/40">
                  <img
                    src={formData.bookImage}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => ((e.target as HTMLElement).style.display = 'none')}
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#F5EFE1]/80 mb-1.5">
                  Left Page Caption
                </label>
                <input
                  type="text"
                  name="bookCaption"
                  value={formData.bookCaption}
                  onChange={handleChange}
                  placeholder="e.g. A moment of stillness & infinite gratitude"
                  className="w-full bg-[#0D0B08] border border-[#C9A05C]/30 rounded-lg px-3.5 py-2 text-sm text-[#F5EFE1] focus:outline-none focus:border-[#C9A05C]"
                />
              </div>
            </div>

            {/* Right Page */}
            <div className="space-y-4">
              <span className="text-xs font-bold text-[#C9A05C]/90 uppercase">Right Page (Poetic Inscription)</span>
              <div>
                <label className="block text-xs font-semibold text-[#F5EFE1]/80 mb-1.5">
                  Quote Heading
                </label>
                <textarea
                  name="quoteHeading"
                  rows={2}
                  value={formData.quoteHeading}
                  onChange={handleChange}
                  placeholder="Good Teachers&#10;Brighter Futures"
                  className="w-full bg-[#0D0B08] border border-[#C9A05C]/30 rounded-lg px-3.5 py-2 text-sm text-[#F5EFE1] font-serif focus:outline-none focus:border-[#C9A05C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#F5EFE1]/80 mb-1.5">
                  Quote Subtext / Dedication
                </label>
                <input
                  type="text"
                  name="quoteSubtext"
                  value={formData.quoteSubtext}
                  onChange={handleChange}
                  placeholder="More than teachers, A family forever."
                  className="w-full bg-[#0D0B08] border border-[#C9A05C]/30 rounded-lg px-3.5 py-2 text-sm text-[#F5EFE1] italic focus:outline-none focus:border-[#C9A05C]"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-[#C9A05C] hover:bg-[#D4AF6A] text-[#0D0B08] font-bold text-sm tracking-wide shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
          >
            {saving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Committing Changes...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Hero Configuration</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
