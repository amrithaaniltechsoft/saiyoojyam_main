import { useMemo } from "react";
import { SlidersHorizontal } from "lucide-react";
import { DynamicBuildingOption } from "@/components/search/TowerFilterSidebar";

interface BuildingFilterTabsProps {
  selectedLocation: string;
  selectedRoomType: string;
  onFilterChange: (location: string, roomType: string) => void;
  buildings?: DynamicBuildingOption[];
}

const DEFAULT_TABS = [
  { key: "all", label: "All Buildings" },
  { key: "premier", label: "Saiyoojyam Premier" },
  { key: "annex", label: "Saiyoojyam Annex" },
  { key: "towers", label: "Saiyoojyam Towers 1 & 2" },
];

export function BuildingFilterTabs({
  selectedLocation,
  selectedRoomType,
  onFilterChange,
  buildings,
}: BuildingFilterTabsProps) {
  const tabs = useMemo(() => {
    const raw = buildings && buildings.length > 0 ? buildings : DEFAULT_TABS;
    const seen = new Set<string>();
    const result: { key: string; label: string }[] = [];

    // Ensure "all" is first
    result.push({ key: "all", label: "All Buildings" });
    seen.add("all");

    for (const b of raw as any[]) {
      const key = (b.slug || b.id || b.key || "").toString().trim().toLowerCase();
      if (!key || seen.has(key)) continue;
      seen.add(key);
      result.push({
        key,
        label: b.label || b.name || "Building",
      });
    }
    return result;
  }, [buildings]);

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 mr-2 flex items-center gap-1">
        <SlidersHorizontal className="w-3.5 h-3.5 text-gray-500" /> Filter Building:
      </span>
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onFilterChange(tab.key, selectedRoomType)}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${selectedLocation === tab.key
            ? "bg-gray-900 text-white"
            : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
            }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
