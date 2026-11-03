"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

function WhatsAppIcon({ className = "w-4 h-4 text-[#FF561C]" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.461h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.007 0C5.38 0 .01 5.37.007 11.998a11.92 11.92 0 001.6 6.002L0 24l6.196-1.625a11.9 11.9 0 005.806 1.513h.005c6.626 0 11.998-5.371 11.998-11.999a11.805 11.805 0 00-3.525-8.484" />
    </svg>
  );
}

interface CtaData {
  title: string;
  description: string;
  image: string;
  whatsapp_number: string;
  whatsapp_button_text: string;
  secondary_button_text: string;
  secondary_button_link: string;
  loaded: boolean;
}

export function AboutCtaSection() {
  const [data, setData] = useState<CtaData>({
    title: "",
    description: "",
    image: "",
    whatsapp_number: "",
    whatsapp_button_text: "",
    secondary_button_text: "",
    secondary_button_link: "",
    loaded: false,
  });

  useEffect(() => {
    const rawApiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost/saiyoojyam";
    const baseUrl = rawApiUrl.replace(/\/+$/, "");

    fetch(`${baseUrl}/api/about`, { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json && json.status && json.data && json.data.cta) {
          const c = json.data.cta;
          let imageUrl = c.image || "";
          if (!imageUrl && c.image_name) {
            imageUrl = `${baseUrl}/uploads/about/${c.image_name}`;
          }
          setData({
            title: c.title?.trim() || "",
            description: c.description?.trim() || "",
            image: imageUrl,
            whatsapp_number: c.whatsapp_number?.trim() || "",
            whatsapp_button_text: c.whatsapp_button_text?.trim() || "",
            secondary_button_text: c.secondary_button_text?.trim() || "",
            secondary_button_link: c.secondary_button_link?.trim() || "",
            loaded: true,
          });
        } else {
          setData((prev) => ({ ...prev, loaded: true }));
        }
      })
      .catch((err) => {
        console.warn("Could not fetch CTA data:", err);
        setData((prev) => ({ ...prev, loaded: true }));
      });
  }, []);

  if (!data.loaded) {
    return null;
  }

  // Only render if there is actual content from database (no fallback dummy content)
  if (!data.title && !data.description && !data.image) {
    return null;
  }

  const rawNum = data.whatsapp_number || "918129339122";
  const whatsappNum = rawNum.replace(/\D/g, "");
  const whatsappUrl = `https://wa.me/${whatsappNum || "918129339122"}?text=${encodeURIComponent("Hello Saiyoojyam Management, I would like to enquire about hostel accommodation.")}`;

  return (
    <section className="relative w-full py-16 sm:py-20 text-white overflow-hidden bg-black">
      {/* Background Image (only if provided in database) */}
      {data.image && (
        <Image
          src={data.image}
          alt={data.title || "Saiyoojyam Ladies Hostels Kakkanad"}
          fill
          sizes="100vw"
          className="object-cover"
          unoptimized={data.image.startsWith("http")}
        />
      )}
      {/* Brand Color Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/45 to-black/35" />

      <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 w-full min-h-[280px] sm:min-h-[340px] flex flex-col justify-between items-start gap-8">
        {/* Top Left: Header and subtext */}
        <div className="text-left max-w-2xl flex flex-col items-start gap-2.5">
          {data.title && (
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold font-heading text-white uppercase tracking-tight drop-shadow-md leading-tight">
              {data.title}
            </h2>
          )}
          {data.description && (
            <p className="text-sm sm:text-base text-gray-100 max-w-xl font-normal leading-relaxed drop-shadow-sm">
              {data.description}
            </p>
          )}
        </div>

        {/* Bottom Right: Action Buttons */}
        <div className="self-end flex flex-wrap items-center justify-end gap-3 sm:gap-4">
          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-white text-gray-800 hover:bg-orange-50 font-bold text-xs sm:text-sm rounded-xl flex items-center gap-2 transition-all active:scale-95 shadow-lg"
            >
              <WhatsAppIcon className="w-4 h-4 text-gray-800" />
              <span>{data.whatsapp_button_text || "Enquire via WhatsApp"}</span>
            </a>
          )}
          {data.secondary_button_text && (
            <Link
              href={data.secondary_button_link || "/search"}
              className="px-6 py-3 bg-black/40 hover:bg-black/60 backdrop-blur-xs text-white font-semibold text-xs sm:text-sm rounded-xl border border-white/40 transition-all active:scale-95 shadow-lg"
            >
              {data.secondary_button_text}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
