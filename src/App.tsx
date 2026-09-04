import React, { useState, useEffect } from 'react';
import {
  fetchChapters,
  fetchPhotos,
  fetchVideos,
  fetchTeachers,
  fetchMemories,
  fetchExternalLinks,
  fetchPeople,
} from './lib/api.ts';
import { Chapter, Photo, Video, Teacher, StudentMemory, ExternalLink, Person } from './types/index.ts';
import { initialChapters, initialPhotos, initialVideos, initialTeachers, initialStudentMemories, initialExternalLinks, initialPeople } from '../server/services/store.ts';

import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { ApologyPage } from './components/ApologyPage.tsx';
import { EndingParticles } from './components/EndingParticles.tsx';
import { MemorySubmissionModal } from './components/MemorySubmissionModal.tsx';
import { InteractiveBookSystem } from './book/InteractiveBookSystem.tsx';

import { AdminLogin } from './admin/AdminLogin.tsx';
import { AdminLayout } from './admin/AdminLayout.tsx';

export function App() {
  const [chapters, setChapters] = useState<Chapter[]>(initialChapters);
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);
  const [videos, setVideos] = useState<Video[]>(initialVideos);
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);
  const [memories, setMemories] = useState<StudentMemory[]>(initialStudentMemories);
  const [links, setLinks] = useState<ExternalLink[]>(initialExternalLinks);
  const [people, setPeople] = useState<Person[]>(initialPeople);

  const [isMemoryModalOpen, setIsMemoryModalOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  const loadData = async () => {
    try {
      const [chData, pData, vData, tData, mData, lData, peData] = await Promise.all([
        fetchChapters(),
        fetchPhotos(),
        fetchVideos(),
        fetchTeachers(),
        fetchMemories(isAdminAuthenticated ? undefined : 'approved'),
        fetchExternalLinks(),
        fetchPeople(),
      ]);

      if (chData.length > 0) setChapters(chData);
      if (pData.length > 0) setPhotos(pData);
      if (vData.length > 0) setVideos(vData);
      if (tData.length > 0) setTeachers(tData);
      if (mData.length > 0) setMemories(mData);
      if (lData.length > 0) setLinks(lData);
      if (peData.length > 0) setPeople(peData);
    } catch (err) {
      console.warn('API fetching notice: loaded default memory book dataset.');
    }
  };

  useEffect(() => {
    loadData();
    const token = localStorage.getItem('admin_token');
    if (token) {
      setIsAdminAuthenticated(true);
    }
  }, [isAdminAuthenticated]);

  const handleNavigateSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setIsAdminAuthenticated(false);
  };

  if (isAdminAuthenticated) {
    return (
      <AdminLayout
        chapters={chapters}
        photos={photos}
        videos={videos}
        teachers={teachers}
        memories={memories}
        links={links}
        people={people}
        onRefresh={loadData}
        onLogout={handleLogout}
        onReturnToPublic={() => setIsAdminAuthenticated(false)}
      />
    );
  }

  return (
    <div className="relative min-h-screen bg-[#1A1D1B] text-[#EFE6CA] overflow-x-hidden">
      {/* Navbar */}
      <Navbar
        onOpenWriteMemory={() => setIsMemoryModalOpen(true)}
        onOpenAdmin={() => setIsAdminLoginOpen(true)}
        onNavigateSection={handleNavigateSection}
      />

      {/* Main Interactive 3D Book & Scroll Storytelling Engine */}
      <main>
        <InteractiveBookSystem
          chapters={chapters}
          photos={photos}
          videos={videos}
          teachers={teachers}
          people={people}
          onOpenWriteMemory={() => setIsMemoryModalOpen(true)}
        />
      </main>

      {/* Magical Ending Light Particles */}
      <EndingParticles />

      {/* "One Last Page" Handwritten Student Apology Note */}
      <ApologyPage />

      {/* Footer */}
      <Footer
        externalLinks={links}
        onOpenWriteMemory={() => setIsMemoryModalOpen(true)}
        onNavigateSection={handleNavigateSection}
      />

      {/* Public Memory Submission Modal */}
      <MemorySubmissionModal
        isOpen={isMemoryModalOpen}
        onClose={() => setIsMemoryModalOpen(false)}
      />

      {/* Admin Credentials Login Modal */}
      <AdminLogin
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={() => {
          setIsAdminLoginOpen(false);
          setIsAdminAuthenticated(true);
        }}
      />
    </div>
  );
}
