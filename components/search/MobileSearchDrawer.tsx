"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { X, MapPin, Calendar, BedDouble, Search, ChevronDown, Check } from "lucide-react";
import { FancyDatePicker } from "@/components/ui/FancyDatePicker";
import { locationOptions, roomTypeOptions, DynamicRoomTypeOption } from "@/components/search/OverlaySearchFilter";
import { DynamicBuildingOption } from "@/components/search/TowerFilterSidebar";

interface MobileSearchDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLocation: string;
  selectedDate: string;
  selectedRoomType: string;
  onFilterChange?: (newLocation: string, newRoomType: string) => void;
  onDateChange?: (date: string) => void;
  onApply?: (newLocation: string, newRoomType: string, newDate: string) => void;
  buildings?: DynamicBuildingOption[];
  roomTypes?: DynamicRoomTypeOption[];
}

export function MobileSearchDrawer({
  isOpen,
  onClose,
  selectedLocation,
  selectedDate,
  selectedRoomType,
  onFilterChange,
  onDateChange,
  onApply,
  buildings,
  roomTypes,
}: MobileSearchDrawerProps) {
  const [tempLocation, setTempLocation] = useState(selectedLocation);
  const [tempDate, setTempDate] = useState(selectedDate);
  const [tempRoomType, setTempRoomType] = useState(selectedRoomType);
  const [fetchedBuildings, setFetchedBuildings] = useState<any[]>([]);
  const [fetchedRoomTypes, setFetchedRoomTypes] = useState<DynamicRoomTypeOption[]>([]);


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

  const availableBuildings = useMemo(() => {
    return buildings && buildings.length > 0
      ? buildings
      : fetchedBuildings && fetchedBuildings.length > 0
      ? fetchedBuildings
      : locationOptions;
  }, [buildings, fetchedBuildings]);

  const locOptions = useMemo(() => {
    const raw = availableBuildings;
    const seen = new Set<string>();
    const result: { value: string; label: string }[] = [];

    result.push({ value: "all", label: "All Hostels (Kochi)" });
    seen.add("all");

    for (const b of raw as any[]) {
      const value = (b.slug || b.id || b.value || "").toString().trim().toLowerCase();
      if (!value || seen.has(value)) continue;
      seen.add(value);
      const cleanName = (b.name || b.label || "Building")
        .replace(/\s*\(?\s*sfsdfsd\s*\)?/gi, "")
        .trim();
      result.push({ value, label: cleanName });
    }
    return result;
  }, [availableBuildings]);

  // Resolve active building info for tempLocation
  const activeBuildingInfo = useMemo(() => {
    const loc = (tempLocation || "").toString().trim().toLowerCase();
    if (!loc || loc === "all") return null;

    const locClean = loc.replace(/^saiyoojyam[-_]/i, "");

    for (const b of availableBuildings as any[]) {
      if (!b) continue;
      const bId = String(b.id || b.building_id || "").toLowerCase();
      const bSlug = String(b.slug || b.building_slug || b.value || "").toLowerCase();
      const bCleanSlug = bSlug.replace(/^saiyoojyam[-_]/i, "");
      const bName = String(b.name || b.label || b.building_name || "").toLowerCase();

      const isTowerMatch =
        (locClean.includes("tower") || locClean === "towers-1-2" || locClean === "towers") &&
        (bCleanSlug.includes("tower") || bName.includes("tower"));

      const isAnnexMatch =
        locClean.includes("annex") &&
        (bCleanSlug.includes("annex") || bName.includes("annex"));

      const isPremierMatch =
        locClean.includes("premier") &&
        (bCleanSlug.includes("premier") || bName.includes("premier"));

      if (
        loc === bId ||
        loc === bSlug ||
        locClean === bCleanSlug ||
        loc === `saiyoojyam-${bSlug}` ||
        bSlug === `saiyoojyam-${loc}` ||
        loc === bName ||
        (bName && (bName.includes(locClean) || locClean.includes(bName))) ||
        isTowerMatch ||
        isAnnexMatch ||
        isPremierMatch
      ) {
        return {
          id: Number(b.building_id || b.id) || null,
          slug: bCleanSlug || bSlug,
          name: b.name || b.label || "",
        };
      }
    }

    if (/^\d+$/.test(loc)) {
      return { id: Number(loc), slug: loc, name: "" };
    }

    return { id: null, slug: locClean, name: "" };
  }, [availableBuildings, tempLocation]);

  const dynamicRoomTypeOptions = useMemo(() => {
    const raw =
      roomTypes && roomTypes.length > 0
        ? roomTypes
        : fetchedRoomTypes && fetchedRoomTypes.length > 0
        ? fetchedRoomTypes
        : roomTypeOptions;

    const seenValues = new Set<string>();
    const seenLabels = new Set<string>();
    const result: { value: string; label: string; id?: number | string }[] = [];

    result.push({ value: "all", label: "All room types" });
    seenValues.add("all");
    seenLabels.add("all room types");

    const loc = (tempLocation || "").toString().trim().toLowerCase();
    const isAll = !loc || loc === "all";

    const targetBId = activeBuildingInfo?.id ?? null;
    const targetBSlug = activeBuildingInfo?.slug ?? "";

    for (const rt of raw as any[]) {
      if (!rt) continue;

      // Filter by building when location is not "all"
      if (!isAll) {
        const rtBId = Number(rt.building_id || (rt as any).room_type_building_id || 0);
        const rtBSlug = String((rt as any).building_slug || "").toLowerCase().replace(/^saiyoojyam[-_]/i, "");
        const rtBName = String((rt as any).building_name || "").toLowerCase();

        const isTowerLoc = loc.includes("tower") || targetBSlug.includes("tower");
        const isTowerRt = rtBSlug.includes("tower") || rtBName.includes("tower") || rtBId === 3 || rtBId === 4;

        const isAnnexLoc = loc.includes("annex") || targetBSlug.includes("annex");
        const isAnnexRt = rtBSlug.includes("annex") || rtBName.includes("annex") || rtBId === 1;

        const isPremierLoc = loc.includes("premier") || targetBSlug.includes("premier");
        const isPremierRt = rtBSlug.includes("premier") || rtBName.includes("premier");

        let matches = false;
        if (targetBId && rtBId > 0 && rtBId === targetBId) {
          matches = true;
        } else if (targetBSlug && rtBSlug && rtBSlug === targetBSlug) {
          matches = true;
        } else if (targetBSlug && (rtBSlug.includes(targetBSlug) || targetBSlug.includes(rtBSlug))) {
          matches = true;
        } else if (isTowerLoc && isTowerRt) {
          matches = true;
        } else if (isAnnexLoc && isAnnexRt) {
          matches = true;
        } else if (isPremierLoc && isPremierRt) {
          matches = true;
        } else if (!targetBId && !targetBSlug) {
          const locClean = loc.replace(/^saiyoojyam[-_]/i, "");
          if (rtBId > 0 && String(rtBId) === locClean) matches = true;
          if (rtBSlug && (rtBSlug === locClean || locClean.includes(rtBSlug))) matches = true;
        }

        if (!matches) {
          continue;
        }
      }

      const label = String(rt.label || rt.name || (rt as any).room_type_name || "").trim();
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
        id: rt.id || (rt as any).room_type_id,
      });
    }

    return result;
  }, [roomTypes, fetchedRoomTypes, tempLocation, activeBuildingInfo]);

  // Check if room type is valid for location
  const checkRoomTypeValidForLocation = (locVal: string, rtVal: string): boolean => {
    if (!rtVal || rtVal === "all") return true;
    if (!locVal || locVal === "all") return true;

    const rtLower = rtVal.toLowerCase();
    return dynamicRoomTypeOptions.some((opt) => {
      const v = opt.value.toLowerCase();
      const l = opt.label.toLowerCase();
      return v === rtLower || l === rtLower;
    });
  };

  const handleSelectLocation = (newLoc: string) => {
    setTempLocation(newLoc);
    if (tempRoomType && tempRoomType !== "all") {
      if (!checkRoomTypeValidForLocation(newLoc, tempRoomType)) {
        setTempRoomType("all");
      }
    }
  };

  // Sync state whenever drawer opens
  useEffect(() => {
    if (isOpen) {
      setTempLocation(selectedLocation);
      setTempDate(selectedDate);
      setTempRoomType(selectedRoomType);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, selectedLocation, selectedDate, selectedRoomType]);

  if (!isOpen) return null;

  const handleApply = () => {
    if (onApply) {
      onApply(tempLocation, tempRoomType, tempDate);
    } else {
      onDateChange?.(tempDate);
      onFilterChange?.(tempLocation, tempRoomType);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] lg:hidden flex flex-col justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Drawer Card */}
      <div className="relative w-full bg-white rounded-t-3xl border-t border-gray-200 max-h-[85vh] flex flex-col z-10 animate-in slide-in-from-bottom duration-300 overflow-hidden text-gray-900 font-sans-normal">
        {/* Drag handle & Header */}
        <div className="pt-3 pb-3 px-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 text-[#FF561C] flex items-center justify-center shrink-0">
              <Search className="w-6 h-6 text-gray-400" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-950">Search & Filter</h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer Body: Form Inputs */}
        <div className="p-5 overflow-y-auto flex flex-col gap-4">
          {/* 1. Hostel Location */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#FF561C]" />
              <span>Hostel Location</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {locOptions.map((opt, idx) => {
                const isSelected = opt.value === tempLocation;
                return (
                  <button
                    key={`mob-loc-${opt.value}-${idx}`}
                    type="button"
                    onClick={() => handleSelectLocation(opt.value)}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-left text-xs transition-all cursor-pointer active:scale-95 ${isSelected
                      ? "border border-[#FF561C]/50 bg-orange-50 text-[#C44610] font-semibold"
                      : "border border-gray-200 bg-gray-50/70 hover:bg-gray-100 text-gray-800 font-medium"
                      }`}
                  >
                    <span>{opt.label}</span>
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

          {/* 2. Check-in Date */}
          <div className="flex flex-col gap-1.5 pt-1">
            <FancyDatePicker
              label="Check-in Date"
              value={tempDate}
              onChange={(d) => setTempDate(d)}
              placeholder="Select check-in"
              minDate={new Date().toISOString().split("T")[0]}
              align="left"
            />
          </div>

          {/* 3. Room Type */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
              <BedDouble className="w-3.5 h-3.5 text-[#FF561C]" />
              <span>Room Type</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {dynamicRoomTypeOptions.map((opt, idx) => {
                const isSelected =
                  opt.value === tempRoomType ||
                  (opt.value === "all" && (!tempRoomType || tempRoomType === "all"));
                return (
                  <button
                    key={`mob-rt-${opt.value}-${idx}`}
                    type="button"
                    onClick={() => setTempRoomType(opt.value)}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-left text-xs transition-all cursor-pointer active:scale-95 ${isSelected
                      ? "border border-[#FF561C]/50 bg-orange-50 text-[#C44610] font-semibold"
                      : "border border-gray-200 bg-gray-50/70 hover:bg-gray-100 text-gray-800 font-medium"
                      }`}
                  >
                    <span>{opt.label}</span>
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
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/80 flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setTempLocation("all");
              setTempDate("");
              setTempRoomType("all");
            }}
            className="flex-1 py-3 text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 bg-white border border-gray-200 rounded-xl transition-colors cursor-pointer text-center"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="flex-2 py-3 text-xs sm:text-sm font-semibold text-white bg-[#FF561C] hover:bg-[#e0450d] rounded-xl transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4 text-white" strokeWidth={2.5} />
            <span>Search Rooms</span>
          </button>
        </div>
      </div>
    </div>
  );
}
