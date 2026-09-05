import React from 'react';
import { Sparkles, Heart } from 'lucide-react';

interface FooterProps {
  onOpenWriteMemory: () => void;
  onNavigateSection: (id: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenWriteMemory,
  onNavigateSection,
}) => {
  return (
    <footer className="bg-[#0D0B08] border-t border-[#C9A05C]/20 text-[#F5EFE1] py-16 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
        {/* Brand Column */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full border border-[#C9A05C] flex items-center justify-center text-[#C9A05C] bg-[#16130E] shadow-md">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-serif text-lg font-bold text-[#F5EFE1] tracking-wide">
                HALL OF FAME
              </h4>
              <p className="text-[10px] text-[#C9A05C] uppercase tracking-widest font-sans font-semibold">
                TEACHERS' DAY 2026
              </p>
            </div>
          </div>
          <p className="font-sans text-xs text-[#F5EFE1]/70 leading-relaxed max-w-sm">
            A digital memory book preserving the laughter, gratitude, and unforgettable moments of Teachers' Day 2026.
          </p>
          <div className="flex items-center space-x-1.5 text-xs text-[#5C1F2E] font-semibold">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>by CSE Sec-D Students</span>
          </div>
        </div>

        {/* Navigation Column */}
        <div className="space-y-3 md:pl-8">
          <h5 className="font-serif text-sm uppercase tracking-widest text-[#C9A05C] font-bold">
            Explore
          </h5>
          <ul className="space-y-2 text-xs text-[#F5EFE1]/75 font-sans">
            <li>
              <button onClick={() => onNavigateSection('hero')} className="hover:text-[#C9A05C] transition-colors">
                Home
              </button>
            </li>
            <li>
              <button onClick={() => onNavigateSection('gallery')} className="hover:text-[#C9A05C] transition-colors">
                Photo Bento Grid
              </button>
            </li>
            <li>
              <button onClick={() => onNavigateSection('edits')} className="hover:text-[#C9A05C] transition-colors">
                Edits & Moments
              </button>
            </li>
            <li>
              <button onClick={() => onNavigateSection('team')} className="hover:text-[#C9A05C] transition-colors">
                Management Team
              </button>
            </li>
            <li>
              <button onClick={() => onNavigateSection('messages')} className="hover:text-[#C9A05C] transition-colors">
                Faculty Messages
              </button>
            </li>
            <li>
              <button onClick={() => onNavigateSection('apology')} className="hover:text-[#C9A05C] transition-colors">
                Thank You & Apology
              </button>
            </li>
          </ul>
        </div>

        {/* Leave a Note Column */}
        <div className="space-y-4 bg-[#16130E] p-6 rounded-2xl border border-[#C9A05C]/20 shadow-xl md:ml-auto w-full max-w-sm">
          <h5 className="font-serif text-base font-bold text-[#F5EFE1]">
            Have a memory to share?
          </h5>
          <p className="text-xs text-[#F5EFE1]/70 leading-relaxed font-sans">
            Leave your message, thank you note, or memory to be permanently preserved in our digital memory book.
          </p>
          <button
            onClick={onOpenWriteMemory}
            className="w-full py-2.5 bg-[#C9A05C] text-[#0D0B08] font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-[#D4AF6A] transition-all shadow-md active:scale-95"
          >
            Leave a Note
          </button>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="max-w-6xl mx-auto mt-12 pt-6 border-t border-[#C9A05C]/20 flex flex-col sm:flex-row justify-between items-center text-[11px] text-[#F5EFE1]/60 font-sans">
        <p>© 2026 Teachers' Day Hall of Fame — CSE Sec-D. All rights reserved.</p>
        <p className="mt-2 sm:mt-0 font-serif italic text-xs text-[#C9A05C]">
          Designed & Engineered with Editorial Passion
        </p>
      </div>
    </footer>
  );
};
