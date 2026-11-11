"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { RoomItem } from "@/data/roomsData";
import { RoomCard } from "@/components/search/RoomCard";
import { BottomFeatureHighlights } from "@/components/search/BottomFeatureHighlights";
import { OverlaySearchFilter } from "@/components/search/OverlaySearchFilter";
import {
  TowerFilterSidebar,
  TowerRoomFilter,
  DynamicBuildingOption,
} from "@/components/search/TowerFilterSidebar";
import {
  ShowerHead,
  Wind,
  BookOpen,
  Lock,
  Wifi,
  Utensils,
  Building,
  CheckCircle2,
  BedDouble,
  Bus,
  Sun,
  Zap,
  SlidersHorizontal,
} from "lucide-react";
import { MobileSearchDrawer } from "@/components/search/MobileSearchDrawer";
import { MobileRoomFilterDrawer } from "@/components/search/MobileRoomFilterDrawer";
import { MobileSearchSummaryButton } from "@/components/search/MobileSearchSummaryButton";
import { SearchBottomBar } from "@/components/search/SearchBottomBar";

// Icon Helper mapping for Room Feature badges
function renderFeatureIcon(iconName: string, className = "w-3.5 h-3.5 text-[#A83223]") {
  switch (iconName) {
    case "ShowerHead":
      return <ShowerHead className={className} />;
    case "Wind":
      return <Wind className={className} />;
    case "BookOpen":
      return <BookOpen className={className} />;
    case "Lock":
      return <Lock className={className} />;
    case "Wifi":
      return <Wifi className={className} />;
    case "Utensils":
      return <Utensils className={className} />;
    case "Building":
      return <Building className={className} />;
    case "Sun":
      return <Sun className={className} />;
    case "Bus":
      return <Bus className={className} />;
    case "Zap":
      return <Zap className={className} />;
    default:
      return <CheckCircle2 className={className} />;
  }
}

interface SearchResultsViewProps {
  initialLocation?: string;
  initialDate?: string;
  initialRoomType?: string;
  initialFilter?: string | null;
}

export function SearchResultsView({
  initialLocation = "all",
  initialDate = "",
  initialRoomType = "all",
  initialFilter = null,
}: SearchResultsViewProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [selectedLocation, setSelectedLocation] = useState(
    searchParams.get("location") || initialLocation || "all"
  );
  const [selectedDate, setSelectedDate] = useState(
    searchParams.get("date") ?? initialDate ?? ""
  );
  const [selectedRoomType, setSelectedRoomType] = useState(
    searchParams.get("roomType") || initialRoomType || "all"
  );
  const [selectedTowerFilter, setSelectedTowerFilter] = useState<string | null>(
    searchParams.get("filter") || initialFilter
  );

  const [apiRooms, setApiRooms] = useState<RoomItem[]>([]);
  const [allApiRooms, setAllApiRooms] = useState<RoomItem[]>([]);
  const [dynamicBuildings, setDynamicBuildings] = useState<DynamicBuildingOption[]>([]);
  const [dynamicRoomTypes, setDynamicRoomTypes] = useState<any[]>([]);
  const [dynamicCategories, setDynamicCategories] = useState<Record<string, TowerRoomFilter[]>>({});
  const [loading, setLoading] = useState(true);

  const [isSearchDrawerOpen, setIsSearchDrawerOpen] = useState(false);
  const [isRoomFilterDrawerOpen, setIsRoomFilterDrawerOpen] = useState(false);

  // Initial fetch for all buildings and room types from saiyoojyam_room_type
  useEffect(() => {
    const rawApiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost/saiyoojyam";
    const baseUrl = rawApiUrl.replace(/\/+$/, "");

    fetch(`${baseUrl}/api/building`, { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json && json.status && Array.isArray(json.data) && json.data.length > 0) {
          const seen = new Set<string>();
          const list: DynamicBuildingOption[] = [];
          for (const b of json.data) {
            const key = (b.slug || String(b.id || "")).trim().toLowerCase();
            if (!key || seen.has(key)) continue;
            seen.add(key);
            const label = (b.name || b.label || "Building")
              .replace(/\s*\(?\s*sfsdfsd\s*\)?/gi, "")
              .trim();
            list.push({
              id: key,
              building_id: b.building_id || b.id,
              slug: key,
              label: label,
              name: label,
              tagline: b.tagline === "sfsdfsd" ? "" : b.tagline,
              address: b.address,
            });
          }
          setDynamicBuildings((prev) => (prev.length > 0 ? prev : list));
        }
      })
      .catch(() => {});

    fetch(`${baseUrl}/api/room-types`, { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json && json.status && Array.isArray(json.data) && json.data.length > 0) {
          setDynamicRoomTypes(json.data);
        }
      })
      .catch(() => {});
  }, []);

  // Sync state whenever URL query params change
  useEffect(() => {
    const loc = searchParams.get("location") || initialLocation || "all";
    const dt = searchParams.get("date") ?? initialDate ?? "";
    const rt = searchParams.get("roomType") || initialRoomType || "all";
    const flt = searchParams.get("filter") || initialFilter || null;

    setSelectedLocation(loc);
    setSelectedDate(dt);
    setSelectedRoomType(rt);
    setSelectedTowerFilter(flt);
  }, [searchParams, initialLocation, initialDate, initialRoomType, initialFilter]);

  // Fetch rooms from backend REST API
  useEffect(() => {
    const rawApiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost/saiyoojyam";
    const baseUrl = rawApiUrl.replace(/\/+$/, "");

    const params = new URLSearchParams();
    if (selectedLocation && selectedLocation !== "all") params.set("location", selectedLocation);
    if (selectedDate) params.set("date", selectedDate);
    if (selectedRoomType && selectedRoomType !== "all") params.set("roomType", selectedRoomType);
    if (selectedTowerFilter) params.set("filter", selectedTowerFilter);

    setLoading(true);
    fetch(`${baseUrl}/api/rooms?${params.toString()}`, { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json && json.status) {
          if (Array.isArray(json.buildings) && json.buildings.length > 0) {
            const seen = new Set<string>();
            const mapped: DynamicBuildingOption[] = [];
            for (const b of json.buildings) {
              const key = (b.slug || String(b.id || "")).trim().toLowerCase();
              if (!key || seen.has(key)) continue;
              seen.add(key);
              const label = (b.name || b.label || "Building")
                .replace(/\s*\(?\s*sfsdfsd\s*\)?/gi, "")
                .trim();
              mapped.push({
                id: key,
                building_id: b.building_id || b.id,
                slug: key,
                label: label,
                name: label,
                tagline: b.tagline === "sfsdfsd" ? "" : b.tagline,
                address: b.address,
              });
            }
            setDynamicBuildings(mapped);
          }
          if (json.buildingCategories && typeof json.buildingCategories === "object") {
            setDynamicCategories(json.buildingCategories);
          }

          if (Array.isArray(json.roomTypes) && json.roomTypes.length > 0) {
            setDynamicRoomTypes((prev) => (prev.length > 0 ? prev : json.roomTypes));
          }

          if (Array.isArray(json.allRooms) && json.allRooms.length > 0) {
            setAllApiRooms(json.allRooms);
          }

          if (Array.isArray(json.data)) {
            setApiRooms(json.data);
          } else {
            setApiRooms([]);
          }
        } else {
          setApiRooms([]);
        }
      })
      .catch((err) => {
        console.warn("Could not fetch rooms from API:", err);
        setApiRooms([]);
      })
      .finally(() => setLoading(false));
  }, [selectedLocation, selectedDate, selectedRoomType, selectedTowerFilter]);

  // Combined & Filtered rooms calculation
  const filteredRooms = useMemo(() => {
    const flatDynamicFilters = Object.values(dynamicCategories).flat();
    const allFilters = flatDynamicFilters;
    const activeTowerObj = selectedTowerFilter
      ? allFilters.find((f) => f.id === selectedTowerFilter)
      : null;

    const sourceRooms = apiRooms;

    return sourceRooms.filter((room) => {
      // 1. Building location match
      if (selectedLocation !== "all") {
        const sel = (selectedLocation || "").toLowerCase().trim();
        const bKey = (room.buildingKey || "").toLowerCase().trim();
        const bId = String(room.buildingId || "").toLowerCase().trim();
        const bName = (room.apartmentName || room.buildingName || "").toLowerCase().trim();

        const matchesLoc =
          bKey === sel ||
          bId === sel ||
          bName === sel ||
          (sel === "annex" && bKey.includes("annex")) ||
          (sel.includes("annex") && bKey.includes("annex")) ||
          (sel === "towers" && bKey.includes("tower")) ||
          (sel.includes("tower") && bKey.includes("tower")) ||
          bKey.includes(sel) ||
          sel.includes(bKey);

        if (!matchesLoc) {
          return false;
        }
      }

      // 2. Room capacity / sharing / room_type_id / name match
      if (selectedRoomType !== "all") {
        let targetShares: number | null = null;
        if (/^\d+$/.test(selectedRoomType)) {
          targetShares = parseInt(selectedRoomType, 10);
        } else {
          const m = selectedRoomType.match(/(\d+)\s*(-|share|bed|sharing)?/i);
          if (m) targetShares = parseInt(m[1], 10);
          else if (/single/i.test(selectedRoomType)) targetShares = 1;
        }

        const roomCap =
          room.rooms_capacity ??
          room.capacity ??
          room.totalBeds ??
          (!isNaN(Number(room.roomType)) ? Number(room.roomType) : null);

        const matchesSharing =
          room.roomType === selectedRoomType ||
          String(room.roomTypeId) === selectedRoomType ||
          String(room.rooms_capacity) === selectedRoomType ||
          String(room.capacity) === selectedRoomType ||
          String(room.totalBeds) === selectedRoomType ||
          (targetShares !== null && roomCap === targetShares) ||
          (room.roomTypeSlug && (
            room.roomTypeSlug.toLowerCase() === selectedRoomType.toLowerCase() ||
            room.roomTypeSlug.toLowerCase().includes(selectedRoomType.toLowerCase()) ||
            selectedRoomType.toLowerCase().includes(room.roomTypeSlug.toLowerCase())
          )) ||
          (room.roomTypeName && (
            room.roomTypeName.toLowerCase() === selectedRoomType.toLowerCase() ||
            room.roomTypeName.toLowerCase().includes(selectedRoomType.toLowerCase()) ||
            room.roomTypeName.startsWith(selectedRoomType) ||
            (targetShares !== null && (
              room.roomTypeName.toLowerCase().includes(`${targetShares} share`) ||
              room.roomTypeName.toLowerCase().includes(`${targetShares}-share`) ||
              room.roomTypeName.toLowerCase().includes(`${targetShares} bed`) ||
              room.roomTypeName.toLowerCase().includes(`${targetShares} sharing`)
            ))
          ));
        if (!matchesSharing) {
          return false;
        }
      }

      // 3. Category sidebar filter match
      if (selectedTowerFilter && selectedTowerFilter !== "all") {
        if (room.roomTypeSlug && room.roomTypeSlug === selectedTowerFilter) {
          return true;
        }
        if (room.roomTypeSlug && selectedTowerFilter.includes("-share") && room.roomTypeSlug !== selectedTowerFilter) {
          return false;
        }
      }

      if (activeTowerObj) {
        if (activeTowerObj.building && room.buildingKey !== activeTowerObj.building) {
          return false;
        }
        if (activeTowerObj.id.startsWith("premier-") && room.buildingKey !== "premier") {
          return false;
        }
        if (activeTowerObj.id.startsWith("annex-") && room.buildingKey !== "annex") {
          return false;
        }
        if (
          activeTowerObj.id.startsWith("t1-") &&
          (room.buildingKey.includes("2") || (room.wingInfo && room.wingInfo.includes("Tower 2")))
        ) {
          return false;
        }
        if (
          activeTowerObj.id.startsWith("t2-") &&
          (room.buildingKey.includes("1") || (room.wingInfo && room.wingInfo.includes("Tower 1")))
        ) {
          return false;
        }

        if (activeTowerObj.shares !== undefined && String(activeTowerObj.shares) !== room.roomType) {
          const matchesType = room.roomType === String(activeTowerObj.shares);
          const matchesTitle =
            room.title.toLowerCase().includes(`${activeTowerObj.shares}-share`) ||
            room.title.toLowerCase().includes(`${activeTowerObj.shares}-bed`) ||
            (activeTowerObj.shares === 1 && room.title.toLowerCase().includes("single"));
          if (!matchesType && !matchesTitle) {
            return false;
          }
        }

        if (activeTowerObj.isAc !== undefined) {
          const isRoomAc =
            room.badgeCategory.toLowerCase().includes("ac") &&
            !room.badgeCategory.toLowerCase().includes("non-ac");
          if (activeTowerObj.isAc && !isRoomAc) {
            return false;
          }
          if (!activeTowerObj.isAc && isRoomAc) {
            return false;
          }
        }
      }

      return true;
    });
  }, [apiRooms, selectedLocation, selectedRoomType, selectedTowerFilter, dynamicCategories]);

  // All rooms available in the selected building across all sharing types
  const allBuildingRooms = useMemo(() => {
    const pool = allApiRooms.length > 0 ? allApiRooms : apiRooms;
    return pool.filter((r) => {
      if (selectedLocation !== "all") {
        return r.buildingKey === selectedLocation || String(r.buildingId) === selectedLocation;
      }
      return true;
    });
  }, [allApiRooms, apiRooms, selectedLocation]);

  const handleFilterUpdate = (newLoc: string, newType: string, newDate?: string) => {
    let typeToUse = newType;
    if (newLoc !== selectedLocation && newLoc !== "all") {
      const pool = allApiRooms.length > 0 ? allApiRooms : apiRooms;
      const roomsForNewLoc = pool.filter(
        (r) => r.buildingKey === newLoc || String(r.buildingId) === newLoc
      );
      if (roomsForNewLoc.length > 0 && newType !== "all" && !roomsForNewLoc.some((r) => r.roomType === newType)) {
        typeToUse = "all";
      }
    }

    setSelectedLocation(newLoc);
    setSelectedRoomType(typeToUse);
    const dateToUse = newDate !== undefined ? newDate : selectedDate;
    if (newDate !== undefined) setSelectedDate(dateToUse);

    // If changing building, clear specific category filter from previous building
    let filterToUse = selectedTowerFilter;
    if (newLoc !== "all") {
      const isTower1 = (newLoc.includes("tower-1") || newLoc === "t1") && Boolean(filterToUse?.startsWith("t1-"));
      const isTower2 = (newLoc.includes("tower-2") || newLoc === "t2") && Boolean(filterToUse?.startsWith("t2-"));
      if (filterToUse && !filterToUse.startsWith(newLoc) && !isTower1 && !isTower2) {
        filterToUse = null;
        setSelectedTowerFilter(null);
      }
    }

    const params = new URLSearchParams();
    if (newLoc && newLoc !== "all") params.set("location", newLoc);
    if (dateToUse) params.set("date", dateToUse);
    if (typeToUse && typeToUse !== "all") params.set("roomType", typeToUse);
    if (filterToUse) params.set("filter", filterToUse);

    const qs = params.toString();
    router.replace(`/search${qs ? `?${qs}` : ""}`);
  };

  const handleSelectFilter = (filterId: string | null) => {
    setSelectedTowerFilter(filterId);

    const params = new URLSearchParams();
    if (selectedLocation && selectedLocation !== "all") params.set("location", selectedLocation);
    if (selectedDate) params.set("date", selectedDate);
    if (selectedRoomType && selectedRoomType !== "all") params.set("roomType", selectedRoomType);
    if (filterId) params.set("filter", filterId);

    const qs = params.toString();
    router.replace(`/search${qs ? `?${qs}` : ""}`);
  };

  const getBuildingLabel = (key: string) => {
    const found = dynamicBuildings.find((b) => b.id === key || b.slug === key);
    if (found) {
      return (found.label || found.name || key)
        .replace(/\s*\(?\s*sfsdfsd\s*\)?/gi, "")
        .trim();
    }
    switch (key) {
      case "premier":
        return "Saiyoojyam Premier";
      case "annex":
        return "Saiyoojyam Annex";
      case "towers":
        return "Saiyoojyam Towers 1 & 2";
      default:
        return "All Hostel Buildings";
    }
  };

  return (
    <div className="w-full bg-white min-h-screen pb-20">
      {/* Top Banner Hero Header with Background Image & Center Alignment */}
      <div className="w-full text-white pt-6 sm:pt-10 pb-12 sm:pb-16 px-4 sm:px-16 lg:px-32 relative bg-gray-900">
        {/* Orange Background Fill & Decorative Filled SVG */}
        <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-[#FF561C] via-[#E0450D] to-[#B83200]">
          <svg
            className="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
          >
            <path
              fill="#ffffff"
              fillOpacity="1"
              d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />
            <circle cx="150" cy="80" r="180" fill="#ffffff" fillOpacity="0.08" />
            <circle cx="1300" cy="240" r="220" fill="#ffffff" fillOpacity="0.06" />
          </svg>
        </div>

        {/* Center-Aligned Welcoming Content */}
        <div className="max-w-[900px] mx-auto text-center flex flex-col items-center justify-center gap-2 relative z-10 pb-2 sm:pb-0">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Find a perfect home for YOU
          </h1>
        </div>

        {/* Desktop View (lg+): Full Searchbar Pill */}
        <OverlaySearchFilter
          selectedLocation={selectedLocation}
          selectedDate={selectedDate}
          selectedRoomType={selectedRoomType}
          onFilterChange={(loc, type) => handleFilterUpdate(loc, type)}
          onDateChange={(date) => handleFilterUpdate(selectedLocation, selectedRoomType, date)}
          onSearch={(loc, dt, rt) => handleFilterUpdate(loc, rt, dt)}
          buildings={dynamicBuildings}
          roomTypes={dynamicRoomTypes}
          className="hidden lg:flex"
        />

        {/* Mobile & Tablet View (< lg): Interactive Summary Search Button */}
        <MobileSearchSummaryButton
          location={selectedLocation}
          roomType={selectedRoomType}
          date={selectedDate}
          buildings={dynamicBuildings}
          roomTypes={dynamicRoomTypes}
          onClick={() => setIsSearchDrawerOpen(true)}
          className="lg:hidden px-3 absolute left-0 right-0 -bottom-6 z-20 flex justify-center"
        />
      </div>

      {/* Mobile/Tablet Bottom Sheet Search Drawer */}
      <MobileSearchDrawer
        isOpen={isSearchDrawerOpen}
        onClose={() => setIsSearchDrawerOpen(false)}
        selectedLocation={selectedLocation}
        selectedDate={selectedDate}
        selectedRoomType={selectedRoomType}
        buildings={dynamicBuildings}
        roomTypes={dynamicRoomTypes}
        onApply={(loc, type, date) => handleFilterUpdate(loc, type, date)}
        onFilterChange={(loc, type) => handleFilterUpdate(loc, type)}
        onDateChange={(date) => handleFilterUpdate(selectedLocation, selectedRoomType, date)}
      />

      {/* Main Vertical Listing Section */}
      <div className="max-w-[1440px] bg-white mx-auto px-4 sm:px-6 lg:px-16 pt-9 sm:pt-10">
        {/* Results Heading & Counter */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3 mb-4 sm:mb-6 pb-2 sm:pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg sm:text-2xl font-semibold text-gray-950 font-sans-normal">
              {selectedLocation === "all"
                ? "Available Rooms across All Buildings"
                : `Available Rooms in ${getBuildingLabel(selectedLocation)}`}
            </h2>
            {selectedDate && (
              <span className="text-xs text-gray-500 font-medium">
                Availability calculated for check-in: {selectedDate}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex items-center gap-2 text-[#C44610] text-xs font-semibold shrink-0">
              <span className="w-2 h-2 rounded-full bg-[#FF561C] animate-pulse" />
              <span>{filteredRooms.length} Rooms Available</span>
            </div>

            {/* Mobile & Tab Filter Button */}
            <button
              type="button"
              onClick={() => setIsRoomFilterDrawerOpen(true)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-2 border border-[#FF561C] text-[#FF561C] rounded-full text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer"
              aria-label="Filter Rooms by Category"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#FF561C]" />
              <span>Filters</span>
              {selectedTowerFilter && (
                <span className="w-2 h-2 rounded-full bg-[#FF561C]" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Room Category Filter Drawer */}
        <MobileRoomFilterDrawer
          isOpen={isRoomFilterDrawerOpen}
          onClose={() => setIsRoomFilterDrawerOpen(false)}
          selectedFilterId={selectedTowerFilter}
          onSelectFilter={handleSelectFilter}
          totalRoomsCount={filteredRooms.length}
          activeBuilding={selectedLocation}
          onSelectBuilding={(b) => handleFilterUpdate(b, selectedRoomType)}
          buildings={dynamicBuildings}
          buildingCategories={dynamicCategories}
        />

        {/* 2-Column Split: Left Filter Sidebar + Right Room Cards */}
        <div className="flex flex-col lg:flex-row items-start gap-8">
          {/* Left Column: Room Filter Sidebar */}
          <TowerFilterSidebar
            selectedFilterId={selectedTowerFilter}
            onSelectFilter={handleSelectFilter}
            activeBuilding={selectedLocation}
            onSelectBuilding={(b) => handleFilterUpdate(b, selectedRoomType)}
            buildings={dynamicBuildings}
            buildingCategories={dynamicCategories}
          />

          {/* Right Column: Room Cards */}
          <div className="flex-1 w-full min-w-0">

            {loading ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 flex flex-col items-center justify-center">
                <div className="w-10 h-10 border-3 border-[#FF561C] border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-sm font-medium text-gray-600">
                  Checking real-time room availability...
                </p>
              </div>
            ) : filteredRooms.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 sm:p-12 text-center border border-gray-200 flex flex-col items-center justify-center max-w-lg mx-auto my-12 shadow-xs">
                <div className="w-16 h-16 rounded-2xl bg-orange-50 text-[#FF561C] flex items-center justify-center mb-4">
                  <BedDouble className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {allBuildingRooms.length > 0 && selectedRoomType !== "all"
                    ? `No ${selectedRoomType}-Bed Rooms in ${getBuildingLabel(selectedLocation)}`
                    : "No Matching Rooms Found"}
                </h3>
                <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                  {allBuildingRooms.length > 0 && selectedRoomType !== "all"
                    ? `${getBuildingLabel(selectedLocation)} has ${allBuildingRooms.length} room(s) available in other sharing configurations (${Array.from(new Set(allBuildingRooms.map((r) => r.roomTypeName || `${r.roomType}-Sharing`))).join(", ")}).`
                    : "We couldn't find any available rooms matching your current filter criteria. Try adjusting your building location or room category filter."}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {allBuildingRooms.length > 0 && selectedRoomType !== "all" && (
                    <button
                      onClick={() => handleFilterUpdate(selectedLocation, "all")}
                      className="px-6 py-2.5 bg-[#FF561C] hover:bg-[#e0450d] text-white text-xs font-semibold rounded-full transition-all cursor-pointer shadow-sm"
                    >
                      View All {allBuildingRooms.length} Rooms in {getBuildingLabel(selectedLocation)}
                    </button>
                  )}
                  <button
                    onClick={() => {
                      handleFilterUpdate("all", "all", "");
                      handleSelectFilter(null);
                    }}
                    className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-full transition-all cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Mobile & Tablet View: 2 Cards Per Row Grid */}
                <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5 lg:hidden">
                  {filteredRooms.map((room, idx) => (
                    <div
                      key={`${room.id}-${idx}`}
                      className="border border-gray-200 rounded-xl overflow-hidden bg-white hover:border-gray-300 transition-all flex flex-col"
                    >
                      <RoomCard
                        room={room}
                        renderFeatureIcon={renderFeatureIcon}
                      />
                    </div>
                  ))}
                </div>

                {/* Desktop View: Stacked Vertical Column List of Horizontal Cards separated by lines */}
                <div className="hidden lg:flex flex-col divide-y divide-gray-200 border border-gray-200 rounded-xl overflow-hidden bg-white shadow-xs">
                  {filteredRooms.map((room, idx) => (
                    <RoomCard
                      key={`${room.id}-${idx}`}
                      room={room}
                      renderFeatureIcon={renderFeatureIcon}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Bottom Feature Highlights Section */}
        <BottomFeatureHighlights />
      </div>

      {/* Floating Bottom Tab Bar (Mobile/Tablet only, visible after scroll) */}
      <SearchBottomBar
        onOpenSearch={() => setIsSearchDrawerOpen(true)}
        onOpenFilter={() => setIsRoomFilterDrawerOpen(true)}
        hasActiveFilters={Boolean(
          selectedTowerFilter ||
            selectedLocation !== "all" ||
            selectedRoomType !== "all"
        )}
      />
    </div>
  );
}
