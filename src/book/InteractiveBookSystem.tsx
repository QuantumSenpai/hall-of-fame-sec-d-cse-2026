import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { VintageBook3D } from './VintageBook3D.tsx';
import { Chapter, Photo, Video, Teacher, Person } from '../types/index.ts';
import { PolaroidStack } from '../components/PolaroidStack.tsx';
import { FilmStrip } from '../components/FilmStrip.tsx';
import { TeacherCard } from '../components/TeacherCard.tsx';
import { ChevronDown, Play, Sparkles } from 'lucide-react';

interface InteractiveBookSystemProps {
  chapters: Chapter[];
  photos: Photo[];
  videos: Video[];
  teachers: Teacher[];
  people: Person[];
  onOpenWriteMemory: () => void;
}

export const InteractiveBookSystem: React.FC<InteractiveBookSystemProps> = ({
  chapters,
  photos,
  videos,
  teachers,
  people,
  onOpenWriteMemory,
}) => {
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);

  // Scroll Progress Engine
  const { scrollYProgress } = useScroll();
  const smoothScroll = useSpring(scrollYProgress, { stiffness: 90, damping: 25 });

  // Transforms mapped to scroll progress
  // Initial cover rotation open
  const coverRotationY = useTransform(smoothScroll, [0, 0.12, 0.88, 1], [0, -170, -170, 0]);
  
  // Book 3D Rotation Y (Intro settling & tilt)
  const bookRotationY = useTransform(smoothScroll, [0, 0.1, 0.9, 1], [-15, 0, 0, 0]);
  const bookRotateX = useTransform(smoothScroll, [0, 0.1, 0.9, 1], [10, 0, 0, 5]);

  // Book Scale Zoom into full bleed stage
  const bookScale = useTransform(smoothScroll, [0, 0.08, 0.15, 0.85, 0.95], [0.85, 1, 1.2, 1, 0.85]);
  const bookZ = useTransform(smoothScroll, [0, 0.15, 0.85, 1], [0, 150, 150, 0]);

  // Book opacity fading into chapter media stage
  const bookOpacity = useTransform(smoothScroll, [0, 0.1, 0.2, 0.85, 0.95], [1, 1, 0.15, 1, 1]);

  const activeChapter = chapters[activeChapterIndex] || chapters[0];

  // Update active chapter index on scroll
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      if (chapters.length === 0) return;
      // Map 0.15 -> 0.85 range across chapters
      const chapterStep = 0.7 / Math.max(chapters.length, 1);
      const index = Math.min(
        Math.floor(Math.max(0, latest - 0.12) / chapterStep),
        chapters.length - 1
      );
      setActiveChapterIndex(Math.max(0, index));
    });
    return () => unsubscribe();
  }, [scrollYProgress, chapters]);

  // Chapter specific photos and videos
  const chapterPhotos = photos.filter((p) => p.chapterId === activeChapter?.id || !p.chapterId);
  const chapterVideos = videos.filter((v) => v.chapterId === activeChapter?.id || !v.chapterId);

  return (
    <div className="relative w-full">
      {/* HERO / INTRO SECTION */}
      <section id="hero" className="relative min-h-screen flex flex-col justify-between items-center py-20 px-4">
        {/* Editorial Heading */}
        <div className="text-center space-y-3 z-10 max-w-4xl mx-auto pt-10">
          <motion.p
            className="text-xs sm:text-sm font-serif uppercase tracking-[0.3em] text-[#B9905A]"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            A DAY TO REMEMBER • SEPTEMBER 2026
          </motion.p>

          <motion.h1
            className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#EFE6CA] leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            TEACHERS' DAY 2026
          </motion.h1>

          <motion.p
            className="font-sans text-sm sm:text-base text-[#44636A] italic max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            A celebration of guidance, friendship, and unforgettable memories. Preserved forever in our interactive digital memory book.
          </motion.p>
        </div>

        {/* Scroll Indicator Prompt */}
        <motion.div
          className="z-10 flex flex-col items-center space-y-2 text-[#B9905A] pb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <span className="font-serif text-xs uppercase tracking-widest">
            SCROLL TO OPEN BOOK
          </span>
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </motion.div>
      </section>

      {/* STICKY 3D VINTAGE BOOK CONTAINER */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden pointer-events-none z-20">
        <motion.div style={{ opacity: bookOpacity }} className="w-full h-full">
          <VintageBook3D
            coverRotationY={coverRotationY.get()}
            bookRotationY={bookRotationY.get()}
            bookRotateX={bookRotateX.get()}
            bookScale={bookScale.get()}
            bookZ={bookZ.get()}
            activeChapterTitle={activeChapter?.title}
            activeChapterSubtitle={activeChapter?.subtitle || ''}
            isBookClosed={scrollYProgress.get() > 0.9}
          />
        </motion.div>
      </div>

      {/* CHAPTER CONTENT STAGES (SCROLL-DRIVEN) */}
      <div id="chapters" className="relative z-30 space-y-32 py-20">
        {chapters.map((chapter, idx) => {
          const currentPhotos = photos.filter((p) => p.chapterId === chapter.id);
          const currentVideos = videos.filter((v) => v.chapterId === chapter.id);

          return (
            <section
              key={chapter.id}
              className="min-h-screen max-w-7xl mx-auto px-4 flex flex-col justify-center py-16"
            >
              {/* Chapter Title Badge */}
              <div className="text-center space-y-3 mb-10">
                <span className="inline-block px-4 py-1 rounded-full border border-[#B9905A]/40 text-[#B9905A] font-serif text-xs tracking-widest uppercase bg-[#292D2B]/80 backdrop-blur-xs">
                  CHAPTER 0{chapter.chapterNumber}
                </span>
                <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#EFE6CA]">
                  {chapter.title}
                </h2>
                {chapter.subtitle && (
                  <p className="font-serif italic text-base sm:text-lg text-[#B9905A]">
                    {chapter.subtitle}
                  </p>
                )}
                {chapter.description && (
                  <p className="font-sans text-sm text-[#44636A] max-w-2xl mx-auto leading-relaxed">
                    {chapter.description}
                  </p>
                )}
              </div>

              {/* Layout Variations based on Chapter layoutType */}
              {chapter.layoutType === 'polaroid_stack' && (
                <PolaroidStack photos={currentPhotos.length > 0 ? currentPhotos : photos} />
              )}

              {chapter.layoutType === 'film_strip' && (
                <FilmStrip photos={currentPhotos} videos={currentVideos} />
              )}

              {chapter.layoutType === 'video_theater' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto w-full">
                  {(currentVideos.length > 0 ? currentVideos : videos).map((video) => (
                    <div
                      key={video.id}
                      className="bg-[#1A1D1B] border-2 border-[#B9905A]/40 p-4 rounded-lg shadow-2xl space-y-3"
                    >
                      <div className="relative aspect-video rounded overflow-hidden bg-charcoal group cursor-pointer">
                        <img
                          src={video.thumbnailUrl || `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-charcoal/40 flex items-center justify-center">
                          <div className="w-14 h-14 rounded-full bg-[#B9905A] text-charcoal flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Play className="w-7 h-7 fill-current ml-0.5" />
                          </div>
                        </div>
                      </div>
                      <h4 className="font-serif text-lg font-bold text-[#EFE6CA]">
                        {video.title}
                      </h4>
                      {video.description && (
                        <p className="font-sans text-xs text-[#44636A]">
                          {video.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {(chapter.layoutType === 'editorial' || chapter.layoutType === 'torn_collage') && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto w-full">
                  {(currentPhotos.length > 0 ? currentPhotos : photos.slice(0, 3)).map((photo) => (
                    <div
                      key={photo.id}
                      className="paper-card p-4 rounded shadow-polaroid transform hover:-translate-y-2 transition-transform duration-300"
                    >
                      <img
                        src={photo.imageUrl}
                        alt={photo.title}
                        className="w-full h-56 object-cover rounded mb-3 border border-[#292D2B]/10"
                      />
                      <h4 className="font-serif text-base font-bold text-[#292D2B]">
                        {photo.title}
                      </h4>
                      {photo.caption && (
                        <p className="font-handwritten text-sm text-[#44636A] mt-1">
                          "{photo.caption}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>

      {/* TEACHERS SECTION */}
      <section id="teachers" className="relative z-30 py-20 px-4 max-w-5xl mx-auto space-y-10">
        <div className="text-center space-y-2">
          <span className="font-serif text-xs uppercase tracking-widest text-[#B9905A]">
            WORDS OF WISDOM
          </span>
          <h2 className="font-serif text-4xl font-bold text-[#EFE6CA]">
            Faculty Messages
          </h2>
          <p className="font-sans text-sm text-[#44636A]">
            Heartfelt thoughts and wisdom shared by our respected professors.
          </p>
        </div>

        <div className="space-y-6">
          {teachers.map((teacher) => (
            <TeacherCard key={teacher.id} teacher={teacher} />
          ))}
        </div>
      </section>

      {/* PEOPLE BEHIND THE DAY SECTION */}
      <section id="people" className="relative z-30 py-20 px-4 max-w-6xl mx-auto space-y-10">
        <div className="text-center space-y-2">
          <span className="font-serif text-xs uppercase tracking-widest text-[#B9905A]">
            OUR TEAMS & VOLUNTEERS
          </span>
          <h2 className="font-serif text-4xl font-bold text-[#EFE6CA]">
            People Behind the Day
          </h2>
          <p className="font-sans text-sm text-[#44636A]">
            Honoring the organizers, photographers, and contributors who brought Teachers' Day 2026 to life.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {people.map((person) => (
            <div
              key={person.id}
              className="bg-[#1A1D1B] border border-[#B9905A]/30 p-6 rounded-lg text-center space-y-3 hover:border-[#B9905A] transition-colors"
            >
              {person.photoUrl ? (
                <img
                  src={person.photoUrl}
                  alt={person.name}
                  className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-[#B9905A]"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-[#292D2B] text-[#B9905A] font-serif text-xl flex items-center justify-center mx-auto border-2 border-[#B9905A]">
                  {person.name.charAt(0)}
                </div>
              )}
              <div>
                <h4 className="font-serif text-lg font-bold text-[#EFE6CA]">
                  {person.name}
                </h4>
                <p className="font-sans text-xs text-[#B95F46] font-semibold uppercase tracking-wider">
                  {person.role}
                </p>
              </div>
              {person.bio && (
                <p className="font-sans text-xs text-[#44636A] leading-relaxed">
                  {person.bio}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* EMOTIONAL CLOSING SECTION */}
      <section id="beyond" className="relative z-30 py-32 px-4 text-center space-y-6 max-w-3xl mx-auto">
        <Sparkles className="w-8 h-8 text-[#B9905A] mx-auto animate-pulse" />
        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#EFE6CA] leading-tight">
          "Some moments become memories. <br />
          <span className="italic text-[#B9905A]">Some memories become forever."</span>
        </h2>
        <div className="w-20 h-0.5 bg-[#B9905A] mx-auto" />
        <p className="font-serif text-2xl font-bold text-[#B95F46]">
          Thank You, Teachers. ❤️
        </p>
      </section>
    </div>
  );
};
