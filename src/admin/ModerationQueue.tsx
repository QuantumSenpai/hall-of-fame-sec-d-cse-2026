import React, { useState, useEffect } from 'react';
import { StudentMemory } from '../types/index.ts';
import { updateMemoryStatus, fetchMemories } from '../lib/api.ts';
import { Check, X, Clock, RefreshCw } from 'lucide-react';

interface ModerationQueueProps {
  memories: StudentMemory[];
  onRefresh: () => void;
  onShowSaveToast?: () => void;
}

export const ModerationQueue: React.FC<ModerationQueueProps> = ({
  memories,
  onRefresh,
  onShowSaveToast,
}) => {
  const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [pendingQueue, setPendingQueue] = useState<StudentMemory[]>([]);
  const [loadingPending, setLoadingPending] = useState(false);

  const loadPendingQueue = async () => {
    setLoadingPending(true);
    try {
      const list = await fetchMemories('pending');
      setPendingQueue(list);
    } catch (err) {
      console.error('Failed to load pending memories:', err);
    } finally {
      setLoadingPending(false);
    }
  };

  useEffect(() => {
    loadPendingQueue();
  }, []);

  const allMemories = [
    ...pendingQueue,
    ...memories.filter((m) => !pendingQueue.some((p) => p.id === m.id)),
  ];

  const filtered = allMemories.filter((m) => (filter === 'all' ? true : m.status === filter));

  const handleStatus = async (id: number, status: 'approved' | 'rejected') => {
    try {
      await updateMemoryStatus(id, status);
      await loadPendingQueue();
      onRefresh();
      onShowSaveToast?.();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#B9905A]/20 pb-4">
        <div>
          <h3 className="font-serif text-2xl font-bold text-[#EFE6CA]">
            Submissions Moderation Queue
          </h3>
          <p className="text-xs text-[#B9905A]">
            Review pending student memories stored in Vercel KV before committing them to the permanent site content.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <button
            onClick={loadPendingQueue}
            title="Refresh KV Queue"
            className="p-2 rounded-lg bg-[#292D2B] text-[#B9905A] border border-[#B9905A]/30 hover:bg-[#B9905A] hover:text-[#141615] transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingPending ? 'animate-spin' : ''}`} />
          </button>

          {(['pending', 'approved', 'rejected', 'all'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg capitalize font-semibold transition-all ${
                filter === tab
                  ? 'bg-[#B9905A] text-[#141615] shadow-md'
                  : 'bg-[#292D2B] text-[#EFE6CA]/70 hover:text-[#EFE6CA] border border-[#B9905A]/20'
              }`}
            >
              {tab} ({allMemories.filter((m) => (tab === 'all' ? true : m.status === tab)).length})
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 bg-[#1E2220] rounded-xl border border-[#B9905A]/20 text-[#B9905A] text-sm">
          No submissions found in this category.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((memory) => (
            <div
              key={memory.id}
              className="bg-[#1E2220] border border-[#B9905A]/20 p-5 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-[#B9905A]/50 transition-all shadow-md"
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
                    className={`text-[10px] px-2.5 py-0.5 rounded uppercase font-semibold ${
                      memory.status === 'approved'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                        : memory.status === 'rejected'
                        ? 'bg-red-950 text-red-300 border border-red-700'
                        : 'bg-[#44636A]/30 text-[#D4AF77] border border-[#44636A]'
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
                    className="text-xs text-[#B9905A] hover:underline inline-block"
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
                    <span>Approve & Commit</span>
                  </button>
                )}
                {memory.status !== 'rejected' && (
                  <button
                    onClick={() => handleStatus(memory.id, 'rejected')}
                    className="inline-flex items-center space-x-1 px-3.5 py-1.5 bg-[#B95F46] text-white rounded-lg hover:bg-[#A34F38] transition-colors font-medium shadow"
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
