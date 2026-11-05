"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export interface PropertySlide {
  image: string;
  name?: string;
  tagline?: string;
}

export function PropertiesCarousel({ slides }: { slides: PropertySlide[] }) {
  if (!slides || slides.length === 0) return null;

  return (
    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border border-gray-100 group">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          bulletClass:
            "inline-block w-2 h-2 rounded-full bg-white/70 mx-1 transition-all cursor-pointer",
          bulletActiveClass: "!w-5 !bg-[#FF561C] !rounded-full",
        }}
        loop={slides.length > 1}
        className="w-full h-full relative [&_.swiper-pagination]:!text-right [&_.swiper-pagination]:!pr-4 [&_.swiper-pagination]:!bottom-3"
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={idx} className="relative w-full h-full">
            <Image
              src={slide.image}
              alt={slide.name || "Saiyoojyam Property"}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
              unoptimized={slide.image.startsWith("http")}
            />
            {(slide.name || slide.tagline) && (
              <div className="absolute inset-x-0 bottom-0 pb-6 pt-10 px-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white flex flex-col justify-end">
                {slide.name && (
                  <span className="text-xs sm:text-sm font-semibold tracking-wide text-white">
                    {slide.name}
                  </span>
                )}
                {slide.tagline && (
                  <span className="text-[11px] text-gray-300 font-normal">
                    {slide.tagline}
                  </span>
                )}
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

