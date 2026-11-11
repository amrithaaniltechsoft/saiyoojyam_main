"use client";

import { useState, useEffect, useRef } from "react";
import { Share2, Copy, Check, X, Mail } from "lucide-react";
import { BuildingDetailData } from "@/data/buildingsData";
import { WhatsAppIcon } from "@/components/building/WhatsAppIcon";

interface BuildingHeroHeaderProps {
  building: BuildingDetailData;
}

export function BuildingHeroHeader({ building }: BuildingHeroHeaderProps) {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [canNativeShare, setCanNativeShare] = useState(false);
  const shareMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href);
      setCanNativeShare(typeof navigator !== "undefined" && typeof navigator.share === "function");
    }
  }, []);

  // Close popup when clicking outside or pressing Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target as Node)) {
        setIsShareOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsShareOpen(false);
      }
    }

    if (isShareOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isShareOpen]);

  const handleShareClick = async () => {
    const currentUrl = shareUrl || (typeof window !== "undefined" ? window.location.href : "");

    // On mobile devices, prefer native share sheet if available
    const isMobile =
      typeof navigator !== "undefined" &&
      /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isMobile && typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: building.name || "Saiyoojyam Ladies Hostel",
          text: building.tagline || building.description || `Check out ${building.name} at Saiyoojyam Ladies Hostel`,
          url: currentUrl,
        });
        return;
      } catch (err: any) {
        if (err?.name === "AbortError") return;
      }
    }

    // Toggle dropdown on desktop or fallback
    setIsShareOpen((prev) => !prev);
  };

  const handleCopyLink = async () => {
    const currentUrl = shareUrl || (typeof window !== "undefined" ? window.location.href : "");
    try {
      await navigator.clipboard.writeText(currentUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } catch {
      // Fallback if clipboard API is restricted
      const textArea = document.createElement("textarea");
      textArea.value = currentUrl;
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand("copy");
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2500);
      } catch {
        // Ignore fallback error
      }
      document.body.removeChild(textArea);
    }
  };

  const handleNativeShare = async () => {
    const currentUrl = shareUrl || (typeof window !== "undefined" ? window.location.href : "");
    try {
      await navigator.share({
        title: building.name || "Saiyoojyam Ladies Hostel",
        text: building.tagline || building.description || `Check out ${building.name} at Saiyoojyam Ladies Hostel`,
        url: currentUrl,
      });
      setIsShareOpen(false);
    } catch (err: any) {
      if (err?.name === "AbortError") return;
    }
  };

  return (
    <div className="flex flex-row items-start justify-between gap-3 sm:gap-4 pb-2 sm:pb-4 w-full">
      <div className="flex-1 min-w-0 pr-2">
        {building.tagline ? (
          <div className="flex items-center gap-2 text-[11px] sm:text-xs font-semibold text-[#C44610] mb-0.5 sm:mb-1">
            <span className="truncate">{building.tagline}</span>
          </div>
        ) : null}
        <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-950 tracking-tight leading-tight break-words">
          {building.name}
        </h1>
        {building.address ? (
          <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-700 font-normal mt-1 leading-normal">
            {/* Real Google Maps Location Pin Icon */}
            <svg
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FF561C] fill-[#FF561C] shrink-0"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z" />
            </svg>
            <span className="line-clamp-2 sm:line-clamp-1">{building.address}</span>
          </div>
        ) : null}
      </div>

      {/* Share Button & Popover */}
      <div ref={shareMenuRef} className="relative flex items-center shrink-0 pt-0.5 sm:pt-1">
        <button
          type="button"
          aria-label="Share property"
          onClick={handleShareClick}
          className={`p-2 sm:p-2.5 rounded-full text-gray-700 hover:text-gray-950 hover:bg-gray-100 cursor-pointer transition-colors active:scale-95 ${
            isShareOpen ? "bg-gray-100 text-gray-950 ring-2 ring-[#FF561C]/25" : ""
          }`}
          title="Share this property"
        >
          <Share2 className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
        </button>

        {isShareOpen && (
          <div className="absolute right-0 top-full mt-2 w-[300px] sm:w-[340px] bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900">Share Property</h3>
              <button
                type="button"
                onClick={() => setIsShareOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                aria-label="Close share menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Property Summary */}
            <div className="mb-3 p-2.5 bg-gray-50 rounded-xl">
              <p className="text-xs font-semibold text-gray-900 truncate">{building.name}</p>
              {building.address && (
                <p className="text-[11px] text-gray-500 truncate mt-0.5">{building.address}</p>
              )}
            </div>

            {/* Copy Link Field */}
            <div className="mb-3.5">
              <label className="block text-[11px] font-medium text-gray-600 mb-1">Page Link</label>
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="flex-1 min-w-0 px-2.5 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg text-gray-700 select-all focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all shrink-0 cursor-pointer ${
                    isCopied
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-[#FF561C] hover:bg-[#e04814] text-white"
                  }`}
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Share Buttons */}
            <div>
              <p className="text-[11px] font-medium text-gray-600 mb-2">Share via</p>
              <div className="grid grid-cols-4 gap-2">
                {/* WhatsApp */}
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                    `${building.name || "Saiyoojyam Hostel"}\n${shareUrl}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 transition-colors group"
                >
                  <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                    <WhatsAppIcon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-[10px] font-medium">WhatsApp</span>
                </a>

                {/* Facebook */}
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-blue-50 text-gray-700 hover:text-blue-700 transition-colors group"
                >
                  <div className="w-9 h-9 rounded-full bg-[#1877F2] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </div>
                  <span className="text-[10px] font-medium">Facebook</span>
                </a>

                {/* X / Twitter */}
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                    building.name || "Saiyoojyam Hostel"
                  )}&url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-gray-100 text-gray-700 hover:text-black transition-colors group"
                >
                  <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </div>
                  <span className="text-[10px] font-medium">X</span>
                </a>

                {/* Email */}
                <a
                  href={`mailto:?subject=${encodeURIComponent(
                    building.name || "Saiyoojyam Hostel"
                  )}&body=${encodeURIComponent(
                    `Check out this property at Saiyoojyam Ladies Hostel:\n\n${building.name}\n${shareUrl}`
                  )}`}
                  className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-amber-50 text-gray-700 hover:text-amber-800 transition-colors group"
                >
                  <div className="w-9 h-9 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                    <Mail className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-[10px] font-medium">Email</span>
                </a>
              </div>

              {canNativeShare && (
                <button
                  type="button"
                  onClick={handleNativeShare}
                  className="mt-3 w-full py-2 px-3 text-xs font-semibold text-gray-700 hover:text-gray-950 bg-gray-100 hover:bg-gray-200/80 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>More sharing options...</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
