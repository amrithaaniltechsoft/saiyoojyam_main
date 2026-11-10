import Link from "next/link";
import { RoomItem } from "@/data/roomsData";
import { BedDouble, ArrowRight, Check } from "lucide-react";

interface RoomCardProps {
  room: RoomItem;
  renderFeatureIcon?: (iconName: string, className?: string) => React.ReactNode;
  onSelect?: (room: RoomItem) => void;
  showViewDetails?: boolean;
  isSelected?: boolean;
}

export function RoomCard({
  room,
  onSelect,
  showViewDetails = true,
  isSelected = false,
}: RoomCardProps) {
  const hrefDateParam = room.availableFromDate
    ? `&date=${encodeURIComponent(room.availableFromDate)}&checkIn=${encodeURIComponent(room.availableFromDate)}`
    : "";
  const href = `/building/${room.buildingKey}?room=${room.id}${hrefDateParam}`;

  // Dynamic room type label from saiyoojyam_room_type (room_type_name)
  // and room capacity from saiyoojyam_rooms (rooms_capacity)
  const roomTypeName = (room.roomTypeName || "").trim();
  const capacity =
    room.rooms_capacity ??
    room.capacity ??
    room.totalBeds ??
    (room.roomType && !isNaN(Number(room.roomType)) ? Number(room.roomType) : null);

  let displayRoomType = "";
  if (roomTypeName) {
    const hasCapacityMention = /capacity/i.test(roomTypeName);
    if (!hasCapacityMention && capacity) {
      displayRoomType = `${roomTypeName} (Capacity: ${capacity})`;
    } else {
      displayRoomType = roomTypeName;
    }
  } else if (room.roomType) {
    displayRoomType = capacity
      ? `${room.roomType}-Sharing (Capacity: ${capacity})`
      : `${room.roomType}-Sharing`;
  } else {
    displayRoomType = capacity ? `Room (Capacity: ${capacity})` : "Standard Room";
  }

  const content = (
    <div className="relative h-full bg-white hover:bg-gray-50/70 transition-all flex flex-col lg:flex-row items-stretch lg:items-center justify-between p-3 sm:p-3.5 lg:py-2.5 lg:px-4 gap-2.5 sm:gap-3 lg:gap-4 font-sans-normal">
      {/* Top on Mobile/Tab, Left on Desktop: Room Number, Bed Icons & Count */}
      <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1 pt-2 lg:pt-0">
        {/* Room Number Plaque */}
        <div className="min-w-[3.5rem] sm:min-w-[4rem] lg:min-w-[4.5rem] px-2 sm:px-2.5 h-9 sm:h-10 lg:h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0 border border-gray-200/80">
          <span className="text-sm sm:text-base lg:text-base font-semibold text-[#FF561C] leading-none whitespace-nowrap">
            {room.roomNumber}
          </span>
        </div>

        {/* Beds Info & Layout */}
        <div className="flex flex-col justify-center min-w-0 flex-1">
          <div className="flex items-center gap-3 sm:gap-4 text-[11px] sm:text-xs lg:text-sm font-semibold text-gray-900 leading-tight min-w-0">
            <div className="flex items-center gap-1 sm:gap-1.5 min-w-0 max-w-[15rem] shrink">
              <BedDouble className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-700 shrink-0" />
              <span className="truncate">{displayRoomType}</span>
            </div>
            {room.apartmentName && (
              <span className="text-[10px] sm:text-xs text-gray-500 font-medium truncate block max-w-full">
                {room.apartmentName}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 sm:gap-1.5 leading-none mt-1.5 flex-wrap">
            <div className="flex items-center gap-0.5 sm:gap-1">
              {((room.bedLayoutIcons && room.bedLayoutIcons.length > 0)
                ? room.bedLayoutIcons
                : Array.from({ length: Number(capacity || 1) })
              ).map((_, bIdx) => {
                const isBedFree = bIdx < (room.bedsFreeCount ?? 0);
                return (
                  <BedDouble
                    key={bIdx}
                    className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-colors ${
                      isBedFree
                        ? room.isUpcomingVacancy
                          ? "text-amber-500"
                          : "text-[#FF561C]"
                        : "text-gray-400"
                    }`}
                  />
                );
              })}
            </div>

            {/* Availability status badge: Only show for upcoming vacancy */}
            {room.isUpcomingVacancy && (
              <span className="ml-1 sm:ml-2 inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                {room.availableFromDisplay || "Available Soon"}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Rent & View CTA */}
      <div className="flex items-center justify-between lg:justify-end gap-2 sm:gap-3 lg:gap-3 shrink-0 pt-1 lg:pt-0 border-t border-gray-100 lg:border-t-0 mt-auto lg:mt-0">
        <div className="text-left lg:text-right shrink-0">
          <div className="text-sm sm:text-base lg:text-base font-semibold text-gray-950 font-sans-normal leading-tight whitespace-nowrap">
            ₹{room.rentMonthly}
            <span className="text-[10px] sm:text-xs font-normal text-gray-500"> / bed</span>
          </div>
          <div className="text-[9px] sm:text-[10px] text-emerald-700 font-medium leading-none whitespace-nowrap">
            Fixed monthly rent
          </div>
        </div>

        {/* Mobile & Tablet View Button: Simple text with underline or selected badge */}
        {showViewDetails && (
          <div className="flex lg:hidden items-center shrink-0">
            {isSelected ? (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 whitespace-nowrap">
                <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                <span>Selected</span>
              </span>
            ) : (
              <span className="text-xs font-semibold text-[#FF561C] underline underline-offset-2 decoration-[#FF561C]/80 hover:text-[#e0450d] transition-colors whitespace-nowrap">
                Select
              </span>
            )}
          </div>
        )}

        {/* View Details CTA: Shown on desktop */}
        {showViewDetails && (
          <div className="hidden lg:flex items-center shrink-0">
            {isSelected ? (
              <span className="py-1.5 px-3.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 shrink-0 whitespace-nowrap">
                <Check className="w-3.5 h-3.5 text-white stroke-[2.5]" />
                <span>Selected</span>
              </span>
            ) : onSelect ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(room);
                }}
                className="py-1.5 px-3.5 rounded-lg bg-[#FF561C] hover:bg-[#e0450d] text-white text-xs font-semibold hover:shadow transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 group shrink-0 whitespace-nowrap"
              >
                <span>Select Room</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform shrink-0" />
              </button>
            ) : (
              <span className="py-1.5 px-3.5 rounded-lg bg-[#FF561C] hover:bg-[#e0450d] text-white text-xs font-semibold hover:shadow transition-all flex items-center gap-1.5 group shrink-0 whitespace-nowrap">
                <span>View Details</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform shrink-0" />
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );

  if (onSelect) {
    return (
      <div
        onClick={() => onSelect(room)}
        className="cursor-pointer block h-full select-none"
      >
        {content}
      </div>
    );
  }

  return (
    <Link href={href} className="cursor-pointer block h-full select-none">
      {content}
    </Link>
  );
}

