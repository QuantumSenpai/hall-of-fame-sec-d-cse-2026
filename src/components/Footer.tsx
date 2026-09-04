import React from 'react';
import { BookOpen, Heart, Instagram, Youtube, HardDrive, Linkedin } from 'lucide-react';
import { ExternalLink } from '../types/index.ts';

interface FooterProps {
  externalLinks?: ExternalLink[];
  onOpenWriteMemory: () => void;
  onNavigateSection: (id: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  externalLinks = [],
  onOpenWriteMemory,
  onNavigateSection,
}) => {
  const getIcon = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return <Instagram className="w-4 h-4" />;
      case 'youtube':
        return <Youtube className="w-4 h-4" />;
      case 'gdrive':
        return <HardDrive className="w-4 h-4" />;
      case 'linkedin':
        return <Linkedin className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  return (
    <footer className="bg-[#121413] border-t-2 border-[#B9905A]/40 text-[#EFE6CA] py-16 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand Column */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full border-2 border-[#B9905A] flex items-center justify-center text-[#B9905A] bg-[#292D2B]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-lg font-bold text-[#EFE6CA]">
                HALL OF FAME
              </h4>
              <p className="text-xs text-[#B9905A] uppercase tracking-widest font-sans">
                TEACHERS' DAY 2026
              </p>
            </div>
          </div>
          <p className="font-sans text-xs text-[#44636A] leading-relaxed">
            A digital memory book preserving the laughter, gratitude, and unforgettable moments of Teachers' Day 2026.
          </p>
          <div className="flex items-center space-x-1.5 text-xs text-[#B95F46] font-medium">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>by CSE Sec-D Students</span>
          </div>
        </div>

        {/* Navigation Column */}
        <div className="space-y-3">
          <h5 className="font-serif text-sm uppercase tracking-widest text-[#B9905A] font-bold">
            Explore Memories
          </h5>
          <ul className="space-y-2 text-xs text-[#EFE6CA]/80 font-sans">
            <li>
              <button onClick={() => onNavigateSection('hero')} className="hover:text-[#B9905A] transition-colors">
                Home
              </button>
            </li>
            <li>
              <button onClick={() => onNavigateSection('chapters')} className="hover:text-[#B9905A] transition-colors">
                Our Story & Chapters
              </button>
            </li>
            <li>
              <button onClick={() => onNavigateSection('memories')} className="hover:text-[#B9905A] transition-colors">
                Student Memories
              </button>
            </li>
            <li>
              <button onClick={() => onNavigateSection('teachers')} className="hover:text-[#B9905A] transition-colors">
                Faculty Messages
              </button>
            </li>
            <li>
              <button onClick={() => onNavigateSection('people')} className="hover:text-[#B9905A] transition-colors">
                People Behind the Day
              </button>
            </li>
          </ul>
        </div>

        {/* External Drive & Social Links Column */}
        <div className="space-y-3">
          <h5 className="font-serif text-sm uppercase tracking-widest text-[#B9905A] font-bold">
            External Links & Albums
          </h5>
          {externalLinks.length > 0 ? (
            <ul className="space-y-2 text-xs">
              {externalLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-[#EFE6CA]/80 hover:text-[#B9905A] transition-colors"
                  >
                    <span className="text-[#B9905A]">{getIcon(link.platform)}</span>
                    <span className="truncate">{link.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-[#44636A]">
              No external links added yet.
            </p>
          )}
        </div>

        {/* Write a Memory Column */}
        <div className="space-y-4 bg-[#1A1D1B] p-6 rounded-lg border border-[#B9905A]/30">
          <h5 className="font-serif text-base font-bold text-[#EFE6CA]">
            Have a memory to share?
          </h5>
          <p className="text-xs text-[#44636A] leading-relaxed">
            Leave your message, thank you note, or memory to be permanently preserved in our digital memory book.
          </p>
          <button
            onClick={onOpenWriteMemory}
            className="w-full py-2.5 bg-[#B9905A] text-[#1A1D1B] font-semibold text-xs rounded hover:bg-[#D4AF77] transition-colors shadow"
          >
            Write a Memory
          </button>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-[#292D2B] flex flex-col sm:flex-row justify-between items-center text-[11px] text-[#44636A] font-serif">
        <p>© 2026 Teachers' Day Hall of Fame — CSE Sec-D. All rights reserved.</p>
        <p className="mt-2 sm:mt-0">Designed & Engineered with Editorial Passion</p>
      </div>
    </footer>
  );
};
