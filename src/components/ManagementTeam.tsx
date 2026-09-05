import React from 'react';
import type { Person } from '../types/index.ts';
import { Users } from 'lucide-react';

interface ManagementTeamProps {
  people: Person[];
  className?: string;
}

export const ManagementTeam: React.FC<ManagementTeamProps> = ({
  people,
  className = '',
}) => {
  if (!people || people.length === 0) {
    return null;
  }

  // Sort by displayOrder
  const sorted = [...people].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  return (
    <div className={`w-full ${className}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sorted.map((person) => (
          <div
            key={person.id}
            className="group relative bg-[#16130E] border border-[#C9A05C]/20 hover:border-[#C9A05C]/60 rounded-2xl overflow-hidden p-6 transition-all duration-300 shadow-lg hover:shadow-2xl flex flex-col items-center text-center"
          >
            {/* Ambient subtle glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#C9A05C]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

            {/* Photo Avatar with Double Gold Border */}
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 bg-gradient-to-b from-[#C9A05C] via-[#85612f] to-[#C9A05C]/20 mb-4 shadow-xl">
              <div className="w-full h-full rounded-full overflow-hidden bg-[#0D0B08] border-2 border-[#16130E]">
                {person.photoUrl ? (
                  <img
                    src={person.photoUrl}
                    alt={person.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-[0.95]"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#C9A05C]/40">
                    <Users className="w-10 h-10" />
                  </div>
                )}
              </div>
            </div>

            {/* Name */}
            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#F5EFE1] group-hover:text-[#D4AF6A] transition-colors">
              {person.name}
            </h3>

            {/* Role Badge */}
            <div className="mt-1.5 px-3 py-1 rounded-full bg-[#0D0B08] border border-[#C9A05C]/30 text-[11px] font-sans font-semibold uppercase tracking-wider text-[#C9A05C]">
              {person.role}
            </div>

            {/* Optional Short Line / Bio */}
            {person.bio && (
              <p className="font-sans text-xs text-[#F5EFE1]/75 italic mt-3 leading-relaxed max-w-xs">
                "{person.bio}"
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
