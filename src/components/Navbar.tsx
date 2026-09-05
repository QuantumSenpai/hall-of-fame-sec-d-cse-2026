import React, { useState } from 'react';
import { Sparkles, Menu, X, Heart, Shield } from 'lucide-react';

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
    { label: 'Photo Bento', id: 'gallery' },
    { label: 'Edits & Moments', id: 'edits' },
    { label: 'Management', id: 'team' },
    { label: 'Faculty Messages', id: 'messages' },
    { label: 'Thank You', id: 'apology' },
  ];

  const handleNavClick = (id: string) => {
    onNavigateSection(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-4 py-3 sm:py-4 transition-all duration-300">
      <div className="max-w-6xl mx-auto flex items-center justify-between glass-surface rounded-full px-4 sm:px-6 py-2.5 shadow-xl border border-[#C9A05C]/20 bg-[#16130E]/85 backdrop-blur-md">
        {/* Brand Logo */}
        <button
          onClick={() => handleNavClick('hero')}
          className="flex items-center space-x-3 text-left group focus:outline-none"
        >
          <div className="w-8 h-8 rounded-full border border-[#C9A05C] flex items-center justify-center text-[#C9A05C] bg-[#1E1B15] group-hover:scale-105 transition-transform shadow-md">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="font-serif text-sm sm:text-base font-bold tracking-wide text-[#F5EFE1] block leading-none">
              HALL OF FAME
            </span>
            <span className="text-[10px] font-sans tracking-widest text-[#C9A05C] uppercase block font-semibold mt-0.5">
              TEACHERS' DAY 2026
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-6 text-xs uppercase tracking-wider font-medium text-[#F5EFE1]/80">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className="hover:text-[#C9A05C] transition-colors focus:outline-none font-sans"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Action CTAs */}
        <div className="hidden sm:flex items-center space-x-3">
          <button
            onClick={onOpenWriteMemory}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-full bg-[#C9A05C] text-[#0D0B08] font-semibold text-xs hover:bg-[#D4AF6A] transition-all shadow-md active:scale-95"
          >
            <Heart className="w-3.5 h-3.5 fill-[#5C1F2E] text-[#5C1F2E]" />
            <span>Leave a Note</span>
          </button>

          <button
            onClick={onOpenAdmin}
            title="Admin CMS Dashboard"
            className="p-2 rounded-full bg-[#16130E] text-[#C9A05C] border border-[#C9A05C]/40 hover:bg-[#C9A05C] hover:text-[#0D0B08] transition-colors"
          >
            <Shield className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Hamburger Toggle (<768px) */}
        <div className="flex md:hidden items-center space-x-2">
          <button
            onClick={onOpenWriteMemory}
            className="p-2 rounded-full bg-[#C9A05C] text-[#0D0B08]"
            title="Leave a Note"
          >
            <Heart className="w-4 h-4 fill-[#5C1F2E] text-[#5C1F2E]" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            className="p-2 text-[#F5EFE1] focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 max-w-6xl mx-auto rounded-2xl p-6 space-y-4 text-center border border-[#C9A05C]/30 bg-[#16130E]/95 backdrop-blur-xl shadow-2xl">
          <nav className="flex flex-col space-y-3 font-serif text-lg text-[#F5EFE1]">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className="py-1 hover:text-[#C9A05C] transition-colors"
              >
                {link.label}
              </button>
            ))}
          </nav>
          <div className="pt-3 border-t border-[#C9A05C]/30 flex flex-col gap-2.5">
            <button
              onClick={() => {
                onOpenWriteMemory();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 bg-[#C9A05C] text-[#0D0B08] font-semibold text-sm rounded-lg"
            >
              Leave a Note
            </button>
            <button
              onClick={() => {
                onOpenAdmin();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2 bg-[#0D0B08] text-[#C9A05C] border border-[#C9A05C]/40 text-xs rounded-lg flex items-center justify-center space-x-1.5"
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
