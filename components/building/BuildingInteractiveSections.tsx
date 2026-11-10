"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { BuildingDetailData } from "@/data/buildingsData";
import { RoomItem } from "@/data/roomsData";
import { RoomCard } from "@/components/search/RoomCard";
import { BookingDrawer } from "@/components/building/BookingDrawer";
import { BuildingCtaLocation } from "@/components/building/BuildingCtaLocation";
import { BookmarkCheck } from "lucide-react";

interface BuildingInteractiveSectionsProps {
  building: BuildingDetailData;
  buildingRooms: RoomItem[];
  gallery: React.ReactNode;
  amenitiesAndFeatures: React.ReactNode;
}

export function BuildingInteractiveSections({
  building,
  buildingRooms,
  gallery,
  amenitiesAndFeatures,
}: BuildingInteractiveSectionsProps) {
  const searchParams = useSearchParams();
  const [selectedRoom, setSelectedRoom] = useState<RoomItem | undefined>(undefined);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const roomIdParam = searchParams.get("room") || searchParams.get("roomId");
  const roomTypeParam = searchParams.get("roomType");
  const isFromRoomLink = Boolean(roomIdParam);

  const activeRoom: RoomItem | undefined =
    selectedRoom ||
    (roomIdParam ? buildingRooms.find((r) => r.id === roomIdParam) : undefined) ||
    (roomTypeParam && roomTypeParam !== "all"
      ? buildingRooms.find((r) => r.roomType === roomTypeParam)
      : undefined) ||
    buildingRooms[0];

  // Sync selectedRoom whenever roomIdParam changes in the URL (e.g. via Rooms dropdown)
  useEffect(() => {
    if (roomIdParam) {
      const match = buildingRooms.find((r) => r.id === roomIdParam);
      if (match) setSelectedRoom(match);
    }
  }, [roomIdParam, buildingRooms]);

  // Exclude the currently selected room so it is not duplicated in the list below
  const otherRooms = useMemo(() => {
    if (!activeRoom) return buildingRooms;
    return buildingRooms.filter((r) => r.id !== activeRoom.id);
  }, [buildingRooms, activeRoom]);

  const handleSelectRoom = (room: RoomItem) => {
    setSelectedRoom(room);
    const locationSection = document.getElementById("location");
    if (locationSection) {
      locationSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
      {/* Left Column (8 cols): Photo Gallery + Mobile CTA + Amenities + Features + Rooms */}
      <div className="lg:col-span-8 flex flex-col gap-8">
        {/* Photo Gallery slot */}
        {gallery}

        {/* Mobile & Tablet View (< lg): Place CTA Box & Map right below gallery */}
        <div className="lg:hidden">
          <BuildingCtaLocation
            building={building}
            selectedRoom={activeRoom}
            rooms={buildingRooms}
          />
        </div>

        {/* Amenities & Features slot (Server components) */}
        {amenitiesAndFeatures}

        {/* Available Other Room Types & Sharing Options */}
        {otherRooms.length > 0 && (
          <div id="building-rooms" className="pt-6 space-y-4 scroll-mt-24">
            <div>
              <h2 className="text-lg sm:text-xl font-medium text-gray-950">
                {activeRoom ? `Other Rooms in ${building.name}` : `Rooms in ${building.name}`}
              </h2>
              <p className="text-xs sm:text-sm text-gray-700 font-normal mt-0.5">
                Explore alternative configurations and bed setups for this property
              </p>
            </div>

            {/* Mobile & Tablet: 2-column grid */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5 lg:hidden">
              {otherRooms.map((room) => (
                <div
                  key={room.id}
                  className="border border-gray-200 rounded-xl overflow-hidden bg-white hover:border-gray-300 transition-all flex flex-col"
                >
                  <RoomCard
                    room={room}
                    showViewDetails={true}
                    onSelect={handleSelectRoom}
                  />
                </div>
              ))}
            </div>

            {/* Desktop: Stacked list with divider lines */}
            <div className="hidden lg:flex flex-col divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden bg-white">
              {otherRooms.map((room) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  showViewDetails={true}
                  onSelect={handleSelectRoom}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Column (4 cols): Sticky CTA Box & Google Map Location on Desktop */}
      <div className="hidden lg:block lg:col-span-4 lg:sticky lg:top-20">
        <BuildingCtaLocation
          building={building}
          selectedRoom={activeRoom}
          rooms={buildingRooms}
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
