import Image from "next/image";

export function AboutHeroSection() {
  return (
    <section className="relative w-full min-h-[380px] sm:min-h-[460px] lg:min-h-[520px] flex items-end justify-start overflow-hidden bg-black text-white">
      <Image
        src="/home-hero/h1.png"
        alt="Welcome to Saiyoojyam Hostels Kakkanad Kochi"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/5 to-transparent" />

      <div className="relative z-10 max-w-[1280px] w-full mx-auto px-5 sm:px-8 pb-12 sm:pb-16 pt-24 text-left flex flex-col items-start justify-end gap-2.5 sm:gap-3">
        {/* <span className="inline-block text-xs sm:text-sm font-semibold text-white">
          About Saiyoojyam
        </span> */}
        <h1 className="text-3xl sm:text-5xl lg:text-7xl font-heading text-white font-semibold leading-[1.15] max-w-4xl tracking-wide">
          Welcome to{" "}
          <span className="relative inline-block mt-0.5">
            <span className="courgette-regular text-orange-200 font-normal tracking-wide text-[0.95em]">
              Saiyoojyam
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
                className="animate-draw-underline"
                pathLength="100"
              />
            </svg>
          </span>
        </h1>
        <p className="text-sm sm:text-lg text-gray-200 max-w-2xl font-normal leading-relaxed">
          A perfect home and premier living environment for working women &amp; students in Kakkanad, Kochi.
        </p>
      </div>
    </section>
  );
}
