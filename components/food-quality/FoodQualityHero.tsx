import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Utensils, Clock, Droplets, ShieldCheck } from "lucide-react";

export interface FoodHeroData {
  subtitle?: string;
  title?: string;
  description?: string;
  image?: string;
}

interface FoodQualityHeroProps {
  data?: FoodHeroData;
}

export function FoodQualityHero({ data }: FoodQualityHeroProps) {
  const subtitle = data?.subtitle || "Hygienic • Nutritious • Homely Meals";
  const title = data?.title || "Wholesome & Homely Food Quality";
  const description =
    data?.description ||
    "Good health begins with pure, comforting food. At Saiyoojyam Hostels, our meals are freshly cooked with motherly care, zero artificial taste enhancers, and delivered punctually to match the demanding schedules of IT professionals and students near Kakkanad.";
  const heroImage = "/home-hero/h1.png";

  return (
    <section className="relative w-full min-h-[400px] sm:min-h-[460px] lg:min-h-[500px] flex items-end justify-start overflow-hidden bg-gray-950 text-white">
      {/* Background Image */}
      <Image
        src={heroImage}
        alt="Saiyoojyam Ladies Hostel Homely Food & Dining Quality"
        fill
        priority
        unoptimized={heroImage.startsWith("http")}
        sizes="100vw"
        className="object-cover object-center opacity-45 scale-105 transition-transform duration-1000"
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
          <span className="text-[#FF561C] font-semibold">Food Quality</span>
        </nav>

        {/* Badge */}
        {subtitle && (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF561C]/20 border border-[#FF561C]/40 text-[#ffd7a8] text-xs sm:text-sm font-medium tracking-wide">
            <Utensils className="w-3.5 h-3.5 text-[#FF561C]" />
            <span>{subtitle}</span>
          </div>
        )}

        {/* Heading */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-heading text-white font-semibold leading-[1.15] max-w-4xl tracking-tight">
          {title.includes("Food Quality") ? (
            <>
              {title.replace("Food Quality", "").trim()}{" "}
              <span className="relative inline-block mt-0.5">
                <span className="courgette-regular text-orange-200 font-normal tracking-wide text-[0.95em]">
                  Food Quality
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
            </>
          ) : (
            title
          )}
        </h1>

        {/* Subtitle */}
        {description && (
          <p className="text-sm sm:text-base lg:text-lg text-gray-200 max-w-3xl font-normal leading-relaxed">
            {description}
          </p>
        )}

        {/* Quick Highlights Pills */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-2 text-xs sm:text-sm text-gray-200">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/10 backdrop-blur-sm border border-white/10">
            <Clock className="w-3.5 h-3.5 text-[#FF561C]" /> Breakfast &amp; Lunch Tiffin by 7:30 AM
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/10 backdrop-blur-sm border border-white/10">
            <Utensils className="w-3.5 h-3.5 text-[#FF561C]" /> North &amp; South Indian Combo
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/10 backdrop-blur-sm border border-white/10">
            <Droplets className="w-3.5 h-3.5 text-[#FF561C]" /> 24/7 Boiled Drinking Water &amp; RO
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/10 backdrop-blur-sm border border-white/10">
            <ShieldCheck className="w-3.5 h-3.5 text-[#FF561C]" /> Daily Kitchen Sanitization
          </span>
        </div>
      </div>
    </section>
  );
}
