"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, Phone, Mail, Sparkles, Building2, UtensilsCrossed, Info } from "lucide-react";
import { ProfileDropdown } from "./ProfileDropdown";

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

export function Header() {
  const [isVisible, setIsVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [contactData, setContactData] = useState<{
    phone?: string;
    contact_phone1?: string;
    clean_phone?: string;
    email?: string;
    whatsapp?: string;
    contact_whats_app?: string;
    whatsapp_clean?: string;
  }>({});

  useEffect(() => {
    const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost/saiyoojyam";
    const baseUrl = rawApiUrl.replace(/\/+$/, "");
    fetch(`${baseUrl}/api/contact?_t=${Date.now()}`, { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json && json.status && json.data) {
          setContactData(json.data);
        }
      })
      .catch(() => {});
  }, []);

  const whatsappRaw =
    contactData.whatsapp_clean ||
    contactData.whatsapp ||
    contactData.contact_whats_app ||
    contactData.contact_phone1 ||
    contactData.phone ||
    "";
  const whatsappNumber = cleanWhatsappNumber(whatsappRaw);
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;
  const phoneDisplay = contactData.contact_phone1 || contactData.phone || "+91 81293 39122";
  const phoneTel = `tel:${contactData.clean_phone ? `+${contactData.clean_phone}` : phoneDisplay.replace(/[^\d+]/g, "") || "+918129339122"}`;
  const emailDisplay = contactData.email || "saiyoojyam@gmail.com";
  const emailMailto = `mailto:${emailDisplay}`;

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Always keep header visible at the top of the page
      if (currentScrollY <= 10) {
        setIsVisible(true);
        lastScrollY = currentScrollY;
        return;
      }

      const diff = currentScrollY - lastScrollY;

      // Threshold to ignore micro-scroll jitter
      if (Math.abs(diff) < 8) return;

      if (diff > 0 && currentScrollY > 80) {
        // Scrolling down -> hide header (close mobile menu if open)
        setIsVisible(false);
        setIsMobileMenuOpen(false);
      } else if (diff < 0) {
        // Scrolling up -> show header
        setIsVisible(true);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 w-full z-50 bg-white border-b border-gray-100 shadow-xs py-2 sm:py-2.5 transition-transform duration-300 ease-in-out ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 flex items-center justify-between gap-3 sm:gap-6">
          {/* Logo Container */}
          <Link href="/" className="flex items-center shrink-0 hover:opacity-95 transition-opacity">
            <Image
              src="/logo/logo.png"
              alt="Saiyoojyam Ladies Hostels"
              width={260}
              height={80}
              className="h-10 sm:h-14 lg:h-16 w-auto object-contain cursor-pointer"
              priority
            />
          </Link>

          {/* Desktop Navigation Links (Phone & Email & Pages) */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-6 text-sm font-normal text-gray-800">
            <Link
              href="/about-us"
              className="flex items-center gap-1.5 hover:text-[#FF561C] transition-colors"
            >
              <span>About Us</span>
            </Link>
            <Link
              href="/amenities"
              className="flex items-center gap-1.5 hover:text-[#FF561C] transition-colors"
            >
              <span>Amenities</span>
            </Link>
            <Link
              href="/food-quality"
              className="flex items-center gap-1.5 hover:text-[#FF561C] transition-colors"
            >
              <span>Food Quality</span>
            </Link>
            <a
              href={phoneTel}
              className="flex items-center gap-1.5 hover:text-[#FF561C] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#FF561C]" />
              <span>{phoneDisplay}</span>
            </a>
            <a
              href={emailMailto}
              className="flex items-center gap-1.5 hover:text-[#FF561C] transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-[#FF561C]" />
              <span>{emailDisplay}</span>
            </a>
          </nav>

          {/* Right Action Icons: Profile, WhatsApp CTA, and Mobile Hamburger */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Profile Dropdown: Visible on ALL screen widths */}
            <ProfileDropdown theme="orange" />

            {/* Desktop WhatsApp CTA Button (Hidden on Mobile) */}
            <a
              className="hidden md:inline-flex items-center justify-center px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg bg-[#FF561C] hover:bg-[#e0450d] text-white text-xs sm:text-sm font-semibold transition-transform active:scale-95 gap-2 shadow-sm"
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppIcon className="w-4 h-4 text-white" />
              <span>Enquire via WhatsApp</span>
            </a>

            {/* Mobile Hamburger Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              className="lg:hidden p-2 rounded-lg text-gray-700 hover:text-gray-950 hover:bg-gray-100 transition-colors flex items-center justify-center cursor-pointer"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-900" />
              ) : (
                <Menu className="w-6 h-6 text-gray-900" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Drawer Navigation Dropdown - Anchored directly to Header's bottom */}
        {isMobileMenuOpen && (
          <div
            className="absolute top-full left-0 right-0 w-full bg-white border-b border-gray-200 shadow-2xl p-5 flex flex-col gap-4 lg:hidden z-50 animate-in slide-in-from-top-2 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="flex flex-col divide-y divide-gray-100 text-sm font-medium text-gray-900">
              <Link
                href="/about-us"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-3 flex items-center gap-3 hover:text-[#FF561C] transition-colors"
              >
                <Info className="w-4 h-4 text-[#FF561C]" />
                <span>About Us</span>
              </Link>
              <Link
                href="/amenities"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-3 flex items-center gap-3 hover:text-[#FF561C] transition-colors"
              >
                <Sparkles className="w-4 h-4 text-[#FF561C]" />
                <span>Amenities & Facilities</span>
              </Link>
              <Link
                href="/food-quality"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-3 flex items-center gap-3 hover:text-[#FF561C] transition-colors"
              >
                <UtensilsCrossed className="w-4 h-4 text-[#FF561C]" />
                <span>Food Quality</span>
              </Link>
              <Link
                href="/search"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-3 flex items-center gap-3 hover:text-[#FF561C] transition-colors"
              >
                <Building2 className="w-4 h-4 text-[#FF561C]" />
                <span>Explore Hostels</span>
              </Link>
            </nav>

            {/* Direct Contact Links in Mobile Drawer */}
            <div className="pt-2 flex flex-col gap-2.5">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#FF561C] text-white text-xs font-semibold shadow-sm active:scale-95 transition-transform"
              >
                <WhatsAppIcon className="w-4 h-4 text-white" />
                <span>Enquire via WhatsApp</span>
              </a>

              <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs text-gray-600">
                <a
                  href={phoneTel}
                  className="flex items-center gap-1.5 hover:text-[#FF561C]"
                >
                  <Phone className="w-3.5 h-3.5 text-[#FF561C]" />
                  <span>Call Us</span>
                </a>
                <a
                  href={emailMailto}
                  className="flex items-center gap-1.5 hover:text-[#FF561C]"
                >
                  <Mail className="w-3.5 h-3.5 text-[#FF561C]" />
                  <span>Email Support</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Backdrop overlay for outside click dismiss */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}


