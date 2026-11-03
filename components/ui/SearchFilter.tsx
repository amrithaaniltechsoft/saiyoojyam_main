"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Calendar,
  BedDouble,
  Search,
  Sparkles,
  ChevronDown,
  Check,
  X,
} from "lucide-react";
import { FancyDatePicker } from "@/components/ui/FancyDatePicker";

export interface DynamicRoomTypeOption {
  value: string;
  label: string;
  id?: number | string;
  name?: string;
  room_type_name?: string;
  slug?: string;
  building_id?: number | string;
}

export interface DynamicBuildingOption {
  id?: number | string;
  slug?: string;
  name?: string;
  label?: string;
  value?: string;
  tagline?: string;
  address?: string;
}

export interface SearchFilterState {
  location: string;
  checkInDate: string;
  roomType: string;
}

export interface SearchFilterProps {
  // Option 1: Controlled state object (used in BuildingHeader & HeroCarousel)
  searchFilter?: SearchFilterState;
  setSearchFilter?: React.Dispatch<React.SetStateAction<SearchFilterState>>;

  // Option 2: Individual props & callbacks (used in SearchResultsView & OverlaySearchFilter)
  selectedLocation?: string;
  selectedDate?: string;
  selectedRoomType?: string;
  onFilterChange?: (newLocation: string, newRoomType: string) => void;
  onDateChange?: (date: string) => void;
  onSearch?: (location: string, date: string, roomType: string) => void;

  // Dynamic Options (auto-fetches from API if omitted or empty)
  buildings?: any[];
  roomTypes?: DynamicRoomTypeOption[];

  // Display & layout customizations
  showBottomBadge?: boolean;
  noShadow?: boolean;
  className?: string;
  floatingOnScroll?: boolean;
}

export const locationOptions = [
  { value: "all", label: "All Hostels (Kochi)" },
];

export const roomTypeOptions = [
  { value: "all", label: "All room types" },
];

export function SearchFilter({
  searchFilter,
  setSearchFilter,
  selectedLocation,
  selectedDate,
  selectedRoomType,
  onFilterChange,
  onDateChange,
  onSearch,
  buildings,
  roomTypes,
  showBottomBadge = false,
  noShadow = false,
  className = "",
  floatingOnScroll = false,
}: SearchFilterProps) {
  const router = useRouter();

  // Internal fallback state if controlled props are not provided
  const [internalLocation, setInternalLocation] = useState(
    selectedLocation ?? searchFilter?.location ?? "all"
  );
  const [internalDate, setInternalDate] = useState(
    selectedDate ?? searchFilter?.checkInDate ?? ""
  );
  const [internalRoomType, setInternalRoomType] = useState(
    selectedRoomType ?? searchFilter?.roomType ?? "all"
  );

  const [isScrolled, setIsScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<"location" | "room" | null>(null);
  const [fetchedBuildings, setFetchedBuildings] = useState<any[]>([]);
  const [fetchedRoomTypes, setFetchedRoomTypes] = useState<DynamicRoomTypeOption[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync internal state when external props change
  useEffect(() => {
    if (selectedLocation !== undefined) setInternalLocation(selectedLocation);
    else if (searchFilter?.location !== undefined) setInternalLocation(searchFilter.location);
  }, [selectedLocation, searchFilter?.location]);

  useEffect(() => {
    if (selectedDate !== undefined) setInternalDate(selectedDate);
    else if (searchFilter?.checkInDate !== undefined) setInternalDate(searchFilter.checkInDate);
  }, [selectedDate, searchFilter?.checkInDate]);

  useEffect(() => {
    if (selectedRoomType !== undefined) setInternalRoomType(selectedRoomType);
    else if (searchFilter?.roomType !== undefined) setInternalRoomType(searchFilter.roomType);
  }, [selectedRoomType, searchFilter?.roomType]);

  // Determine current active values
  const effectiveLocation =
    selectedLocation !== undefined
      ? selectedLocation
      : searchFilter?.location !== undefined
      ? searchFilter.location
      : internalLocation;

  const effectiveDate =
    selectedDate !== undefined
      ? selectedDate
      : searchFilter?.checkInDate !== undefined
      ? searchFilter.checkInDate
      : internalDate;

  const effectiveRoomType =
    selectedRoomType !== undefined
      ? selectedRoomType
      : searchFilter?.roomType !== undefined
      ? searchFilter.roomType
      : internalRoomType;

  // Auto-fetch buildings and room types if not passed as props
  useEffect(() => {
    const rawApiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost/saiyoojyam";
    const baseUrl = rawApiUrl.replace(/\/+$/, "");

    if (!buildings || buildings.length === 0) {
      fetch(`${baseUrl}/api/building`, { cache: "no-store" })
        .then((res) => (res.ok ? res.json() : null))
        .then((json) => {
          if (json && json.status && Array.isArray(json.data) && json.data.length > 0) {
            setFetchedBuildings(json.data);
          }
        })
        .catch(() => {});
    }

    if (!roomTypes || roomTypes.length === 0) {
      fetch(`${baseUrl}/api/room-types`, { cache: "no-store" })
        .then((res) => (res.ok ? res.json() : null))
        .then((json) => {
          if (json && json.status && Array.isArray(json.data) && json.data.length > 0) {
            setFetchedRoomTypes(json.data);
          }
        })
        .catch(() => {});
    }
  }, [buildings, roomTypes]);

  // Click outside and scroll listeners
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };

    const handleScroll = () => {
      if (!floatingOnScroll) return;
      if (window.scrollY > 160) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    if (floatingOnScroll) {
      window.addEventListener("scroll", handleScroll, { passive: true });
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (floatingOnScroll) {
        window.removeEventListener("scroll", handleScroll);
      }
    };
  }, [floatingOnScroll]);

  // Build dynamic building location options
  const locOptions = useMemo(() => {
    const raw =
      buildings && buildings.length > 0
        ? buildings
        : fetchedBuildings && fetchedBuildings.length > 0
        ? fetchedBuildings
        : [];

    const seen = new Set<string>();
    const result: { value: string; label: string }[] = [];

    result.push({ value: "all", label: "All Hostels (Kochi)" });
    seen.add("all");

    for (const b of raw as any[]) {
      if (!b) continue;
      const value = (b.slug || b.id || b.value || "").toString().trim().toLowerCase();
      if (!value || seen.has(value)) continue;
      seen.add(value);
      const cleanName = String(b.name || b.label || "Building")
        .replace(/\s*\(?\s*sfsdfsd\s*\)?/gi, "")
        .trim();
      result.push({ value, label: cleanName });
    }
    return result;
  }, [buildings, fetchedBuildings]);

  // Build dynamic room type options
  const dynamicRoomTypeOptions = useMemo(() => {
    const raw =
      roomTypes && roomTypes.length > 0
        ? roomTypes
        : fetchedRoomTypes && fetchedRoomTypes.length > 0
        ? fetchedRoomTypes
        : [];

    const seenValues = new Set<string>();
    const seenLabels = new Set<string>();
    const result: { value: string; label: string; id?: number | string }[] = [];

    result.push({ value: "all", label: "All room types" });
    seenValues.add("all");
    seenLabels.add("all room types");

    for (const rt of raw as any[]) {
      if (!rt) continue;
      const label = String(rt.label || rt.name || rt.room_type_name || "").trim();
      if (!label) continue;
      const labelKey = label.toLowerCase();
      if (seenLabels.has(labelKey)) continue;

      const rawVal = String(rt.slug || rt.value || rt.id || label).trim();
      const valKey = rawVal.toLowerCase();
      if (!valKey || seenValues.has(valKey)) continue;

      seenLabels.add(labelKey);
      seenValues.add(valKey);

      result.push({
        value: rawVal,
        label: label,
        id: rt.id || rt.room_type_id,
      });
    }
    return result;
  }, [roomTypes, fetchedRoomTypes]);

  // Selected Location Label Object
  const selectedLocationObj = useMemo(() => {
    const loc = (effectiveLocation || "all").toString().toLowerCase().trim();
    if (loc === "all" || !loc) {
      return locOptions[0] || { value: "all", label: "All Hostels (Kochi)" };
    }

    // 1. Direct match
    const exactMatch = locOptions.find((o) => o.value.toLowerCase() === loc);
    if (exactMatch) return exactMatch;

    // 2. Fuzzy slug match (prefix saiyoojyam-)
    const slugFuzzy = locOptions.find((o) => {
      const v = o.value.toLowerCase();
      return (
        v === `saiyoojyam-${loc}` ||
        loc === `saiyoojyam-${v}` ||
        v.replace(/^saiyoojyam[-_]/, "") === loc.replace(/^saiyoojyam[-_]/, "")
      );
    });
    if (slugFuzzy) return slugFuzzy;

    // 3. Label match
    const labelMatch = locOptions.find(
      (o) => o.label.toLowerCase() === loc || o.label.toLowerCase().includes(loc)
    );
    if (labelMatch) return labelMatch;

    // 4. Formatted fallback so it never displays "All Hostels" when a specific building is chosen
    const cleanWord = loc
      .replace(/^saiyoojyam[-_]/i, "")
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    return { value: loc, label: `Saiyoojyam ${cleanWord}` };
  }, [locOptions, effectiveLocation]);

  // Selected Room Type Label Object
  const selectedRoomTypeObj = useMemo(() => {
    const curr = (effectiveRoomType || "all").toString().toLowerCase().trim();
    if (!curr || curr === "all") {
      return dynamicRoomTypeOptions[0] || roomTypeOptions[0];
    }

    const exactMatch = dynamicRoomTypeOptions.find(
      (o) => o.value.toLowerCase() === curr
    );
    if (exactMatch) return exactMatch;

    const labelMatch = dynamicRoomTypeOptions.find(
      (o) => o.label.toLowerCase() === curr
    );
    if (labelMatch) return labelMatch;

    const idMatch = dynamicRoomTypeOptions.find(
      (o) => o.id !== undefined && String(o.id).toLowerCase() === curr
    );
    if (idMatch) return idMatch;

    const shareNum = curr.match(/(\d+)/)?.[1];
    if (shareNum) {
      const numMatch = dynamicRoomTypeOptions.find((o) =>
        new RegExp(`^${shareNum}\\s*(-|bed|share)`, "i").test(o.label)
      );
      if (numMatch) return numMatch;
    }

    const pretty = curr
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    return { value: curr, label: pretty };
  }, [dynamicRoomTypeOptions, effectiveRoomType]);

  const handleLocationSelect = (val: string) => {
    setInternalLocation(val);
    if (setSearchFilter) {
      setSearchFilter((prev) => ({ ...prev, location: val }));
    }
    if (onFilterChange) {
      onFilterChange(val, effectiveRoomType);
    }
    setOpenDropdown(null);
  };

  const handleDateChange = (val: string) => {
    setInternalDate(val);
    if (setSearchFilter) {
      setSearchFilter((prev) => ({ ...prev, checkInDate: val }));
    }
    if (onDateChange) {
      onDateChange(val);
    }
  };

  const handleRoomTypeSelect = (val: string) => {
    setInternalRoomType(val);
    if (setSearchFilter) {
      setSearchFilter((prev) => ({ ...prev, roomType: val }));
    }
    if (onFilterChange) {
      onFilterChange(effectiveLocation, val);
    }
    setOpenDropdown(null);
  };

  const handleSearch = () => {
    setOpenDropdown(null);
    if (onSearch) {
      onSearch(effectiveLocation, effectiveDate, effectiveRoomType);
      return;
    }
    if (onFilterChange) {
      onFilterChange(effectiveLocation, effectiveRoomType);
    }
    const params = new URLSearchParams();
    if (effectiveLocation && effectiveLocation !== "all") {
      params.set("location", effectiveLocation);
    }
    if (effectiveDate) {
      params.set("date", effectiveDate);
    }
    if (effectiveRoomType && effectiveRoomType !== "all") {
      params.set("roomType", effectiveRoomType);
    }
    const qs = params.toString();
    router.push(`/search${qs ? `?${qs}` : ""}`);
  };

  // Wrapper classes for fixed floating scroll vs standard in-flow
  const wrapperClass = floatingOnScroll
    ? isScrolled
      ? "fixed bottom-3 sm:bottom-6 left-0 right-0 z-50 w-full max-w-[850px] mx-auto px-3 sm:px-4 transition-all duration-300"
      : "w-full max-w-[850px] mx-auto px-3 sm:px-6 absolute left-0 right-0 -bottom-16 sm:-bottom-8 z-20 flex justify-center transition-all duration-300"
    : "w-full max-w-[850px] flex flex-col items-center gap-1.5 sm:gap-2 relative z-50";

  // Box classes exactly matching the user's design snippet
  const boxClass =
    floatingOnScroll && isScrolled
      ? "w-full bg-[#FFF2D1] backdrop-blur-md rounded-2xl sm:rounded-full p-2 sm:p-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-1.5 shadow-xl border-2 border-[#FF561C] text-gray-950 animate-in fade-in slide-in-from-bottom-4 duration-300 relative"
      : `w-full bg-white rounded-2xl sm:rounded-full p-2 sm:p-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-1.5 shadow-xl sm:shadow-md border-2 border-black/40 text-gray-950 relative ${
          noShadow ? "shadow-none" : ""
        } ${className}`;

  return (
    <div ref={containerRef} className={wrapperClass}>
      <div className={boxClass}>
        {/* 1. Hostel Location Field with Custom Popover Dropdown */}
        <div className="relative flex-1 min-w-0 w-full">
          <div
            onClick={() =>
              setOpenDropdown((prev) => (prev === "location" ? null : "location"))
            }
            className="w-full flex items-center px-3 sm:px-4 py-2 sm:py-1 hover:bg-black/5 rounded-xl sm:rounded-full transition-colors cursor-pointer group select-none"
          >
            <MapPin className="w-4 h-4 text-[#FF561C] shrink-0 mr-2.5 group-hover:scale-110 transition-transform" />
            <div className="flex-1 min-w-0 pr-1">
              <label className="block text-[11px] sm:text-xs font-medium sm:font-normal text-gray-600 sm:text-gray-700 cursor-pointer">
                Hostel location
              </label>
              <div className="flex items-center justify-between gap-1 text-xs sm:text-sm text-gray-950 font-normal truncate">
                <span className="truncate">{selectedLocationObj?.label || "All Hostels (Kochi)"}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-gray-500 shrink-0 transition-transform duration-200 ${
                    openDropdown === "location" ? "rotate-180 text-[#FF561C]" : ""
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Location Custom Dropdown Menu */}
          {openDropdown === "location" && (
            <div
              className={`absolute left-0 right-0 sm:right-auto w-full sm:w-72 bg-white rounded-2xl shadow-2xl border border-gray-200 py-2 z-[70] max-h-72 overflow-y-auto animate-in fade-in zoom-in-95 duration-150 ${
                floatingOnScroll && isScrolled ? "bottom-full mb-3" : "top-full mt-2"
              }`}
            >
              {locOptions.map((opt, idx) => {
                const isSelected =
                  opt.value.toLowerCase() === (selectedLocationObj?.value || "").toLowerCase();
                return (
                  <button
                    key={`loc-${opt.value}-${idx}`}
                    type="button"
                    onClick={() => handleLocationSelect(opt.value)}
                    className={`w-full px-4 py-2.5 text-left text-xs sm:text-sm flex items-center justify-between hover:bg-gray-100 transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-orange-50 text-[#C44610] font-semibold"
                        : "text-gray-950 font-normal"
                    }`}
                  >
                    <span className="truncate">{opt.label}</span>
                    {isSelected && <Check className="w-4 h-4 text-[#FF561C] shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Divider: horizontal on mobile, vertical on sm+ */}
        <div className="h-[1px] w-full bg-black/10 sm:hidden" />
        <div className="hidden sm:block w-[1px] h-7 bg-gray-200 shrink-0" />

        {/* 2. Check-In Date Field with Fancy Popover Calendar */}
        <div className="relative flex-1 min-w-0 w-full">
          <FancyDatePicker
            label="Check-in date"
            value={effectiveDate}
            onChange={handleDateChange}
            minDate={new Date().toISOString().split("T")[0]}
            placeholder="Select date"
            align="center"
            position={floatingOnScroll && isScrolled ? "top" : "bottom"}
            customTrigger={({ displayLabel, isOpen, toggle, clear, value }) => (
              <div
                onClick={() => {
                  setOpenDropdown(null);
                  toggle();
                }}
                className="w-full flex items-center px-3 sm:px-4 py-2 sm:py-1 hover:bg-black/5 rounded-xl sm:rounded-full transition-colors cursor-pointer group select-none"
              >
                <Calendar className="w-4 h-4 text-[#FF561C] shrink-0 mr-2.5 group-hover:scale-110 transition-transform" />
                <div className="flex-1 min-w-0 pr-1">
                  <label className="block text-[11px] sm:text-xs font-medium sm:font-normal text-gray-600 sm:text-gray-700 cursor-pointer">
                    Check-in date
                  </label>
                  <div className="flex items-center justify-between gap-1 text-xs sm:text-sm text-gray-950 font-normal truncate">
                    <span className="truncate">{displayLabel || "Any date"}</span>
                    <div className="flex items-center gap-1 shrink-0">
                      {value && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            clear();
                          }}
                          className="w-4 h-4 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-600 flex items-center justify-center transition-colors cursor-pointer"
                          title="Clear date"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-gray-500 shrink-0 transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-[#FF561C]" : ""
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          />
        </div>

        {/* Divider: horizontal on mobile, vertical on sm+ */}
        <div className="h-[1px] w-full bg-black/10 sm:hidden" />
        <div className="hidden sm:block w-[1px] h-7 bg-gray-200 shrink-0" />

        {/* 3. Room Type Field with Custom Popover Dropdown */}
        <div className="relative flex-1 min-w-0 w-full">
          <div
            onClick={() =>
              setOpenDropdown((prev) => (prev === "room" ? null : "room"))
            }
            className="w-full flex items-center px-3 sm:px-4 py-2 sm:py-1 hover:bg-black/5 rounded-xl sm:rounded-full transition-colors cursor-pointer group select-none"
          >
            <BedDouble className="w-4 h-4 text-[#FF561C] shrink-0 mr-2.5 group-hover:scale-110 transition-transform" />
            <div className="flex-1 min-w-0 pr-1">
              <label className="block text-[11px] sm:text-xs font-medium sm:font-normal text-gray-600 sm:text-gray-700 cursor-pointer">
                Room type
              </label>
              <div className="flex items-center justify-between gap-1 text-xs sm:text-sm text-gray-950 font-normal truncate">
                <span className="truncate">{selectedRoomTypeObj?.label || "All room types"}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-gray-500 shrink-0 transition-transform duration-200 ${
                    openDropdown === "room" ? "rotate-180 text-[#FF561C]" : ""
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Room Type Custom Dropdown Menu */}
          {openDropdown === "room" && (
            <div
              className={`absolute left-0 right-0 sm:left-auto sm:right-0 w-full sm:w-72 bg-white rounded-2xl shadow-2xl border border-gray-200 py-2 z-[70] max-h-72 overflow-y-auto animate-in fade-in zoom-in-95 duration-150 ${
                floatingOnScroll && isScrolled ? "bottom-full mb-3" : "top-full mt-2"
              }`}
            >
              {dynamicRoomTypeOptions.map((opt, idx) => {
                const isSelected =
                  opt.value.toLowerCase() === (selectedRoomTypeObj?.value || "").toLowerCase() ||
                  (opt.value === "all" && (!effectiveRoomType || effectiveRoomType === "all"));
                return (
                  <button
                    key={`rt-${opt.value}-${idx}`}
                    type="button"
                    onClick={() => handleRoomTypeSelect(opt.value)}
                    className={`w-full px-4 py-2.5 text-left text-xs sm:text-sm flex items-center justify-between hover:bg-gray-100 transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-orange-50 text-[#C44610] font-semibold"
                        : "text-gray-950 font-normal"
                    }`}
                  >
                    <span className="truncate">{opt.label}</span>
                    {isSelected && <Check className="w-4 h-4 text-[#FF561C] shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 4. Search CTA Button: full button on mobile, circular on sm+ */}
        <button
          onClick={handleSearch}
          className="w-full sm:w-11 h-11 bg-[#FF561C] hover:bg-[#e0450d] text-white rounded-xl sm:rounded-full shadow-md transition-all flex items-center justify-center gap-2 shrink-0 active:scale-95 cursor-pointer mt-1 sm:mt-0"
          type="button"
          aria-label="Search Hostels"
        >
          <Search className="w-4 h-4 text-white" strokeWidth={2.5} />
          <span className="sm:hidden font-semibold text-xs tracking-wide">Search Rooms</span>
        </button>
      </div>

      {/* Optional Bottom Dark Pill Banner with Star Badge (used on home hero if enabled) */}
      {showBottomBadge && (
        <div
          className={`self-stretch sm:self-start bg-[#242321]/90 backdrop-blur-md text-white px-2.5 py-1 sm:py-1.5 rounded-lg sm:rounded-full flex sm:inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-medium tracking-wide ${
            noShadow ? "shadow-none" : "shadow-md"
          }`}
        >
          <span className="w-3.5 h-3.5 rounded-sm sm:rounded-md bg-amber-400 text-gray-950 font-bold inline-flex items-center justify-center shrink-0">
            <Sparkles className="w-2.5 h-2.5 fill-gray-950 text-gray-950" />
          </span>
          <span className="text-gray-200 truncate sm:whitespace-normal">
            Homely meals, 24/7 biometric security &amp; high-speed Wi-Fi
          </span>
        </div>
      )}
    </div>
  );
}
