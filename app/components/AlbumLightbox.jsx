"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { IBM_Plex_Serif } from "next/font/google";
import localFont from "next/font/local";

// const ibmPlexSerif = IBM_Plex_Serif({
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700"],
// });

// const segamoriz = localFont({
//   src: "../fonts/Segamoriz.woff2",
// });

const font2 = localFont({
  src: "../fonts/NeueMontreal-Regular.woff2",
});


export default function AlbumLightbox({
  isOpen,
  onClose,
  title,
  images,
  startIndex = 0,
}) {
  const [currentIndex, setCurrentIndex] = useState(startIndex);

  const goNext = () => {
    if (!images?.length) return;
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goPrev = () => {
    if (!images?.length) return;
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  useEffect(() => {
    if (isOpen) setCurrentIndex(startIndex);
  }, [isOpen, startIndex]);

  useEffect(() => {
    function handleKeyDown(e) {
      if (!isOpen) return;

      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, images, currentIndex]);

  if (!isOpen || !images?.length) return null;

  return (
    <div
      className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative flex w-full max-w-[1200px] max-h-[90vh] flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between shrink-0">
          <h2 className="text-2xl uppercase tracking-[0.18em] text-white">
            {title}
          </h2>
          <div className="flex items-center gap-8">
            <p className="text-sm text-white/70">
              {currentIndex + 1} / {images.length}
            </p>
            <button
              onClick={onClose}
              className="z-20 text-3xl text-white/80 transition hover:text-white cursor-pointer"
              aria-label="Close album"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-black shadow-[0_20px_80px_rgba(0,0,0,0.6)] shrink-0">
          <div className="relative h-[min(62vh,700px)] w-full">
            <Image
              src={images[currentIndex]}
              alt={`${title} image ${currentIndex + 1}`}
              fill
              className="object-contain bg-black"
              priority
            />
          </div>

          <button
            onClick={goPrev}
            className="absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-2xl text-white transition hover:bg-black/70 cursor-pointer"
            aria-label="Previous image"
          >
            ‹
          </button>

          <button
            onClick={goNext}
            className="absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-2xl text-white transition hover:bg-black/70 cursor-pointer"
            aria-label="Next image"
          >
            ›
          </button>
        </div>

        <div className="mt-4 flex gap-3 overflow-x-auto pb-2 shrink-0">
          {images.map((img, index) => (
            <button
              key={img}
              onClick={() => setCurrentIndex(index)}
              className={`relative h-20 w-32 shrink-0 overflow-hidden rounded-lg border-2 transition cursor-pointer ${
                index === currentIndex
                  ? "border-amber-50"
                  : "border-white/10 opacity-70 hover:opacity-100"
              }`}
              aria-label={`Go to image ${index + 1}`}
            >
              <Image src={img} alt="" fill className="object-cover" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
