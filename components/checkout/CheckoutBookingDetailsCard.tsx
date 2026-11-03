"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { MapPin, AlertCircle, Loader2 } from "lucide-react";
import { BuildingDetailData } from "@/data/buildingsData";
import { RoomItem } from "@/data/roomsData";

interface CheckoutBookingDetailsCardProps {
  building: BuildingDetailData;
  room?: RoomItem;
  checkInParam?: string;
  checkOutParam?: string;
  durationParam: string;
  personsParam: string;
  onChangeSelection?: () => void;
}

export function CheckoutBookingDetailsCard({
  building,
  room,
  checkInParam,
  checkOutParam,
  durationParam,
  personsParam,
  onChangeSelection,
}: CheckoutBookingDetailsCardProps) {
  const router = useRouter();

  // Availability checking state
  const [isChecking, setIsChecking] = useState(false);
  const [availability, setAvailability] = useState<{
    isAvailable: boolean;
    message: string;
    availableBeds?: number;
  } | null>(null);

  const cleanRoomId = useMemo(() => {
    if (!room) return "";
    const raw = (room as any).rooms_id || (room as any).dbId || room.id || "";
    return String(raw).replace(/^room-/, "").trim();
  }, [room]);

  useEffect(() => {
    if (!checkInParam) return;

    let isCancelled = false;
    setIsChecking(true);

    const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost/saiyoojyam";
    const baseUrl = rawApiUrl.replace(/\/+$/, "");

    const params = new URLSearchParams({
      check_in: checkInParam,
      ...(checkOutParam ? { check_out: checkOutParam } : {}),
      duration: durationParam || "Long Term",
      building: building?.slug || "",
      ...(cleanRoomId ? { room_id: cleanRoomId } : {}),
    });

    fetch(`${baseUrl}/api/rooms/check-availability?${params.toString()}`)
      .then((res) => res.json())
      .then((json) => {
        if (isCancelled) return;
        setIsChecking(false);
        if (json) {
          setAvailability({
            isAvailable: !!json.is_available,
            message:
              json.message ||
              (json.is_available
                ? "Room is available"
                : "Room is not available for selected dates"),
            availableBeds: json.available_beds ?? json.total_available_beds,
          });
        }
      })
      .catch(() => {
        if (!isCancelled) setIsChecking(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [checkInParam, checkOutParam, durationParam, building?.slug, cleanRoomId]);

  const handleChange =
    onChangeSelection ||
    (() => {
      if (building.slug) {
        router.push(
          `/building/${building.slug}${room?.id ? `?room=${room.id}` : ""}`
        );
      } else {
        router.back();
      }
    });
  // Helper date formatting function (e.g. "Wed, Oct 14, 2026")
  const formatDateDisplay = (dateString?: string, fallback: string = "Today") => {
    if (!dateString) return fallback;
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return dateString;
      return d.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-xs space-y-3.5">
      <h3 className="text-sm font-semibold text-gray-950">
        Your booking details
      </h3>

      {/* Check-in & Check-out 2-Column Grid */}
      <div className="grid grid-cols-2 gap-3 pb-3 border-b border-gray-200">
        {/* Check-in */}
        <div className="border-r border-gray-200 pr-2">
          <span className="text-xs text-gray-800 font-medium block">Check-in</span>
          <span className="font-semibold text-xs sm:text-sm text-gray-950 block mt-0.5">
            {formatDateDisplay(checkInParam, "Today")}
          </span>
        </div>

        {/* Check-out */}
        <div className="pl-1">
          <span className="text-xs text-gray-800 font-medium block">Check-out</span>
          <span className="font-semibold text-xs sm:text-sm text-gray-950 block mt-0.5">
            {checkOutParam
              ? formatDateDisplay(checkOutParam)
              : durationParam === "Short Term"
                ? "As scheduled"
                : "Monthly renewal"}
          </span>
        </div>
      </div>

      {/* You selected */}
      <div className="space-y-1">
        <span className="text-xs text-gray-800 font-semibold block">You selected</span>
        <p className="font-semibold text-xs sm:text-sm text-gray-950">
          {durationParam === "Short Term"
            ? `${personsParam} person · Short Term Stay`
            : `1 month, 1 room for ${personsParam} adult${personsParam !== "1" ? "s" : ""}`}
        </p>
        <p className="text-xs text-gray-800 font-medium">
          {room ? `1 x Room ${room.roomNumber} (${room.roomTypeName || `${room.roomType}-Sharing`})` : `1 x ${building.name} Bed`}
        </p>
      </div>

      {/* Property Address from saiyoojyam_building */}
      {(building.address || building.building_address || room?.building_address || room?.buildingAddress || room?.address) && (
        <div className="pt-2 border-t border-gray-100 flex items-start gap-1.5 text-xs text-gray-700">
          <MapPin className="w-3.5 h-3.5 text-[#FF561C] shrink-0 mt-0.5" />
          <span className="leading-snug line-clamp-2">
            {building.address || building.building_address || room?.building_address || room?.buildingAddress || room?.address}
          </span>
        </div>
      )}

      {/* Real-time Room Availability Feedback */}
      {isChecking && (
        <div className="pt-2 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-500">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-[#FF561C]" />
          <span>Verifying room availability...</span>
        </div>
      )}

      {!isChecking && availability && !availability.isAvailable && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs space-y-1.5 animate-in fade-in">
          <div className="flex items-center gap-1.5 font-bold text-red-700">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>Room is Not Available</span>
          </div>
          <p className="text-red-700 text-[11px] leading-relaxed">
            {availability.message || "This room is fully booked for your selected dates."}
          </p>
          <div className="pt-0.5">
            <button
              type="button"
              onClick={handleChange}
              className="text-[11px] font-semibold text-red-800 underline hover:text-red-950 cursor-pointer"
            >
              Change dates or select another room &rarr;
            </button>
          </div>
        </div>
      )}

      {/* Change your selection link */}
      <div className="pt-1">
        <button
          type="button"
          onClick={handleChange}
          className="text-xs font-semibold text-[#0057b8] hover:text-[#003b95] underline cursor-pointer"
        >
          Change your selection
        </button>
      </div>
    </div>
  );
}
