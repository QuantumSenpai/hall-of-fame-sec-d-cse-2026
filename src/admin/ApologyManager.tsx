import React, { useState, useEffect } from 'react';
import { ApologyContent } from '../types/index.ts';
import { fetchApology, updateApology } from '../lib/api.ts';
import { Heart, Save, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';

interface ApologyManagerProps {
  onRefresh: () => void;
}

export const ApologyManager: React.FC<ApologyManagerProps> = ({ onRefresh }) => {
  const [formData, setFormData] = useState<ApologyContent>({
    label: '',
    title: '',
    paragraphs: [],
    signature: '',
    subSignature: '',
  });

  const [paragraphsText, setParagraphsText] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const apology = await fetchApology();
    if (apology) {
      setFormData(apology);
      setParagraphsText(Array.isArray(apology.paragraphs) ? apology.paragraphs.join('\n\n') : '');
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

    const parsedParagraphs = paragraphsText
      .split('\n\n')
      .map((p) => p.trim())
      .filter(Boolean);

    try {
      const res = await updateApology({
        ...formData,
        paragraphs: parsedParagraphs,
      });

      if (res.success) {
        setMessage({ type: 'success', text: 'Thank You & Apology section updated successfully!' });
        onRefresh();
      } else {
        setMessage({ type: 'error', text: res.error || 'Failed to update content.' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'An error occurred while saving.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-[#C9A05C]">
        <RefreshCw className="w-6 h-6 animate-spin mr-3" />
        <span className="font-serif">Loading apology content...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#C9A05C]/20 pb-5">
        <div>
          <div className="inline-flex items-center space-x-2 text-[#C9A05C] text-xs font-semibold uppercase tracking-widest mb-1">
            <Heart className="w-3.5 h-3.5 text-[#5C1F2E]" />
            <span>Final Section</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#F5EFE1]">Thank You & Apology CMS</h2>
          <p className="text-xs text-[#F5EFE1]/60 mt-1">
            Manage the sincere closing note, humble apology, and class signatures.
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
        <div className="bg-[#16130E] border border-[#C9A05C]/20 rounded-xl p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#F5EFE1]/80 mb-1.5">
              Section Eyebrow Label
            </label>
            <input
              type="text"
              name="label"
              value={formData.label}
              onChange={handleChange}
              placeholder="e.g. ONE LAST PAGE"
              className="w-full bg-[#0D0B08] border border-[#C9A05C]/30 rounded-lg px-3.5 py-2.5 text-sm text-[#F5EFE1] placeholder-[#F5EFE1]/30 focus:outline-none focus:border-[#C9A05C]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#F5EFE1]/80 mb-1.5">
              Section Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. From Our Hearts"
              className="w-full bg-[#0D0B08] border border-[#C9A05C]/30 rounded-lg px-3.5 py-2.5 text-sm font-serif text-[#F5EFE1] placeholder-[#F5EFE1]/30 focus:outline-none focus:border-[#C9A05C]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#F5EFE1]/80 mb-1.5">
              Paragraphs (Separate paragraphs with double newlines)
            </label>
            <textarea
              rows={6}
              value={paragraphsText}
              onChange={(e) => setParagraphsText(e.target.value)}
              placeholder="Paragraph 1...&#10;&#10;Paragraph 2..."
              className="w-full bg-[#0D0B08] border border-[#C9A05C]/30 rounded-lg px-3.5 py-2.5 text-sm text-[#F5EFE1] placeholder-[#F5EFE1]/30 focus:outline-none focus:border-[#C9A05C] leading-relaxed"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-[#F5EFE1]/80 mb-1.5">
                Signature Title
              </label>
              <input
                type="text"
                name="signature"
                value={formData.signature}
                onChange={handleChange}
                placeholder="e.g. TEACHERS' DAY 2026"
                className="w-full bg-[#0D0B08] border border-[#C9A05C]/30 rounded-lg px-3.5 py-2 text-sm text-[#F5EFE1] focus:outline-none focus:border-[#C9A05C]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#F5EFE1]/80 mb-1.5">
                Sub-Signature / Dedication
              </label>
              <input
                type="text"
                name="subSignature"
                value={formData.subSignature}
                onChange={handleChange}
                placeholder="e.g. Made with love by CSE Sec-D Students"
                className="w-full bg-[#0D0B08] border border-[#C9A05C]/30 rounded-lg px-3.5 py-2 text-sm text-[#F5EFE1] italic focus:outline-none focus:border-[#C9A05C]"
                required
              />
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
                <span>Save Apology Section</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
