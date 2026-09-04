import React, { useState } from 'react';
import { Chapter, Photo, Video, Teacher, StudentMemory, ExternalLink, Person } from '../types/index.ts';
import { DashboardOverview } from './DashboardOverview.tsx';
import { ModerationQueue } from './ModerationQueue.tsx';
import { PhotosManager } from './PhotosManager.tsx';
import { VideosManager } from './VideosManager.tsx';
import { TeachersManager } from './TeachersManager.tsx';
import { ChaptersManager } from './ChaptersManager.tsx';
import { LayoutDashboard, BookOpen, Image, Video as VideoIcon, UserCheck, MessageSquare, LogOut, ArrowLeft } from 'lucide-react';

interface AdminLayoutProps {
  chapters: Chapter[];
  photos: Photo[];
  videos: Video[];
  teachers: Teacher[];
  memories: StudentMemory[];
  links: ExternalLink[];
  people: Person[];
  onRefresh: () => void;
  onLogout: () => void;
  onReturnToPublic: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  chapters,
  photos,
  videos,
  teachers,
  memories,
  links,
  people,
  onRefresh,
  onLogout,
  onReturnToPublic,
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  const pendingCount = memories.filter((m) => m.status === 'pending').length;

  const menuItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'chapters', label: 'Book Chapters', icon: BookOpen },
    { id: 'photos', label: 'Photos Gallery', icon: Image },
    { id: 'videos', label: 'YouTube Videos', icon: VideoIcon },
    { id: 'teachers', label: 'Faculty Messages', icon: UserCheck },
    { id: 'memories', label: 'Submissions Queue', icon: MessageSquare, badge: pendingCount },
  ];

  return (
    <div className="min-h-screen bg-[#121413] text-[#EFE6CA] font-sans flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#1A1D1B] border-r border-[#B9905A]/30 p-6 flex flex-col justify-between flex-shrink-0">
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full border border-[#B9905A] flex items-center justify-center text-[#B9905A] bg-[#292D2B]">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-base font-bold text-[#EFE6CA]">
                CMS DASHBOARD
              </h2>
              <p className="text-[10px] text-[#B9905A] uppercase tracking-widest">
                TEACHERS' DAY 2026
              </p>
            </div>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const IconComp = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-[#B9905A] text-[#1A1D1B] font-bold'
                      : 'text-[#EFE6CA]/70 hover:bg-[#292D2B] hover:text-[#EFE6CA]'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <IconComp className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-[#B95F46] text-[#EFE6CA] text-[10px] font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Controls */}
        <div className="pt-6 border-t border-[#B9905A]/20 space-y-2">
          <button
            onClick={onReturnToPublic}
            className="w-full flex items-center space-x-2 px-3.5 py-2 rounded text-xs text-[#44636A] hover:text-[#EFE6CA] hover:bg-[#292D2B] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Public Site</span>
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-2 px-3.5 py-2 rounded text-xs text-red-400 hover:bg-red-950/40 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Admin</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        {activeTab === 'overview' && (
          <DashboardOverview
            chapters={chapters}
            photos={photos}
            videos={videos}
            teachers={teachers}
            memories={memories}
            links={links}
            people={people}
            onSelectTab={setActiveTab}
          />
        )}
        {activeTab === 'memories' && (
          <ModerationQueue memories={memories} onRefresh={onRefresh} />
        )}
        {activeTab === 'photos' && (
          <PhotosManager photos={photos} chapters={chapters} onRefresh={onRefresh} />
        )}
        {activeTab === 'videos' && (
          <VideosManager videos={videos} chapters={chapters} onRefresh={onRefresh} />
        )}
        {activeTab === 'teachers' && (
          <TeachersManager teachers={teachers} onRefresh={onRefresh} />
        )}
        {activeTab === 'chapters' && (
          <ChaptersManager chapters={chapters} onRefresh={onRefresh} />
        )}
      </main>
    </div>
  );
};
