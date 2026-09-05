import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import type { ApologyContent } from '../types/index.ts';

export interface ApologyPageProps {
  apology?: ApologyContent;
  className?: string;
}

export const ApologyPage: React.FC<ApologyPageProps> = ({
  apology,
  className = '',
}) => {
  const label = apology?.label || 'ONE LAST PAGE';
  const title = apology?.title || 'From Our Hearts';
  const paragraphs = apology?.paragraphs && apology.paragraphs.length > 0
    ? apology.paragraphs
    : [
        'We tried to preserve every smile, every laugh, and every little moment that made this Teachers’ Day so special to all of us.',
        'If something doesn’t work perfectly or if we missed a detail, we sincerely apologize. We may not have captured every single angle, but we gave this tribute our absolute best.',
      ];
  const signature = apology?.signature || "TEACHERS' DAY 2026";
  const subSignature = apology?.subSignature || 'Made with love by CSE Sec-D Students';

  return (
    <section
      id="apology"
      className={`relative py-24 px-4 bg-[#0D0B08] text-[#F5EFE1] overflow-hidden flex items-center justify-center ${className}`}
    >
      {/* Background Radial Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(201, 160, 92, 0.06) 0%, rgba(92, 31, 46, 0.05) 45%, transparent 70%)',
        }}
      />

      {/* Parchment Letter Card with smooth scroll fade-in */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative max-w-2xl w-full bg-gradient-to-br from-[#f8f2e4] via-[#eee5d3] to-[#e4d7bf] text-[#24140b] p-8 sm:p-12 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.85)] border-2 border-[#C9A05C]/40"
      >
        {/* Subtle Adhesive Tape Strip Accent */}
        <div className="absolute -top-3 left-10 w-24 h-7 bg-[#eedfc2]/90 border border-[#C9A05C]/50 backdrop-blur-xs transform -rotate-2 shadow-xs pointer-events-none" />

        {/* Header */}
        <div className="text-center space-y-2 mb-6 border-b border-[#C9A05C]/30 pb-5">
          <span className="font-sans text-xs uppercase tracking-[0.25em] text-[#5C1F2E] font-bold">
            {label}
          </span>
          <h3 className="font-serif text-3xl sm:text-4xl font-bold text-[#24140b] tracking-tight">
            {title}
          </h3>
        </div>

        {/* Handwritten / Calligraphic Body */}
        <div className="space-y-4 text-center sm:text-left font-hand text-xl sm:text-2xl text-[#2d1b11] leading-relaxed">
          {paragraphs.map((p, idx) => (
            <p key={idx}>"{p}"</p>
          ))}
        </div>

        {/* Signature Footer */}
        <div className="mt-8 pt-5 border-t border-[#C9A05C]/30 flex flex-col sm:flex-row justify-between items-center text-xs font-serif text-[#6d441c] gap-3">
          <span className="tracking-widest font-semibold">{signature}</span>
          <div className="flex items-center space-x-1.5 text-[#5C1F2E] font-bold text-sm">
            <span>{subSignature}</span>
            <Heart className="w-4 h-4 fill-current text-[#5C1F2E]" />
          </div>
        </div>
      </motion.div>
    </section>
  );
};
