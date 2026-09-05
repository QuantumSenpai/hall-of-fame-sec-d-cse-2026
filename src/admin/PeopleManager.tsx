import React, { useState } from 'react';
import { Person } from '../types/index.ts';
import { adminAddPerson, adminUpdatePerson, adminDeletePerson } from '../lib/api.ts';
import { Users, Plus, Trash2, Edit3, Save, X, RefreshCw, AlertCircle } from 'lucide-react';

interface PeopleManagerProps {
  people: Person[];
  onRefresh: () => void;
}

export const PeopleManager: React.FC<PeopleManagerProps> = ({ people, onRefresh }) => {
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<Person>>({
    name: '',
    role: '',
    photoUrl: '',
    bio: '',
    displayOrder: 1,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startAdd = () => {
    setEditingPerson(null);
    setFormData({
      name: '',
      role: '',
      photoUrl: '',
      bio: '',
      displayOrder: (people.length || 0) + 1,
    });
    setIsAdding(true);
    setError(null);
  };

  const startEdit = (person: Person) => {
    setIsAdding(false);
    setEditingPerson(person);
    setFormData(person);
    setError(null);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingPerson(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.role) {
      setError('Name and role are required.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      if (editingPerson) {
        const res = await adminUpdatePerson(editingPerson.id, formData);
        if (res.success) {
          handleCancel();
          onRefresh();
        } else {
          setError(res.error || 'Failed to update team member.');
        }
      } else {
        const res = await adminAddPerson(formData);
        if (res.success) {
          handleCancel();
          onRefresh();
        } else {
          setError(res.error || 'Failed to add team member.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from the management team?`)) {
      return;
    }

    try {
      const res = await adminDeletePerson(id);
      if (res.success) {
        onRefresh();
      } else {
        alert(res.error || 'Failed to delete member.');
      }
    } catch (err: any) {
      alert(err.message || 'An error occurred.');
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#C9A05C]/20 pb-5">
        <div>
          <div className="inline-flex items-center space-x-2 text-[#C9A05C] text-xs font-semibold uppercase tracking-widest mb-1">
            <Users className="w-3.5 h-3.5" />
            <span>Contributors</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#F5EFE1]">Management Team CMS</h2>
          <p className="text-xs text-[#F5EFE1]/60 mt-1">
            Manage the student coordinators, media crew, and leads honored on the site.
          </p>
        </div>
        {!isAdding && !editingPerson && (
          <button
            onClick={startAdd}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-[#C9A05C] hover:bg-[#D4AF6A] text-[#0D0B08] font-bold text-xs tracking-wide shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Team Member</span>
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 rounded-xl flex items-center space-x-3 text-sm bg-rose-950/40 border border-rose-500/30 text-rose-300">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form (Add or Edit) */}
      {(isAdding || editingPerson) && (
        <form onSubmit={handleSubmit} className="bg-[#16130E] border border-[#C9A05C]/30 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#C9A05C]/20 pb-3">
            <h3 className="text-sm font-bold text-[#C9A05C] uppercase tracking-wider">
              {editingPerson ? `Edit: ${editingPerson.name}` : 'New Team Member'}
            </h3>
            <button
              type="button"
              onClick={handleCancel}
              className="text-[#F5EFE1]/60 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#F5EFE1]/80 mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Vikramaditya Sen"
                className="w-full bg-[#0D0B08] border border-[#C9A05C]/30 rounded-lg px-3.5 py-2 text-sm text-[#F5EFE1] focus:outline-none focus:border-[#C9A05C]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#F5EFE1]/80 mb-1.5">
                Role / Title *
              </label>
              <input
                type="text"
                value={formData.role || ''}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="e.g. Lead Event Organizer"
                className="w-full bg-[#0D0B08] border border-[#C9A05C]/30 rounded-lg px-3.5 py-2 text-sm text-[#F5EFE1] focus:outline-none focus:border-[#C9A05C]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#F5EFE1]/80 mb-1.5">
              Photo URL (Google Drive or direct image link)
            </label>
            <input
              type="text"
              value={formData.photoUrl || ''}
              onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full bg-[#0D0B08] border border-[#C9A05C]/30 rounded-lg px-3.5 py-2 text-sm text-[#F5EFE1] focus:outline-none focus:border-[#C9A05C]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#F5EFE1]/80 mb-1.5">
              Optional Short Line / Contribution Bio
            </label>
            <textarea
              rows={2}
              value={formData.bio || ''}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Brief description of contributions..."
              className="w-full bg-[#0D0B08] border border-[#C9A05C]/30 rounded-lg px-3.5 py-2 text-sm text-[#F5EFE1] focus:outline-none focus:border-[#C9A05C]"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 rounded-lg border border-[#C9A05C]/30 text-xs text-[#F5EFE1]/80 hover:bg-[#1E1B15]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center space-x-1.5 px-5 py-2 rounded-lg bg-[#C9A05C] hover:bg-[#D4AF6A] text-[#0D0B08] font-bold text-xs tracking-wide disabled:opacity-50"
            >
              {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>{editingPerson ? 'Update Member' : 'Save Member'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Grid of existing members */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {people.map((person) => (
          <div
            key={person.id}
            className="bg-[#16130E] border border-[#C9A05C]/20 rounded-xl overflow-hidden flex flex-col group hover:border-[#C9A05C]/50 transition-colors"
          >
            <div className="aspect-square w-full bg-[#0D0B08] overflow-hidden relative">
              {person.photoUrl ? (
                <img
                  src={person.photoUrl}
                  alt={person.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#C9A05C]/40">
                  <Users className="w-12 h-12" />
                </div>
              )}
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h4 className="font-serif font-bold text-base text-[#F5EFE1]">{person.name}</h4>
                <p className="text-xs text-[#C9A05C] font-medium tracking-wide uppercase mt-0.5">
                  {person.role}
                </p>
                {person.bio && (
                  <p className="text-xs text-[#F5EFE1]/70 mt-2 line-clamp-2 leading-relaxed">
                    {person.bio}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-[#C9A05C]/10">
                <button
                  onClick={() => startEdit(person)}
                  className="p-1.5 rounded-md hover:bg-[#C9A05C]/20 text-[#C9A05C] transition-colors"
                  title="Edit member"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(person.id, person.name)}
                  className="p-1.5 rounded-md hover:bg-rose-900/30 text-rose-400 transition-colors"
                  title="Delete member"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
