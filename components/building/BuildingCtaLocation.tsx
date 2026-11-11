"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Check,
  Utensils,
  BedDouble,
  Tag,
  Snowflake,
  Sparkles,
  Phone,
  BookmarkCheck,
} from "lucide-react";
import { BuildingDetailData } from "@/data/buildingsData";
import { RoomItem } from "@/data/roomsData";
import { BookingDrawer } from "./BookingDrawer";
import { WhatsAppIcon } from "./WhatsAppIcon";

interface BuildingCtaLocationProps {
  building: BuildingDetailData;
  selectedRoom?: RoomItem;
  viewMode?: "booking" | "overview";
  rooms?: RoomItem[];
}

export function BuildingCtaLocation({
  building,
  selectedRoom,
  viewMode,
  rooms,
}: BuildingCtaLocationProps) {
  const searchParams = useSearchParams();
  const roomIdParam = searchParams.get("room") || searchParams.get("roomId");
  const roomTypeParam = searchParams.get("roomType");

  // Find rooms belonging to this building from tariff-added rooms
  const buildingRooms = rooms || [];

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const findMatchingRoom = (param: string | null): RoomItem | undefined => {
    if (!param) return undefined;
    const clean = param.trim().toLowerCase();
    const cleanNum = clean.replace(/^room[-_]/i, "");
    return buildingRooms.find(
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
    return buildingRooms.find(
      (r) =>
        String(r.roomType).toLowerCase() === clean ||
        String(r.capacity) === clean ||
        (r.roomTypeSlug && r.roomTypeSlug.toLowerCase() === clean) ||
        (r.roomTypeName && r.roomTypeName.toLowerCase().includes(clean))
    );
  };

  // Determine active room: explicit prop > roomId query param > roomType query param > first available room in building
  const activeRoom: RoomItem | undefined =
    selectedRoom ||
    findMatchingRoom(roomIdParam) ||
    findMatchingRoomByType(roomTypeParam) ||
    buildingRooms[0];

  const roomCapacity =
    activeRoom?.rooms_capacity ??
    activeRoom?.capacity ??
    activeRoom?.totalBeds ??
    (activeRoom?.roomType && !isNaN(Number(activeRoom.roomType))
      ? Number(activeRoom.roomType)
      : activeRoom?.bedLayoutIcons?.length || null);

  const mapEmbedUrl = building.mapEmbedUrl || "";

  const mapDirectUrl =
    building.mapDirectUrl ||
    (building.address
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          building.name + " " + building.address
        )}`
      : "");

  const cleanActiveRoomTitle = activeRoom
    ? (activeRoom.title || activeRoom.roomTypeName || `${activeRoom.roomType}-Sharing`)
        .replace(/\s*\(?\b(?:non[-\s]*ac)\b\)?\s*/gi, " ")
        .replace(/\s{2,}/g, " ")
        .trim()
    : "";

  // Clean WhatsApp phone number
  const rawWhatsapp = (building.bookingFormWhatsappNumber || "918129339122").replace(/[^0-9]/g, "");
  const cleanWhatsapp =
    rawWhatsapp.startsWith("91") && rawWhatsapp.length === 12
      ? rawWhatsapp
      : rawWhatsapp.length === 10
      ? `91${rawWhatsapp}`
      : rawWhatsapp || "918129339122";

  // Construct Book Now WhatsApp Link
  const whatsappBookingMessage = activeRoom
    ? `Hello Saiyoojyam Management, I would like to book Room ${activeRoom.roomNumber} (${cleanActiveRoomTitle}) at ${building.name}. Please confirm availability and booking procedure.`
    : `Hello Saiyoojyam Management, I would like to enquire about room availability at ${building.name}.`;

  return (
    <div id="location" className="flex flex-col gap-3 scroll-mt-24">
      {/* Top Card: Selected Room & Pricing Details */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col justify-between gap-3 font-sans-normal">
          {activeRoom ? (
            <>
              {/* Header: Room Number Plaque & Category Badge */}
              <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-gray-100">
                {/* Room Number Highlighted Plaque */}
                <div className="flex items-center gap-2">
                  <div className="px-2.5 py-1 bg-gradient-to-r from-orange-50 to-orange-100/70 border border-orange-200 rounded-lg flex items-center gap-1.5">
                    <span className="text-[11px] font-medium uppercase tracking-wider text-orange-700">Room</span>
                    <span className="text-xl sm:text-2xl font-semibold text-[#FF561C] leading-none">
                      {activeRoom.roomNumber}
                    </span>
                  </div>
                  <span className="text-xs text-gray-600 font-medium">
                    {activeRoom.roomTypeName || `${activeRoom.roomType}-Sharing`}
                  </span>
                </div>

                {/* AC Badge: Only shown if AC, Non-AC badge is hidden */}
                {(() => {
                  const isAc = Boolean(
                    activeRoom.isAc ||
                    (activeRoom.badgeCategory &&
                      activeRoom.badgeCategory.toLowerCase().includes("ac") &&
                      !activeRoom.badgeCategory.toLowerCase().includes("non-ac"))
                  );
                  if (!isAc) return null;
                  return (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 bg-blue-50 text-blue-700 border border-blue-200/80">
                      <Snowflake className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>AC Room</span>
                    </span>
                  );
                })()}
              </div>

              {/* Beds Availability & Location Info */}
              <div className="flex flex-col gap-1.5 text-xs text-gray-700 bg-gray-50/70 rounded-lg p-2.5 border border-gray-100">
                <div className="flex items-center justify-between flex-wrap gap-1">
                  <span className="text-gray-500 font-normal">Capacity:</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <div className="flex items-center gap-1">
                      {((activeRoom.bedLayoutIcons && activeRoom.bedLayoutIcons.length > 0)
                        ? activeRoom.bedLayoutIcons
                        : Array.from({ length: Number(roomCapacity || 4) })
                      ).map((_, bIdx) => (
                        <BedDouble
                          key={bIdx}
                          className="w-3.5 h-3.5 text-[#FF561C]"
                        />
                      ))}
                    </div>
                    <span className="font-semibold text-[#C44610] text-xs">
                      {roomCapacity ? `${roomCapacity} Beds` : "4 Beds"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-gray-200/60 text-[11px] text-gray-500">
                  <span className="truncate">{activeRoom.subHeaderLocation}</span>
                  <span className="truncate font-medium text-gray-700">{cleanActiveRoomTitle}</span>
                </div>
              </div>

              {/* Pricing Section: Fixed Rent per Bed */}
              <div className="flex items-baseline justify-between pt-1">
                <div>
                  <span className="text-[11px] text-gray-500 block leading-tight font-normal">Monthly Rent</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-xl sm:text-2xl font-semibold text-gray-950 font-sans-normal">
                      ₹{activeRoom.rentMonthly}
                    </span>
                    <span className="text-xs font-normal text-gray-500"> / bed</span>
                  </div>
                </div>

                <div className="text-right flex flex-col items-end">
                  <span className="text-[11px] text-emerald-700 font-medium">
                    Fixed monthly rate
                  </span>
                  {activeRoom.rentPriceSub && (
                    <span className="text-[12px] text-gray-500 mt-1">
                      {activeRoom.rentPriceSub}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions: Book Now CTA Button */}
              <div className="pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(true)}
                  className="w-full py-2.5 bg-[#FF561C] hover:bg-[#e0450d] text-white font-semibold rounded-lg text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
                >
                  <BookmarkCheck className="w-4 h-4 text-white" />
                  <span>Book Now (Room {activeRoom.roomNumber})</span>
                </button>
              </div>
            </>
          ) : (
            <div className="py-2 text-center flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center text-[#FF561C]">
                <BedDouble className="w-5 h-5 text-[#FF561C]" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-bold text-gray-950">No Rooms Available</h4>
                <p className="text-xs text-gray-500 font-normal leading-relaxed">
                  All rooms in this property are currently occupied for the selected dates. Enquire on WhatsApp for upcoming vacancies or waitlist.
                </p>
              </div>
              <a
                href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
                  `Hello Saiyoojyam Management, are there any rooms available or coming up soon at ${building.name}?`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full mt-1 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold rounded-lg text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
              >
                <WhatsAppIcon className="w-4 h-4 text-white" />
                <span>Enquire via WhatsApp</span>
              </a>
            </div>
          )}
        </div>

      {/* Bottom Card: Google Maps Embed Card (only rendered if mapEmbedUrl is configured) */}
      {mapEmbedUrl ? (
        <div className="relative h-[180px] sm:h-[195px] bg-slate-100 rounded-lg overflow-hidden border border-gray-200 shadow-sm group">
          <iframe
            src={mapEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            title={`${building.name} Location on Google Maps`}
            className="w-full h-full"
          />

          {/* Floating "Show on map" Button with Real Location Pin Icon */}
          {mapDirectUrl ? (
            <a
              href={mapDirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 bg-[#006ce4] hover:bg-[#0057b8] text-white px-4 py-2 rounded-md font-semibold text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5 hover:scale-105 pointer-events-auto cursor-pointer"
            >
              <svg
                className="w-3.5 h-3.5 fill-white shrink-0"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z" />
              </svg>
              <span>Show on map</span>
            </a>
          ) : null}
        </div>
      ) : mapDirectUrl ? (
        <a
          href={mapDirectUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2.5 bg-[#006ce4] hover:bg-[#0057b8] text-white rounded-lg font-semibold text-xs shadow-sm transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <svg
            className="w-3.5 h-3.5 fill-white shrink-0"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z" />
          </svg>
          <span>View on Google Maps</span>
        </a>
      ) : null}

      {/* Booking Drawer Modal */}
      <BookingDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        building={building}
        room={activeRoom}
      />
    </div>
  );
}
