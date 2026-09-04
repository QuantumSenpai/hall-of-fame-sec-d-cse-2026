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
      <div className="fixed inset-0 z-50 bg-[#070204]/90 backdrop-blur-md flex items-center justify-center p-4">
        <motion.div
          className="relative w-full max-w-xl bg-[#16060b] text-[#f2e8d5] p-6 sm:p-8 rounded-2xl shadow-[0_25px_80px_rgba(0,0,0,0.9),0_0_40px_rgba(201,164,99,0.12)] border border-[rgba(201,164,99,0.35)]"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
        >
          <button
            onClick={resetAndClose}
            className="absolute top-4 right-4 p-2 text-[rgba(242,232,213,0.5)] hover:text-[#f2e8d5] rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {isSubmitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-[#220912] border border-[#c9a463] text-[#c9a463] rounded-full flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(201,164,99,0.25)]">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="font-serif text-3xl font-bold text-[#f2e8d5]">
                Memory Submitted!
              </h3>
              <p className="font-sans text-sm text-[rgba(201,164,99,0.8)] max-w-md mx-auto">
                Thank you for contributing to our Teachers' Day Memory Book. Your message has been sent to our moderators and will appear on the memory wall shortly.
              </p>
              <button
                onClick={resetAndClose}
                className="mt-4 px-6 py-2.5 bg-gradient-to-r from-[#c9a463] to-[#b88d48] text-[#0e0407] font-bold text-xs uppercase tracking-wider rounded-lg hover:brightness-110 transition-all shadow-[0_2px_12px_rgba(201,164,99,0.25)]"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center space-x-2 border-b border-[rgba(201,164,99,0.2)] pb-3">
                <Heart className="w-5 h-5 text-[#df8f70]" />
                <h3 className="font-serif text-2xl font-bold text-[#f2e8d5]">
                  Write a Memory
                </h3>
              </div>

              {error && (
                <div className="p-3 bg-red-950/80 border border-red-700 text-red-200 text-xs rounded-lg">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#c9a463] mb-1 font-semibold">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full px-3.5 py-2.5 bg-[#220a12] border border-[rgba(201,164,99,0.3)] rounded-lg text-sm text-[#f2e8d5] placeholder:text-[rgba(242,232,213,0.3)] focus:outline-none focus:border-[#c9a463] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#c9a463] mb-1 font-semibold">
                  Role / Designation
                </label>
                <input
                  type="text"
                  value={authorRole}
                  onChange={(e) => setAuthorRole(e.target.value)}
                  placeholder="e.g. Student, Sec-D CSE"
                  className="w-full px-3.5 py-2.5 bg-[#220a12] border border-[rgba(201,164,99,0.3)] rounded-lg text-sm text-[#f2e8d5] placeholder:text-[rgba(242,232,213,0.3)] focus:outline-none focus:border-[#c9a463] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#c9a463] mb-1 font-semibold">
                  Your Memory / Compliment *
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share a heartfelt message, a funny story, or a thank you note..."
                  className="w-full px-3.5 py-2.5 bg-[#220a12] border border-[rgba(201,164,99,0.3)] rounded-lg text-sm text-[#f2e8d5] placeholder:text-[rgba(242,232,213,0.3)] focus:outline-none focus:border-[#c9a463] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#c9a463] mb-1 font-semibold">
                  Optional Photo Link (Google Drive / Image URL)
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://drive.google.com/..."
                  className="w-full px-3.5 py-2.5 bg-[#220a12] border border-[rgba(201,164,99,0.3)] rounded-lg text-sm text-[#f2e8d5] placeholder:text-[rgba(242,232,213,0.3)] focus:outline-none focus:border-[#c9a463] transition-colors"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={resetAndClose}
                  className="px-4 py-2 text-xs font-medium text-[rgba(242,232,213,0.6)] hover:text-[#f2e8d5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-[#c9a463] to-[#b88d48] text-[#0e0407] font-bold text-xs uppercase tracking-wider rounded-lg hover:brightness-110 transition-all shadow-[0_2px_12px_rgba(201,164,99,0.25)]"
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
