// ============================================================
// HALL OF MEMORIES — TEACHERS' DAY 2026
// Precision rebuild matching the reference image
// ============================================================
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useInView,
} from "framer-motion";
import {
  Play,
  ChevronRight,
  Menu,
  X,
  Heart,
  BookOpen,
  Instagram,
  Youtube,
  HardDrive,
  ArrowRight,
  Send,
  Feather,
  ChevronLeft,
  ZoomIn,
} from "lucide-react";
import { AdminLayout } from "./admin/AdminLayout.tsx";
import {
  PhysicalBookHero,
  InteractiveChaptersBook,
} from "./book/PhysicalBook.tsx";
import { ApologyPage } from "./components/ApologyPage.tsx";
import { GallerySection } from "./components/GallerySection.tsx";
import {
  fetchChapters,
  fetchPhotos,
  fetchVideos,
  fetchTeachers,
  fetchMemories,
  fetchExternalLinks,
  fetchPeople,
} from "./lib/api.ts";
import type { Chapter, Photo, Video, Teacher, StudentMemory, ExternalLink, Person } from "./types/index.ts";

// ============================================================
// TYPES
// ============================================================
interface ChapterData {
  id: string;
  num: string;
  category: string;
  title: string;
  description: string;
  linkText: string;
  image: string;
  overlayLines: string[];
}

// ============================================================
// CHAPTERS DATA
// ============================================================
const CHAPTERS: ChapterData[] = [
  {
    id: "story",
    num: "01",
    category: "OUR STORY",
    title: "The Story\nof Our Day",
    description:
      "It's not just about classes and subjects,\nbut about the people who made it special.",
    linkText: "EXPLORE OUR STORY",
    image:
      "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1600&q=80",
    overlayLines: ["Every journey", "has a beginning"],
  },
  {
    id: "moments",
    num: "02",
    category: "GREAT MOMENTS",
    title: "Highlights",
    description:
      "Relive the most beautiful highlights\nfrom Teachers' Day 2026.",
    linkText: "WATCH VIDEOS",
    image:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1600&q=80",
    overlayLines: ["Laughter", "Applause", "Unforgettable ♥"],
  },
  {
    id: "teachers",
    num: "03",
    category: "OUR TEACHERS",
    title: "Teachers'\nSupremacy",
    description: "Their wisdom, their presence,\ntheir impact — beyond words.",
    linkText: "VIEW TEACHERS",
    image:
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1600&q=80",
    overlayLines: ["Inspiring", "Guiding", "Believing", "Always ♥"],
  },
  {
    id: "students",
    num: "04",
    category: "STUDENT'S",
    title: "Students'\nHard Work",
    description:
      "Behind the success of the day,\nthere was a lot of passion and effort.",
    linkText: "SEE OUR JOURNEY",
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80",
    overlayLines: ["Ideas", "Efforts", "Teamwork", "Results ♥"],
  },
  {
    id: "activities",
    num: "05",
    category: "ACTIVITIES",
    title: "Pure Enjoyment",
    description:
      "Games, surprises, performances\nand endless fun with our favourite people.",
    linkText: "EXPLORE FUN",
    image:
      "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1600&q=80",
    overlayLines: ["Same People", "More Memories ♥"],
  },
  {
    id: "memories",
    num: "06",
    category: "MEMORIES",
    title: "Crazy Moments",
    description: "Unplanned, unexpected and absolutely\nunforgettable moments.",
    linkText: "SEE THE CRAZINESS",
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=80",
    overlayLines: ["Good People", "Great Memories ♥"],
  },
];

// ============================================================
// ATMOSPHERIC ELEMENTS
// ============================================================
const Petal: React.FC<{
  left: string;
  delay: number;
  duration: number;
  size: number;
}> = ({ left, delay, duration, size }) => (
  <div
    className="petal"
    style={{
      left,
      animationDelay: `${delay}s`,
      animationDuration: `${duration}s`,
      width: size,
      height: size * 0.75,
    }}
  />
);

const Star: React.FC<{ x: string; y: string; size: number; delay: number }> = ({
  x,
  y,
  size,
  delay,
}) => (
  <div
    className="star"
    style={{
      left: x,
      top: y,
      width: size,
      height: size,
      animationDelay: `${delay}s`,
      animationDuration: `${2.5 + delay}s`,
    }}
  />
);

// ============================================================
// THE OPEN BOOK COMPONENT
// ============================================================
const OpenBook: React.FC = () => {
  const pageLines = Array.from({ length: 22 });

  return (
    <div
      className="book-scene"
      style={{ width: "100%", display: "flex", justifyContent: "center" }}
    >
      <div className="book-spread-container" style={{ display: "flex" }}>
        {/* LEFT PAGE */}
        <div
          className="book-page-left"
          style={{
            width: 290,
            height: 430,
            borderRadius: "4px 0 0 4px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          {/* Paper texture lines */}
          <div className="page-lines" />
          {/* Decorative double border */}
          <div
            style={{
              position: "absolute",
              inset: 12,
              border: "2px double rgba(139,100,50,0.4)",
              borderRadius: 2,
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 18,
              border: "1px solid rgba(139,100,50,0.18)",
              borderRadius: 2,
              pointerEvents: "none",
            }}
          />

          {/* Decorative corner flourishes */}
          {[
            ["top-[22px] left-[22px]", "12px 0 0 0"],
            ["top-[22px] right-[22px]", "0 12px 0 0"],
            ["bottom-[22px] left-[22px]", "0 0 0 12px"],
            ["bottom-[22px] right-[22px]", "0 0 12px 0"],
          ].map(([pos, radius], i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                top: pos.includes("top") ? 22 : "auto",
                bottom: pos.includes("bottom") ? 22 : "auto",
                left: pos.includes("left") ? 22 : "auto",
                right: pos.includes("right") ? 22 : "auto",
                width: 18,
                height: 18,
                border: "1px solid rgba(139,100,50,0.4)",
                borderRadius: radius,
              }}
            />
          ))}

          {/* Content */}
          <div
            style={{
              position: "relative",
              zIndex: 2,
              textAlign: "center",
              padding: "0 28px",
            }}
          >
            <div
              style={{
                width: 32,
                height: 1,
                background: "rgba(100,65,20,0.5)",
                margin: "0 auto 12px",
              }}
            />
            <p
              style={{
                fontFamily: "Caveat, cursive",
                fontSize: 30,
                lineHeight: 1.25,
                color: "#3a2510",
                marginBottom: 8,
              }}
            >
              Good
              <br />
              Teachers
              <br />
              Brighter
              <br />
              Futures
            </p>
            <div
              style={{
                width: 32,
                height: 1,
                background: "rgba(100,65,20,0.5)",
                margin: "10px auto",
              }}
            />
            <p
              style={{
                fontFamily: "Caveat, cursive",
                fontSize: 16,
                color: "#5c3d1e",
                lineHeight: 1.4,
              }}
            >
              More than teachers,
              <br />
              <span style={{ color: "#8b3a3a" }}>A family ♥</span>
            </p>
          </div>

          {/* Red bookmark ribbon */}
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 44,
              width: 14,
              height: 72,
              background: "linear-gradient(to bottom, #7a1010, #a01818)",
              boxShadow: "2px 0 4px rgba(0,0,0,0.4)",
              clipPath: "polygon(0 0, 100% 0, 100% 82%, 50% 100%, 0 82%)",
            }}
          />
        </div>

        {/* SPINE */}
        <div className="book-spine" style={{ width: 24, height: 430 }} />

        {/* RIGHT PAGE */}
        <div
          className="book-page-right"
          style={{
            width: 290,
            height: 430,
            borderRadius: "0 4px 4px 0",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div className="page-lines" />
          <img
            src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&q=80"
            alt="Class group"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "sepia(25%) saturate(0.85) brightness(0.82)",
            }}
          />
          {/* Warm overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(61,21,21,0.18)",
              mixBlendMode: "multiply",
            }}
          />
          {/* Thin border */}
          <div
            style={{
              position: "absolute",
              inset: 10,
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 2,
              pointerEvents: "none",
            }}
          />
          {/* Caption */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              padding: "20px 12px 12px",
              background:
                "linear-gradient(to top, rgba(0,0,0,0.6), transparent)",
            }}
          >
            <p
              style={{
                fontFamily: "Caveat, cursive",
                fontSize: 14,
                color: "rgba(242,232,213,0.9)",
                textAlign: "center",
              }}
            >
              September 2026 — A day to remember ♥
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// NAVBAR
// ============================================================
const Navbar: React.FC<{
  onWriteMemory: () => void;
  onAdminClick: () => void;
}> = ({ onWriteMemory, onAdminClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const navLinks = [
    { label: "Home", id: "hero" },
    { label: "Our Story", id: "story" },
    { label: "Great Moments", id: "moments" },
    { label: "Memories", id: "memories" },
    { label: "People", id: "teachers" },
    { label: "Beyond The Day", id: "beyond" },
    { label: "Messages", id: "messages" },
  ];

  return (
    <>
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div
          style={{
            maxWidth: 1440,
            margin: "0 auto",
            padding: "0 24px",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          {/* Logo with Open Book + Feather Quill */}
          <button
            onClick={() => scrollTo("hero")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              background: "none",
              border: "none",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            <svg
              width="34"
              height="28"
              viewBox="0 0 38 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ flexShrink: 0 }}
            >
              <path
                d="M19 12C14 7 7 7 3 9V26C7 24 14 24 19 28C24 24 31 24 35 26V9C31 7 24 7 19 12Z"
                stroke="#c9a463"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="rgba(201,164,99,0.08)"
              />
              <path
                d="M19 12V28"
                stroke="#c9a463"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <path
                d="M22 4C28 3 32 6 31 12C30 18 25 21 21 23"
                stroke="#e2c27e"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <path
                d="M27 7L24 10"
                stroke="#e2c27e"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              <path
                d="M29 9L26 12"
                stroke="#e2c27e"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
            <div style={{ textAlign: "left", lineHeight: 1 }}>
              <div
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#c9a463",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                }}
              >
                HALL OF MEMORIES
              </div>
              <div
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: 8.5,
                  color: "rgba(201,164,99,0.65)",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  marginTop: 2,
                }}
              >
                TEACHERS' DAY 2026
              </div>
            </div>
          </button>

          {/* Center Nav Links — hidden on mobile */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 22,
              flex: 1,
              justifyContent: "center",
            }}
            className="hidden lg:flex"
          >
            {navLinks.map((l) => (
              <button
                key={l.id}
                className="nav-link"
                onClick={() => scrollTo(l.id)}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Menu pill */}
          <button className="menu-pill" onClick={() => setMenuOpen((v) => !v)}>
            <span>MENU</span>
            {menuOpen ? <X size={12} /> : <Menu size={12} />}
          </button>
        </div>
      </nav>

      {/* Expanded Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            style={{
              position: "fixed",
              top: 52,
              left: 0,
              right: 0,
              zIndex: 99,
              background: "rgba(8,2,5,0.94)",
              backdropFilter: "blur(20px)",
              borderBottom: "1px solid rgba(201,164,99,0.12)",
              padding: "28px 24px",
            }}
          >
            <div
              style={{
                maxWidth: 1440,
                margin: "0 auto",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                gap: 8,
              }}
            >
              {navLinks.map((l) => (
                <button
                  key={l.id}
                  onClick={() => scrollTo(l.id)}
                  style={{
                    fontFamily: "Cormorant Garamond, serif",
                    fontSize: 22,
                    color: "rgba(242,232,213,0.8)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    padding: "4px 0",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#c9a463")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "rgba(242,232,213,0.8)")
                  }
                >
                  {l.label}
                </button>
              ))}
              <button
                onClick={() => {
                  onWriteMemory();
                  setMenuOpen(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontFamily: "Inter, sans-serif",
                  fontSize: 12,
                  color: "rgba(184,95,70,0.9)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "4px 0",
                }}
              >
                <Heart size={13} style={{ fill: "currentColor" }} /> Write a
                Memory
              </button>
              <button
                onClick={() => {
                  onAdminClick();
                  setMenuOpen(false);
                }}
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: 11,
                  color: "rgba(139,115,85,0.5)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  padding: "4px 0",
                }}
              >
                Admin →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// ============================================================
// HERO SECTION
// ============================================================
const HeroSection: React.FC<{
  onWatchHighlight: () => void;
  onOpenMedia?: (url: string) => void;
}> = ({ onWatchHighlight, onOpenMedia }) => {
  const [bookDone, setBookDone] = useState(false);

  const floatingWords = [
    "Guidance",
    "Friendship",
    "Knowledge",
    "Better Humans",
    "Forever Grateful",
  ];

  return (
    <section id="hero" className="hero-section" style={{ paddingTop: 52 }}>
      {/* Stars */}
      <Star x="8%" y="18%" size={2} delay={0} />
      <Star x="18%" y="75%" size={1.5} delay={1.1} />
      <Star x="72%" y="12%" size={2} delay={0.6} />
      <Star x="88%" y="55%" size={1.5} delay={1.8} />
      <Star x="44%" y="35%" size={1} delay={0.9} />
      <Star x="94%" y="25%" size={2} delay={2.2} />
      <Star x="6%" y="88%" size={1.5} delay={1.4} />
      <Star x="55%" y="82%" size={1} delay={0.4} />

      {/* Rose Petals */}
      <Petal left="8%" delay={0} duration={11} size={14} />
      <Petal left="22%" delay={2.5} duration={13} size={11} />
      <Petal left="38%" delay={5} duration={10} size={16} />
      <Petal left="55%" delay={1.5} duration={12} size={13} />
      <Petal left="68%" delay={3.5} duration={14} size={10} />
      <Petal left="80%" delay={0.8} duration={11} size={15} />
      <Petal left="91%" delay={4.5} duration={13} size={12} />
      <Petal left="48%" delay={6.5} duration={9} size={9} />

      {/* Main content grid */}
      <div
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          padding: "0 40px",
          width: "100%",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 32,
            alignItems: "center",
            minHeight: "calc(100vh - 52px)",
            paddingBottom: 40,
          }}
        >
          {/* ===== LEFT TEXT ===== */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 14,
            }}
          >
            {/* Cursive handwritten top */}
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={bookDone ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 }}
              style={{
                fontFamily: "Caveat, cursive",
                fontSize: 28,
                color: "#c9a463",
                lineHeight: 1,
                marginBottom: 0,
              }}
            >
              A day to remember
            </motion.p>

            {/* Main heading */}
            <div style={{ overflow: "hidden" }}>
              <motion.h1
                initial={{ opacity: 0, y: 70 }}
                animate={bookDone ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 1.0,
                  delay: 0.25,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{
                  fontFamily: "Playfair Display, serif",
                  fontWeight: 900,
                  lineHeight: 0.9,
                  letterSpacing: "-0.02em",
                  margin: 0,
                }}
              >
                <span
                  style={{
                    display: "block",
                    fontSize: "clamp(52px, 8vw, 96px)",
                    color: "#f2e8d5",
                  }}
                >
                  TEACHERS'
                </span>
                <span
                  style={{
                    display: "block",
                    fontSize: "clamp(52px, 8vw, 96px)",
                    color: "#f2e8d5",
                  }}
                >
                  DAY 2026
                </span>
              </motion.h1>
            </div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={bookDone ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.45 }}
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 13,
                lineHeight: 1.7,
                color: "rgba(196,180,154,0.85)",
                maxWidth: 320,
                margin: 0,
              }}
            >
              A celebration of guidance, friendship
              <br />
              and unforgettable memories.
              <br />
              <em style={{ color: "rgba(201,164,99,0.75)" }}>
                Forever in our hearts.
              </em>
            </motion.p>

            {/* Watch Highlight button */}
            <motion.button
              initial={{ opacity: 0, y: 14 }}
              animate={bookDone ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              onClick={onWatchHighlight}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                background: "rgba(242,232,213,0.07)",
                border: "1px solid rgba(242,232,213,0.25)",
                borderRadius: 999,
                padding: "9px 22px 9px 10px",
                cursor: "pointer",
                fontFamily: "Inter, sans-serif",
                fontSize: 10.5,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "#f2e8d5",
                backdropFilter: "blur(8px)",
                width: "fit-content",
                transition: "border-color 0.3s, box-shadow 0.3s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor =
                  "rgba(201,164,99,0.5)";
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 0 20px rgba(201,164,99,0.15)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor =
                  "rgba(242,232,213,0.25)";
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  border: "1px solid rgba(201,164,99,0.45)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(201,164,99,0.12)",
                }}
              >
                <Play
                  size={13}
                  style={{ fill: "#c9a463", color: "#c9a463", marginLeft: 2 }}
                />
              </div>
              Watch Highlight
            </motion.button>

            {/* Scroll to begin */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={bookDone ? { opacity: 1 } : {}}
              transition={{ delay: 0.9 }}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                marginTop: 8,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 1,
                    height: 32,
                    background: "rgba(201,164,99,0.3)",
                  }}
                />
                <p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: 9.5,
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                    color: "rgba(201,164,99,0.5)",
                    margin: 0,
                  }}
                >
                  SCROLL TO BEGIN
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 5,
                  paddingLeft: 1,
                }}
              >
                <div className="scroll-dot" />
                <div className="scroll-dot" />
                <div className="scroll-dot" />
              </div>
            </motion.div>
          </div>

          {/* ===== RIGHT: 3D PHYSICAL BOOK ===== */}
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <PhysicalBookHero
              onIntroComplete={() => setBookDone(true)}
              onWatchHighlight={onWatchHighlight}
              onOpenMedia={onOpenMedia}
            />

            {/* Feather quill */}
            <motion.div
              initial={{ opacity: 0, rotate: -30, x: -20 }}
              animate={bookDone ? { opacity: 0.35, rotate: -15, x: 0 } : {}}
              transition={{ delay: 1.5, duration: 1.2 }}
              style={{
                position: "absolute",
                bottom: -10,
                left: "12%",
                pointerEvents: "none",
              }}
            >
              <Feather
                size={72}
                color="#c9a463"
                style={{ transform: "rotate(-15deg)" }}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================================
// SECTION DIVIDER
// ============================================================
const SectionDivider: React.FC<{ label: string }> = ({ label }) => (
  <div
    style={{
      background: "var(--bg2)",
      padding: "10px 40px",
      display: "flex",
      alignItems: "center",
      gap: 16,
    }}
  >
    <div
      style={{
        flex: 1,
        height: 1,
        background:
          "linear-gradient(to right, transparent, rgba(201,164,99,0.3))",
      }}
    />
    <span
      style={{
        fontFamily: "Inter, sans-serif",
        fontSize: 9.5,
        letterSpacing: "0.3em",
        textTransform: "uppercase",
        color: "rgba(201,164,99,0.45)",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
    <div
      style={{
        flex: 1,
        height: 1,
        background:
          "linear-gradient(to left, transparent, rgba(201,164,99,0.3))",
      }}
    />
  </div>
);

// ============================================================
// CHAPTER ROW
// ============================================================
const ChapterRow: React.FC<{
  chapter: ChapterData;
  isActive: boolean;
  onImageClick: (src: string) => void;
}> = ({ chapter, isActive, onImageClick }) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(rowRef, { once: true, margin: "-8%" });

  return (
    <div ref={rowRef} id={chapter.id} className="chapter-row-container">
      {/* Timeline circle */}
      <div className={`timeline-circle ${isActive ? "active" : ""}`}>
        {chapter.num}
      </div>

      <div className="chapter-row-content">
        {/* Left text column */}
        <motion.div
          className="chapter-left-info"
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {/* Category label */}
          <p className="chapter-category-label">{chapter.category}</p>

          {/* Title */}
          <h2 className="chapter-heading">{chapter.title}</h2>

          {/* Description */}
          <p className="chapter-desc">{chapter.description}</p>

          {/* CTA Link */}
          <button
            className="chapter-link-btn"
            onClick={() => onImageClick(chapter.image)}
          >
            <span>{chapter.linkText}</span>
            <ArrowRight size={13} className="chapter-link-arrow" />
          </button>
        </motion.div>

        {/* Right self-contained rounded media card */}
        <motion.div
          className="chapter-media-card"
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          onClick={() => onImageClick(chapter.image)}
        >
          {/* Contained image */}
          <img
            src={chapter.image}
            alt={chapter.title}
            loading="lazy"
            className="chapter-card-img"
          />

          {/* Vignette / Warm tint overlay */}
          <div className="chapter-card-overlay" />

          {/* Cursive handwritten overlay text */}
          <div className="chapter-card-cursive">
            {chapter.overlayLines.map((line, i) => (
              <p key={i} className="chapter-cursive-line">
                {line}
              </p>
            ))}
          </div>

          {/* Circular arrow action button */}
          <div className="chapter-card-action">
            <ChevronRight size={18} />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// ============================================================
// CHAPTERS SECTION WITH VERTICAL TIMELINE
// ============================================================
const ChaptersSection: React.FC<{ onImageClick: (src: string) => void }> = ({
  onImageClick,
}) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start 80%", "end 20%"],
  });

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (v) => {
      setActiveIdx(
        Math.min(Math.floor(v * CHAPTERS.length), CHAPTERS.length - 1),
      );
    });
    return unsubscribe;
  }, [scrollYProgress]);

  return (
    <section ref={wrapperRef} className="chapters-wrapper">
      <div className="chapters-inner">
        {/* Continuous vertical timeline line */}
        <div className="timeline-line" />

        <div className="chapters-list">
          {CHAPTERS.map((ch, i) => (
            <ChapterRow
              key={ch.id}
              chapter={ch}
              isActive={i === activeIdx}
              onImageClick={onImageClick}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================================
// CLOSING QUOTE SECTION
// ============================================================
const ClosingSection: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-12%" });

  return (
    <section
      ref={ref}
      id="beyond"
      className="closing-section"
      style={{ padding: "100px 40px" }}
    >
      {/* Background petals */}
      <Petal left="5%" delay={0} duration={16} size={18} />
      <Petal left="92%" delay={4} duration={14} size={13} />
      <Petal left="50%" delay={8} duration={18} size={11} />

      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "260px 1fr",
          gap: 64,
          alignItems: "center",
        }}
      >
        {/* Handwritten card (left) */}
        <motion.div
          initial={{ opacity: 0, x: -40, rotate: -3 }}
          animate={isInView ? { opacity: 1, x: 0, rotate: -2 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          style={{ position: "relative" }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #ede0c8, #f5edd8)",
              borderRadius: 4,
              padding: "32px 28px",
              position: "relative",
              boxShadow:
                "0 20px 60px rgba(0,0,0,0.7), 0 4px 16px rgba(0,0,0,0.5)",
              overflow: "hidden",
            }}
          >
            {/* Paper lines */}
            {Array.from({ length: 13 }).map((_, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: 14 + i * 22,
                  height: 1,
                  background: "rgba(139,115,85,0.12)",
                }}
              />
            ))}
            {/* Tape at top */}
            <div
              style={{
                position: "absolute",
                top: -10,
                left: "50%",
                transform: "translateX(-50%) rotate(-1deg)",
                width: 72,
                height: 22,
                background: "rgba(242,232,213,0.65)",
                border: "1px solid rgba(139,115,85,0.25)",
                borderRadius: 2,
              }}
            />
            <div
              style={{ position: "relative", zIndex: 1, textAlign: "center" }}
            >
              <p
                style={{
                  fontFamily: "Caveat, cursive",
                  fontSize: 22,
                  color: "#3a2810",
                  lineHeight: 1.5,
                  margin: 0,
                }}
              >
                Thank you
                <br />
                <span style={{ color: "#5c3d1e" }}>for being</span>
                <br />
                a part of
                <br />
                our story.
              </p>
              <div
                style={{
                  marginTop: 12,
                  fontFamily: "Caveat, cursive",
                  fontSize: 28,
                  color: "#8b1a1a",
                }}
              >
                ♥
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right: Quote */}
        <div>
          {/* Large quote mark */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontSize: 120,
              fontWeight: 700,
              color: "rgba(201,164,99,0.12)",
              lineHeight: 0.8,
              marginBottom: 8,
              userSelect: "none",
            }}
          >
            "
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 36 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: "Playfair Display, serif",
              fontWeight: 400,
              fontSize: "clamp(22px, 3.5vw, 42px)",
              lineHeight: 1.35,
              color: "#f2e8d5",
              margin: "-36px 0 24px",
            }}
          >
            Some moments become memories
            <br />
            <em style={{ color: "#c9a463" }}>and some memories</em>
            <br />
            become our forever.
          </motion.h2>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={isInView ? { scaleX: 1, opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            style={{
              height: 1,
              background: "rgba(201,164,99,0.35)",
              maxWidth: 200,
              marginBottom: 20,
              transformOrigin: "left",
            }}
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.8 }}
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 10,
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              color: "rgba(201,164,99,0.65)",
            }}
          >
            — THANK YOU, TEACHERS —
          </motion.p>
        </div>
      </div>
    </section>
  );
};

// ============================================================
// SITE FOOTER
// ============================================================
const SiteFooter: React.FC<{ onWriteMemory: () => void }> = ({
  onWriteMemory,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-5%" });

  return (
    <footer
      ref={ref}
      id="messages"
      className="site-footer"
      style={{ padding: "56px 40px 28px" }}
    >
      <div style={{ maxWidth: 1440, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          style={{
            display: "grid",
            gridTemplateColumns: "200px 1fr 1fr 1fr 220px",
            gap: 40,
            paddingBottom: 48,
            borderBottom: "1px solid rgba(201,164,99,0.1)",
          }}
          className="flex-wrap"
        >
          {/* Logo col */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  border: "1px solid rgba(201,164,99,0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#c9a463",
                }}
              >
                <BookOpen size={14} />
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "Cormorant Garamond, serif",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#c9a463",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                  }}
                >
                  HALL OF MEMORIES
                </div>
                <div
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: 8,
                    color: "rgba(201,164,99,0.5)",
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    marginTop: 2,
                  }}
                >
                  TEACHERS' DAY 2026
                </div>
              </div>
            </div>
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 11,
                color: "rgba(196,180,154,0.55)",
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              A digital memory book preserving the laughter, gratitude, and
              unforgettable moments.
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontFamily: "Inter, sans-serif",
                fontSize: 10.5,
                color: "rgba(184,95,70,0.75)",
              }}
            >
              Made with <Heart size={11} style={{ fill: "currentColor" }} /> by
              The Students
            </div>
          </div>

          {/* EXPLORE */}
          <div>
            <h6
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 9.5,
                fontWeight: 600,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "#c9a463",
                marginBottom: 16,
              }}
            >
              EXPLORE
            </h6>
            {([
              { label: "Our Story",      id: "story" },
              { label: "Great Moments",  id: "moments" },
              { label: "Memories",       id: "memories" },
              { label: "People Behind",  id: "teachers" },
              { label: "Beyond The Day", id: "beyond" },
            ] as { label: string; id: string }[]).map(({ label, id }) => (
              <button
                key={id}
                onClick={() => {
                  const el = document.getElementById(id);
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                style={{
                  display: "block",
                  fontFamily: "Inter, sans-serif",
                  fontSize: 12,
                  color: "rgba(196,180,154,0.6)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "3px 0",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#c9a463")}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "rgba(196,180,154,0.6)")
                }
              >
                {label}
              </button>
            ))}
          </div>

          {/* CONNECT */}
          <div>
            <h6
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 9.5,
                fontWeight: 600,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "#c9a463",
                marginBottom: 16,
              }}
            >
              CONNECT
            </h6>
            {([
              { icon: Instagram, label: "Instagram",        href: "https://instagram.com" },
              { icon: Youtube,   label: "YouTube",          href: "https://youtube.com" },
              { icon: HardDrive, label: "Drive Album",      href: "#" },
              { icon: Heart,     label: "Share Your Memory", href: null },
            ] as { icon: React.ElementType; label: string; href: string | null }[]).map(({ icon: Icon, label, href }) => (
              <button
                key={label}
                onClick={() => {
                  if (label === "Share Your Memory") { onWriteMemory(); return; }
                  if (href && href !== "#") window.open(href, "_blank", "noopener");
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  fontFamily: "Inter, sans-serif",
                  fontSize: 12,
                  color: "rgba(196,180,154,0.6)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "3px 0",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#c9a463")}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "rgba(196,180,154,0.6)")
                }
              >
                <Icon size={12} /> {label}
              </button>
            ))}
          </div>

          {/* LEGAL */}
          <div>
            <h6
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 9.5,
                fontWeight: 600,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "#c9a463",
                marginBottom: 16,
              }}
            >
              LEGAL
            </h6>
            {["Privacy Policy", "Terms of Use"].map((item) => (
              <button
                key={item}
                style={{
                  display: "block",
                  fontFamily: "Inter, sans-serif",
                  fontSize: 12,
                  color: "rgba(196,180,154,0.6)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "3px 0",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#c9a463")}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "rgba(196,180,154,0.6)")
                }
              >
                {item}
              </button>
            ))}
          </div>

          {/* WRITE A MESSAGE */}
          <div className="write-box">
            <h6
              style={{
                fontFamily: "Cormorant Garamond, serif",
                fontSize: 17,
                fontWeight: 600,
                color: "#f2e8d5",
                marginBottom: 6,
              }}
            >
              Write a Message
            </h6>
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 11,
                color: "rgba(196,180,154,0.6)",
                lineHeight: 1.6,
                marginBottom: 14,
              }}
            >
              Have a message for our teachers? Share it with us!
            </p>
            <button
              onClick={onWriteMemory}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "9px 14px",
                background: "rgba(201,164,99,0.08)",
                border: "1px solid rgba(201,164,99,0.3)",
                borderRadius: 6,
                cursor: "pointer",
                transition: "all 0.25s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor =
                  "rgba(201,164,99,0.6)";
                (e.currentTarget as HTMLElement).style.background =
                  "rgba(201,164,99,0.15)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor =
                  "rgba(201,164,99,0.3)";
                (e.currentTarget as HTMLElement).style.background =
                  "rgba(201,164,99,0.08)";
              }}
            >
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: 11,
                  color: "rgba(201,164,99,0.8)",
                }}
              >
                Share it with us
              </span>
              <ArrowRight size={15} color="#c9a463" />
            </button>
          </div>
        </motion.div>

        {/* Bottom copyright */}
        <div
          style={{
            paddingTop: 20,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 10,
              color: "rgba(139,115,85,0.5)",
            }}
          >
            © 2026 Teachers' Day Hall of Memories. All rights reserved.
          </span>
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 10,
              color: "rgba(139,115,85,0.5)",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            Made with{" "}
            <Heart
              size={10}
              style={{
                fill: "rgba(184,95,70,0.6)",
                color: "rgba(184,95,70,0.6)",
              }}
            />{" "}
            by The Students
          </span>
        </div>
      </div>
    </footer>
  );
};

// ============================================================
// WRITE MEMORY MODAL
// ============================================================
const WriteMemoryModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setLoading(true);
    try {
      await fetch("/api/memories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorName: name,
          message,
          authorRole: "Student, Sec-D CSE 2026",
        }),
      });
    } catch {
      /* silent */
    }
    setLoading(false);
    setSubmitted(true);
  };

  const reset = useCallback(() => {
    setSubmitted(false);
    setName("");
    setMessage("");
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") reset(); };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, reset]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && reset()}
    >
      <motion.div
        className="modal-box"
        style={{ maxWidth: 480 }}
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 16 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <div style={{ padding: "36px 36px 32px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 24,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Heart size={18} style={{ fill: "#c87b5a", color: "#c87b5a" }} />
              <h3
                style={{
                  fontFamily: "Playfair Display, serif",
                  fontSize: 22,
                  color: "#f2e8d5",
                  margin: 0,
                }}
              >
                Write a Memory
              </h3>
            </div>
            <button
              onClick={reset}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "rgba(196,180,154,0.5)",
              }}
            >
              <X size={18} />
            </button>
          </div>

          {submitted ? (
            <div style={{ textAlign: "center", padding: "24px 0" }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  border: "1px solid rgba(201,164,99,0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                  color: "#c9a463",
                }}
              >
                <Heart size={24} style={{ fill: "currentColor" }} />
              </div>
              <h4
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  fontSize: 24,
                  color: "#f2e8d5",
                  marginBottom: 8,
                }}
              >
                Memory Received!
              </h4>
              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: 12,
                  color: "rgba(196,180,154,0.65)",
                  marginBottom: 24,
                }}
              >
                Your heartfelt message will appear after review.
              </p>
              <button
                onClick={reset}
                style={{
                  padding: "10px 32px",
                  borderRadius: 999,
                  background: "rgba(201,164,99,0.15)",
                  border: "1px solid rgba(201,164,99,0.4)",
                  color: "#c9a463",
                  fontFamily: "Inter, sans-serif",
                  fontSize: 11,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: 16 }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontFamily: "Inter, sans-serif",
                    fontSize: 9.5,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "rgba(201,164,99,0.7)",
                    marginBottom: 6,
                  }}
                >
                  Your Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g. Priya Sharma"
                  className="dark-input"
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontFamily: "Inter, sans-serif",
                    fontSize: 9.5,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "rgba(201,164,99,0.7)",
                    marginBottom: 6,
                  }}
                >
                  Your Memory / Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={4}
                  placeholder="Share a heartfelt memory or thank you note for our teachers..."
                  className="dark-input"
                  style={{ resize: "none" }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 12,
                  paddingTop: 4,
                }}
              >
                <button
                  type="button"
                  onClick={reset}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "Inter, sans-serif",
                    fontSize: 11,
                    color: "rgba(196,180,154,0.5)",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 24px",
                    borderRadius: 999,
                    background: "#c9a463",
                    color: "#0e0407",
                    fontFamily: "Inter, sans-serif",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    border: "none",
                    cursor: "pointer",
                    opacity: loading ? 0.6 : 1,
                  }}
                >
                  {loading ? "Submitting..." : "Submit"} <Send size={12} />
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

// ============================================================
// ADMIN LOGIN MODAL
// ============================================================
const AdminModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ isOpen, onClose, onSuccess }) => {
  const [user, setUser] = useState("admin");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: user, password: pass }),
      });
      const json = await res.json();
      if (json.token) {
        localStorage.setItem("admin_token", json.token);
        onSuccess();
      } else setErr(json.error || "Invalid credentials");
    } catch {
      setErr("Connection failed");
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        className="modal-box"
        style={{ maxWidth: 360 }}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div style={{ padding: "32px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <h3
              style={{
                fontFamily: "Playfair Display, serif",
                fontSize: 20,
                color: "#f2e8d5",
                margin: 0,
              }}
            >
              Admin Access
            </h3>
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "rgba(196,180,154,0.5)",
              }}
            >
              <X size={17} />
            </button>
          </div>
          {err && (
            <div
              style={{
                padding: "10px 12px",
                background: "rgba(139,30,30,0.3)",
                border: "1px solid rgba(139,30,30,0.5)",
                borderRadius: 6,
                fontFamily: "Inter, sans-serif",
                fontSize: 12,
                color: "#f8a0a0",
                marginBottom: 16,
              }}
            >
              {err}
            </div>
          )}
          <form
            onSubmit={handleLogin}
            style={{ display: "flex", flexDirection: "column", gap: 12 }}
          >
            <input
              value={user}
              onChange={(e) => setUser(e.target.value)}
              placeholder="Username"
              className="dark-input"
            />
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="Password"
              className="dark-input"
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "11px",
                borderRadius: 999,
                background: "#c9a463",
                color: "#0e0407",
                fontFamily: "Inter, sans-serif",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                border: "none",
                cursor: "pointer",
                marginTop: 4,
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? "Verifying..." : "Sign In"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

// ============================================================
// VIDEO MODAL
// ============================================================
const VideoModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        style={{ width: "100%", maxWidth: 900 }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: 10,
          }}
        >
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "rgba(242,232,213,0.6)",
            }}
          >
            <X size={26} />
          </button>
        </div>
        <div
          style={{
            aspectRatio: "16/9",
            background: "#120509",
            borderRadius: 10,
            border: "1px solid rgba(201,164,99,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 14,
            boxShadow: "0 30px 80px rgba(0,0,0,0.8)",
          }}
        >
          <Play size={56} color="rgba(201,164,99,0.35)" />
          <p
            style={{
              fontFamily: "Playfair Display, serif",
              fontSize: 20,
              color: "#f2e8d5",
              margin: 0,
            }}
          >
            Highlight Video
          </p>
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 12,
              color: "rgba(196,180,154,0.45)",
              textAlign: "center",
              margin: 0,
              maxWidth: 300,
            }}
          >
            Add a YouTube link via Admin CMS to display the highlight video
            here.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

// ============================================================
// FULLSCREEN IMAGE VIEWER
// ============================================================
const ImageViewer: React.FC<{ src: string | null; onClose: () => void }> = ({
  src,
  onClose,
}) => {
  useEffect(() => {
    if (!src) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [src, onClose]);

  if (!src) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="viewer-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <button
          onClick={onClose}
          aria-label="Close Fullscreen View"
          style={{
            position: "absolute",
            top: 20,
            right: 24,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "rgba(242,232,213,0.8)",
            zIndex: 310,
          }}
        >
          <X size={32} />
        </button>
        <motion.img
          src={src}
          alt="Fullscreen"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.92 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          style={{
            maxWidth: "92vw",
            maxHeight: "90vh",
            objectFit: "contain",
            borderRadius: 8,
            boxShadow: "0 40px 100px rgba(0,0,0,0.95), 0 0 40px rgba(201,164,99,0.15)",
            border: "1px solid rgba(201,164,99,0.2)",
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
};

// ============================================================
// ADMIN SHELL WRAPPER — fetches live data from API
// ============================================================
const AdminShell: React.FC<{
  onLogout: () => void;
  onReturnToPublic: () => void;
}> = ({ onLogout, onReturnToPublic }) => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [memories, setMemories] = useState<StudentMemory[]>([]);
  const [links, setLinks] = useState<ExternalLink[]>([]);
  const [people, setPeople] = useState<Person[]>([]);

  const loadAll = useCallback(async () => {
    const [c, ph, v, t, m_pending, m_approved, m_rejected, l, p] = await Promise.all([
      fetchChapters(true),
      fetchPhotos(undefined, undefined, true),
      fetchVideos(undefined, true),
      fetchTeachers(true),
      fetchMemories("pending"),
      fetchMemories("approved"),
      fetchMemories("rejected"),
      fetchExternalLinks(),
      fetchPeople(),
    ]);
    setChapters(c);
    setPhotos(ph);
    setVideos(v);
    setTeachers(t);
    setMemories([...m_pending, ...m_approved, ...m_rejected]);
    setLinks(l);
    setPeople(p);
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  return (
    <AdminLayout
      chapters={chapters}
      photos={photos}
      videos={videos}
      teachers={teachers}
      memories={memories}
      links={links}
      people={people}
      onRefresh={loadAll}
      onLogout={onLogout}
      onReturnToPublic={onReturnToPublic}
    />
  );
};

// ============================================================
// MAIN APP
// ============================================================
export function App() {
  const [showMemory, setShowMemory] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [viewerSrc, setViewerSrc] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const t = localStorage.getItem("admin_token");
    if (t) setIsAdmin(true);
  }, []);

  if (isAdmin) {
    return (
      <AdminShell
        onLogout={() => {
          localStorage.removeItem("admin_token");
          setIsAdmin(false);
        }}
        onReturnToPublic={() => setIsAdmin(false)}
      />
    );
  }

  return (
    <div
      style={{ background: "#0e0407", color: "#f2e8d5", minHeight: "100vh" }}
    >
      {/* Floating petals — always visible across the whole page */}
      <Petal left="3%" delay={0} duration={14} size={12} />
      <Petal left="97%" delay={6} duration={16} size={10} />

      {/* NAVBAR */}
      <Navbar
        onWriteMemory={() => setShowMemory(true)}
        onAdminClick={() => setShowAdmin(true)}
      />

      {/* HERO */}
      <HeroSection
        onWatchHighlight={() => setShowVideo(true)}
        onOpenMedia={(src) => setViewerSrc(src)}
      />

      {/* DIVIDER */}
      <SectionDivider label="EXPLORE OUR MEMORIES IN PARCHMENT" />

      {/* CHAPTERS SECTION — VERTICAL TIMELINE (matches reference) */}
      <ChaptersSection onImageClick={(src) => setViewerSrc(src)} />

      {/* ONE LAST PAGE — Apology / Gratitude note */}
      <ApologyPage />

      {/* 3D DEPTH CARD CAROUSEL GALLERY SECTION */}
      <GallerySection onImageClick={(src) => setViewerSrc(src)} />

      {/* CLOSING SECTION */}
      <ClosingSection />

      {/* FOOTER */}
      <SiteFooter onWriteMemory={() => setShowMemory(true)} />

      {/* MODALS */}
      <AnimatePresence>
        {showMemory && (
          <WriteMemoryModal
            isOpen={showMemory}
            onClose={() => setShowMemory(false)}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showAdmin && (
          <AdminModal
            isOpen={showAdmin}
            onClose={() => setShowAdmin(false)}
            onSuccess={() => {
              setShowAdmin(false);
              setIsAdmin(true);
            }}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showVideo && (
          <VideoModal isOpen={showVideo} onClose={() => setShowVideo(false)} />
        )}
      </AnimatePresence>
      <ImageViewer src={viewerSrc} onClose={() => setViewerSrc(null)} />
    </div>
  );
}
