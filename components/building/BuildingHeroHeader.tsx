import { Bookmark, Share2 } from "lucide-react";
import { BuildingDetailData } from "@/data/buildingsData";

interface BuildingHeroHeaderProps {
  building: BuildingDetailData;
}

export function BuildingHeroHeader({ building }: BuildingHeroHeaderProps) {
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

      <div className="flex items-center shrink-0 pt-0.5 sm:pt-1">
        <button
          type="button"
          aria-label="Share property"
          className="p-2 sm:p-2.5 rounded-full text-gray-700 hover:text-gray-950 hover:bg-gray-100 cursor-pointer transition-colors active:scale-95"
        >
          <Share2 className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
        </button>
      </div>
    </div>
  );
}
