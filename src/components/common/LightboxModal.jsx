import React, { useEffect } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { X, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

export default function LightboxModal() {
  const { 
    lightboxGallery, 
    closeLightbox, 
    nextLightboxImage, 
    prevLightboxImage 
  } = useDashboard();

  useEffect(() => {
    if (!lightboxGallery) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'ArrowRight') nextLightboxImage();
      else if (e.key === 'ArrowLeft') prevLightboxImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxGallery, closeLightbox, nextLightboxImage, prevLightboxImage]);

  if (!lightboxGallery || !lightboxGallery.images || lightboxGallery.images.length === 0) {
    return null;
  }

  const { images, index } = lightboxGallery;
  const currentImage = images[index];
  const hasMultiple = images.length > 1;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/92 backdrop-blur-md animate-in fade-in duration-200 select-none"
      onClick={closeLightbox}
    >
      {/* Top Header: Image counter, external link & close button */}
      <div 
        className="absolute top-4 left-4 right-4 flex items-center justify-between text-white z-20 pointer-events-none"
      >
        <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-semibold pointer-events-auto flex items-center gap-2">
          <span>Ảnh {index + 1} / {images.length}</span>
          {hasMultiple && (
            <span className="text-white/60 text-[10px] hidden sm:inline">(Dùng phím ← → hoặc nút để chuyển)</span>
          )}
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <a
            href={currentImage}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-white/80 hover:text-white bg-black/50 hover:bg-black/70 rounded-full transition-colors"
            title="Mở tab mới"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="w-5 h-5" />
          </a>
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeLightbox();
            }}
            className="p-2 text-white/80 hover:text-white bg-black/50 hover:bg-black/70 rounded-full transition-colors"
            title="Đóng (Esc)"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Prev Navigation Button */}
      {hasMultiple && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            prevLightboxImage();
          }}
          className="absolute left-3 sm:left-6 z-20 p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-black/90 text-white/90 hover:text-white backdrop-blur-xs transition-all hover:scale-110 active:scale-95 shadow-lg"
          title="Ảnh trước (←)"
        >
          <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>
      )}

      {/* Next Navigation Button */}
      {hasMultiple && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            nextLightboxImage();
          }}
          className="absolute right-3 sm:right-6 z-20 p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-black/90 text-white/90 hover:text-white backdrop-blur-xs transition-all hover:scale-110 active:scale-95 shadow-lg"
          title="Ảnh tiếp theo (→)"
        >
          <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>
      )}

      {/* Main Image Display */}
      <div 
        className="max-w-5xl max-h-[82vh] flex items-center justify-center relative select-none"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          key={currentImage}
          src={currentImage}
          alt={`Preview ${index + 1}`}
          className="max-h-[80vh] max-w-full rounded-xl sm:rounded-2xl object-contain shadow-2xl ring-1 ring-white/10 animate-in fade-in zoom-in-95 duration-150"
        />
      </div>

      {/* Bottom Thumbnail Strip (if multiple images) */}
      {hasMultiple && (
        <div 
          className="absolute bottom-4 z-20 flex items-center gap-2 max-w-md overflow-x-auto p-1.5 bg-black/60 backdrop-blur-md rounded-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => {
                const { images } = lightboxGallery;
                setLightboxGallery({ images, index: i });
              }}
              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden shrink-0 transition-all ${
                i === index 
                  ? 'ring-2 ring-blue-500 scale-105 opacity-100' 
                  : 'opacity-50 hover:opacity-80'
              }`}
            >
              <img src={img} alt="thumb" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
