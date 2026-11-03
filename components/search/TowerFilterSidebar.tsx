"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Check, X, ChevronDown, Building2 } from "lucide-react";

export interface TowerRoomFilter {
  id: string;
  label: string;
  shares?: number;
  isAc?: boolean;
  isBunk?: boolean;
  isNightAc?: boolean;
  building?: string;
  dbId?: number;
}

export interface DynamicBuildingOption {
  id: string;
  label: string;
  slug?: string;
  name?: string;
  tagline?: string;
  address?: string;
}

// 1. Saiyoojyam Premier room types
export const PREMIER_FILTERS: TowerRoomFilter[] = [
  { id: "premier-1-ac", label: "Single AC", shares: 1, isAc: true },
  { id: "premier-2-ac", label: "2 Share AC", shares: 2, isAc: true },
  { id: "premier-3-ac", label: "3 Share AC", shares: 3, isAc: true },
  { id: "premier-2-nonac", label: "2 Share Non-AC", shares: 2, isAc: false },
  { id: "premier-3-nonac", label: "3 Share Non-AC", shares: 3, isAc: false },
  { id: "premier-4-nonac", label: "4 Share Non-AC", shares: 4, isAc: false },
];

// 2. Saiyoojyam Annex room types
export const ANNEX_FILTERS: TowerRoomFilter[] = [
  { id: "annex-1-ac", label: "Single AC", shares: 1, isAc: true },
  { id: "annex-2-ac", label: "2 Share AC", shares: 2, isAc: true },
  { id: "annex-3-ac", label: "3 Share AC", shares: 3, isAc: true },
  { id: "annex-1-nonac", label: "Single Non-AC", shares: 1, isAc: false },
  { id: "annex-2-nonac", label: "2 Share Non-AC", shares: 2, isAc: false },
  { id: "annex-3-nonac", label: "3 Share Non-AC", shares: 3, isAc: false },
  { id: "annex-4-nonac", label: "4 Share Non-AC", shares: 4, isAc: false },
];

// 3. Saiyoojyam Towers 1 & 2 room types
export const TOWERS_FILTERS: TowerRoomFilter[] = [
  // Tower 1 categories
  { id: "t1-4-ac", label: "Tower 1: 4 Share AC", shares: 4, isAc: true },
  { id: "t1-3-ac", label: "Tower 1: 3 Share AC", shares: 3, isAc: true },
  { id: "t1-4-1", label: "Tower 1: 4 Share-1", shares: 4, isAc: false },
  { id: "t1-4-2", label: "Tower 1: 4 Share-2", shares: 4, isAc: false },
  { id: "t1-3", label: "Tower 1: 3 Share", shares: 3, isAc: false },

  // Tower 2 categories
  { id: "t2-single-ac", label: "Tower 2: Single AC", shares: 1, isAc: true },
  { id: "t2-2-ac", label: "Tower 2: 2 Share AC", shares: 2, isAc: true },
  { id: "t2-3-ac", label: "Tower 2: 3 Share AC", shares: 3, isAc: true },
  { id: "t2-single", label: "Tower 2: Single Non-AC", shares: 1, isAc: false },
  { id: "t2-2", label: "Tower 2: 2 Share Non-AC", shares: 2, isAc: false },
  { id: "t2-3", label: "Tower 2: 3 Share Non-AC", shares: 3, isAc: false },
  { id: "t2-4", label: "Tower 2: 4 Share Non-AC", shares: 4, isAc: false },
  { id: "t2-10-1", label: "Tower 2: 10 Share-1 (Bunk; Night AC)", shares: 10, isAc: true, isBunk: true, isNightAc: true },
  { id: "t2-10-2", label: "Tower 2: 10 Share-2 (Bunk; Night AC)", shares: 10, isAc: true, isBunk: true, isNightAc: true },
  { id: "t2-8", label: "Tower 2: 8 Share (Bunk; Night AC)", shares: 8, isAc: true, isBunk: true, isNightAc: true },
  { id: "t2-6", label: "Tower 2: 6 Share (Bunk; Night AC)", shares: 6, isAc: true, isBunk: true, isNightAc: true },
  { id: "t2-4-bunk", label: "Tower 2: 4 Share (Bunk; Night AC)", shares: 4, isAc: true, isBunk: true, isNightAc: true },
];

// Retain legacy exports for backwards compatibility
export const TOWER_1_FILTERS = TOWERS_FILTERS.filter(f => f.id.startsWith("t1-"));
export const TOWER_2_FILTERS_COL1 = TOWERS_FILTERS.filter(f => f.id.startsWith("t2-")).slice(0, 6);
export const TOWER_2_FILTERS_COL2 = TOWERS_FILTERS.filter(f => f.id.startsWith("t2-")).slice(6);

interface TowerFilterSidebarProps {
  selectedFilterId: string | null;
  onSelectFilter: (filterId: string | null) => void;
  activeBuilding?: string;
  onSelectBuilding?: (building: string) => void;
  buildings?: DynamicBuildingOption[];
  buildingCategories?: Record<string, TowerRoomFilter[]>;
}

export function TowerFilterSidebar({
  selectedFilterId,
  onSelectFilter,
  activeBuilding = "all",
  onSelectBuilding,
  buildings,
  buildingCategories,
}: TowerFilterSidebarProps) {
  const buildingOptions = useMemo(() => {
    const raw = buildings && buildings.length > 0 ? buildings : [];
    const seen = new Set<string>();
    const result: { id: string; label: string }[] = [];

    result.push({ id: "all", label: "All Buildings" });
    seen.add("all");

    for (const b of raw as any[]) {
      const id = (b.slug || b.id || "").toString().trim().toLowerCase();
      if (!id || seen.has(id)) continue;
      seen.add(id);
      result.push({
        id,
        label: b.label || b.name || "Building",
      });
    }
    return result;
  }, [buildings]);

  const [selectedBuilding, setSelectedBuilding] = useState<string>(
    activeBuilding || "all"
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync with activeBuilding prop whenever it changes
  useEffect(() => {
    if (activeBuilding) {
      setSelectedBuilding(activeBuilding);
    }
  }, [activeBuilding]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Automatically switch building selection if an item from another building is selected
  useEffect(() => {
    if (!selectedFilterId) return;
    if (selectedFilterId.startsWith("premier-")) {
      setSelectedBuilding((prev) => (prev === "all" ? "all" : "premier"));
    } else if (selectedFilterId.startsWith("annex-")) {
      setSelectedBuilding((prev) => (prev === "all" ? "all" : "annex"));
    } else if (selectedFilterId.startsWith("t1-")) {
      setSelectedBuilding((prev) => (prev === "all" ? "all" : "tower-1"));
    } else if (selectedFilterId.startsWith("t2-")) {
      setSelectedBuilding((prev) => (prev === "all" ? "all" : "tower-2"));
    } else if (selectedFilterId.startsWith("towers-")) {
      setSelectedBuilding((prev) => (prev === "all" ? "all" : "towers"));
    }
  }, [selectedFilterId]);

  const handleToggle = (id: string) => {
    if (selectedFilterId === id) {
      onSelectFilter(null);
    } else {
      onSelectFilter(id);
    }
  };

  const currentBuildingObj =
    buildingOptions.find((b) => b.id === selectedBuilding) || buildingOptions[0] || { id: "all", label: "All Buildings" };

  const buildingsToShow = useMemo(() => {
    const realBuildings = buildingOptions.filter((b) => b.id !== "all");
    if (selectedBuilding === "all") {
      return realBuildings;
    }
    return realBuildings.filter((b) => b.id === selectedBuilding);
  }, [buildingOptions, selectedBuilding]);

  const getFiltersForBuilding = (bId: string): TowerRoomFilter[] => {
    if (buildingCategories && buildingCategories[bId] && buildingCategories[bId].length > 0) {
      return buildingCategories[bId];
    }
    if (bId === "premier") return PREMIER_FILTERS;
    if (bId === "annex") return ANNEX_FILTERS;
    if (bId === "tower-1" || bId.includes("tower-1") || bId === "t1") return TOWER_1_FILTERS;
    if (bId === "tower-2" || bId.includes("tower-2") || bId === "t2") return [...TOWER_2_FILTERS_COL1, ...TOWER_2_FILTERS_COL2];
    if (bId === "towers" || bId.includes("tower")) return TOWERS_FILTERS;
    return [];
  };

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  return (
    <aside className="hidden lg:flex w-[280px] xl:w-[320px] shrink-0 flex-col bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-xs sticky top-24 max-h-[90vh] h-[90vh] font-sans-normal">
      {/* Header with Mobile Accordion Toggle & Clear Button */}
      <div className="shrink-0 flex items-center justify-between pb-3 border-b border-gray-100 mb-3 font-sans-normal">
        <div
          onClick={() => setIsMobileFiltersOpen((prev) => !prev)}
          className="flex items-center gap-2 cursor-pointer lg:cursor-default"
        >
          <h3 className="text-sm font-semibold text-gray-950 tracking-tight font-sans-normal flex items-center gap-2">
            <span>Filter by Room Category</span>
            {selectedFilterId && (
              <span className="w-2 h-2 rounded-full bg-[#FF561C] inline-block" />
            )}
          </h3>
          <span className="lg:hidden text-xs text-gray-500 font-normal">
            ({isMobileFiltersOpen ? "Hide" : "Show"})
          </span>
        </div>

        <div className="flex items-center gap-2">
          {selectedFilterId && (
            <button
              type="button"
              onClick={() => onSelectFilter(null)}
              className="text-xs font-semibold text-red-600 hover:text-red-700 underline flex items-center gap-1 cursor-pointer transition-colors font-sans-normal"
            >
              <X className="w-3.5 h-3.5 text-red-600" />
              <span>Reset</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsMobileFiltersOpen((prev) => !prev)}
            className="lg:hidden p-1 text-gray-500 hover:text-gray-900 transition-colors"
            aria-label="Toggle Room Category Filters"
          >
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                isMobileFiltersOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Main Filter Body (Collapsible on mobile, always visible on lg+) */}
      <div className={`${isMobileFiltersOpen ? "flex" : "hidden"} lg:flex flex-col flex-1 min-h-0`}>
        {/* Building Dropdown Selector with Full Names */}
        <div ref={dropdownRef} className="shrink-0 relative mb-4 font-sans-normal">
          <label className="block text-[11px] font-semibold text-gray-800 mb-1.5 uppercase tracking-wide">
            Select Building
          </label>
        <button
          type="button"
          onClick={() => setIsDropdownOpen((prev) => !prev)}
          className="w-full flex items-center justify-between gap-2 px-3 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-left text-xs font-semibold text-gray-950 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2 truncate min-w-0">
            <Building2 className="w-4 h-4 text-[#FF561C] shrink-0" />
            <span className="truncate">{currentBuildingObj.label}</span>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-gray-700 shrink-0 transition-transform duration-200 ${
              isDropdownOpen ? "rotate-180 text-[#FF561C]" : ""
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-xl shadow-xl py-1.5 z-30 animate-in fade-in zoom-in-95 duration-150">
            {buildingOptions.map((opt) => {
              const isSelected = selectedBuilding === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setSelectedBuilding(opt.id);
                    setIsDropdownOpen(false);
                    onSelectBuilding?.(opt.id);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs transition-colors cursor-pointer text-left ${
                    isSelected
                      ? "bg-orange-50 text-[#C44610] font-semibold"
                      : "text-gray-900 font-medium hover:text-black hover:bg-gray-50"
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-[#FF561C] shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Scrollable Filters Content */}
      <div className="space-y-5 overflow-y-auto flex-1 pr-1 font-sans-normal [scrollbar-width:thin] [scrollbar-color:#9ca3af_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar]:block [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-500">
        {buildingsToShow.map((b) => {
          const filters = getFiltersForBuilding(b.id);
          if (filters.length === 0) return null;

          return (
            <div key={b.id}>
              <div className="pb-1.5 mb-2.5 border-b border-gray-200">
                <h4 className="text-[13px] font-semibold text-gray-950 tracking-tight font-sans-normal">
                  {b.label}
                </h4>
              </div>

              <div className="flex flex-col gap-1">
                {filters.map((item, idx) => {
                  const isSelected = selectedFilterId === item.id;
                  return (
                    <button
                      key={`${item.id}-${idx}`}
                      type="button"
                      onClick={() => handleToggle(item.id)}
                      className={`w-full text-left flex items-start gap-2.5 px-2.5 py-2 rounded-lg text-xs transition-colors cursor-pointer group font-sans-normal ${
                        isSelected
                          ? "bg-orange-100/70 text-[#C44610] font-semibold"
                          : "text-gray-900 font-medium hover:text-black hover:bg-gray-100/70"
                      }`}
                    >
                      <span
                        className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0 transition-all ${
                          isSelected
                            ? "border-[#FF561C] bg-[#FF561C]"
                            : "border-gray-500 group-hover:border-gray-800 bg-white"
                        }`}
                      >
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </span>
                      <span className="leading-snug">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      </div>
    </aside>
  );
}
