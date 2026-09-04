import React, { useState } from 'react';
import { BookOpen, Menu, X, Heart, Shield } from 'lucide-react';

interface NavbarProps {
  onOpenWriteMemory: () => void;
  onOpenAdmin: () => void;
  onNavigateSection: (id: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenWriteMemory,
  onOpenAdmin,
  onNavigateSection,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', id: 'hero' },
    { label: 'Our Story', id: 'chapters' },
    { label: 'Memories', id: 'memories' },
    { label: 'Teachers', id: 'teachers' },
    { label: 'People', id: 'people' },
    { label: 'Beyond', id: 'beyond' },
  ];

  const handleNavClick = (id: string) => {
    onNavigateSection(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-4 py-3 sm:py-4 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between glass-panel rounded-full px-4 sm:px-6 py-2.5 shadow-vintage">
        {/* Brand Logo */}
        <button
          onClick={() => handleNavClick('hero')}
          className="flex items-center space-x-2 text-left group focus:outline-none"
        >
          <div className="w-8 h-8 rounded-full border border-[#B9905A] flex items-center justify-center text-[#B9905A] bg-[#292D2B] group-hover:scale-105 transition-transform">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <span className="font-serif text-sm sm:text-base font-bold tracking-wide text-[#EFE6CA] block leading-none">
              HALL OF FAME
            </span>
            <span className="text-[10px] font-sans tracking-widest text-[#B9905A] uppercase block">
              TEACHERS' DAY 2026
            </span>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-xs uppercase tracking-wider font-medium text-[#EFE6CA]/80">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className="hover:text-[#B9905A] transition-colors focus:outline-none"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center space-x-3">
          <button
            onClick={onOpenWriteMemory}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-[#B9905A] text-[#1A1D1B] font-semibold text-xs hover:bg-[#D4AF77] transition-all shadow-md"
          >
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>Write a Memory</span>
          </button>

          <button
            onClick={onOpenAdmin}
            title="Admin CMS Dashboard"
            className="p-1.5 rounded-full bg-[#292D2B] text-[#B9905A] border border-[#B9905A]/40 hover:bg-[#B9905A] hover:text-[#1A1D1B] transition-colors"
          >
            <Shield className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex sm:hidden items-center space-x-2">
          <button
            onClick={onOpenWriteMemory}
            className="p-1.5 rounded-full bg-[#B9905A] text-[#1A1D1B]"
          >
            <Heart className="w-4 h-4 fill-current" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#EFE6CA] focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden mt-2 glass-panel rounded-2xl p-6 space-y-4 text-center">
          <nav className="flex flex-col space-y-3 font-serif text-lg text-[#EFE6CA]">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className="py-1 hover:text-[#B9905A] transition-colors"
              >
                {link.label}
              </button>
            ))}
          </nav>
          <div className="pt-2 border-t border-[#B9905A]/30 flex flex-col gap-2">
            <button
              onClick={() => {
                onOpenWriteMemory();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 bg-[#B9905A] text-[#1A1D1B] font-semibold text-sm rounded-lg"
            >
              Write a Memory
            </button>
            <button
              onClick={() => {
                onOpenAdmin();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2 bg-[#292D2B] text-[#B9905A] border border-[#B9905A]/40 text-xs rounded-lg flex items-center justify-center space-x-1.5"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin CMS</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
