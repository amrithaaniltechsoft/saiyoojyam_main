"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { X, Building2, ChevronDown, Check } from "lucide-react";
import {
  PREMIER_FILTERS,
  ANNEX_FILTERS,
  TOWERS_FILTERS,
  TowerRoomFilter,
  DynamicBuildingOption,
} from "@/components/search/TowerFilterSidebar";

interface MobileRoomFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFilterId: string | null;
  onSelectFilter: (filterId: string | null) => void;
  totalRoomsCount?: number;
  activeBuilding?: string;
  onSelectBuilding?: (buildingKey: string) => void;
  buildings?: DynamicBuildingOption[];
  buildingCategories?: Record<string, TowerRoomFilter[]>;
}

export function MobileRoomFilterDrawer({
  isOpen,
  onClose,
  selectedFilterId,
  onSelectFilter,
  totalRoomsCount,
  activeBuilding = "all",
  onSelectBuilding,
  buildings,
  buildingCategories,
}: MobileRoomFilterDrawerProps) {
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

  // Lock background scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Sync building from selected filter
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

  if (!isOpen) return null;

  const handleToggle = (id: string) => {
    if (selectedFilterId === id) {
      onSelectFilter(null);
    } else {
      onSelectFilter(id);
    }
  };

  const currentBuildingObj =
    buildingOptions.find((b) => b.id === selectedBuilding) || buildingOptions[0] || { id: "all", label: "All Buildings" };

  const buildingsToShow = buildingOptions
    .filter((b) => b.id !== "all")
    .filter((b) => selectedBuilding === "all" || b.id === selectedBuilding);

  const getFiltersForBuilding = (bId: string): TowerRoomFilter[] => {
    if (buildingCategories && buildingCategories[bId] && buildingCategories[bId].length > 0) {
      return buildingCategories[bId];
    }
    if (bId === "premier") return PREMIER_FILTERS;
    if (bId === "annex") return ANNEX_FILTERS;
    if (bId.includes("tower") || bId === "t1" || bId === "t2" || bId === "towers") return TOWERS_FILTERS;
    return [];
  };

  return (
    <div className="fixed inset-0 z-[100] lg:hidden flex flex-col justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Drawer Card */}
      <div className="relative w-full bg-white rounded-t-3xl shadow-2xl max-h-[85vh] flex flex-col z-10 animate-in slide-in-from-bottom duration-300 overflow-hidden font-sans-normal">
        {/* Header */}
        <div className="pt-3.5 pb-3 px-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-gray-950 flex items-center gap-2">
              <span>Filter by Room Category</span>
              {selectedFilterId && (
                <span className="w-2 h-2 rounded-full bg-[#FF561C] inline-block" />
              )}
            </h3>
            <p className="text-xs text-gray-500">
              {totalRoomsCount !== undefined
                ? `${totalRoomsCount} rooms available`
                : "Select preferred room configurations"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Content */}
        <div className="p-5 overflow-y-auto flex-1 flex flex-col gap-5">
          {/* Building Dropdown Selector */}
          <div ref={dropdownRef} className="relative">
            <label className="block text-[11px] font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
              Select Building
            </label>
            <button
              type="button"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="w-full flex items-center justify-between gap-2 px-3.5 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-left text-xs font-semibold text-gray-950 transition-colors cursor-pointer"
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
                      className={`w-full px-3.5 py-2 text-left text-xs flex items-center justify-between transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-orange-50 text-[#C44610] font-semibold"
                          : "text-gray-900 font-normal hover:bg-gray-50"
                      }`}
                    >
                      <span className="truncate">{opt.label}</span>
                      {isSelected && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF561C] shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Dynamic Building Categories */}
          {buildingsToShow.map((b) => {
            const filters = getFiltersForBuilding(b.id);
            if (filters.length === 0) return null;

            return (
              <div key={b.id}>
                <div className="pb-1.5 mb-2.5 border-b border-gray-200 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                  <h4 className="text-[13px] font-semibold text-gray-950 tracking-tight">
                    {b.label}
                  </h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {filters.map((item, idx) => {
                    const isSelected = selectedFilterId === item.id;
                    return (
                      <button
                        key={`${item.id}-${idx}`}
                        type="button"
                        onClick={() => handleToggle(item.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-left text-xs transition-all cursor-pointer active:scale-95 ${
                          isSelected
                            ? "bg-orange-50 border border-[#FF561C]/50 text-[#C44610] font-semibold shadow-xs"
                            : "bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-800 font-medium"
                        }`}
                      >
                        <span>{item.label}</span>
                        {isSelected ? (
                          <Check className="w-3.5 h-3.5 text-[#FF561C] shrink-0" />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border border-gray-300 bg-white shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/80 flex items-center gap-3">
          <button
            type="button"
            onClick={() => onSelectFilter(null)}
            className="flex-1 py-3 text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 bg-white border border-gray-200 rounded-xl transition-colors cursor-pointer text-center"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-2 py-3 text-xs sm:text-sm font-semibold text-white bg-[#FF561C] hover:bg-[#e0450d] rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer text-center"
          >
            Apply & View Rooms
          </button>
        </div>
      </div>
    </div>
  );
}
