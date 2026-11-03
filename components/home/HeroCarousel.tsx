"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import { MapPin } from "lucide-react";
import { SearchFilter, SearchFilterState } from "@/components/ui/SearchFilter";
import "swiper/css";
import "swiper/css/effect-fade";

export interface Slide {
  counter: string;
  caption: string;
  image: string;
  alt: string;
}

const slides: Slide[] = [
  {
    counter: "01 / 04",
    caption: "Saiyoojyam Premier - Premium AC & Non-AC Living near Infopark",
    image: "/home-hero/h4.png",
    alt: "Saiyoojyam Premier hostel room in Kakkanad near Infopark",
  },
  {
    counter: "02 / 04",
    caption: "Saiyoojyam Annex - Kuzhikkattumoola Tranquil & Safe Sanctuary",
    image: "/home-hero/h5.png",
    alt: "Saiyoojyam Annex room and study spaces in Kuzhikkattumoola",
  },
  {
    counter: "03 / 04",
    caption:
      "Saiyoojyam Towers 1 & 2 - Painakkil Jn, Modern Coliving for IT Professionals",
    image: "/home-hero/h6.png",
    alt: "Saiyoojyam Towers modern common lounge and dining space",
  },
  {
    counter: "04 / 04",
    caption:
      "Saiyoojyam Towers 1 & 2 - Painakkil Jn, Modern Coliving for IT Professionals",
    image: "/home-hero/h7.png",
    alt: "Saiyoojyam Towers modern common lounge and dining space",
  },
];

export interface HostelBuildingItem {
  id?: number | string;
  name: string;
  slug?: string;
  location: string;
  images: string[];
}
interface MobileBuildingCardProps {
  buildingItem: HostelBuildingItem;
  bSlug: string;
  intervalDelay: number;
}

function MobileBuildingCard({
  buildingItem,
  bSlug,
  intervalDelay,
}: MobileBuildingCardProps) {
  const router = useRouter();
  const [activeImgIdx, setActiveImgIdx] = useState(0);

  useEffect(() => {
    if (!buildingItem.images || buildingItem.images.length <= 1) return;

    const timer = setInterval(() => {
      setActiveImgIdx((prev) => (prev + 1) % buildingItem.images.length);
    }, intervalDelay);

    return () => clearInterval(timer);
  }, [buildingItem.images, intervalDelay]);

  return (
    <div
      onClick={() => router.push(`/building/${bSlug}?view=overview`)}
      className="w-full bg-white pb-2 cursor-pointer flex flex-col group select-none"
    >
      {/* Building Image Auto-Crossfade Container */}
      <div className="relative h-28 sm:h-36 w-full bg-gray-100 overflow-hidden">
        {buildingItem.images.map((imgSrc, imgIdx) => (
          <div
            key={imgIdx}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              imgIdx === activeImgIdx ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <Image
              src={imgSrc}
              alt={`${buildingItem.name} view ${imgIdx + 1}`}
              fill
              sizes="(max-width: 640px) 45vw, 240px"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none z-20" />
      </div>

      {/* Card Content Footer */}
      <div className="pt-2 flex flex-col justify-between flex-1 gap-0.5">
        <h3 className="text-xs sm:text-sm font-semibold text-gray-950 font-sans-normal leading-snug group-hover:text-[#FF561C] transition-colors truncate">
          {buildingItem.name}
        </h3>
        <div className="flex items-center gap-1 text-[11px] text-gray-500 font-sans-normal font-medium">
          <MapPin className="w-3 h-3 text-gray-500 shrink-0" />
          <span className="truncate">{buildingItem.location}</span>
        </div>
      </div>
    </div>
  );
}

interface HeroCarouselProps {
  initialBuildings?: HostelBuildingItem[];
  searchFilter?: SearchFilterState;
  setSearchFilter?: React.Dispatch<React.SetStateAction<SearchFilterState>>;
}

export function HeroCarousel({
  initialBuildings,
  searchFilter: externalFilter,
  setSearchFilter: externalSetFilter,
}: HeroCarouselProps) {
  const router = useRouter();

  const [hostelBuildings, setHostelBuildings] = useState<HostelBuildingItem[]>(
    initialBuildings || []
  );

  useEffect(() => {
    if (initialBuildings && initialBuildings.length > 0) {
      setHostelBuildings(initialBuildings);
      return;
    }

    const rawApiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost/saiyoojyam";
    const baseUrl = rawApiUrl.replace(/\/+$/, "");

    fetch(`${baseUrl}/api/building`, { cache: "no-store" })
      .then((res) => res.json())
      .then((json) => {
        if (json && json.status && Array.isArray(json.data) && json.data.length > 0) {
          const mapped: HostelBuildingItem[] = json.data.map((b: any) => ({
            id: b.id,
            name: b.name || "",
            slug: b.slug || "",
            location: b.location || b.address || "",
            images: Array.isArray(b.images) && b.images.length > 0 ? b.images : (b.mainImage ? [b.mainImage] : []),
          }));
          setHostelBuildings(mapped);
        }
      })
      .catch(() => {});
  }, [initialBuildings]);

  const [internalFilter, setInternalFilter] = useState<SearchFilterState>({
    location: "all",
    checkInDate: "",
    roomType: "all",
  });

  const searchFilter = externalFilter ?? internalFilter;
  const setSearchFilter = externalSetFilter ?? setInternalFilter;

  const getSlug = (item: HostelBuildingItem) => {
    if (item.slug) return item.slug;
    const nameLower = (item.name || "").toLowerCase();
    if (nameLower.includes("premier")) return "premier";
    if (nameLower.includes("annex")) return "annex";
    if (nameLower.includes("tower")) return "towers";
    return "premier";
  };

  return (
    <section className="relative z-30 w-full bg-black text-white p-0 overflow-x-clip">
      {/* ========================================================== */}
      {/* 1. MOBILE & TABLET APP-LIKE EXPERIENCE (lg:hidden)         */}
      {/* ========================================================== */}
      <div className="flex flex-col lg:hidden w-full bg-white text-gray-900 pb-10 overflow-x-clip">
        {/* Top Hero Banner with Image Slider & Gradient */}
        <div className="relative w-full h-[230px] sm:h-[300px] overflow-hidden">
          <Swiper
            modules={[Autoplay, EffectFade]}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            speed={1000}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            loop={true}
            className="w-full h-full"
          >
            {slides.map((slide, idx) => (
              <SwiperSlide key={idx} className="w-full h-full relative">
                <Image
                  src={slide.image}
                  alt={slide.alt}
                  fill
                  priority={idx === 0}
                  className="object-cover"
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Floating App Header Banner Text */}
          <div className="absolute inset-x-0 bottom-8 px-4 z-20 flex flex-col justify-end">

            <h1 className="text-3xl font-heading text-white font-semibold leading-[1.18] tracking-wide drop-shadow-md">
              Saiyoojyam,<br />
              <span className="relative inline-block mt-0.5">
                <span className="courgette-regular text-orange-200 font-normal tracking-wide text-[0.88em]">
                  a perfect home
                </span>
                <svg
                  className="absolute left-0 -bottom-1.5 w-full h-2.5 overflow-visible pointer-events-none"
                  viewBox="0 0 100 12"
                  preserveAspectRatio="none"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 9.5 C 25 2.5, 75 2, 98 8 C 80 11.5, 45 11, 28 9"
                    stroke="#ffd7a8"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="animate-draw-underline"
                    pathLength="100"
                  />
                </svg>
              </span>{" "}
              for you
            </h1>
          </div>
        </div>

        {/* Floating Search Filter */}
        <div className="px-3 sm:px-6 -mt-3 relative z-30 w-full max-w-full overflow-visible">
          <div className="w-full">
            <SearchFilter
              searchFilter={searchFilter}
              setSearchFilter={setSearchFilter}
              buildings={hostelBuildings}
            />
          </div>
        </div>

        {/* Featured Hostels / Buildings Section: White BG, Unboxed, Sharp / No Rounded Corners */}
        {hostelBuildings.length > 0 && (
          <div className="mt-8 px-4 sm:px-6 w-full bg-white overflow-hidden">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-950 tracking-tight">
                  Explore Our Hostels
                </h2>
                <p className="text-xs text-gray-500 font-normal">
                  Near Infopark Kakkanad & SmartCity
                </p>
              </div>
            </div>

            {/* Touch/Swipe Swiper Carousel on mobile / tablet */}
            <div className="w-full overflow-hidden">
              <Swiper
                slidesPerView={2.2}
                spaceBetween={12}
                breakpoints={{
                  480: {
                    slidesPerView: 2.5,
                    spaceBetween: 14,
                  },
                  640: {
                    slidesPerView: 2.7,
                    spaceBetween: 16,
                  },
                  768: {
                    slidesPerView: 3,
                    spaceBetween: 16,
                  },
                }}
                grabCursor={true}
                touchEventsTarget="container"
                resistance={true}
                resistanceRatio={0.65}
                className="w-full"
              >
                {hostelBuildings.map((buildingItem, idx) => {
                  const bSlug = getSlug(buildingItem);

                  return (
                    <SwiperSlide key={buildingItem.id ?? idx} className="!h-auto">
                      <MobileBuildingCard
                        buildingItem={buildingItem}
                        bSlug={bSlug}
                        intervalDelay={3500 + idx * 700}
                      />
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================== */}
      {/* 2. DESKTOP VIEW (hidden lg:flex)                            */}
      {/* Exact identical original layout preserved without changes  */}
      {/* ========================================================== */}
      <div className="hidden lg:flex flex-row w-full items-stretch min-h-[540px] lg:h-[580px] gap-[1px]">
        {/* Main Hero Slider (Left Panel) */}
        <div className="relative flex-1 min-h-[460px] lg:min-h-[580px] bg-gray-950 flex flex-col justify-between px-6 sm:px-10 pb-12 sm:pb-36">
          {/* Swiper Background */}
          <div className="absolute inset-0 w-full h-full select-none overflow-hidden">
            <Swiper
              modules={[Autoplay, EffectFade]}
              effect="fade"
              fadeEffect={{ crossFade: true }}
              speed={1000}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
              }}
              loop={true}
              className="w-full h-full"
            >
              {slides.map((slide, idx) => (
                <SwiperSlide key={idx} className="w-full h-full relative">
                  <Image
                    src={slide.image}
                    alt={slide.alt}
                    fill
                    priority={idx === 0}
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 70vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/30 to-black/20" />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Bottom Content Group: Headline directly above Search Filter */}
          <div className="relative z-20 flex flex-col justify-end gap-4 sm:gap-5 mt-auto">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-heading text-white font-semibold leading-[1.18]">
              Saiyoojyam,<br />
              <span className="relative inline-block mt-1">
                <span className="courgette-regular text-orange-200 font-normal tracking-wide text-[0.88em]">
                  a perfect home
                </span>
                <svg
                  className="absolute left-0 -bottom-2 sm:-bottom-2.5 w-full h-3 overflow-visible pointer-events-none"
                  viewBox="0 0 100 12"
                  preserveAspectRatio="none"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 9.5 C 25 2.5, 75 2, 98 8 C 80 11.5, 45 11, 28 9"
                    stroke="#ffd7a8"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="animate-draw-underline"
                    pathLength="100"
                  />
                </svg>
              </span>{" "}
              for you
            </h1>

            <div className="relative z-30 w-full max-w-[760px] mt-5">
              <SearchFilter
                searchFilter={searchFilter}
                setSearchFilter={setSearchFilter}
                buildings={hostelBuildings}
                showBottomBadge={true}
              />
            </div>
          </div>
        </div>

        {/* Right Column: 3 Hostel Buildings Single Column Stack */}
        {hostelBuildings.length > 0 && (
          <div className="w-full lg:w-[320px] xl:w-[360px] shrink-0 flex flex-col bg-black">
            {hostelBuildings.map((buildingItem, idx) => {
              const bSlug = getSlug(buildingItem);

              return (
                <div
                  key={buildingItem.id ?? idx}
                  onClick={() => router.push(`/building/${bSlug}?view=overview`)}
                  className="group relative flex-1 h-[175px] lg:h-1/3 w-full overflow-hidden flex flex-col justify-end p-5 cursor-pointer bg-gray-900"
                >
                  {/* Background Carousel Swiper */}
                  {buildingItem.images && buildingItem.images.length > 0 && (
                    <div className="absolute inset-0 w-full h-full select-none pointer-events-none">
                      <Swiper
                        modules={[Autoplay, EffectFade]}
                        effect="fade"
                        fadeEffect={{ crossFade: true }}
                        speed={800}
                        autoplay={{
                          delay: 3500 + idx * 700,
                          disableOnInteraction: false,
                        }}
                        loop={buildingItem.images.length > 1}
                        className="w-full h-full"
                      >
                        {buildingItem.images.map((imgSrc, imgIdx) => (
                          <SwiperSlide key={imgIdx} className="w-full h-full relative">
                            <Image
                              src={imgSrc}
                              alt={`${buildingItem.name} view ${imgIdx + 1}`}
                              fill
                              sizes="(max-width: 1024px) 100vw, 360px"
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    </div>
                  )}

                  {/* Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none z-10" />

                  {/* Building Title & Location */}
                  <div className="relative z-20 flex flex-col gap-1">
                    <h3 className="text-lg font-semibold text-white leading-snug font-sans-normal">
                      {buildingItem.name}
                    </h3>

                    {buildingItem.location && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-300 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-white shrink-0" />
                        <span className="truncate">{buildingItem.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}


