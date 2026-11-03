"use client";

import { useMemo } from "react";
import { Search } from "lucide-react";
import {
  locationOptions,
  roomTypeOptions,
  DynamicRoomTypeOption,
} from "@/components/search/OverlaySearchFilter";
import { DynamicBuildingOption } from "@/components/search/TowerFilterSidebar";

interface MobileSearchSummaryButtonProps {
  location: string;
  roomType: string;
  date?: string;
  onClick: () => void;
  className?: string;
  buildings?: DynamicBuildingOption[];
  roomTypes?: DynamicRoomTypeOption[];
}

export function MobileSearchSummaryButton({
  location,
  roomType,
  date,
  onClick,
  className = "",
  buildings,
  roomTypes,
}: MobileSearchSummaryButtonProps) {
  const selectedLocationLabel = useMemo(() => {
    const loc = (location || "all").toString().trim();
    if (loc === "all" || !loc) return "All Hostels (Kochi)";

    const bMatch =
      buildings &&
      buildings.find(
        (b) =>
          (b.slug || String(b.id || "")).toLowerCase() === loc.toLowerCase()
      );
    if (bMatch?.label || bMatch?.name) return bMatch.label || bMatch.name;

    const optMatch = locationOptions.find((o) => o.value.toLowerCase() === loc.toLowerCase());
    if (optMatch?.label) return optMatch.label;

    const cleanWord = loc
      .replace(/^saiyoojyam[-_]/i, "")
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    return `Saiyoojyam ${cleanWord}`;
  }, [buildings, location]);

  const dynamicRoomTypeObj =
    roomTypes &&
    roomTypes.find(
      (r) =>
        r.value === roomType ||
        (r.slug && r.slug.toLowerCase() === roomType.toLowerCase()) ||
        (r.name && r.name.toLowerCase() === roomType.toLowerCase()) ||
        String(r.id) === roomType
    );

  const selectedRoomTypeLabel =
    dynamicRoomTypeObj?.label ||
    dynamicRoomTypeObj?.name ||
    roomTypeOptions.find((o) => o.value === roomType)?.label ||
    (roomType && roomType !== "all" ? roomType : "All room types");

  return (
    <div className={`w-full max-w-[620px] mx-auto ${className}`}>
      <button
        type="button"
        onClick={onClick}
        className="w-full h-full bg-white hover:bg-orange-50/50 text-gray-900 border border-orange-500 rounded-lg py-2 px-3.5 shadow-sm flex items-center justify-between gap-2.5 transition-all active:scale-[0.98] cursor-pointer group"
      >
        {/* Search Icon Badge */}
        <div className="w-8 h-8 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
          <Search className="w-5 h-5 text-gray-400" strokeWidth={2.5} />
        </div>

        {/* Chosen Hostel + Summary of other search filters */}
        <div className="flex-1 min-w-0 text-left">
          <div className="text-xs sm:text-sm font-semibold text-gray-700 truncate">
            {selectedLocationLabel}
          </div>
          <div className="text-[11px] sm:text-xs text-gray-600 truncate flex items-center gap-1.5">
            <span>{selectedRoomTypeLabel}</span>
            {date && (
              <>
                <span className="text-gray-300">•</span>
                <span className="text-gray-700">{date}</span>
              </>
            )}
          </div>
        </div>
      </button>
    </div>
  );
}
