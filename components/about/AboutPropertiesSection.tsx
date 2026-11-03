"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Building2, ArrowRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export function AboutPropertiesSection() {
  const [networkData, setNetworkData] = useState<{
    subtitle: string;
    title: string;
    raw_desc: string;
    description: string;
    images: Array<{ image: string; name?: string; tagline?: string }>;
    loaded: boolean;
  }>({
    subtitle: "",
    title: "",
    raw_desc: "",
    description: "",
    images: [],
    loaded: false,
  });

  useEffect(() => {
    const rawApiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost/saiyoojyam";
    const baseUrl = rawApiUrl.replace(/\/+$/, "");

    fetch(`${baseUrl}/api/about`, { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json && json.status && json.data && json.data.network) {
          const net = json.data.network;
          setNetworkData({
            subtitle: net.subtitle?.trim() || "",
            title: net.title?.trim() || "",
            raw_desc:
              net.raw_desc?.trim() ||
              net.description?.trim() ||
              "",
            description: net.description?.trim() || "",
            images: Array.isArray(net.images) ? net.images : [],
            loaded: true,
          });
        } else {
          setNetworkData((prev) => ({ ...prev, loaded: true }));
        }
      })
      .catch((err) => {
        console.warn("Could not fetch network data:", err);
        setNetworkData((prev) => ({ ...prev, loaded: true }));
      });
  }, []);

  if (!networkData.loaded) {
    return null;
  }

  const hasContent =
    Boolean(networkData.title) ||
    Boolean(networkData.raw_desc) ||
    Boolean(networkData.description) ||
    networkData.images.length > 0;

  if (!hasContent) {
    return null;
  }

  const hasImages = networkData.images.length > 0;

  return (
    <section className="w-full py-12 sm:py-20 bg-white">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          {/* Offset warm peach/orange background banner */}
          <div className="hidden lg:block absolute top-0 left-0 w-3/4 h-full bg-[#fff4ee] rounded-3xl -z-0" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center lg:py-10 lg:px-6">
            {/* Left Text Block */}
            <div
              className={`${
                hasImages ? "lg:col-span-7" : "lg:col-span-12"
              } flex flex-col justify-center space-y-4 sm:space-y-5 lg:pr-4 order-2 lg:order-1`}
            >
              {networkData.subtitle && (
                <span className="text-xs sm:text-sm font-bold text-[#FF561C]">
                  {networkData.subtitle}
                </span>
              )}
              {networkData.title && (
                <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold font-heading text-gray-950 leading-tight">
                  {networkData.title}
                </h2>
              )}
              {networkData.raw_desc ? (
                <div
                  className="space-y-4 text-sm sm:text-base text-gray-700 leading-relaxed font-normal [&>p]:mb-3 [&>p:last-child]:mb-0 [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5"
                  dangerouslySetInnerHTML={{ __html: networkData.raw_desc }}
                />
              ) : networkData.description ? (
                <div className="space-y-4 text-sm sm:text-base text-gray-700 leading-relaxed font-normal">
                  <p>{networkData.description}</p>
                </div>
              ) : null}

              {/* Property Quick Pills */}
              <div className="pt-2 flex flex-wrap gap-2 sm:gap-3">
                <Link
                  href="/building/towers"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-orange-200 text-xs sm:text-sm font-semibold text-gray-900 hover:border-[#FF561C] hover:text-[#FF561C] transition-colors"
                >
                  <Building2 className="w-4 h-4 text-[#FF561C]" />
                  <span>Saiyoojyam Towers</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/building/premier"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-orange-200 text-xs sm:text-sm font-semibold text-gray-900 hover:border-[#FF561C] hover:text-[#FF561C] transition-colors"
                >
                  <Building2 className="w-4 h-4 text-[#FF561C]" />
                  <span>Saiyoojyam Premier</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/building/annex"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-orange-200 text-xs sm:text-sm font-semibold text-gray-900 hover:border-[#FF561C] hover:text-[#FF561C] transition-colors"
                >
                  <Building2 className="w-4 h-4 text-[#FF561C]" />
                  <span>Saiyoojyam Annex</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Right Carousel: Only renders if images exist in database */}
            {hasImages && (
              <div className="lg:col-span-5 relative order-1 lg:order-2">
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
                    loop={networkData.images.length > 1}
                    className="w-full h-full relative [&_.swiper-pagination]:!text-right [&_.swiper-pagination]:!pr-4 [&_.swiper-pagination]:!bottom-3"
                  >
                    {networkData.images.map((slide, idx) => (
                      <SwiperSlide key={idx} className="relative w-full h-full">
                        <Image
                          src={slide.image}
                          alt={slide.name || "Saiyoojyam Property"}
                          fill
                          sizes="(max-width: 1024px) 100vw, 40vw"
                          className="object-cover"
                          unoptimized={slide.image.startsWith("http")}
                        />
                        {/* Caption Overlay if name/tagline provided */}
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
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
