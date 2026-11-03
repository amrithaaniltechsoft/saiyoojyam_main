"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BedDouble,
  Sparkles,
  Image as ImageIcon,
  MapPin,
  Building2,
  ChevronDown,
  Check,
  Search,
} from "lucide-react";
import { WhatsAppIcon } from "@/components/building/WhatsAppIcon";
import { SearchFilter, SearchFilterState } from "@/components/ui/SearchFilter";
import { ProfileDropdown } from "@/components/global/ProfileDropdown";
import { BuildingMegaMenu } from "@/components/building/BuildingMegaMenu";
import { MobileSearchDrawer } from "@/components/search/MobileSearchDrawer";
import { MobileSearchSummaryButton } from "@/components/search/MobileSearchSummaryButton";

const ALL_BUILDINGS = [
  {
    slug: "premier",
    name: "Saiyoojyam Premier",
    location: "Painakkil Jn, Kakkanad",
    tagline: "35,000 Sq.Ft · Elevator · AC/Non-AC",
  },
  {
    slug: "annex",
    name: "Saiyoojyam Annex",
    location: "Kuzhikkattumoola, Kakkanad",
    tagline: "Homely Food · Peaceful Residential Living",
  },
  {
    slug: "towers",
    name: "Saiyoojyam Towers 1 & 2",
    location: "Kusumagiri, Kakkanad",
    tagline: "Twin Towers · Near Infopark & CSEZ",
  },
];

interface BuildingHeaderProps {
  buildingName?: string;
  whatsappNumber?: string;
  currentBuildingSlug?: string;
}

export function BuildingHeader({
  buildingName,
  whatsappNumber = "918129339122",
  currentBuildingSlug = "premier",
}: BuildingHeaderProps) {
  const router = useRouter();
  const [isBuildingMenuOpen, setIsBuildingMenuOpen] = useState(false);
  const buildingMenuRef = useRef<HTMLDivElement>(null);

  const [isSearchDrawerOpen, setIsSearchDrawerOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState<SearchFilterState>({
    location: currentBuildingSlug,
    checkInDate: "",
    roomType: "all",
  });

  useEffect(() => {
    if (currentBuildingSlug) {
      setSearchFilter((prev) => ({
        ...prev,
        location: currentBuildingSlug,
      }));
    }
  }, [currentBuildingSlug]);

  const handleLocationChange = (newLocation: string, newRoomType: string) => {
    const cleanNewLoc = (newLocation || "all").toLowerCase().trim();
    const cleanCurLoc = (currentBuildingSlug || "").toLowerCase().trim();

    setSearchFilter((prev) => ({
      ...prev,
      location: cleanNewLoc,
      roomType: newRoomType,
    }));

    // If another building location is selected, redirect directly to that building's room search
    if (cleanNewLoc && cleanNewLoc !== cleanCurLoc) {
      const params = new URLSearchParams();
      if (cleanNewLoc !== "all") params.set("location", cleanNewLoc);
      if (searchFilter.checkInDate) params.set("date", searchFilter.checkInDate);
      if (newRoomType && newRoomType !== "all") params.set("roomType", newRoomType);
      const qs = params.toString();
      router.push(`/search${qs ? `?${qs}` : ""}`);
    }
  };

  const handleSearchSubmit = (loc: string, dt: string, rt: string) => {
    const cleanLoc = (loc || searchFilter.location || "all").toLowerCase().trim();
    const params = new URLSearchParams();
    if (cleanLoc && cleanLoc !== "all") params.set("location", cleanLoc);
    if (dt) params.set("date", dt);
    if (rt && rt !== "all") params.set("roomType", rt);
    const qs = params.toString();
    router.push(`/search${qs ? `?${qs}` : ""}`);
  };

  const handleMobileFilterUpdate = (newLocation: string, newRoomType: string) => {
    setSearchFilter((prev) => ({
      ...prev,
      location: newLocation,
      roomType: newRoomType,
    }));
    const params = new URLSearchParams({
      location: newLocation,
      date: searchFilter.checkInDate,
      roomType: newRoomType,
    });
    router.push(`/search?${params.toString()}`);
  };

  const handleMobileDateChange = (date: string) => {
    setSearchFilter((prev) => ({
      ...prev,
      checkInDate: date,
    }));
  };

  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsBuildingMenuOpen(true);
  };

  const handleMouseLeave = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = setTimeout(() => {
      setIsBuildingMenuOpen(false);
    }, 150);
  };

  const mobileBuildingMenuRef = useRef<HTMLDivElement>(null);
  const [isMobileRoomsMenuOpen, setIsMobileRoomsMenuOpen] = useState(false);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        buildingMenuRef.current &&
        !buildingMenuRef.current.contains(target)
      ) {
        setIsBuildingMenuOpen(false);
      }
      if (
        mobileBuildingMenuRef.current &&
        !mobileBuildingMenuRef.current.contains(target)
      ) {
        setIsMobileRoomsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  const currentBuilding =
    ALL_BUILDINGS.find((b) => b.slug === currentBuildingSlug) || ALL_BUILDINGS[0];

  return (
    <>
      <header className="relative w-full z-40 bg-[#FF561C] text-white">
      {/* Top Row: Brand Logo, Buildings Switcher Dropdown, Navigation Anchor Links & Enquire */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between gap-3 sm:gap-4 relative z-30">
        {/* Brand Logo & Back to Home */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <Link href="/" className="flex items-center shrink-0 group">
            <Image
              src="/logo/logo.png"
              alt="Saiyoojyam Ladies Hostels"
              width={220}
              height={60}
              className="h-10 sm:h-12 md:h-14 w-auto object-contain brightness-0 invert group-hover:opacity-90 transition-opacity"
              priority
            />
          </Link>
        </div>

        {/* Top Row Center: Navigation Anchor Links */}
        <nav className="hidden lg:flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium tracking-wide mx-auto">
          {/* 1. Rooms Mega Dropdown */}
          <div
            ref={buildingMenuRef}
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              onClick={() => setIsBuildingMenuOpen((prev) => !prev)}
              className="px-3 py-1.5 rounded-full text-white hover:bg-white/15 transition-all flex items-center gap-1.5 active:scale-95 shrink-0 cursor-pointer select-none"
            >
              <BedDouble className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white stroke-[2]" />
              <span>Rooms</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-white transition-transform duration-200 ${isBuildingMenuOpen ? "rotate-180" : ""
                  }`}
              />
            </button>

            {/* Rooms Dropdown Menu for Current Building */}
            <BuildingMegaMenu
              isOpen={isBuildingMenuOpen}
              onClose={() => setIsBuildingMenuOpen(false)}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              currentBuildingSlug={currentBuildingSlug}
            />
          </div>

          {/* 2. Facilities */}
          <a
            href="#facilities"
            className="px-3 py-1.5 rounded-full text-white hover:bg-white/15 transition-all flex items-center gap-1.5 active:scale-95 shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white stroke-[2]" />
            <span>Facilities</span>
          </a>

          {/* 3. Amenities & Rooms */}
          <a
            href="#rooms"
            className="px-3 py-1.5 rounded-full text-white hover:bg-white/15 transition-all flex items-center gap-1.5 active:scale-95 shrink-0"
          >
            <BedDouble className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white stroke-[2]" />
            <span>Amenities &amp; Rooms</span>
          </a>

          {/* 4. Gallery */}
          <a
            href="#gallery"
            className="px-3 py-1.5 rounded-full text-white hover:bg-white/15 transition-all flex items-center gap-1.5 active:scale-95 shrink-0"
          >
            <ImageIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white stroke-[2]" />
            <span>Gallery</span>
          </a>

          {/* 5. Location */}
          <a
            href="#location"
            className="px-3 py-1.5 rounded-full text-white hover:bg-white/15 transition-all flex items-center gap-1.5 active:scale-95 shrink-0"
          >
            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white stroke-[2]" />
            <span>Location</span>
          </a>
        </nav>

        {/* Top Row Right Edge: Contact / Enquire Button */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-auto lg:ml-0">
          <ProfileDropdown theme="white" />
          <a
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
              `Hello Saiyoojyam Management, I would like to enquire about ${buildingName || "hostel accommodation"}.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white hover:bg-orange-50 text-[#FF561C] font-semibold text-xs sm:text-sm px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-lg flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer shrink-0"
          >
            <WhatsAppIcon className="w-4 h-4 text-[#FF561C]" />
            <span className="hidden sm:inline">Enquire via WhatsApp</span>
            <span className="sm:hidden">Enquire</span>
          </a>
        </div>
      </div>

      {/* Bottom Row: Desktop Full Search Bar & Mobile Interactive Search Button */}
      <div className="max-w-[1280px] mx-auto px-3 sm:px-6 lg:px-8 flex justify-center -mb-7 sm:-mb-8 relative z-20 pt-2 pb-0">
        {/* Desktop View (lg+): Full Size Search Bar */}
        <div className="hidden lg:flex w-full max-w-[850px] justify-center">
          <SearchFilter
            searchFilter={searchFilter}
            setSearchFilter={setSearchFilter}
            onFilterChange={handleLocationChange}
            onDateChange={(dt) => setSearchFilter((prev) => ({ ...prev, checkInDate: dt }))}
            onSearch={handleSearchSubmit}
            showBottomBadge={false}
            noShadow={false}
          />
        </div>

        {/* Mobile & Tablet View (< lg): Search Summary Button (reduced width) + Rooms Filter Button on Right */}
        <div className="lg:hidden w-full max-w-[620px] mx-auto flex items-stretch gap-2">
          <div className="flex-1 min-w-0 flex items-stretch">
            <MobileSearchSummaryButton
              location={searchFilter.location}
              roomType={searchFilter.roomType}
              date={searchFilter.checkInDate}
              onClick={() => setIsSearchDrawerOpen(true)}
              className="h-full flex items-stretch"
            />
          </div>

          {/* Rooms Filter Button on Right Edge */}
          <div ref={mobileBuildingMenuRef} className="relative shrink-0 flex items-stretch">
            <button
              type="button"
              onClick={() => setIsMobileRoomsMenuOpen((prev) => !prev)}
              aria-label="Filter rooms for this building"
              className="h-full px-3.5 bg-white hover:bg-orange-50/50 text-gray-700 border border-[#FF561C] rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer select-none font-semibold text-xs"
            >
              <BedDouble className="w-4 h-4 text-gray-700 shrink-0" />
              <span>Rooms</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-gray-700 transition-transform duration-200 ${isMobileRoomsMenuOpen ? "rotate-180" : ""
                  }`}
              />
            </button>

            {/* Rooms Dropdown Menu for Current Building */}
            <BuildingMegaMenu
              isOpen={isMobileRoomsMenuOpen}
              onClose={() => setIsMobileRoomsMenuOpen(false)}
              currentBuildingSlug={currentBuildingSlug}
            />
          </div>
        </div>
      </div>
    </header>

    {/* Mobile/Tablet Bottom Sheet Search Drawer */}
    <MobileSearchDrawer
      isOpen={isSearchDrawerOpen}
      onClose={() => setIsSearchDrawerOpen(false)}
      selectedLocation={searchFilter.location}
      selectedDate={searchFilter.checkInDate}
      selectedRoomType={searchFilter.roomType}
      onFilterChange={handleMobileFilterUpdate}
      onDateChange={handleMobileDateChange}
    />
  </>
);
}
