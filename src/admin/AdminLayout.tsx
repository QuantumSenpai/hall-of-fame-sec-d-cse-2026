import React, { useState, useEffect } from 'react';
import { Photo, Video, Teacher, StudentMemory, Person } from '../types/index.ts';
import { DashboardOverview } from './DashboardOverview.tsx';
import { ModerationQueue } from './ModerationQueue.tsx';
import { PhotosManager } from './PhotosManager.tsx';
import { VideosManager } from './VideosManager.tsx';
import { TeachersManager } from './TeachersManager.tsx';
import { HeroManager } from './HeroManager.tsx';
import { ApologyManager } from './ApologyManager.tsx';
import { PeopleManager } from './PeopleManager.tsx';
import {
  LayoutDashboard,
  Sparkles,
  Image,
  Film,
  Users,
  UserCheck,
  Heart,
  MessageSquare,
  LogOut,
  ArrowLeft,
  CheckCircle,
  X,
} from 'lucide-react';

interface AdminLayoutProps {
  photos: Photo[];
  videos: Video[];
  teachers: Teacher[];
  memories: StudentMemory[];
  people: Person[];
  onRefresh: () => void;
  onLogout: () => void;
  onReturnToPublic: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  photos,
  videos,
  teachers,
  memories,
  people,
  onRefresh,
  onLogout,
  onReturnToPublic,
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showDeploymentToast, setShowDeploymentToast] = useState(false);

  // Security: Ensure robots do not index the admin route
  useEffect(() => {
    let meta = document.querySelector("meta[name='robots']");
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'robots');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', 'noindex, nofollow');
    return () => {
      meta?.remove();
    };
  }, []);

  const triggerSaveToast = () => {
    setShowDeploymentToast(true);
  };

  const pendingCount = memories.filter((m) => m.status === 'pending').length;

  const menuItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'hero', label: 'Hero Section CMS', icon: Sparkles },
    { id: 'photos', label: 'Photos Bento Grid', icon: Image },
    { id: 'videos', label: 'Edits & Moments', icon: Film },
    { id: 'people', label: 'Management Team', icon: Users },
    { id: 'teachers', label: 'Faculty Messages', icon: UserCheck },
    { id: 'apology', label: 'Thank You & Apology', icon: Heart },
    { id: 'memories', label: 'Submissions Queue', icon: MessageSquare, badge: pendingCount },
  ];

  return (
    <div className="min-h-screen bg-[#0D0B08] text-[#F5EFE1] font-sans flex flex-col md:flex-row relative">
      {/* Persistent deployment status toast on saves */}
      {showDeploymentToast && (
        <div className="fixed top-6 right-6 z-50 bg-[#16130E] border-2 border-[#C9A05C] text-[#F5EFE1] px-5 py-3.5 rounded-xl shadow-2xl flex items-center space-x-3 animate-fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <div className="text-xs">
            <span className="font-bold block text-sm text-[#F5EFE1]">Saved Successfully</span>
            <span className="text-[#C9A05C]">
              Changes committed. Updated content is active across the site.
            </span>
          </div>
          <button
            onClick={() => setShowDeploymentToast(false)}
            className="p-1 hover:text-white transition-colors ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#16130E] border-r border-[#C9A05C]/20 p-6 flex flex-col justify-between flex-shrink-0">
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full border border-[#C9A05C] flex items-center justify-center text-[#C9A05C] bg-[#1E1B15] shadow-md">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-base font-bold text-[#F5EFE1] tracking-wide">
                CMS DASHBOARD
              </h2>
              <p className="text-[10px] text-[#C9A05C] uppercase tracking-widest font-medium">
                TEACHERS' DAY 2026
              </p>
            </div>
          </div>

          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const IconComp = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#C9A05C] text-[#0D0B08] font-bold shadow-md'
                      : 'text-[#F5EFE1]/70 hover:bg-[#1E1B15] hover:text-[#F5EFE1]'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <IconComp className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-[#5C1F2E] text-white text-[10px] font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Controls */}
        <div className="pt-6 border-t border-[#C9A05C]/20 space-y-2">
          <button
            onClick={onReturnToPublic}
            className="w-full flex items-center space-x-2 px-3.5 py-2.5 rounded-lg text-xs text-[#C9A05C] hover:text-[#F5EFE1] hover:bg-[#1E1B15] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Public Site</span>
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-2 px-3.5 py-2.5 rounded-lg text-xs text-rose-400 hover:bg-rose-950/30 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Admin</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto bg-[#0D0B08]">
        {activeTab === 'overview' && (
          <DashboardOverview
            photos={photos}
            videos={videos}
            teachers={teachers}
            memories={memories}
            people={people}
            onSelectTab={setActiveTab}
          />
        )}
        {activeTab === 'hero' && (
          <HeroManager
            onRefresh={() => {
              onRefresh();
              triggerSaveToast();
            }}
          />
        )}
        {activeTab === 'photos' && (
          <PhotosManager
            photos={photos}
            onRefresh={() => {
              onRefresh();
              triggerSaveToast();
            }}
          />
        )}
        {activeTab === 'videos' && (
          <VideosManager
            videos={videos}
            onRefresh={() => {
              onRefresh();
              triggerSaveToast();
            }}
          />
        )}
        {activeTab === 'people' && (
          <PeopleManager
            people={people}
            onRefresh={() => {
              onRefresh();
              triggerSaveToast();
            }}
          />
        )}
        {activeTab === 'teachers' && (
          <TeachersManager
            teachers={teachers}
            onRefresh={() => {
              onRefresh();
              triggerSaveToast();
            }}
          />
        )}
        {activeTab === 'apology' && (
          <ApologyManager
            onRefresh={() => {
              onRefresh();
              triggerSaveToast();
            }}
          />
        )}
        {activeTab === 'memories' && (
          <ModerationQueue
            memories={memories}
            onRefresh={onRefresh}
            onShowSaveToast={triggerSaveToast}
          />
        )}
      </main>
    </div>
  );
};
