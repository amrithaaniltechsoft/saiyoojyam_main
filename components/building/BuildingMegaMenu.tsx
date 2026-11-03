"use client";

import { useRouter } from "next/navigation";
import {
  PREMIER_FILTERS,
  ANNEX_FILTERS,
  TOWERS_FILTERS,
} from "@/components/search/TowerFilterSidebar";

interface BuildingMegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  currentBuildingSlug?: string;
}

export function BuildingMegaMenu({
  isOpen,
  onClose,
  onMouseEnter,
  onMouseLeave,
  currentBuildingSlug = "premier",
}: BuildingMegaMenuProps) {
  const router = useRouter();

  if (!isOpen) return null;

  // Determine filters and building info based on current building slug
  let filters = PREMIER_FILTERS;
  let locationParam = "premier";
  let buildingTitle = "Saiyoojyam Premier";

  if (currentBuildingSlug.includes("annex")) {
    filters = ANNEX_FILTERS;
    locationParam = currentBuildingSlug;
    buildingTitle = "Saiyoojyam Annex";
  } else if (currentBuildingSlug.includes("tower")) {
    filters = TOWERS_FILTERS;
    locationParam = currentBuildingSlug;
    buildingTitle = "Saiyoojyam Towers 1 & 2";
  }

  const isWide = filters.length > 8;

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`absolute top-full right-0 sm:left-1/2 sm:-translate-x-1/2 mt-2 ${
        isWide ? "w-[90vw] max-w-[560px]" : "w-[300px] sm:w-[320px]"
      } bg-white border border-gray-200/90 rounded-2xl shadow-2xl p-5 sm:p-6 z-50 animate-in fade-in zoom-in-95 duration-150 text-gray-900 font-sans-normal pointer-events-auto before:absolute before:-top-3 before:left-0 before:right-0 before:h-3 before:content-['']`}
    >
      <div className="flex flex-col">
        {/* Header / View all link */}
        <button
          type="button"
          onClick={() => {
            onClose();
            router.push(`/search?location=${locationParam}`);
          }}
          className="text-left group cursor-pointer pb-2 mb-3.5 border-b border-gray-200 flex items-center justify-between"
        >
          <h4 className="text-sm sm:text-base font-semibold text-gray-950 group-hover:text-[#FF561C] transition-colors whitespace-nowrap">
            {buildingTitle} Rooms
          </h4>
          <span className="text-xs text-[#FF561C] font-normal group-hover:underline ml-2 shrink-0">
            View all &rarr;
          </span>
        </button>

        {/* Room filter options */}
        <div
          className={`${
            isWide
              ? "grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2"
              : "flex flex-col gap-2"
          } text-xs sm:text-[13px] text-gray-700`}
        >
          {filters.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onClose();
                router.push(`/search?location=${locationParam}&filter=${item.id}`);
              }}
              className="flex items-center gap-2 hover:text-[#FF561C] transition-colors text-left cursor-pointer group py-0.5"
            >
              <span className="w-1.5 h-1.5 rounded-full border border-gray-400 group-hover:border-[#FF561C] group-hover:bg-[#FF561C] shrink-0" />
              <span className="whitespace-nowrap">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
