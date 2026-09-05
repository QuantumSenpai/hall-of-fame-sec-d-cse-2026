import React from 'react';
import { Photo, Video, Teacher, StudentMemory, Person } from '../types/index.ts';
import { Image, Film, UserCheck, MessageSquare, Users, PlusCircle, Sparkles, Heart } from 'lucide-react';

interface DashboardOverviewProps {
  photos: Photo[];
  videos: Video[];
  teachers: Teacher[];
  memories: StudentMemory[];
  people: Person[];
  onSelectTab: (tab: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  photos,
  videos,
  teachers,
  memories,
  people,
  onSelectTab,
}) => {
  const pendingMemories = memories.filter((m) => m.status === 'pending');

  const stats = [
    { label: 'Photos Managed', count: photos.length, icon: Image, tab: 'photos' },
    { label: 'Edits & Moments', count: videos.length, icon: Film, tab: 'videos' },
    { label: 'Faculty Messages', count: teachers.length, icon: UserCheck, tab: 'teachers' },
    { label: 'Management Team', count: people.length, icon: Users, tab: 'people' },
    { label: 'Pending Submissions', count: pendingMemories.length, icon: MessageSquare, tab: 'memories', highlight: pendingMemories.length > 0 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-2xl font-bold text-[#F5EFE1]">System Overview</h2>
        <p className="text-xs text-[#F5EFE1]/60 mt-1">
          High-level metrics and quick actions for Teachers' Day 2026 digital memory site.
        </p>
      </div>

      {/* Overview Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, idx) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={idx}
              onClick={() => onSelectTab(stat.tab)}
              className={`bg-[#16130E] border p-5 rounded-xl transition-all cursor-pointer shadow-lg hover:shadow-[0_8px_25px_rgba(201,160,92,0.12)] group ${
                stat.highlight ? 'border-[#5C1F2E] bg-[#5C1F2E]/10' : 'border-[#C9A05C]/20 hover:border-[#C9A05C]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-wider text-[#C9A05C]/80 font-semibold">
                  {stat.label}
                </span>
                <IconComponent className="w-5 h-5 text-[#C9A05C] group-hover:scale-110 transition-transform" />
              </div>
              <p className="text-3xl font-bold font-serif text-[#F5EFE1] mt-2">
                {stat.count}
              </p>
            </div>
          );
        })}
      </div>

      {/* Quick Action Buttons */}
      <div className="bg-[#16130E] border border-[#C9A05C]/20 p-6 rounded-xl space-y-4 shadow-xl">
        <h3 className="font-serif text-base font-bold text-[#F5EFE1] border-b border-[#C9A05C]/20 pb-3">
          Quick Management Actions
        </h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => onSelectTab('hero')}
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-[#1E1B15] text-[#C9A05C] border border-[#C9A05C]/40 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-[#C9A05C] hover:text-[#0D0B08] transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Edit Hero Content</span>
          </button>
          <button
            onClick={() => onSelectTab('photos')}
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-[#C9A05C] text-[#0D0B08] rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-[#D4AF6A] transition-all shadow-md"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Bento Photo</span>
          </button>
          <button
            onClick={() => onSelectTab('videos')}
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-[#1E1B15] text-[#F5EFE1] border border-[#C9A05C]/30 rounded-lg font-semibold text-xs hover:border-[#C9A05C] transition-all"
          >
            <PlusCircle className="w-4 h-4 text-[#C9A05C]" />
            <span>Add Edit / Video</span>
          </button>
          <button
            onClick={() => onSelectTab('people')}
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-[#1E1B15] text-[#F5EFE1] border border-[#C9A05C]/30 rounded-lg font-semibold text-xs hover:border-[#C9A05C] transition-all"
          >
            <Users className="w-4 h-4 text-[#C9A05C]" />
            <span>Management Team</span>
          </button>
          <button
            onClick={() => onSelectTab('apology')}
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-[#1E1B15] text-[#F5EFE1] border border-[#C9A05C]/30 rounded-lg font-semibold text-xs hover:border-[#C9A05C] transition-all"
          >
            <Heart className="w-4 h-4 text-[#5C1F2E]" />
            <span>Thank You & Apology</span>
          </button>
          <button
            onClick={() => onSelectTab('memories')}
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-[#5C1F2E] text-[#F5EFE1] rounded-lg font-semibold text-xs hover:bg-[#722739] transition-all shadow-md"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Submissions Queue ({pendingMemories.length})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
