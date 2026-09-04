import React, { useState } from 'react';
import { Teacher } from '../types/index.ts';
import { adminAddTeacher, adminDeleteTeacher } from '../lib/api.ts';
import { Plus, Trash2, UserCheck } from 'lucide-react';

interface TeachersManagerProps {
  teachers: Teacher[];
  onRefresh: () => void;
}

export const TeachersManager: React.FC<TeachersManagerProps> = ({ teachers, onRefresh }) => {
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [photoUrl, setPhotoUrl] = useState('');
  const [message, setMessage] = useState('');
  const [profileLink, setProfileLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) return;
    setIsSubmitting(true);
    await adminAddTeacher({
      name,
      department,
      photoUrl: photoUrl || undefined,
      message,
      profileLink: profileLink || undefined,
    });
    setIsSubmitting(false);
    setName('');
    setMessage('');
    setPhotoUrl('');
    setProfileLink('');
    onRefresh();
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this teacher entry?')) {
      await adminDeleteTeacher(id);
      onRefresh();
    }
  };

  return (
    <div className="space-y-8">
      {/* Add Teacher Form */}
      <form onSubmit={handleAdd} className="bg-[#1A1D1B] border border-[#B9905A]/40 p-6 rounded-lg space-y-4">
        <h3 className="font-serif text-lg font-bold text-[#EFE6CA] flex items-center space-x-2">
          <Plus className="w-5 h-5 text-[#B9905A]" />
          <span>Add Faculty Member & Message</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#B9905A] mb-1 font-semibold">
              Faculty Full Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Dr. Aris Thorne"
              className="w-full px-3 py-2 bg-[#292D2B] border border-[#B9905A]/40 rounded text-sm text-[#EFE6CA] focus:outline-none focus:border-[#B9905A]"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#B9905A] mb-1 font-semibold">
              Department / Subject
            </label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="e.g. Computer Science & Engineering"
              className="w-full px-3 py-2 bg-[#292D2B] border border-[#B9905A]/40 rounded text-sm text-[#EFE6CA] focus:outline-none focus:border-[#B9905A]"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#B9905A] mb-1 font-semibold">
              Photo Link (Google Drive / Direct URL)
            </label>
            <input
              type="text"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3 py-2 bg-[#292D2B] border border-[#B9905A]/40 rounded text-sm text-[#EFE6CA] focus:outline-none focus:border-[#B9905A]"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#B9905A] mb-1 font-semibold">
              Faculty Profile Link (Optional)
            </label>
            <input
              type="url"
              value={profileLink}
              onChange={(e) => setProfileLink(e.target.value)}
              placeholder="https://linkedin.com/in/..."
              className="w-full px-3 py-2 bg-[#292D2B] border border-[#B9905A]/40 rounded text-sm text-[#EFE6CA] focus:outline-none focus:border-[#B9905A]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs uppercase tracking-wider text-[#B9905A] mb-1 font-semibold">
              Faculty Message / Quote *
            </label>
            <textarea
              required
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Heartfelt words of wisdom for the graduating class..."
              className="w-full px-3 py-2 bg-[#292D2B] border border-[#B9905A]/40 rounded text-sm text-[#EFE6CA] focus:outline-none focus:border-[#B9905A]"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-[#B9905A] text-[#1A1D1B] font-bold text-xs uppercase tracking-wider rounded hover:bg-[#D4AF77] transition-colors"
        >
          {isSubmitting ? 'Saving...' : 'Save Faculty Entry'}
        </button>
      </form>

      {/* Existing Teachers List */}
      <div className="space-y-3">
        {teachers.map((teacher) => (
          <div
            key={teacher.id}
            className="bg-[#1A1D1B] border border-[#B9905A]/30 p-4 rounded-lg flex justify-between items-center"
          >
            <div className="flex items-center space-x-3">
              {teacher.photoUrl ? (
                <img
                  src={teacher.photoUrl}
                  alt={teacher.name}
                  className="w-12 h-12 rounded-full object-cover border border-[#B9905A]"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-[#292D2B] text-[#B9905A] font-serif font-bold flex items-center justify-center border border-[#B9905A]">
                  {teacher.name.charAt(0)}
                </div>
              )}
              <div>
                <h4 className="font-serif text-base font-bold text-[#EFE6CA]">
                  {teacher.name}
                </h4>
                <p className="text-xs text-[#B95F46] font-semibold">{teacher.department}</p>
              </div>
            </div>
            <button
              onClick={() => handleDelete(teacher.id)}
              className="p-2 text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
