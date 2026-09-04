import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

export const ApologyPage: React.FC = () => {
  return (
    <section className="relative py-20 px-4 bg-[#121413] text-[#EFE6CA] overflow-hidden flex items-center justify-center">
      {/* Background Vintage Paper Texture */}
      <div className="absolute inset-0 bg-paper-texture opacity-10 pointer-events-none" />

      <motion.div
        className="relative max-w-2xl w-full bg-[#EFE6CA] text-[#292D2B] p-8 sm:p-12 rounded-lg shadow-polaroid border-2 border-[#B9905A] rotate-1"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        {/* Adhesive Tape Corner Accent */}
        <div className="absolute -top-4 left-10 w-24 h-8 bg-[#E2D5B5]/90 border border-[#B9905A]/40 backdrop-blur-xs transform -rotate-3 shadow-xs" />

        {/* Header */}
        <div className="text-center space-y-2 mb-6 border-b border-[#B9905A]/30 pb-4">
          <span className="font-serif text-xs uppercase tracking-widest text-[#B95F46] font-bold">
            ONE LAST PAGE
          </span>
          <h3 className="font-serif text-3xl font-bold text-[#292D2B]">
            From Our Hearts
          </h3>
        </div>

        {/* Handwritten Body */}
        <div className="space-y-4 text-center sm:text-left font-handwritten text-xl sm:text-2xl text-[#292D2B] leading-relaxed">
          <p>
            "We tried to preserve every smile, every laugh, and every little moment that made this day special."
          </p>
          <p>
            "If something doesn't work perfectly, we sincerely apologize. We may not have captured everything, but we gave this our absolute best."
          </p>
        </div>

        {/* Signature */}
        <div className="mt-8 pt-4 border-t border-[#B9905A]/30 flex flex-col sm:flex-row justify-between items-center text-xs font-serif text-[#44636A]">
          <span>TEACHERS' DAY 2026</span>
          <div className="flex items-center space-x-1.5 text-[#B95F46] font-bold text-sm mt-2 sm:mt-0">
            <span>Made with love by the students</span>
            <Heart className="w-4 h-4 fill-current" />
          </div>
        </div>
      </motion.div>
    </section>
  );
};
