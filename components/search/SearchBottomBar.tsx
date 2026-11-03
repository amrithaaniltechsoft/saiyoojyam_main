"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { User, Search, SlidersHorizontal, Menu, X, Info, Sparkles, UtensilsCrossed, Building2, Phone, Mail, Home } from "lucide-react";
import { LoginModal } from "@/components/global/LoginModal";

interface SearchBottomBarProps {
  onOpenSearch: () => void;
  onOpenFilter: () => void;
  hasActiveFilters?: boolean;
}

function WhatsAppIcon({ className = "w-4 h-4 text-white" }: { className?: string }) {
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

export function SearchBottomBar({
  onOpenSearch,
  onOpenFilter,
  hasActiveFilters = false,
}: SearchBottomBarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
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
    const syncUser = () => {
      try {
        const stored = localStorage.getItem("saiyoojyam_user");
        setUserName(stored || null);
      } catch {
        setUserName(null);
      }
    };
    syncUser();
    window.addEventListener("user-login", syncUser);
    window.addEventListener("storage", syncUser);

    return () => {
      window.removeEventListener("user-login", syncUser);
      window.removeEventListener("storage", syncUser);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // Show tab bar only after user scrolls down past 120px
      if (window.scrollY > 120) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const firstName = userName ? userName.trim().split(" ")[0] : null;

  if (!isVisible) return null;

  return (
    <>
      {/* Mobile Menu Bottom Drawer triggered by Menu tab */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl border-t border-gray-200 p-5 pb-8 flex flex-col gap-4 animate-in slide-in-from-bottom duration-200 max-h-[85vh] overflow-y-auto z-[90]">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <span className="text-sm font-bold text-gray-950 uppercase tracking-wider">
                Saiyoojyam Menu
              </span>
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="p-1 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex flex-col divide-y divide-gray-100 text-sm font-medium text-gray-900">
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className="py-2.5 flex items-center gap-3 hover:text-[#FF561C] transition-colors"
              >
                <Home className="w-4 h-4 text-[#FF561C]" />
                <span>Home</span>
              </Link>
              <Link
                href="/about-us"
                onClick={() => setIsMenuOpen(false)}
                className="py-2.5 flex items-center gap-3 hover:text-[#FF561C] transition-colors"
              >
                <Info className="w-4 h-4 text-[#FF561C]" />
                <span>About Us</span>
              </Link>
              <Link
                href="/amenities"
                onClick={() => setIsMenuOpen(false)}
                className="py-2.5 flex items-center gap-3 hover:text-[#FF561C] transition-colors"
              >
                <Sparkles className="w-4 h-4 text-[#FF561C]" />
                <span>Amenities & Facilities</span>
              </Link>
              <Link
                href="/food-quality"
                onClick={() => setIsMenuOpen(false)}
                className="py-2.5 flex items-center gap-3 hover:text-[#FF561C] transition-colors"
              >
                <UtensilsCrossed className="w-4 h-4 text-[#FF561C]" />
                <span>Food Quality</span>
              </Link>
              <Link
                href="/search"
                onClick={() => setIsMenuOpen(false)}
                className="py-2.5 flex items-center gap-3 text-[#FF561C] font-semibold"
              >
                <Building2 className="w-4 h-4 text-[#FF561C]" />
                <span>Explore Hostels (Current)</span>
              </Link>
            </nav>

            <div className="pt-2 flex flex-col gap-2.5">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMenuOpen(false)}
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
        </div>
      )}

      {/* Fixed Bottom App Tab Bar (Mobile & Tablet: < lg) */}
      <div className="fixed bottom-0 left-0 right-0 z-[70] lg:hidden bg-white/95 backdrop-blur-md border-t border-gray-200/90 shadow-[0_-6px_20px_-2px_rgba(0,0,0,0.12),0_-2px_6px_-1px_rgba(0,0,0,0.06)] px-2 py-1.5 safe-area-inset-bottom">
        <div className="grid grid-cols-4 items-center justify-around max-w-md mx-auto">
          {/* 1. Search Tab */}
          <button
            type="button"
            onClick={() => {
              setIsMenuOpen(false);
              onOpenSearch();
            }}
            className="flex flex-col items-center justify-center gap-1 py-1 px-2 rounded-lg transition-colors text-gray-600 hover:text-gray-950 cursor-pointer"
          >
            <Search className="w-5 h-5" strokeWidth={2} />
            <span className="text-[11px] font-medium leading-none">Search</span>
          </button>

          {/* 2. Filter Tab */}
          <button
            type="button"
            onClick={() => {
              setIsMenuOpen(false);
              onOpenFilter();
            }}
            className="flex flex-col items-center justify-center gap-1 py-1 px-2 rounded-lg transition-colors text-gray-600 hover:text-gray-950 cursor-pointer relative"
          >
            <div className="relative">
              <SlidersHorizontal className="w-5 h-5" strokeWidth={2} />
              {hasActiveFilters && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#FF561C] ring-2 ring-white" />
              )}
            </div>
            <span className="text-[11px] font-medium leading-none">Filter</span>
          </button>

          {/* 3. Profile Tab */}
          <button
            type="button"
            onClick={() => {
              setIsMenuOpen(false);
              setIsLoginModalOpen(true);
            }}
            className="flex flex-col items-center justify-center gap-1 py-1 px-2 rounded-lg transition-colors text-gray-600 hover:text-gray-950 cursor-pointer max-w-[80px]"
          >
            <User className="w-5 h-5" strokeWidth={2} />
            <span className="text-[11px] font-medium leading-none truncate max-w-full">
              {firstName || "Profile"}
            </span>
          </button>

          {/* 4. Menu Tab */}
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="flex flex-col items-center justify-center gap-1 py-1 px-2 rounded-lg transition-colors text-gray-600 hover:text-gray-950 cursor-pointer"
          >
            <Menu className="w-5 h-5" strokeWidth={2} />
            <span className="text-[11px] font-medium leading-none">Menu</span>
          </button>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
}
