import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Heart, CheckCircle2 } from 'lucide-react';
import { submitMemory } from '../lib/api.ts';

interface MemorySubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MemorySubmissionModal: React.FC<MemorySubmissionModalProps> = ({ isOpen, onClose }) => {
  const [authorName, setAuthorName] = useState('');
  const [authorRole, setAuthorRole] = useState('Student, Sec-D CSE');
  const [message, setMessage] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('gratitude');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !message.trim()) {
      setError('Please fill in your name and memory message.');
      return;
    }

    if (imageUrl.includes('photos.app.goo.gl') || imageUrl.includes('photos.google.com/share')) {
      setError('Google Photos share links cannot be hotlinked. Please use a direct Google Drive link or image URL.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const res = await submitMemory({
        authorName: authorName.trim(),
        authorRole: authorRole.trim(),
        message: message.trim(),
        imageUrl: imageUrl.trim() || undefined,
        category,
      });

      setIsSubmitting(false);

      if (res.error) {
        setError(res.error);
      } else {
        setIsSubmitted(true);
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setError('Failed to submit memory. Please check your connection and try again.');
    }
  };

  const resetAndClose = () => {
    setIsSubmitted(false);
    setAuthorName('');
    setMessage('');
    setImageUrl('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-[#141615]/85 backdrop-blur-md flex items-center justify-center p-4">
        <motion.div
          className="relative w-full max-w-xl bg-[#1E2220] text-[#EFE6CA] p-6 sm:p-8 rounded-2xl shadow-2xl border border-[#B9905A]/40"
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
        >
          <button
            onClick={resetAndClose}
            aria-label="Close"
            className="absolute top-4 right-4 p-2 text-[#EFE6CA]/50 hover:text-[#EFE6CA] rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {isSubmitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-[#292D2B] border border-[#B9905A] text-[#B9905A] rounded-full flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="font-serif text-3xl font-bold text-[#EFE6CA]">
                Memory Submitted!
              </h3>
              <p className="font-sans text-sm text-[#EFE6CA]/80 max-w-md mx-auto leading-relaxed">
                Thank you for honoring our mentors. Your memory has been received and will appear on the memory book wall once verified.
              </p>
              <button
                onClick={resetAndClose}
                className="mt-4 px-6 py-2.5 bg-[#B9905A] text-[#141615] font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-[#D4AF77] transition-all shadow-md active:scale-95"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center space-x-2 border-b border-[#B9905A]/20 pb-3">
                <Heart className="w-5 h-5 text-[#B95F46]" />
                <h3 className="font-serif text-2xl font-bold text-[#EFE6CA]">
                  Write a Memory
                </h3>
              </div>

              {error && (
                <div className="p-3 bg-[#B95F46]/20 border border-[#B95F46] text-[#EFE6CA] text-xs rounded-lg font-sans">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#B9905A] mb-1 font-semibold">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full px-3.5 py-2.5 bg-[#141615] border border-[#B9905A]/30 rounded-lg text-sm text-[#EFE6CA] placeholder:text-[#EFE6CA]/30 focus:outline-none focus:border-[#B9905A] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#B9905A] mb-1 font-semibold">
                  Role / Section
                </label>
                <input
                  type="text"
                  value={authorRole}
                  onChange={(e) => setAuthorRole(e.target.value)}
                  placeholder="e.g. Student, Sec-D CSE"
                  className="w-full px-3.5 py-2.5 bg-[#141615] border border-[#B9905A]/30 rounded-lg text-sm text-[#EFE6CA] placeholder:text-[#EFE6CA]/30 focus:outline-none focus:border-[#B9905A] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#B9905A] mb-1 font-semibold">
                  Your Message or Tribute *
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share a heartfelt memory, thank you note, or funny moment..."
                  className="w-full px-3.5 py-2.5 bg-[#141615] border border-[#B9905A]/30 rounded-lg text-sm text-[#EFE6CA] placeholder:text-[#EFE6CA]/30 focus:outline-none focus:border-[#B9905A] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#B9905A] mb-1 font-semibold">
                  Optional Photo Link (Google Drive view link)
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://drive.google.com/file/d/..."
                  className="w-full px-3.5 py-2.5 bg-[#141615] border border-[#B9905A]/30 rounded-lg text-sm text-[#EFE6CA] placeholder:text-[#EFE6CA]/30 focus:outline-none focus:border-[#B9905A] transition-colors"
                />
                <span className="text-[10px] text-[#EFE6CA]/50 mt-1 block">
                  Please use public Google Drive links (Google Photos share links do not hotlink).
                </span>
              </div>

              <div className="pt-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={resetAndClose}
                  className="px-4 py-2 text-xs font-medium text-[#EFE6CA]/60 hover:text-[#EFE6CA]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center space-x-2 px-6 py-2.5 bg-[#B9905A] text-[#141615] font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-[#D4AF77] transition-all shadow-md active:scale-95"
                >
                  <span>{isSubmitting ? 'Submitting...' : 'Submit Memory'}</span>
                  <Send className="w-4 h-4 ml-1" />
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
