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
      <form onSubmit={handleAdd} className="bg-[#16060b] border border-[rgba(201,164,99,0.25)] p-6 rounded-xl space-y-4 shadow-xl">
        <h3 className="font-serif text-lg font-bold text-[#f2e8d5] flex items-center space-x-2 border-b border-[rgba(201,164,99,0.2)] pb-3">
          <Plus className="w-5 h-5 text-[#c9a463]" />
          <span>Add Faculty Member & Message</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#c9a463] mb-1 font-semibold">
              Faculty Full Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Dr. Aris Thorne"
              className="w-full px-3.5 py-2.5 bg-[#220a12] border border-[rgba(201,164,99,0.3)] rounded-lg text-sm text-[#f2e8d5] placeholder:text-[rgba(242,232,213,0.3)] focus:outline-none focus:border-[#c9a463] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#c9a463] mb-1 font-semibold">
              Department / Subject
            </label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="e.g. Computer Science & Engineering"
              className="w-full px-3.5 py-2.5 bg-[#220a12] border border-[rgba(201,164,99,0.3)] rounded-lg text-sm text-[#f2e8d5] placeholder:text-[rgba(242,232,213,0.3)] focus:outline-none focus:border-[#c9a463] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#c9a463] mb-1 font-semibold">
              Photo Link (Google Drive / Direct URL)
            </label>
            <input
              type="text"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3.5 py-2.5 bg-[#220a12] border border-[rgba(201,164,99,0.3)] rounded-lg text-sm text-[#f2e8d5] placeholder:text-[rgba(242,232,213,0.3)] focus:outline-none focus:border-[#c9a463] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#c9a463] mb-1 font-semibold">
              Faculty Profile Link (Optional)
            </label>
            <input
              type="url"
              value={profileLink}
              onChange={(e) => setProfileLink(e.target.value)}
              placeholder="https://linkedin.com/in/..."
              className="w-full px-3.5 py-2.5 bg-[#220a12] border border-[rgba(201,164,99,0.3)] rounded-lg text-sm text-[#f2e8d5] placeholder:text-[rgba(242,232,213,0.3)] focus:outline-none focus:border-[#c9a463] transition-colors"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs uppercase tracking-wider text-[#c9a463] mb-1 font-semibold">
              Faculty Message / Quote *
            </label>
            <textarea
              required
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Heartfelt words of wisdom for the graduating class..."
              className="w-full px-3.5 py-2.5 bg-[#220a12] border border-[rgba(201,164,99,0.3)] rounded-lg text-sm text-[#f2e8d5] placeholder:text-[rgba(242,232,213,0.3)] focus:outline-none focus:border-[#c9a463] transition-colors"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-gradient-to-r from-[#c9a463] to-[#b88d48] text-[#0e0407] font-bold text-xs uppercase tracking-wider rounded-lg hover:brightness-110 transition-all shadow-[0_2px_12px_rgba(201,164,99,0.25)]"
        >
          {isSubmitting ? 'Saving...' : 'Save Faculty Entry'}
        </button>
      </form>

      {/* Existing Teachers List */}
      <div className="space-y-3">
        {teachers.map((teacher) => (
          <div
            key={teacher.id}
            className="bg-[#16060b] border border-[rgba(201,164,99,0.22)] p-4 rounded-xl flex justify-between items-center hover:border-[rgba(201,164,99,0.45)] transition-all shadow-md"
          >
            <div className="flex items-center space-x-3">
              {teacher.photoUrl ? (
                <img
                  src={teacher.photoUrl}
                  alt={teacher.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#c9a463]"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-[#220912] text-[#c9a463] font-serif font-bold flex items-center justify-center border-2 border-[#c9a463]">
                  {teacher.name.charAt(0)}
                </div>
              )}
              <div>
                <h4 className="font-serif text-base font-bold text-[#f2e8d5]">
                  {teacher.name}
                </h4>
                <p className="text-xs text-[rgba(201,164,99,0.75)] font-semibold">{teacher.department}</p>
              </div>
            </div>
            <button
              onClick={() => handleDelete(teacher.id)}
              className="p-2 text-red-400 hover:text-red-300 hover:bg-[#320f18] rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
