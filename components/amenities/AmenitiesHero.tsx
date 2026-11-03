import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Sparkles, ShieldCheck, Utensils, Wifi, Zap } from "lucide-react";

export function AmenitiesHero() {
  return (
    <section className="relative w-full min-h-[380px] sm:min-h-[440px] lg:min-h-[480px] flex items-end justify-start overflow-hidden bg-gray-950 text-white">
      {/* Background Image with warm gradient overlay */}
      <Image
        src="/home-hero/h1.png"
        alt="Saiyoojyam Ladies Hostels Kakkanad Amenities"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center opacity-40 scale-105 transition-transform duration-1000"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />

      {/* Decorative Warm Ambient Glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#FF561C]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8 pb-10 sm:pb-14 pt-28 text-left flex flex-col items-start justify-end gap-3 sm:gap-4">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-300 font-medium"
        >
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-[#FF561C] font-semibold">Amenities</span>
        </nav>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF561C]/20 border border-[#FF561C]/40 text-[#ffd7a8] text-xs sm:text-sm font-medium tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-[#FF561C]" />
          <span>Carefully Curated For Comfort &amp; Safety</span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-heading text-white font-semibold leading-[1.15] max-w-4xl tracking-tight">
          Hostel Amenities &amp;{" "}
          <span className="relative inline-block mt-0.5">
            <span className="courgette-regular text-orange-200 font-normal tracking-wide text-[0.95em]">
              Living Facilities
            </span>
            <svg
              className="absolute left-0 -bottom-1.5 sm:-bottom-2 w-full h-2.5 sm:h-3.5 overflow-visible pointer-events-none"
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
                pathLength="100"
              />
            </svg>
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base lg:text-lg text-gray-200 max-w-3xl font-normal leading-relaxed">
          At Saiyoojyam Ladies Hostels, every facility is thoughtfully designed to provide working
          women and students a secure, hygienic, and authentic home-away-from-home experience near
          Infopark Kakkanad, Kochi.
        </p>

        {/* Quick Highlights Pills */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-2 text-xs sm:text-sm text-gray-200">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/10 backdrop-blur-sm border border-white/10">
            <Wifi className="w-3.5 h-3.5 text-[#FF561C]" /> 24/7 High-Speed Wi-Fi
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/10 backdrop-blur-sm border border-white/10">
            <Utensils className="w-3.5 h-3.5 text-[#FF561C]" /> Nutritious Homely Meals
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/10 backdrop-blur-sm border border-white/10">
            <ShieldCheck className="w-3.5 h-3.5 text-[#FF561C]" /> Biometric &amp; CCTV Security
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/10 backdrop-blur-sm border border-white/10">
            <Zap className="w-3.5 h-3.5 text-[#FF561C]" /> Power Backup
          </span>
        </div>
      </div>
    </section>
  );
}

