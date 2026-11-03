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

  const locOptions = useMemo(() => {
    const raw =
      buildings && buildings.length > 0
        ? buildings
        : fetchedBuildings && fetchedBuildings.length > 0
        ? fetchedBuildings
        : locationOptions;
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
  }, [buildings, fetchedBuildings]);

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
                    onClick={() => setTempLocation(opt.value)}
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
