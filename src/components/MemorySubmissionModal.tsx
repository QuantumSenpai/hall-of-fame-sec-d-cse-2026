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
  const [authorRole, setAuthorRole] = useState('Student, Sec-D');
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
    setError('');
    setIsSubmitting(true);

    try {
      await submitMemory({
        authorName: authorName.trim(),
        authorRole: authorRole.trim(),
        message: message.trim(),
        imageUrl: imageUrl.trim() || undefined,
        category,
      });
      setIsSubmitting(false);
      setIsSubmitted(true);
    } catch (err) {
      setIsSubmitting(false);
      setError('Failed to submit memory. Please try again.');
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
      <div className="fixed inset-0 z-50 bg-charcoal/85 backdrop-blur-md flex items-center justify-center p-4">
        <motion.div
          className="relative w-full max-w-xl bg-[#EFE6CA] text-[#292D2B] p-6 sm:p-8 rounded-xl shadow-2xl border-2 border-[#B9905A]"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
        >
          <button
            onClick={resetAndClose}
            className="absolute top-4 right-4 p-2 text-[#292D2B]/70 hover:text-[#292D2B] rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {isSubmitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-[#44636A] text-[#EFE6CA] rounded-full flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="font-serif text-3xl font-bold text-[#292D2B]">
                Memory Submitted!
              </h3>
              <p className="font-sans text-sm text-[#44636A] max-w-md mx-auto">
                Thank you for contributing to our Teachers' Day Memory Book. Your message has been sent to our moderators and will appear on the memory wall shortly.
              </p>
              <button
                onClick={resetAndClose}
                className="mt-4 px-6 py-2.5 bg-[#B9905A] text-[#1A1D1B] font-medium rounded-lg hover:bg-[#D4AF77] transition-colors shadow"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center space-x-2 border-b border-[#B9905A]/40 pb-3">
                <Heart className="w-5 h-5 text-[#B95F46]" />
                <h3 className="font-serif text-2xl font-bold text-[#292D2B]">
                  Write a Memory
                </h3>
              </div>

              {error && (
                <div className="p-3 bg-[#B95F46]/20 border border-[#B95F46] text-[#93442F] text-xs rounded">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-serif uppercase tracking-wider text-[#44636A] mb-1 font-semibold">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full px-3 py-2 bg-[#F8F4EA] border border-[#B9905A]/50 rounded text-sm text-[#292D2B] focus:outline-none focus:border-[#B9905A]"
                />
              </div>

              <div>
                <label className="block text-xs font-serif uppercase tracking-wider text-[#44636A] mb-1 font-semibold">
                  Role / Designation
                </label>
                <input
                  type="text"
                  value={authorRole}
                  onChange={(e) => setAuthorRole(e.target.value)}
                  placeholder="e.g. Student, Sec-D CSE"
                  className="w-full px-3 py-2 bg-[#F8F4EA] border border-[#B9905A]/50 rounded text-sm text-[#292D2B] focus:outline-none focus:border-[#B9905A]"
                />
              </div>

              <div>
                <label className="block text-xs font-serif uppercase tracking-wider text-[#44636A] mb-1 font-semibold">
                  Your Memory / Compliment *
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share a heartfelt message, a funny story, or a thank you note..."
                  className="w-full px-3 py-2 bg-[#F8F4EA] border border-[#B9905A]/50 rounded text-sm text-[#292D2B] focus:outline-none focus:border-[#B9905A]"
                />
              </div>

              <div>
                <label className="block text-xs font-serif uppercase tracking-wider text-[#44636A] mb-1 font-semibold">
                  Optional Photo Link (Google Drive / Image URL)
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://drive.google.com/..."
                  className="w-full px-3 py-2 bg-[#F8F4EA] border border-[#B9905A]/50 rounded text-sm text-[#292D2B] focus:outline-none focus:border-[#B9905A]"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={resetAndClose}
                  className="px-4 py-2 text-xs font-medium text-[#44636A] hover:text-[#292D2B]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center space-x-2 px-6 py-2.5 bg-[#B9905A] text-[#1A1D1B] font-semibold text-xs rounded hover:bg-[#D4AF77] transition-colors shadow"
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
