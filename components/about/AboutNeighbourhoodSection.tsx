"use client";

import { useState, useEffect } from "react";
import { MapPin } from "lucide-react";

export function AboutNeighbourhoodSection() {
  const [data, setData] = useState<{
    subtitle: string;
    title: string;
    raw_desc: string;
    landmarks: string[];
    loaded: boolean;
  }>({
    subtitle: "",
    title: "",
    raw_desc: "",
    landmarks: [],
    loaded: false,
  });

  useEffect(() => {
    const rawApiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost/saiyoojyam";
    const baseUrl = rawApiUrl.replace(/\/+$/, "");

    fetch(`${baseUrl}/api/about`, { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json && json.status && json.data && json.data.neighbourhood) {
          const nb = json.data.neighbourhood;
          setData({
            subtitle: nb.subtitle?.trim() || "",
            title: nb.title?.trim() || "",
            raw_desc:
              nb.raw_desc?.trim() ||
              (nb.description ? `<p>${nb.description}</p>` : ""),
            landmarks: Array.isArray(nb.landmarks) ? nb.landmarks : [],
            loaded: true,
          });
        } else {
          setData((prev) => ({ ...prev, loaded: true }));
        }
      })
      .catch((err) => {
        console.warn("Could not fetch neighbourhood data:", err);
        setData((prev) => ({ ...prev, loaded: true }));
      });
  }, []);

  if (!data.loaded) {
    return null;
  }

  const hasContent =
    Boolean(data.title) ||
    Boolean(data.raw_desc) ||
    data.landmarks.length > 0;

  if (!hasContent) {
    return null;
  }

  return (
    <section className="w-full py-16 sm:py-24 bg-white">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {(data.subtitle || data.title) && (
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
            {data.subtitle && (
              <span className="text-xs sm:text-sm font-bold text-[#FF561C]">
                {data.subtitle}
              </span>
            )}
            {data.title && (
              <h2 className="text-3xl sm:text-5xl font-bold font-heading text-gray-950 mt-2">
                {data.title}
              </h2>
            )}
          </div>
        )}

        <div className="px-0 lg:px-40 flex flex-col gap-6">
          {data.raw_desc && (
            <div
              className="space-y-4 text-sm sm:text-base text-gray-700 leading-relaxed font-normal [&>p]:mb-3"
              dangerouslySetInnerHTML={{ __html: data.raw_desc }}
            />
          )}

          {/* Landmark quick badges (only if provided in database) */}
          {data.landmarks && data.landmarks.length > 0 && (
            <div className="pt-2 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {data.landmarks.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-gray-200 text-xs sm:text-sm text-gray-800 font-medium shadow-sm hover:border-[#FF561C]/40 transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#FF561C] shrink-0" />
                  <span className="truncate">{item}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
