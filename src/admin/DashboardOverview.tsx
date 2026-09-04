import React from 'react';
import { Chapter, Photo, Video, Teacher, StudentMemory, ExternalLink, Person } from '../types/index.ts';
import { Image, Video as VideoIcon, BookOpen, UserCheck, MessageSquare, Link, Users, PlusCircle } from 'lucide-react';

interface DashboardOverviewProps {
  chapters: Chapter[];
  photos: Photo[];
  videos: Video[];
  teachers: Teacher[];
  memories: StudentMemory[];
  links: ExternalLink[];
  people: Person[];
  onSelectTab: (tab: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  chapters,
  photos,
  videos,
  teachers,
  memories,
  links,
  people,
  onSelectTab,
}) => {
  const pendingMemories = memories.filter((m) => m.status === 'pending');

  const stats = [
    { label: 'Total Chapters', count: chapters.length, icon: BookOpen, color: 'text-amber-400', tab: 'chapters' },
    { label: 'Photos Managed', count: photos.length, icon: Image, color: 'text-blue-400', tab: 'photos' },
    { label: 'Videos Hosted', count: videos.length, icon: VideoIcon, color: 'text-red-400', tab: 'videos' },
    { label: 'Faculty Messages', count: teachers.length, icon: UserCheck, color: 'text-emerald-400', tab: 'teachers' },
    { label: 'Pending Submissions', count: pendingMemories.length, icon: MessageSquare, color: 'text-orange-400', tab: 'memories' },
    { label: 'External Links', count: links.length, icon: Link, color: 'text-indigo-400', tab: 'links' },
    { label: 'Team Contributors', count: people.length, icon: Users, color: 'text-purple-400', tab: 'people' },
  ];

  return (
    <div className="space-y-8">
      {/* Overview Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={idx}
              onClick={() => onSelectTab(stat.tab)}
              className="bg-[#1A1D1B] border border-[#B9905A]/30 p-5 rounded-lg hover:border-[#B9905A] transition-all cursor-pointer shadow-md group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-[#44636A] font-semibold">
                  {stat.label}
                </span>
                <IconComponent className={`w-5 h-5 ${stat.color} group-hover:scale-110 transition-transform`} />
              </div>
              <p className="text-3xl font-bold font-serif text-[#EFE6CA] mt-2">
                {stat.count}
              </p>
            </div>
          );
        })}
      </div>

      {/* Quick Action Buttons */}
      <div className="bg-[#1A1D1B] border border-[#B9905A]/30 p-6 rounded-lg space-y-4">
        <h3 className="font-serif text-lg font-bold text-[#EFE6CA] border-b border-[#B9905A]/20 pb-2">
          Quick Management Actions
        </h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => onSelectTab('photos')}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-[#B9905A] text-[#1A1D1B] rounded font-semibold text-xs hover:bg-[#D4AF77] transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Photo</span>
          </button>
          <button
            onClick={() => onSelectTab('videos')}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-[#292D2B] text-[#EFE6CA] border border-[#B9905A]/40 rounded font-semibold text-xs hover:border-[#B9905A] transition-colors"
          >
            <PlusCircle className="w-4 h-4 text-[#B9905A]" />
            <span>Add Video</span>
          </button>
          <button
            onClick={() => onSelectTab('chapters')}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-[#292D2B] text-[#EFE6CA] border border-[#B9905A]/40 rounded font-semibold text-xs hover:border-[#B9905A] transition-colors"
          >
            <PlusCircle className="w-4 h-4 text-[#B9905A]" />
            <span>Add Chapter</span>
          </button>
          <button
            onClick={() => onSelectTab('teachers')}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-[#292D2B] text-[#EFE6CA] border border-[#B9905A]/40 rounded font-semibold text-xs hover:border-[#B9905A] transition-colors"
          >
            <PlusCircle className="w-4 h-4 text-[#B9905A]" />
            <span>Add Teacher Message</span>
          </button>
          <button
            onClick={() => onSelectTab('memories')}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-[#B95F46] text-[#EFE6CA] rounded font-semibold text-xs hover:bg-[#D07E66] transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span>View Submissions Queue ({pendingMemories.length})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
