"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Phone, Star, ArrowUp } from "lucide-react";

function WhatsAppIcon({ className = "w-5 h-5 text-white" }: { className?: string }) {
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

function InstagramIcon({ className = "w-5 h-5 text-white" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ className = "w-5 h-5 text-white" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function YoutubeIcon({ className = "w-5 h-5 text-white" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function cleanWhatsappNumber(rawPhone?: string): string {
  if (!rawPhone) return "918129339122";
  let digits = rawPhone.replace(/\D/g, "");
  if (!digits) return "918129339122";
  if (digits.length === 11 && digits.startsWith("0")) {
    digits = digits.slice(1);
  }
  if (digits.length === 10) {
    return `91${digits}`;
  }
  return digits;
}

export function Footer() {
  const [socials, setSocials] = useState<{
    phone?: string;
    contact_phone1?: string;
    whatsapp?: string;
    contact_whats_app?: string;
    whatsapp_clean?: string;
    clean_phone?: string;
    email?: string;
    instagram?: string;
    facebook?: string;
    youtube?: string;
  }>({});

  useEffect(() => {
    const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost/saiyoojyam";
    const baseUrl = rawApiUrl.replace(/\/+$/, "");
    fetch(`${baseUrl}/api/contact?_t=${Date.now()}`, { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json && json.status && json.data) {
          setSocials(json.data);
        }
      })
      .catch(() => {});
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const whatsappRaw =
    socials.whatsapp_clean ||
    socials.whatsapp ||
    socials.contact_whats_app ||
    socials.contact_phone1 ||
    socials.phone ||
    "";
  const whatsappNumber = cleanWhatsappNumber(whatsappRaw);
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;
  const phoneDisplay = socials.contact_phone1 || socials.phone || "+91 81293 39122";
  const phoneTel = `tel:${socials.clean_phone ? `+${socials.clean_phone}` : phoneDisplay.replace(/[^\d+]/g, "") || "+918129339122"}`;

  return (
    <footer className="w-full bg-[#121212] text-white pt-8 sm:pt-12 pb-8 relative z-10 border-t border-white/10">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-12 flex flex-col">
        {/* Main Section: 3-column layout with clean breathing room */}
        <div className="w-full flex items-center justify-between gap-3 sm:gap-6 py-2 pb-6 sm:pb-8">
          {/* 1. Left: Logo & Rating */}
          <div className="flex-1 flex flex-col items-start text-left gap-1.5 sm:gap-2 min-w-0">
            <Image
              src="/logo/logo.png"
              alt="Saiyoojyam Ladies Hostels"
              width={200}
              height={56}
              className="h-12 sm:h-14 md:h-16 w-auto object-contain brightness-0 invert"
            />
            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-gray-300 font-medium tracking-wide">
              <Star className="w-3 sm:w-3.5 h-3 sm:h-3.5 fill-amber-400 text-amber-400 shrink-0" />
              <span className="text-white font-semibold text-xs sm:text-sm">4.7</span>
              <span className="text-gray-400 truncate">• Google Rating</span>
            </div>
          </div>

          {/* 2. Center: Back to Top Button */}
          <div className="shrink-0 flex flex-col items-center justify-center text-center px-2">
            <button
              onClick={scrollToTop}
              type="button"
              aria-label="Back to top"
              title="Back to top"
              className="group flex flex-col items-center gap-1.5 cursor-pointer focus:outline-none"
            >
              <div className="w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full border border-white/20 bg-white group-hover:bg-white group-hover:border-white/50 flex items-center justify-center text-white transition-all shadow-md active:scale-95">
                <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5 text-black group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <span className="text-[9px] sm:text-[10px] md:text-[11px] font-semibold uppercase tracking-wider text-gray-400 group-hover:text-white transition-colors text-center whitespace-nowrap">
                Back to top
              </span>
            </button>
          </div>

          {/* 3. Right: Contact Links & Social Icons */}
          <div className="flex-1 flex flex-col items-end gap-2.5 sm:gap-3.5 text-xs sm:text-sm font-semibold text-white min-w-0">
            {/* Phone & WhatsApp */}
            <div className="flex flex-col items-end gap-1.5 sm:gap-2 md:flex-row md:items-center md:gap-5">
              <a
                href={phoneTel}
                className="flex items-center gap-1.5 text-gray-200 hover:text-white transition-colors text-[11px] sm:text-xs md:text-sm whitespace-nowrap"
              >
                <Phone className="w-3.5 h-3.5 text-white/90 shrink-0" />
                <span className="tracking-tight">{phoneDisplay}</span>
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-gray-200 hover:text-white transition-colors text-[11px] sm:text-xs md:text-sm whitespace-nowrap"
              >
                <WhatsAppIcon className="w-3.5 h-3.5 text-white/90 shrink-0" />
                <span>WhatsApp Enquiry</span>
              </a>
            </div>

            {/* Social Icons */}
            <div className="flex items-center justify-end gap-3.5 sm:gap-5 text-gray-300 pt-0.5">
              <a
                href={socials.instagram || "#"}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <InstagramIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
              </a>
              <a
                href={socials.facebook || "#"}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <FacebookIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
              </a>
              <a
                href={socials.youtube || "#"}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <YoutubeIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Thin Divider Line */}
        <div className="w-full border-t border-white/10 my-4 sm:my-5" />

        {/* Bottom Bar: Copyright & Techsoft Link */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-4 text-center sm:text-left text-[11px] sm:text-xs text-gray-400 pt-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 sm:gap-2">
            <span>© 2025 Saiyoojyam Premier Ladies Hostel. All rights reserved.</span>
            <span className="hidden sm:inline">•</span>
            <a href="#" className="hover:text-white transition-colors underline underline-offset-4">
              Terms of Stay
            </a>
          </div>

          {/* Techsoft Agency Link */}
          <div>
            <a
              href="https://www.techsoftweb.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white font-normal hover:underline underline-offset-4 transition-colors text-gray-400"
            >
              Web Design Company in Kochi Techsoft
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}






