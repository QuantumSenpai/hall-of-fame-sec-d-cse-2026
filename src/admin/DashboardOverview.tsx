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
    { label: 'Total Chapters', count: chapters.length, icon: BookOpen, color: 'text-[#e2c27e]', tab: 'chapters' },
    { label: 'Photos Managed', count: photos.length, icon: Image, color: 'text-[#c9a463]', tab: 'photos' },
    { label: 'Videos Hosted', count: videos.length, icon: VideoIcon, color: 'text-[#df8f70]', tab: 'videos' },
    { label: 'Faculty Messages', count: teachers.length, icon: UserCheck, color: 'text-[#d4af77]', tab: 'teachers' },
    { label: 'Pending Submissions', count: pendingMemories.length, icon: MessageSquare, color: 'text-[#e69f88]', tab: 'memories' },
    { label: 'External Links', count: links.length, icon: Link, color: 'text-[#c9a463]', tab: 'links' },
    { label: 'Team Contributors', count: people.length, icon: Users, color: 'text-[#e2c27e]', tab: 'people' },
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
              className="bg-[#16060b] border border-[rgba(201,164,99,0.22)] p-5 rounded-xl hover:border-[#c9a463] transition-all cursor-pointer shadow-lg hover:shadow-[0_8px_25px_rgba(201,164,99,0.15)] group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-wider text-[rgba(201,164,99,0.7)] font-semibold">
                  {stat.label}
                </span>
                <IconComponent className={`w-5 h-5 ${stat.color} group-hover:scale-110 group-hover:text-[#e2c27e] transition-transform`} />
              </div>
              <p className="text-3xl font-bold font-serif text-[#f2e8d5] mt-2">
                {stat.count}
              </p>
            </div>
          );
        })}
      </div>

      {/* Quick Action Buttons */}
      <div className="bg-[#16060b] border border-[rgba(201,164,99,0.22)] p-6 rounded-xl space-y-4 shadow-xl">
        <h3 className="font-serif text-lg font-bold text-[#f2e8d5] border-b border-[rgba(201,164,99,0.2)] pb-3">
          Quick Management Actions
        </h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => onSelectTab('photos')}
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-[#c9a463] to-[#b88d48] text-[#0e0407] rounded-lg font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-[0_2px_12px_rgba(201,164,99,0.25)]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Photo</span>
          </button>
          <button
            onClick={() => onSelectTab('videos')}
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-[#220a12] text-[#f2e8d5] border border-[rgba(201,164,99,0.3)] rounded-lg font-semibold text-xs hover:border-[#c9a463] hover:bg-[#2d0e19] transition-all"
          >
            <PlusCircle className="w-4 h-4 text-[#c9a463]" />
            <span>Add Video</span>
          </button>
          <button
            onClick={() => onSelectTab('chapters')}
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-[#220a12] text-[#f2e8d5] border border-[rgba(201,164,99,0.3)] rounded-lg font-semibold text-xs hover:border-[#c9a463] hover:bg-[#2d0e19] transition-all"
          >
            <PlusCircle className="w-4 h-4 text-[#c9a463]" />
            <span>Add Chapter</span>
          </button>
          <button
            onClick={() => onSelectTab('teachers')}
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-[#220a12] text-[#f2e8d5] border border-[rgba(201,164,99,0.3)] rounded-lg font-semibold text-xs hover:border-[#c9a463] hover:bg-[#2d0e19] transition-all"
          >
            <PlusCircle className="w-4 h-4 text-[#c9a463]" />
            <span>Add Teacher Message</span>
          </button>
          <button
            onClick={() => onSelectTab('memories')}
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-[#852525] text-[#f2e8d5] rounded-lg font-semibold text-xs hover:bg-[#9a2b2b] transition-all shadow-[0_2px_12px_rgba(133,37,37,0.3)]"
          >
            <MessageSquare className="w-4 h-4" />
            <span>View Submissions Queue ({pendingMemories.length})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
