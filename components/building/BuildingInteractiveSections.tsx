"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { BuildingDetailData } from "@/data/buildingsData";
import { RoomItem } from "@/data/roomsData";
import { RoomCard } from "@/components/search/RoomCard";
import { BookingDrawer } from "@/components/building/BookingDrawer";
import { BuildingCtaLocation } from "@/components/building/BuildingCtaLocation";
import { BookmarkCheck, BedDouble } from "lucide-react";
import {
  TOWERS_FILTERS,
  ANNEX_FILTERS,
  PREMIER_FILTERS,
  TowerRoomFilter,
} from "@/components/search/TowerFilterSidebar";

interface BuildingInteractiveSectionsProps {
  building: BuildingDetailData;
  buildingRooms: RoomItem[];
  gallery: React.ReactNode;
  amenitiesAndFeatures?: React.ReactNode;
  amenities?: React.ReactNode;
  features?: React.ReactNode;
}

export function BuildingInteractiveSections({
  building,
  buildingRooms,
  gallery,
  amenitiesAndFeatures,
  amenities,
  features,
}: BuildingInteractiveSectionsProps) {
  const searchParams = useSearchParams();
  const [selectedRoom, setSelectedRoom] = useState<RoomItem | undefined>(undefined);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const roomIdParam = searchParams.get("room") || searchParams.get("roomId");
  const roomTypeParam = searchParams.get("roomType");

  // Fallback room items when buildingRooms from API is empty
  const fallbackRooms = useMemo<RoomItem[]>(() => {
    if (buildingRooms && buildingRooms.length > 0) return [];

    let filters: TowerRoomFilter[] = [];
    const bSlug = (building.slug || "").toLowerCase();
    if (bSlug.includes("tower")) {
      filters = TOWERS_FILTERS;
    } else if (bSlug.includes("annex")) {
      filters = ANNEX_FILTERS;
    } else if (bSlug.includes("premier")) {
      filters = PREMIER_FILTERS;
    }

    const todayStr = new Date().toISOString().split("T")[0];

    return filters.map((f, idx) => {
      const shares = f.shares || 4;
      const isAc = Boolean(f.isAc);
      const rent = f.price
        ? Number(f.price)
        : shares === 1
        ? 8500
        : shares === 2
        ? 7000
        : shares === 3
        ? 6500
        : shares === 4
        ? 6000
        : 5500;

      return {
        id: f.id,
        dbId: idx + 1,
        roomNumber: f.label.replace(/^Tower\s*\d+\s*:\s*/i, ""),
        apartmentName: building.name,
        buildingKey: building.slug,
        buildingId: bSlug.includes("tower") ? 4 : bSlug.includes("premier") ? 3 : 1,
        buildingName: building.name,
        subHeaderLocation: building.tagline || building.address || "Kakkanad, Kochi",
        buildingAddress: building.address,
        address: building.address,
        title: f.label,
        roomType: String(shares),
        roomTypeName: f.label,
        roomTypeSlug: f.id,
        rooms_capacity: shares,
        roomsCapacity: shares,
        capacity: shares,
        badgeCategory: isAc ? "AC Room" : "",
        isAc,
        floorLevel: f.label.startsWith("Tower 1") ? "Tower 1" : f.label.startsWith("Tower 2") ? "Tower 2" : "Level 1",
        availableFromDate: todayStr,
        availableFromDisplay: "Available Now",
        bedsFreeText: `${shares} Beds Free`,
        bedsFreeCount: shares,
        totalBeds: shares,
        occupiedBeds: 0,
        bedLayoutIcons: Array(shares).fill("single"),
        orientation: shares <= 2 ? "East Facing" : "Courtyard View",
        wingInfo: building.name,
        levelTag: f.label.startsWith("Tower 1") ? "Tower 1" : f.label.startsWith("Tower 2") ? "Tower 2" : "Level 1",
        features: [
          { name: isAc ? "Split AC" : "Ceiling Fan & Cross Vent", icon: "Wind" },
          { name: "Attached Bath", icon: "ShowerHead" },
          { name: "Homely Food & Tiffin", icon: "Utensils" },
          { name: "Inverter Wi-Fi", icon: "Wifi" },
        ],
        includesText: "Includes Breakfast, Lunch & Dinner",
        rentMonthly: rent.toLocaleString("en-IN"),
        rentPrice: rent,
        rentPriceRaw: rent,
        totalPrice: rent,
        totalRent: rent,
        rentPriceTotal: rent,
        rentPriceSub: "",
        description: `Comfortable ${shares}-sharing accommodation in ${building.name} with homely meals, attached bathroom, purified drinking water, and high-speed Wi-Fi.`,
        image: building.heroImages?.main || "/buildings/saiyoojyam-towers/s1.png",
        includedServices: [
          "Homely 3 Meals & Tiffin",
          "Daily Housekeeping",
          "High Speed Wi-Fi",
          "24/7 Security & RO Water",
        ],
        whatsapp: building.bookingFormWhatsappNumber || "918129339122",
      };
    });
  }, [building, buildingRooms]);

  const effectiveRooms = buildingRooms && buildingRooms.length > 0 ? buildingRooms : fallbackRooms;

  const findMatchingRoom = (param: string | null): RoomItem | undefined => {
    if (!param) return undefined;
    const clean = param.trim().toLowerCase();
    const cleanNum = clean.replace(/^room[-_]/i, "");
    return effectiveRooms.find(
      (r) =>
        (r.id && r.id.toLowerCase() === clean) ||
        (r.id && r.id.toLowerCase() === `room-${cleanNum}`) ||
        (r.dbId !== undefined && String(r.dbId) === cleanNum) ||
        (r.roomNumber && r.roomNumber.toLowerCase() === clean)
    );
  };

  const findMatchingRoomByType = (typeParam: string | null): RoomItem | undefined => {
    if (!typeParam || typeParam === "all") return undefined;
    const clean = typeParam.trim().toLowerCase();
    return effectiveRooms.find(
      (r) =>
        (r.id && r.id.toLowerCase() === clean) ||
        String(r.roomType).toLowerCase() === clean ||
        String(r.capacity) === clean ||
        (r.roomTypeSlug && r.roomTypeSlug.toLowerCase() === clean) ||
        (r.roomTypeName && r.roomTypeName.toLowerCase().includes(clean))
    );
  };

  const activeRoom: RoomItem | undefined =
    selectedRoom ||
    findMatchingRoom(roomIdParam) ||
    findMatchingRoomByType(roomTypeParam) ||
    effectiveRooms[0];

  // Sync selectedRoom whenever roomIdParam or roomTypeParam changes in the URL
  useEffect(() => {
    if (roomIdParam) {
      const match = findMatchingRoom(roomIdParam);
      if (match) setSelectedRoom(match);
    } else if (roomTypeParam) {
      const match = findMatchingRoomByType(roomTypeParam);
      if (match) setSelectedRoom(match);
    }
  }, [roomIdParam, roomTypeParam, effectiveRooms]);

  // Smooth scroll to #location on mount or URL param change if hash is #location
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#location") {
      const el = document.getElementById("location");
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 120);
      }
    }
  }, [roomIdParam, roomTypeParam]);

  const handleSelectRoom = (room: RoomItem) => {
    setSelectedRoom(room);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("room", room.id);
      window.history.replaceState({}, "", url.toString());
    }
    // On mobile, scroll up to the CTA box so the user can see booking details immediately
    if (window.innerWidth < 1024) {
      const locationSection = document.getElementById("location");
      if (locationSection) {
        locationSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
      {/* Left Column (8 cols): Photo Gallery + Mobile CTA + Amenities + Rooms + Features */}
      <div className="lg:col-span-8 flex flex-col gap-8">
        {/* Photo Gallery slot */}
        {gallery}

        {/* Mobile & Tablet View (< lg): Place CTA Box & Map right below gallery */}
        <div className="lg:hidden">
          <BuildingCtaLocation
            building={building}
            selectedRoom={activeRoom}
            rooms={effectiveRooms}
          />
        </div>

        {/* 1. Key Amenities (#facilities) */}
        {amenities}

        {/* 2. Available Rooms in this Property (#building-rooms) */}
        <div id="building-rooms" className="pt-2 space-y-4 scroll-mt-24">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg sm:text-xl font-bold text-gray-950">
                  Available Rooms in {building.name}
                </h2>
                {effectiveRooms.length > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-[#FF561C]">
                    {effectiveRooms.length} Room{effectiveRooms.length > 1 ? "s" : ""} Available
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-gray-600 font-normal mt-0.5">
                Select any room below to view bed configuration, monthly tariff, and proceed to booking
              </p>
            </div>
          </div>

          {effectiveRooms.length > 0 ? (
            <>
              {/* Mobile & Tablet: 1 column on phones, 2 columns on tablet */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:hidden">
                {effectiveRooms.map((room) => {
                  const isSelected = room.id === activeRoom?.id;
                  return (
                    <div
                      key={room.id}
                      className={`border rounded-xl overflow-hidden bg-white transition-all flex flex-col ${
                        isSelected
                          ? "border-[#FF561C] ring-2 ring-[#FF561C]/25 bg-orange-50/15 shadow-sm"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <RoomCard
                        room={room}
                        showViewDetails={true}
                        isSelected={isSelected}
                        onSelect={handleSelectRoom}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Desktop: Stacked list with divider lines */}
              <div className="hidden lg:flex flex-col divide-y divide-gray-200 border border-gray-200 rounded-xl overflow-hidden bg-white shadow-xs">
                {effectiveRooms.map((room) => {
                  const isSelected = room.id === activeRoom?.id;
                  return (
                    <div
                      key={room.id}
                      className={`transition-colors ${
                        isSelected
                          ? "bg-orange-50/30 border-l-4 border-l-[#FF561C]"
                          : "hover:bg-gray-50/50"
                      }`}
                    >
                      <RoomCard
                        room={room}
                        showViewDetails={true}
                        isSelected={isSelected}
                        onSelect={handleSelectRoom}
                      />
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
              <BedDouble className="w-8 h-8 text-gray-400 mx-auto mb-2 stroke-[1.5]" />
              <h3 className="text-base font-bold text-gray-950">No Rooms Available</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
                There are currently no rooms listed in this property. Enquire via WhatsApp for upcoming vacancies.
              </p>
            </div>
          )}
        </div>

        {/* 3. Detailed Features & Specifications (#rooms) or legacy combined block */}
        {features || amenitiesAndFeatures}
      </div>

      {/* Right Column (4 cols): Sticky CTA Box & Google Map Location on Desktop */}
      <div className="hidden lg:block lg:col-span-4 lg:sticky lg:top-20">
        <BuildingCtaLocation
          building={building}
          selectedRoom={activeRoom}
          rooms={effectiveRooms}
        />
      </div>

      {/* Sticky Bottom Booking Bar (Mobile & Tablet: < lg, Hidden on Desktop) */}
      {Boolean(activeRoom) && (
        <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/95 backdrop-blur-md border-t border-gray-200/90 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] px-3.5 py-2.5 safe-area-inset-bottom">
          <div className="max-w-md mx-auto flex items-center justify-between gap-3">
            {/* Left: Room Number, Sharing & Price */}
            <div className="flex items-center gap-2.5 min-w-0">
              {activeRoom && (
                <div className="w-10 h-9 bg-gray-100 rounded-lg flex items-center justify-center shrink-0 border border-gray-200 px-1">
                  <span className="text-sm font-bold text-[#FF561C] leading-none">
                    {activeRoom.roomNumber}
                  </span>
                </div>
              )}
              <div className="flex flex-col min-w-0">
                <div className="flex items-baseline gap-1 leading-tight">
                  {activeRoom?.rentMonthly ? (
                    <>
                      <span className="text-base sm:text-lg font-bold text-gray-950 font-sans-normal">
                        ₹{activeRoom.rentMonthly}
                      </span>
                      <span className="text-[10px] text-gray-500 font-normal">/ bed</span>
                    </>
                  ) : (
                    <span className="text-sm font-semibold text-gray-950 truncate">
                      {building.name}
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-emerald-700 font-medium truncate leading-none mt-0.5">
                  {activeRoom
                    ? `${activeRoom.roomTypeName || `${activeRoom.roomType}-Sharing`} · Fixed rent`
                    : "Verified Accommodation"}
                </span>
              </div>
            </div>

            {/* Right: Book Now Button with BookmarkCheck Icon */}
            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              className="py-2.5 px-4 bg-[#FF561C] hover:bg-[#e0450d] text-white font-semibold rounded-lg text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all shrink-0 cursor-pointer"
            >
              <BookmarkCheck className="w-4 h-4 text-white" />
              <span>Book Now</span>
            </button>
          </div>
        </div>
      )}

      {/* Mobile/Tablet Booking Drawer Modal */}
      {Boolean(activeRoom) && (
        <BookingDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          building={building}
          room={activeRoom}
        />
      )}
    </div>
  );
}
