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
    <footer className="bg-[#0b0305] border-t border-[rgba(201,164,99,0.25)] text-[#f2e8d5] py-16 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand Column */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full border border-[#c9a463] flex items-center justify-center text-[#c9a463] bg-[#220912] shadow-[0_0_12px_rgba(201,164,99,0.25)]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-lg font-bold text-[#f2e8d5] tracking-wide">
                HALL OF FAME
              </h4>
              <p className="text-xs text-[#c9a463] uppercase tracking-widest font-sans font-medium">
                TEACHERS' DAY 2026
              </p>
            </div>
          </div>
          <p className="font-sans text-xs text-[rgba(201,164,99,0.7)] leading-relaxed">
            A digital memory book preserving the laughter, gratitude, and unforgettable moments of Teachers' Day 2026.
          </p>
          <div className="flex items-center space-x-1.5 text-xs text-[#df8f70] font-medium">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>by CSE Sec-D Students</span>
          </div>
        </div>

        {/* Navigation Column */}
        <div className="space-y-3">
          <h5 className="font-serif text-sm uppercase tracking-widest text-[#c9a463] font-bold">
            Explore Memories
          </h5>
          <ul className="space-y-2 text-xs text-[rgba(242,232,213,0.75)] font-sans">
            <li>
              <button onClick={() => onNavigateSection('hero')} className="hover:text-[#c9a463] transition-colors">
                Home
              </button>
            </li>
            <li>
              <button onClick={() => onNavigateSection('chapters')} className="hover:text-[#c9a463] transition-colors">
                Our Story & Chapters
              </button>
            </li>
            <li>
              <button onClick={() => onNavigateSection('memories')} className="hover:text-[#c9a463] transition-colors">
                Student Memories
              </button>
            </li>
            <li>
              <button onClick={() => onNavigateSection('teachers')} className="hover:text-[#c9a463] transition-colors">
                Faculty Messages
              </button>
            </li>
            <li>
              <button onClick={() => onNavigateSection('people')} className="hover:text-[#c9a463] transition-colors">
                People Behind the Day
              </button>
            </li>
          </ul>
        </div>

        {/* External Drive & Social Links Column */}
        <div className="space-y-3">
          <h5 className="font-serif text-sm uppercase tracking-widest text-[#c9a463] font-bold">
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
                    className="inline-flex items-center space-x-2 text-[rgba(242,232,213,0.75)] hover:text-[#c9a463] transition-colors"
                  >
                    <span className="text-[#c9a463]">{getIcon(link.platform)}</span>
                    <span className="truncate">{link.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-[rgba(201,164,99,0.7)]">
              No external links added yet.
            </p>
          )}
        </div>

        {/* Write a Memory Column */}
        <div className="space-y-4 bg-[#16060b] p-6 rounded-xl border border-[rgba(201,164,99,0.25)] shadow-xl">
          <h5 className="font-serif text-base font-bold text-[#f2e8d5]">
            Have a memory to share?
          </h5>
          <p className="text-xs text-[rgba(201,164,99,0.7)] leading-relaxed">
            Leave your message, thank you note, or memory to be permanently preserved in our digital memory book.
          </p>
          <button
            onClick={onOpenWriteMemory}
            className="w-full py-2.5 bg-gradient-to-r from-[#c9a463] to-[#b88d48] text-[#0e0407] font-bold text-xs uppercase tracking-wider rounded-lg hover:brightness-110 transition-all shadow-[0_2px_12px_rgba(201,164,99,0.25)]"
          >
            Write a Memory
          </button>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-[rgba(201,164,99,0.2)] flex flex-col sm:flex-row justify-between items-center text-[11px] text-[rgba(201,164,99,0.7)] font-serif">
        <p>© 2026 Teachers' Day Hall of Fame — CSE Sec-D. All rights reserved.</p>
        <p className="mt-2 sm:mt-0">Designed & Engineered with Editorial Passion</p>
      </div>
    </footer>
  );
};
