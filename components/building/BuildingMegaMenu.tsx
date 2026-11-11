"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { BedDouble, Sparkles, ChevronRight, Check } from "lucide-react";
import { RoomItem } from "@/data/roomsData";
import {
  PREMIER_FILTERS,
  ANNEX_FILTERS,
  TOWERS_FILTERS,
  TowerRoomFilter,
} from "@/components/search/TowerFilterSidebar";

interface BuildingMegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  currentBuildingSlug?: string;
  buildingName?: string;
  rooms?: RoomItem[];
}

function getFallbackBuildingName(slug: string): string {
  const s = (slug || "").toLowerCase().trim();
  if (s === "premier") return "Saiyoojyam Premier";
  if (s === "annex") return "Saiyoojyam Annex";
  if (s.startsWith("annex")) return `Saiyoojyam Annex ${s.replace("annex", "").trim()}`.trim();
  if (s.includes("tower")) return "Saiyoojyam Towers";
  return s
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function BuildingMegaMenu({
  isOpen,
  onClose,
  onMouseEnter,
  onMouseLeave,
  currentBuildingSlug = "premier",
  buildingName,
  rooms = [],
}: BuildingMegaMenuProps) {
  const router = useRouter();

  const [internalRooms, setInternalRooms] = useState<RoomItem[]>(rooms || []);
  const [buildingCategories, setBuildingCategories] = useState<TowerRoomFilter[]>([]);
  const [fetchedBuildingName, setFetchedBuildingName] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Sync internal rooms whenever props change
  useEffect(() => {
    if (rooms && rooms.length > 0) {
      setInternalRooms(rooms);
    }
  }, [rooms]);

  // Fetch dynamic room data & categories from API
  useEffect(() => {
    if (!isOpen) return;

    const rawApiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost/saiyoojyam";
    const baseUrl = rawApiUrl.replace(/\/+$/, "");

    let isMounted = true;
    if (internalRooms.length === 0) {
      setIsLoading(true);
    }

    fetch(
      `${baseUrl}/api/rooms?location=${encodeURIComponent(currentBuildingSlug)}`,
      { cache: "no-store" }
    )
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (!isMounted || !json) return;
        if (json.status) {
          if (Array.isArray(json.data) && json.data.length > 0) {
            setInternalRooms(json.data);
          }
          if (
            json.buildingCategories &&
            json.buildingCategories[currentBuildingSlug]
          ) {
            setBuildingCategories(json.buildingCategories[currentBuildingSlug]);
          }
          if (Array.isArray(json.buildings)) {
            const found = json.buildings.find(
              (b: any) =>
                (b.slug || "").toLowerCase() === currentBuildingSlug.toLowerCase()
            );
            if (found && found.name) {
              setFetchedBuildingName(found.name);
            }
          }
        }
      })
      .catch((err) => {
        console.warn("Could not fetch dynamic rooms for mega menu:", err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, currentBuildingSlug]);

  // Derive unique categories from rooms if available
  const availableCategories = useMemo(() => {
    if (!internalRooms || internalRooms.length === 0) return [];
    const map = new Map<string, { id: string; label: string; count: number }>();

    for (const r of internalRooms) {
      const key = (
        r.roomTypeSlug ||
        r.roomTypeName ||
        r.roomType ||
        "standard"
      )
        .toLowerCase()
        .trim();
      const label = (r.roomTypeName || `${r.roomType}-Sharing`).trim();
      if (!map.has(key)) {
        map.set(key, { id: key, label, count: 1 });
      } else {
        map.get(key)!.count += 1;
      }
    }
    return Array.from(map.values());
  }, [internalRooms]);

  // Filtered rooms to display
  const displayedRooms = useMemo(() => {
    if (selectedCategory === "all") return internalRooms;
    return internalRooms.filter((r) => {
      const key = (
        r.roomTypeSlug ||
        r.roomTypeName ||
        r.roomType ||
        ""
      )
        .toLowerCase()
        .trim();
      return (
        key === selectedCategory ||
        key.includes(selectedCategory) ||
        selectedCategory.includes(key)
      );
    });
  }, [internalRooms, selectedCategory]);

  if (!isOpen) return null;

  // Determine display building title
  const displayBuildingTitle =
    buildingName ||
    fetchedBuildingName ||
    getFallbackBuildingName(currentBuildingSlug);

  // Handle clicking a specific room
  const handleRoomClick = (room: RoomItem) => {
    onClose();
    const targetUrl = `/building/${currentBuildingSlug}?room=${encodeURIComponent(
      room.id
    )}#location`;

    router.push(targetUrl);

    if (typeof window !== "undefined") {
      setTimeout(() => {
        const targetElement =
          document.getElementById("location") ||
          document.getElementById("building-rooms");
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  };

  // Handle clicking a room category/filter (fallback)
  const handleCategoryClick = (item: TowerRoomFilter) => {
    onClose();
    const filterVal = item.shares ? String(item.shares) : item.id;
    const targetUrl = `/building/${currentBuildingSlug}?roomType=${encodeURIComponent(
      filterVal
    )}#location`;

    router.push(targetUrl);

    if (typeof window !== "undefined") {
      setTimeout(() => {
        const targetElement =
          document.getElementById("location") ||
          document.getElementById("building-rooms");
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  };

  // Fallback categories if no rooms are defined
  let fallbackFilters: TowerRoomFilter[] = [];
  if (buildingCategories && buildingCategories.length > 0) {
    fallbackFilters = buildingCategories;
  } else if (currentBuildingSlug === "premier") {
    fallbackFilters = PREMIER_FILTERS;
  } else if (currentBuildingSlug.includes("annex")) {
    fallbackFilters = ANNEX_FILTERS;
  } else if (currentBuildingSlug.includes("tower")) {
    fallbackFilters = TOWERS_FILTERS;
  }

  const hasRooms = displayedRooms.length > 0;
  const isWide = displayedRooms.length > 4 || fallbackFilters.length > 8;

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`absolute top-full right-0 sm:left-1/2 sm:-translate-x-1/2 mt-2 ${
        isWide
          ? "w-[94vw] sm:w-[560px] md:w-[620px] max-w-[620px]"
          : "w-[320px] sm:w-[380px] max-w-[calc(100vw-24px)]"
      } bg-white border border-gray-200/90 rounded-2xl shadow-2xl p-4 sm:p-5 z-50 animate-in fade-in zoom-in-95 duration-150 text-gray-900 font-sans-normal pointer-events-auto before:absolute before:-top-3 before:left-0 before:right-0 before:h-3 before:content-['']`}
    >
      <div className="flex flex-col">
        {/* Header / View all link */}
        <div className="pb-2.5 mb-3 border-b border-gray-100 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <h4 className="text-sm sm:text-base font-bold text-gray-950 truncate">
              {displayBuildingTitle} Rooms
            </h4>
            <p className="text-[11px] text-gray-500 font-normal">
              {internalRooms.length > 0
                ? `${internalRooms.length} room${
                    internalRooms.length > 1 ? "s" : ""
                  } available`
                : "Explore room options"}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              onClose();
              router.push(`/search?location=${encodeURIComponent(currentBuildingSlug)}`);
            }}
            className="text-xs text-[#FF561C] font-semibold hover:underline shrink-0 flex items-center gap-0.5 cursor-pointer"
          >
            <span>View all</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#FF561C]" />
          </button>
        </div>

        {/* Optional Category Filter Pills (if multiple categories exist) */}
        {availableCategories.length > 1 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-2.5 no-scrollbar shrink-0">
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all shrink-0 cursor-pointer ${
                selectedCategory === "all"
                  ? "bg-[#FF561C] text-white shadow-xs"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200/70"
              }`}
            >
              All ({internalRooms.length})
            </button>
            {availableCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all shrink-0 cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-[#FF561C] text-white shadow-xs"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200/70"
                }`}
              >
                {cat.label} ({cat.count})
              </button>
            ))}
          </div>
        )}

        {/* Body: Dynamic Rooms List */}
        {isLoading && internalRooms.length === 0 ? (
          <div className="py-6 space-y-2.5 animate-pulse">
            <div className="h-14 bg-gray-100 rounded-xl" />
            <div className="h-14 bg-gray-100 rounded-xl" />
          </div>
        ) : hasRooms ? (
          <div
            className={`${
              isWide
                ? "grid grid-cols-1 sm:grid-cols-2 gap-2"
                : "flex flex-col gap-2"
            } max-h-[360px] overflow-y-auto pr-1 select-none`}
          >
            {displayedRooms.map((room) => {
              const displayRent = room.rentMonthly || (room.rentPriceRaw ? String(room.rentPriceRaw) : "");
              const bedFreeCount =
                room.bedsFreeCount !== undefined
                  ? room.bedsFreeCount
                  : room.totalBeds;

              return (
                <button
                  key={room.id}
                  type="button"
                  onClick={() => handleRoomClick(room)}
                  className="w-full text-left p-2.5 rounded-xl border border-gray-150 hover:border-[#FF561C]/50 hover:bg-orange-50/50 transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-orange-100/80 text-[#FF561C] flex items-center justify-center shrink-0 group-hover:bg-[#FF561C] group-hover:text-white transition-colors">
                      <BedDouble className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-semibold text-xs sm:text-[13px] text-gray-900 group-hover:text-[#FF561C] transition-colors truncate">
                          {room.roomNumber
                            ? `Room ${room.roomNumber}`
                            : room.title}
                        </span>
                        {room.isAc ? (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 bg-blue-50 text-blue-600 rounded">
                            AC
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium px-1.5 py-0.2 bg-gray-100 text-gray-600 rounded">
                            Non-AC
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-500 truncate mt-0.5">
                        {room.roomTypeName || `${room.roomType}-Sharing`}
                        {bedFreeCount !== undefined && bedFreeCount > 0 ? (
                          <span className="text-emerald-600 font-medium ml-1.5">
                            • {room.bedsFreeText || `${bedFreeCount} beds free`}
                          </span>
                        ) : (
                          <span className="text-amber-600 font-medium ml-1.5">
                            • Check availability
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0 ml-2">
                    <span className="text-xs sm:text-sm font-bold text-[#FF561C]">
                      {displayRent ? `₹${displayRent}` : "—"}
                    </span>
                    <span className="text-[10px] text-gray-400 block -mt-0.5">
                      /month
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        ) : fallbackFilters.length > 0 ? (
          /* Fallback: Dynamic Room Categories / Types */
          <div
            className={`${
              isWide
                ? "grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2"
                : "flex flex-col gap-2"
            } text-xs sm:text-[13px] text-gray-700 max-h-[360px] overflow-y-auto pr-1`}
          >
            {fallbackFilters.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleCategoryClick(item)}
                className="flex items-center justify-between gap-2 hover:text-[#FF561C] hover:bg-orange-50/50 p-1.5 rounded-lg transition-colors text-left cursor-pointer group"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-1.5 h-1.5 rounded-full border border-gray-400 group-hover:border-[#FF561C] group-hover:bg-[#FF561C] shrink-0" />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.isAc && (
                  <span className="text-[10px] font-bold px-1.5 py-0.2 bg-blue-50 text-blue-600 rounded shrink-0">
                    AC
                  </span>
                )}
              </button>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="py-6 text-center text-xs text-gray-500">
            <BedDouble className="w-8 h-8 text-gray-300 mx-auto mb-2 stroke-[1.5]" />
            <p className="font-semibold text-gray-800">No rooms listed yet</p>
            <p className="text-[11px] text-gray-400 mt-0.5">
              There are currently no rooms listed in this property.
            </p>
            <button
              type="button"
              onClick={() => {
                onClose();
                router.push("/search");
              }}
              className="mt-3 inline-flex items-center gap-1 px-3 py-1.5 bg-[#FF561C] text-white text-xs font-semibold rounded-lg hover:bg-[#e04814] transition-colors cursor-pointer"
            >
              <span>Explore All Properties</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
