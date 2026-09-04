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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[rgba(201,164,99,0.2)] pb-4">
        <div>
          <h3 className="font-serif text-xl font-bold text-[#f2e8d5]">
            Student Submissions Moderation Queue
          </h3>
          <p className="text-xs text-[rgba(201,164,99,0.7)]">
            Review public memory submissions before releasing them live on the memory book wall.
          </p>
        </div>

        <div className="flex space-x-2 text-xs">
          {(['pending', 'approved', 'rejected', 'all'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg capitalize font-semibold transition-all ${
                filter === tab
                  ? 'bg-gradient-to-r from-[#c9a463] to-[#b88d48] text-[#0e0407] shadow-[0_2px_10px_rgba(201,164,99,0.3)]'
                  : 'bg-[#220a12] text-[rgba(242,232,213,0.7)] hover:text-[#f2e8d5] hover:bg-[#2d0e19] border border-[rgba(201,164,99,0.25)]'
              }`}
            >
              {tab} ({memories.filter((m) => (tab === 'all' ? true : m.status === tab)).length})
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 bg-[#16060b] rounded-xl border border-[rgba(201,164,99,0.2)] text-[rgba(201,164,99,0.7)] text-sm">
          No submissions found in this category.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((memory) => (
            <div
              key={memory.id}
              className="bg-[#16060b] border border-[rgba(201,164,99,0.22)] p-5 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-[rgba(201,164,99,0.45)] transition-all shadow-md"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-serif text-base font-bold text-[#f2e8d5]">
                    {memory.authorName}
                  </span>
                  <span className="text-xs text-[#c9a463] font-sans">
                    ({memory.authorRole})
                  </span>
                  <span
                    className={`text-[10px] px-2.5 py-0.5 rounded uppercase font-semibold ${
                      memory.status === 'approved'
                        ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700'
                        : memory.status === 'rejected'
                        ? 'bg-red-950/80 text-red-300 border border-red-700'
                        : 'bg-[#3d1a08] text-[#e2c27e] border border-[#a0793a]'
                    }`}
                  >
                    {memory.status}
                  </span>
                </div>
                <p className="font-serif italic text-sm text-[rgba(242,232,213,0.9)]">
                  "{memory.message}"
                </p>
                {memory.imageUrl && (
                  <a
                    href={memory.imageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-[#c9a463] hover:underline inline-block"
                  >
                    View Attached Image Link ↗
                  </a>
                )}
              </div>

              <div className="flex items-center space-x-2 text-xs">
                {memory.status !== 'approved' && (
                  <button
                    onClick={() => handleStatus(memory.id, 'approved')}
                    className="inline-flex items-center space-x-1 px-3.5 py-1.5 bg-emerald-700 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium shadow"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>
                )}
                {memory.status !== 'rejected' && (
                  <button
                    onClick={() => handleStatus(memory.id, 'rejected')}
                    className="inline-flex items-center space-x-1 px-3.5 py-1.5 bg-[#852525] text-white rounded-lg hover:bg-[#9e2d2d] transition-colors font-medium shadow"
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
