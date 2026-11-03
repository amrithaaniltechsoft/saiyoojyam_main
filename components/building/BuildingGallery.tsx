"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft, X } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { BuildingDetailData } from "@/data/buildingsData";

interface BuildingGalleryProps {
  building: BuildingDetailData;
}

interface PhotoItem {
  src: string;
  alt: string;
  caption: string;
}



export function BuildingGallery({ building }: BuildingGalleryProps) {
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  // Dynamically include photos from building
  const photos: PhotoItem[] = [];

  // Main banner photo
  if (building.heroImages?.main) {
    photos.push({
      src: building.heroImages.main,
      alt: `${building.name} Main View`,
      caption: `${building.name} Exterior Facade`,
    });
  }

  // Gallery photos
  if (Array.isArray(building.moreImages) && building.moreImages.length > 0) {
    building.moreImages.forEach((imgUrl, i) => {
      if (imgUrl && imgUrl !== building.heroImages?.main) {
        photos.push({
          src: imgUrl,
          alt: `${building.name} Gallery Photo ${i + 1}`,
          caption: `${building.name} Gallery View`,
        });
      }
    });
  }

  if (photos.length === 0) {
    return null;
  }

  // Key navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activePhotoIndex === null) return;
      if (e.key === "Escape") {
        setActivePhotoIndex(null);
      } else if (e.key === "ArrowRight") {
        setActivePhotoIndex((prev) =>
          prev !== null ? (prev + 1) % photos.length : null
        );
      } else if (e.key === "ArrowLeft") {
        setActivePhotoIndex((prev) =>
          prev !== null ? (prev - 1 + photos.length) % photos.length : null
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activePhotoIndex, photos.length]);

  return (
    <>
      <div id="gallery" className="scroll-mt-24">
        {/* ==================== MOBILE & TABLET VIEW (< lg): FULL-WIDTH SLIDER ==================== */}
        <div className="lg:hidden relative w-full rounded-lg overflow-hidden group/slider">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={0}
            slidesPerView={1}
            navigation={{
              prevEl: ".mobile-gallery-prev",
              nextEl: ".mobile-gallery-next",
            }}
            pagination={{
              type: "fraction",
              el: ".mobile-gallery-pagination",
            }}
            loop={photos.length > 1}
            touchEventsTarget="container"
            preventClicks={true}
            preventClicksPropagation={true}
            simulateTouch={true}
            grabCursor={true}
            className="w-full h-[260px] xs:h-[300px] sm:h-[380px]"
          >
            {photos.map((photo, idx) => (
              <SwiperSlide key={`mobile-slide-${photo.src}-${idx}`} className="relative w-full h-full">
                <div
                  onClick={() => setActivePhotoIndex(idx)}
                  className="relative w-full h-full cursor-pointer"
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    priority={idx === 0}
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Left Navigation Arrow */}
          <button
            type="button"
            aria-label="Previous image"
            className="mobile-gallery-prev absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center transition-all active:scale-90 cursor-pointer shadow-md backdrop-blur-xs border border-white/20"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Right Navigation Arrow */}
          <button
            type="button"
            aria-label="Next image"
            className="mobile-gallery-next absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center transition-all active:scale-90 cursor-pointer shadow-md backdrop-blur-xs border border-white/20"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Photo Counter Pill at Top-Right or Bottom-Right */}
          <div className="mobile-gallery-pagination absolute bottom-2.5 right-3 z-20 text-[11px] font-semibold text-white" />
        </div>

        {/* ==================== DESKTOP VIEW (lg+): ORIGINAL TILED GRID ==================== */}
        <div className="hidden lg:flex flex-col gap-2">
          {/* Top Row: Big Main Photo + 2 Stacked Photos */}
          <div className="grid grid-cols-12 gap-2 h-[350px]">
            {/* Main Featured Photo */}
            <div
              onClick={() => setActivePhotoIndex(0)}
              className={`${photos.length > 1 ? "col-span-7" : "col-span-12"} relative h-full rounded-md overflow-hidden group cursor-pointer bg-gray-900`}
            >
              <Image
                src={photos[0].src}
                alt={photos[0].alt}
                fill
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
            </div>

            {/* Two Stacked Photos (Right, only if > 1 photo) */}
            {photos.length > 1 && (
              <div className="col-span-5 grid grid-rows-2 gap-2 h-full">
                {/* Stacked Top */}
                <div
                  onClick={() => setActivePhotoIndex(1)}
                  className="relative h-full rounded-md overflow-hidden group cursor-pointer bg-gray-900"
                >
                  <Image
                    src={photos[1].src}
                    alt={photos[1].alt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                </div>

                {/* Stacked Bottom */}
                <div
                  onClick={() => setActivePhotoIndex(photos[2] ? 2 : 1)}
                  className="relative h-full rounded-md overflow-hidden group cursor-pointer bg-gray-900"
                >
                  <Image
                    src={photos[2]?.src || photos[1].src}
                    alt={photos[2]?.alt || photos[1].alt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                </div>
              </div>
            )}
          </div>

          {/* Bottom Row: 5 Small Thumbnail Photos (only if > 3 photos) */}
          {photos.length > 3 && (
            <div className="grid grid-cols-5 gap-2 h-[88px]">
              {photos.slice(3, 8).map((photo, idx) => {
                const actualIndex = idx + 3;
                const isLast = idx === 4;
                const remainingCount = Math.max(0, photos.length - 7);

                return (
                  <div
                    key={actualIndex}
                    onClick={() => setActivePhotoIndex(actualIndex)}
                    className="relative h-full rounded-md overflow-hidden group cursor-pointer bg-gray-900"
                  >
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />

                    {/* 5th Thumbnail has Dynamic Remaining Photos Overlay */}
                    {isLast && remainingCount > 0 ? (
                      <div className="absolute inset-0 bg-black/65 hover:bg-black/75 transition-colors flex items-center justify-center text-white font-bold text-sm tracking-wide text-center px-1">
                        +{remainingCount} photos
                      </div>
                    ) : (
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ==================== FULLSCREEN LIGHTBOX MODAL ==================== */}
      {activePhotoIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] bg-black/95 flex flex-col justify-between p-4 sm:p-6 backdrop-blur-md animate-in fade-in duration-200"
        >
          {/* Top Bar: Title, Counter & Close */}
          <div className="flex items-center justify-between text-white border-b border-white/10 pb-3">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">
                {building.name}
              </h3>
              <p className="text-xs text-white/70">
                Photo {activePhotoIndex + 1} of {photos.length} •{" "}
                {photos[activePhotoIndex].caption}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setActivePhotoIndex(null)}
              aria-label="Close photo gallery"
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Central Image with Prev / Next Controls */}
          <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
            {/* Prev Button */}
            <button
              type="button"
              aria-label="Previous photo"
              onClick={() =>
                setActivePhotoIndex(
                  (prev) => ((prev ?? 0) - 1 + photos.length) % photos.length
                )
              }
              className="absolute left-2 sm:left-4 z-20 p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/20 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Main Display Image */}
            <div className="relative w-full h-full max-h-[70vh] flex items-center justify-center">
              <Image
                src={photos[activePhotoIndex].src}
                alt={photos[activePhotoIndex].alt}
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Next Button */}
            <button
              type="button"
              aria-label="Next photo"
              onClick={() =>
                setActivePhotoIndex((prev) => ((prev ?? 0) + 1) % photos.length)
              }
              className="absolute right-2 sm:right-4 z-20 p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/20 transition-all cursor-pointer"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Bottom Thumbnail Strip */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto py-2 border-t border-white/10">
            {photos.map((item, idx) => (
              <button
                key={`thumb-${item.src}-${idx}`}
                type="button"
                onClick={() => setActivePhotoIndex(idx)}
                className={`relative w-14 h-11 sm:w-20 sm:h-14 rounded overflow-hidden shrink-0 transition-all cursor-pointer ${
                  activePhotoIndex === idx
                    ? "ring-2 ring-[#FF561C] scale-105 opacity-100"
                    : "opacity-50 hover:opacity-80"
                }`}
              >
                <Image src={item.src} alt={item.alt} fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
