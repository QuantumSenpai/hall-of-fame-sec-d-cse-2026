import React from 'react';
import type { Teacher } from '../types/index.ts';
import { Quote, ExternalLink as LinkIcon } from 'lucide-react';

interface TeacherCardProps {
  teacher: Teacher;
}

export const TeacherCard: React.FC<TeacherCardProps> = ({ teacher }) => {
  return (
    <div className="w-[320px] sm:w-[380px] bg-[#16130E] border border-[#C9A05C]/25 rounded-2xl p-6 sm:p-7 shadow-xl flex flex-col justify-between group transition-all duration-300 hover:border-[#C9A05C]/60 hover:shadow-2xl">
      {/* Decorative Stamp Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center space-x-3.5">
          {teacher.photoUrl ? (
            <div className="relative w-16 h-16 rounded-full border-2 border-[#C9A05C] overflow-hidden shadow-md flex-shrink-0 bg-[#0D0B08]">
              <img
                src={teacher.photoUrl}
                alt={teacher.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full border-2 border-[#C9A05C] bg-[#1E1B15] text-[#C9A05C] flex items-center justify-center font-serif text-2xl font-bold flex-shrink-0 shadow-md">
              {teacher.name.charAt(0)}
            </div>
          )}

          <div>
            <h3 className="font-serif text-xl font-bold text-[#F5EFE1] leading-tight">
              {teacher.name}
            </h3>
            <p className="font-sans text-[11px] text-[#C9A05C] uppercase tracking-wider font-semibold mt-0.5">
              {teacher.department}
            </p>
          </div>
        </div>

        {/* Vintage Postal Badge */}
        <div className="border border-dashed border-[#5C1F2E]/80 bg-[#5C1F2E]/10 rounded px-2 py-1 flex flex-col items-center justify-center opacity-85 group-hover:opacity-100 transition-opacity">
          <span className="text-[8px] font-sans uppercase tracking-widest text-[#5C1F2E] font-bold">HONOR</span>
          <span className="text-[10px] font-serif font-bold text-[#5C1F2E]">2026</span>
        </div>
      </div>

      {/* Quote Message Body */}
      <div className="relative my-3 flex-1">
        <Quote className="w-6 h-6 text-[#C9A05C]/35 absolute -top-1 -left-2 pointer-events-none" />
        <p className="font-serif italic text-base text-[#F5EFE1] leading-relaxed pl-3.5 relative z-10">
          "{teacher.message}"
        </p>
      </div>

      {/* Footer Profile Link */}
      {teacher.profileLink && (
        <div className="pt-4 mt-2 border-t border-[#C9A05C]/15 flex items-center justify-between">
          <a
            href={teacher.profileLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1.5 text-xs text-[#C9A05C] hover:text-[#D4AF6A] font-semibold transition-colors"
          >
            <span>Faculty Profile</span>
            <LinkIcon className="w-3.5 h-3.5" />
          </a>
          <span className="text-[10px] text-[#F5EFE1]/40 font-sans tracking-widest uppercase">
            CSE Faculty
          </span>
        </div>
      )}
    </div>
  );
};
