import React from 'react';
import { Teacher } from '../types/index.ts';
import { Quote, ExternalLink as LinkIcon } from 'lucide-react';

interface TeacherCardProps {
  teacher: Teacher;
}

export const TeacherCard: React.FC<TeacherCardProps> = ({ teacher }) => {
  return (
    <div className="relative bg-gradient-to-br from-[#f8f0de] via-[#ede0c7] to-[#e6d5b8] text-[#2c180e] rounded-xl p-6 sm:p-8 shadow-[0_14px_40px_rgba(0,0,0,0.6)] border border-[rgba(160,121,58,0.45)] flex flex-col sm:flex-row gap-6 items-center sm:items-start group transition-all duration-300 hover:shadow-2xl hover:border-[#c9a463]">
      {/* Decorative Vintage Stamp Accent */}
      <div className="absolute top-3 right-4 w-12 h-14 border border-dashed border-[#8b2525] p-1 flex flex-col items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity">
        <span className="text-[9px] font-serif uppercase tracking-widest text-[#8b2525] font-bold">POSTAGE</span>
        <span className="text-xs font-serif font-bold text-[#8b2525]">2026</span>
      </div>

      {/* Teacher Photo */}
      {teacher.photoUrl ? (
        <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-[#c9a463] overflow-hidden shadow-lg flex-shrink-0">
          <img
            src={teacher.photoUrl}
            alt={teacher.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      ) : (
        <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-[#c9a463] bg-[#220912] text-[#c9a463] flex items-center justify-center font-serif text-3xl font-bold flex-shrink-0 shadow-md">
          {teacher.name.charAt(0)}
        </div>
      )}

      {/* Message Content */}
      <div className="flex-1 text-center sm:text-left space-y-3">
        <div>
          <h3 className="font-serif text-2xl font-bold text-[#2c180e]">
            {teacher.name}
          </h3>
          <p className="font-sans text-xs text-[#8b2525] uppercase tracking-wider font-semibold">
            {teacher.department}
          </p>
        </div>

        <div className="relative pt-2">
          <Quote className="w-6 h-6 text-[#c9a463]/50 absolute -top-2 -left-3" />
          <p className="font-serif italic text-base sm:text-lg text-[#3d2417] leading-relaxed relative z-10 pl-2">
            "{teacher.message}"
          </p>
        </div>

        {teacher.profileLink && (
          <a
            href={teacher.profileLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1.5 text-xs text-[#7a4818] hover:text-[#8b2525] font-semibold transition-colors"
          >
            <span>Faculty Profile</span>
            <LinkIcon className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  );
};
