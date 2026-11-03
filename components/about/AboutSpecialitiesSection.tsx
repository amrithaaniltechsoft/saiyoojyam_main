"use client";

import { useState, useEffect } from "react";
import {
  Sparkles,
  Droplets,
  ShieldCheck,
  CheckCircle,
  Home,
  Heart,
  MapPin,
} from "lucide-react";

interface SpecialityItem {
  title: string;
  icon?: string;
  desc?: string;
}

function renderIcon(iconName?: string) {
  const props = {
    className: "w-10 h-10 sm:w-12 sm:h-12 text-[#FF561C] shrink-0",
    strokeWidth: 1.8,
  };
  switch ((iconName || "").toLowerCase()) {
    case "droplets":
      return <Droplets {...props} />;
    case "shieldcheck":
    case "shield":
      return <ShieldCheck {...props} />;
    case "checkcircle":
    case "check":
      return <CheckCircle {...props} />;
    case "home":
      return <Home {...props} />;
    case "heart":
      return <Heart {...props} />;
    case "mappin":
    case "location":
      return <MapPin {...props} />;
    case "sparkles":
    default:
      return <Sparkles {...props} />;
  }
}

export function AboutSpecialitiesSection() {
  const [data, setData] = useState<{
    subtitle: string;
    title: string;
    items: SpecialityItem[];
    loaded: boolean;
  }>({
    subtitle: "",
    title: "",
    items: [],
    loaded: false,
  });

  useEffect(() => {
    const rawApiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost/saiyoojyam";
    const baseUrl = rawApiUrl.replace(/\/+$/, "");

    fetch(`${baseUrl}/api/about`, { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json && json.status && json.data && json.data.specialities) {
          const spec = json.data.specialities;
          setData({
            subtitle: spec.subtitle?.trim() || "",
            title: spec.title?.trim() || "",
            items: Array.isArray(spec.items) ? spec.items : [],
            loaded: true,
          });
        } else {
          setData((prev) => ({ ...prev, loaded: true }));
        }
      })
      .catch((err) => {
        console.warn("Could not fetch specialities data:", err);
        setData((prev) => ({ ...prev, loaded: true }));
      });
  }, []);

  if (!data.loaded) {
    return null;
  }

  if (data.items.length === 0 && !data.title) {
    return null;
  }

  return (
    <section className="w-full py-16 sm:py-24 bg-[#fffaf8]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {(data.subtitle || data.title) && (
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
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

        {data.items.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {data.items.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 sm:p-8 flex flex-col items-start gap-4 transition-all shadow-sm border border-gray-100 hover:border-[#FF561C]/40 hover:shadow-md"
              >
                {renderIcon(item.icon)}
                <div className="w-full">
                  {item.title && (
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-950 font-heading tracking-tight mb-2 leading-tight">
                      {item.title}
                    </h3>
                  )}
                  {item.desc && (
                    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-normal">
                      {item.desc}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
