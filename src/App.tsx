import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Play, Heart, Sparkles } from 'lucide-react';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { HeroBook } from './components/HeroBook.tsx';
import { HeroInteractiveDotGrid } from './components/HeroInteractiveDotGrid.tsx';
import { BentoGallery } from './components/BentoGallery.tsx';
import { EditsAndMoments } from './components/EditsAndMoments.tsx';
import { ManagementTeam } from './components/ManagementTeam.tsx';
import { SkewedCarousel } from './components/reactbits/SkewedCarousel.tsx';
import { TeacherCard } from './components/TeacherCard.tsx';
import { ApologyPage } from './components/ApologyPage.tsx';
import { BackToTop } from './components/BackToTop.tsx';
import { LetterSwap } from './components/reactbits/LetterSwap.tsx';
import { MemorySubmissionModal } from './components/MemorySubmissionModal.tsx';
import { AdminLogin } from './admin/AdminLogin.tsx';
import { AdminLayout } from './admin/AdminLayout.tsx';
import {
  fetchSiteContent,
  adminCheckAuth,
  adminLogout,
  type SiteContentResponse,
} from './lib/api.ts';
import type { Photo, Video, Teacher, StudentMemory, Person, HeroContent, ApologyContent } from './types/index.ts';

export const App: React.FC = () => {
  const [content, setContent] = useState<SiteContentResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Modals & Navigation
  const [writeMemoryOpen, setWriteMemoryOpen] = useState(false);
  const [adminLoginOpen, setAdminLoginOpen] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);
  const [heroVideoModal, setHeroVideoModal] = useState<string | null>(null);

  // Check initial URL hash / route for /admin
  useEffect(() => {
    if (window.location.pathname === '/admin' || window.location.hash === '#admin') {
      checkAdminAccess();
    }
  }, []);

  const checkAdminAccess = async () => {
    const auth = await adminCheckAuth();
    if (auth.authenticated) {
      setIsAdminView(true);
    } else {
      setAdminLoginOpen(true);
    }
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    const data = await fetchSiteContent();
    if (data) {
      setContent(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAdminSuccess = () => {
    setAdminLoginOpen(false);
    setIsAdminView(true);
  };

  const handleAdminLogout = async () => {
    await adminLogout();
    setIsAdminView(false);
    if (window.location.pathname === '/admin') {
      window.history.pushState(null, '', '/');
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // If in Admin CMS Mode, render AdminLayout
  if (isAdminView && content) {
    return (
      <AdminLayout
        photos={content.photos || []}
        videos={content.videos || []}
        teachers={content.teachers || []}
        memories={content.memories || []}
        people={content.people || []}
        onRefresh={loadData}
        onLogout={handleAdminLogout}
        onReturnToPublic={() => setIsAdminView(false)}
      />
    );
  }

  const hero: HeroContent = content?.hero || {
    badgeText: 'Dedicated to Our Mentors • CSE Sec-D 2026',
    titleLine1: "TEACHERS' DAY",
    titleLine2: '2026 DIGITAL',
    titleLine3: 'MEMORY BOOK',
    subtitle:
      'Every lesson taught, every question answered, every encouraging word shared — captured and preserved in gratitude by the students of Computer Science & Engineering Section-D.',
    bookImage:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    bookCaption: 'A moment of stillness & infinite gratitude',
    quoteHeading: 'Good Teachers\nBrighter Futures',
    quoteSubtext: 'More than teachers, A family forever.',
  };

  const photos: Photo[] = content?.photos || [];
  const videos: Video[] = content?.videos || [];
  const teachers: Teacher[] = content?.teachers || [];
  const people: Person[] = content?.people || [];
  const apology: ApologyContent = content?.apology || {
    label: 'ONE LAST PAGE',
    title: 'From Our Hearts',
    paragraphs: [
      "We tried to preserve every smile, every laugh, and every little moment that made this Teachers' Day so special to all of us.",
      "If something doesn't work perfectly or if we missed a detail, we sincerely apologize. We may not have captured every single angle, but we gave this tribute our absolute best.",
    ],
    signature: "TEACHERS' DAY 2026",
    subSignature: 'Made with love by CSE Sec-D Students',
  };

  return (
    <div className="min-h-screen bg-[#0D0B08] text-[#F5EFE1] selection:bg-[#C9A05C]/30 selection:text-white relative">
      {/* Essential Site Chrome: Fixed Navigation Bar */}
      <Navbar
        onOpenWriteMemory={() => setWriteMemoryOpen(true)}
        onOpenAdmin={checkAdminAccess}
        onNavigateSection={scrollToSection}
      />

      {/* ============================================================ */}
      {/* a. HERO SECTION WITH MOUSE-REACTIVE DOT GRID & DYNAMIC HERO CMS */}
      {/* ============================================================ */}
      <section
        id="hero"
        className="relative min-h-0 md:min-h-[85vh] flex items-center justify-center pt-24 pb-8 sm:pt-28 sm:pb-12 md:pb-16 lg:pb-20 px-4 overflow-hidden border-b border-[#C9A05C]/15"
      >
        {/* Canvas Mouse-Reactive Interactive Dot-Grid (Desktop tracking, mobile static, capped frame budget) */}
        <HeroInteractiveDotGrid />

        {/* Ambient Radial Vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 50% 30%, rgba(201, 160, 92, 0.08) 0%, rgba(13, 11, 8, 0.4) 50%, transparent 80%)',
          }}
        />

        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-8 items-center relative z-10">
          {/* Left Column: Badge, 3-Line Heading, Subtitle, CTAs */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-6 text-center lg:text-left relative z-20">
            <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-[#18140E] border border-[#C9A05C]/45 text-[#E6C687] text-xs font-sans font-semibold tracking-widest uppercase shadow-md shadow-black/40">
              <Sparkles className="w-3.5 h-3.5 text-[#C9A05C] animate-pulse" />
              <span>{hero.badgeText}</span>
            </div>

            {/* Main 3-Line Heading with 3D Kinetic Letter Swap */}
            <div className="space-y-1 sm:space-y-1.5">
              <h1 className="heading-editorial text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#FAF6ED] tracking-tight leading-[1.1] drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
                <LetterSwap text={hero.titleLine1 || "TEACHERS' DAY"} as="span" />
                <br />
                <span className="text-[#C9A05C] drop-shadow-[0_2px_12px_rgba(201,160,92,0.25)]">
                  <LetterSwap text={hero.titleLine2 || "2026 DIGITAL"} as="span" />
                </span>
                <br />
                <LetterSwap text={hero.titleLine3 || "MEMORY BOOK"} as="span" />
              </h1>
            </div>

            <p className="font-sans text-xs sm:text-sm md:text-base text-[#F5EFE1]/85 max-w-xl mx-auto lg:mx-0 leading-relaxed drop-shadow-sm">
              {hero.subtitle}
            </p>

            {/* Hero CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-1 sm:pt-2">
              <button
                onClick={() => scrollToSection('gallery')}
                className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-[#D4AF6A] via-[#C9A05C] to-[#B88B46] text-[#0D0B08] font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all duration-200 shadow-xl shadow-[#C9A05C]/25 flex items-center space-x-2 active:scale-95"
              >
                <span>Explore Photo Bento</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setHeroVideoModal(videos[0]?.youtubeId || 'dQw4w9WgXcQ')}
                className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-[#18140E] border border-[#C9A05C]/45 text-[#F5EFE1] font-semibold text-xs uppercase tracking-wider hover:bg-[#C9A05C] hover:text-[#0D0B08] hover:border-[#C9A05C] transition-all duration-200 flex items-center space-x-2 active:scale-95 shadow-md shadow-black/40"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Watch Video</span>
              </button>

              <button
                onClick={() => setWriteMemoryOpen(true)}
                className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-[#5C1F2E]/20 border border-[#852C42]/70 text-[#F5EFE1] font-semibold text-xs uppercase tracking-wider hover:bg-[#5C1F2E] hover:border-[#9E354F] transition-all duration-200 flex items-center space-x-2 active:scale-95 shadow-sm"
              >
                <Heart className="w-4 h-4 fill-[#C9A05C] text-[#C9A05C]" />
                <span>Leave a Note</span>
              </button>
            </div>
          </div>

          {/* Right Column: Open Book Illustration */}
          <div className="lg:col-span-6 flex justify-center w-full relative z-10">
            <HeroBook
              hero={hero}
              onOpenHighlightMedia={() => setHeroVideoModal(videos[0]?.youtubeId || 'dQw4w9WgXcQ')}
            />
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* b. PHOTO BENTO GRID (LARGE MIXED-SIZE GRID WITH PARALLAX) */}
      {/* ============================================================ */}
      <section id="gallery" className="section-spacing section-container">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <p className="subheading-label">MEMORIES PRESERVED</p>
          <h2 className="heading-editorial text-3xl sm:text-4xl text-[#F5EFE1]">
            <LetterSwap text="Photo Bento Grid" as="span" />
          </h2>
          <p className="font-sans text-xs sm:text-sm text-[#F5EFE1]/70">
            A curated high-contrast gallery of candid moments, ceremonies, and celebrations from Teachers' Day 2026.
          </p>
        </div>

        <BentoGallery photos={photos} />
      </section>

      {/* ============================================================ */}
      {/* c. EDITS & MOMENTS SECTION (SHORT VIDEOS, REELS, FILMS) */}
      {/* ============================================================ */}
      <section id="edits" className="section-spacing section-container border-t border-[#C9A05C]/15">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <p className="subheading-label">CINEMATIC ARCHIVES</p>
          <h2 className="heading-editorial text-3xl sm:text-4xl text-[#F5EFE1]">
            <LetterSwap text="Edits & Moments" as="span" />
          </h2>
          <p className="font-sans text-xs sm:text-sm text-[#F5EFE1]/70">
            Short films, dance tribute reels, and video highlights produced by the Section-D media crew.
          </p>
        </div>

        <EditsAndMoments videos={videos} />
      </section>

      {/* ============================================================ */}
      {/* d. MANAGEMENT TEAM SECTION */}
      {/* ============================================================ */}
      <section id="team" className="section-spacing section-container border-t border-[#C9A05C]/15">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <p className="subheading-label">THE HANDS BEHIND THE CELEBRATION</p>
          <h2 className="heading-editorial text-3xl sm:text-4xl text-[#F5EFE1]">
            <LetterSwap text="Management Team & Leads" as="span" />
          </h2>
          <p className="font-sans text-xs sm:text-sm text-[#F5EFE1]/70">
            Meet the students who coordinated event logistics, stage setup, audiovisuals, and memory curation.
          </p>
        </div>

        <ManagementTeam people={people} />
      </section>

      {/* ============================================================ */}
      {/* e. FACULTY MESSAGES (SKEWED CAROUSEL WITH TOUCH SWIPE) */}
      {/* ============================================================ */}
      <section id="messages" className="section-spacing section-container border-t border-[#C9A05C]/15 overflow-hidden">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <p className="subheading-label">WORDS THAT INSPIRE</p>
          <h2 className="heading-editorial text-3xl sm:text-4xl text-[#F5EFE1]">
            <LetterSwap text="Messages from Respected Faculty" as="span" />
          </h2>
          <p className="font-sans text-xs sm:text-sm text-[#F5EFE1]/70">
            Wisdom, encouragement, and kind reflections shared by our esteemed professors on Teachers' Day 2026.
          </p>
        </div>

        <SkewedCarousel
          items={teachers}
          renderItem={(teacher) => <TeacherCard key={teacher.id} teacher={teacher} />}
        />
      </section>

      {/* ============================================================ */}
      {/* f. THANK YOU & APOLOGY SECTION */}
      {/* ============================================================ */}
      <ApologyPage apology={apology} />

      {/* ============================================================ */}
      {/* g. ESSENTIAL SITE CHROME (FOOTER) */}
      {/* ============================================================ */}
      <Footer
        onOpenWriteMemory={() => setWriteMemoryOpen(true)}
        onNavigateSection={scrollToSection}
      />

      {/* Modal Video Player for Hero Click */}
      <AnimatePresence>
        {heroVideoModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
            onClick={() => setHeroVideoModal(null)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden border border-[#C9A05C]/50 shadow-2xl bg-black"
            >
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${heroVideoModal}?autoplay=1&rel=0`}
                title="Teachers Day Video Player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Write a Memory Modal */}
      <MemorySubmissionModal
        isOpen={writeMemoryOpen}
        onClose={() => setWriteMemoryOpen(false)}
      />

      {/* Admin Login Modal */}
      <AdminLogin
        isOpen={adminLoginOpen}
        onClose={() => setAdminLoginOpen(false)}
        onSuccess={handleAdminSuccess}
      />

      {/* Global Back-To-Top Button */}
      <BackToTop />
    </div>
  );
};

export default App;
