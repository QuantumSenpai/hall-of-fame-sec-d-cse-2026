import React, { useState } from 'react';
import { StudentMemory } from '../types/index.ts';
import { updateMemoryStatus } from '../lib/api.ts';
import { Check, X, Trash2, Clock } from 'lucide-react';

interface ModerationQueueProps {
  memories: StudentMemory[];
  onRefresh: () => void;
}

export const ModerationQueue: React.FC<ModerationQueueProps> = ({ memories, onRefresh }) => {
  const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');

  const filtered = memories.filter((m) => (filter === 'all' ? true : m.status === filter));

  const handleStatus = async (id: number, status: 'approved' | 'rejected') => {
    await updateMemoryStatus(id, status);
    onRefresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#B9905A]/20 pb-4">
        <div>
          <h3 className="font-serif text-xl font-bold text-[#EFE6CA]">
            Student Submissions Moderation Queue
          </h3>
          <p className="text-xs text-[#44636A]">
            Review public memory submissions before releasing them live on the memory book wall.
          </p>
        </div>

        <div className="flex space-x-2 text-xs">
          {(['pending', 'approved', 'rejected', 'all'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded capitalize font-medium transition-colors ${
                filter === tab
                  ? 'bg-[#B9905A] text-[#1A1D1B]'
                  : 'bg-[#292D2B] text-[#EFE6CA]/70 hover:text-[#EFE6CA]'
              }`}
            >
              {tab} ({memories.filter((m) => (tab === 'all' ? true : m.status === tab)).length})
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 bg-[#1A1D1B] rounded-lg border border-[#B9905A]/20 text-[#44636A] text-sm">
          No submissions found in this category.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((memory) => (
            <div
              key={memory.id}
              className="bg-[#1A1D1B] border border-[#B9905A]/30 p-5 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-serif text-base font-bold text-[#EFE6CA]">
                    {memory.authorName}
                  </span>
                  <span className="text-xs text-[#B9905A] font-sans">
                    ({memory.authorRole})
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded uppercase font-semibold ${
                      memory.status === 'approved'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : memory.status === 'rejected'
                        ? 'bg-red-950 text-red-400 border border-red-800'
                        : 'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}
                  >
                    {memory.status}
                  </span>
                </div>
                <p className="font-serif italic text-sm text-[#EFE6CA]/90">
                  "{memory.message}"
                </p>
                {memory.imageUrl && (
                  <a
                    href={memory.imageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-[#44636A] hover:underline"
                  >
                    View Attached Image Link ↗
                  </a>
                )}
              </div>

              <div className="flex items-center space-x-2 text-xs">
                {memory.status !== 'approved' && (
                  <button
                    onClick={() => handleStatus(memory.id, 'approved')}
                    className="inline-flex items-center space-x-1 px-3 py-1.5 bg-emerald-700 text-white rounded hover:bg-emerald-600 transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>
                )}
                {memory.status !== 'rejected' && (
                  <button
                    onClick={() => handleStatus(memory.id, 'rejected')}
                    className="inline-flex items-center space-x-1 px-3 py-1.5 bg-red-800 text-white rounded hover:bg-red-700 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
