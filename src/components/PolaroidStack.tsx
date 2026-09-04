import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Photo } from '../types/index.ts';
import { Maximize2, X } from 'lucide-react';

interface PolaroidStackProps {
  photos: Photo[];
}

export const PolaroidStack: React.FC<PolaroidStackProps> = ({ photos }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  if (!photos || photos.length === 0) return null;

  return (
    <div className="relative w-full max-w-4xl mx-auto py-8">
      {/* Polaroid Cards Stack */}
      <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 px-4">
        {photos.map((photo, index) => {
          const rotation = (index % 3 === 0 ? -4 : index % 3 === 1 ? 3 : -2) + (index * 1.5);
          return (
            <motion.div
              key={photo.id}
              className="relative bg-[#F8F4EA] text-[#292D2B] p-4 pb-6 rounded shadow-polaroid border border-[#D5C4A1] cursor-pointer w-64 sm:w-72 transition-all duration-300 transform hover:scale-105 hover:z-20 hover:rotate-0"
              style={{ rotate: `${rotation}deg` }}
              whileHover={{ y: -8 }}
              onClick={() => setSelectedPhoto(photo)}
            >
              {/* Adhesive Tape Accent */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-[#EFE6CA]/80 border border-[#B9905A]/30 backdrop-blur-xs transform -rotate-2 shadow-xs" />

              {/* Photo Image */}
              <div className="relative w-full h-56 sm:h-64 bg-charcoal rounded overflow-hidden mb-3 border border-[#292D2B]/10">
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute bottom-2 right-2 p-1.5 bg-charcoal/70 text-paper rounded-full opacity-0 hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Handwritten Title & Caption */}
              <h4 className="font-serif text-lg font-bold text-[#292D2B] text-center leading-snug">
                {photo.title}
              </h4>
              {photo.caption && (
                <p className="font-handwritten text-lg text-[#8b4520] text-center mt-1">
                  "{photo.caption}"
                </p>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            className="fixed inset-0 z-50 bg-[#070204]/90 backdrop-blur-md flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              className="relative max-w-3xl w-full bg-[#16060b] text-[#f2e8d5] p-6 rounded-2xl shadow-[0_25px_80px_rgba(0,0,0,0.9),0_0_40px_rgba(201,164,99,0.12)] border border-[rgba(201,164,99,0.35)]"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 p-2 bg-[#220912] border border-[#c9a463] text-[#c9a463] rounded-full hover:bg-[#c9a463] hover:text-[#0e0407] transition-colors shadow"
              >
                <X className="w-5 h-5" />
              </button>
              <img
                src={selectedPhoto.imageUrl}
                alt={selectedPhoto.title}
                className="w-full max-h-[70vh] object-contain rounded-lg mb-4 shadow-lg border border-[rgba(201,164,99,0.2)]"
              />
              <h3 className="font-serif text-2xl font-bold text-[#f2e8d5]">
                {selectedPhoto.title}
              </h3>
              {selectedPhoto.caption && (
                <p className="font-handwritten text-lg text-[#e2c27e] mt-2">
                  "{selectedPhoto.caption}"
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
