"use client";

import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { useRouter, useSearchParams } from "next/navigation";
import {
  X,
  Building as BuildingIcon,
  BedDouble,
  Tag,
  ShieldCheck,
  ChevronDown,
  ArrowRight,
  Heart,
  AlertCircle,
  Loader2,
  Snowflake,
  CheckCircle2,
} from "lucide-react";
import { BuildingDetailData } from "@/data/buildingsData";
import { RoomItem } from "@/data/roomsData";
import { FancyDatePicker } from "@/components/ui/FancyDatePicker";

interface BookingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  building: BuildingDetailData;
  room?: RoomItem;
  buildings?: any[];
}

export function BookingDrawer({
  isOpen,
  onClose,
  building,
  room,
  buildings,
}: BookingDrawerProps) {
  const [selectedBuildingSlug, setSelectedBuildingSlug] = useState<string>(
    (building.slug || "premier").toLowerCase().trim()
  );
  const numPersons = "1";
  const [duration, setDuration] = useState<"Long Term" | "Short Term" | "">("");
  const [checkInDate, setCheckInDate] = useState<string>("");
  const [checkOutDate, setCheckOutDate] = useState<string>("");
  const [isMounted, setIsMounted] = useState(false);
  const [fetchedBuildings, setFetchedBuildings] = useState<any[]>([]);

  // Room Availability Checking States
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [availabilityResult, setAvailabilityResult] = useState<{
    isAvailable: boolean;
    message: string;
    availableBeds?: number;
    statusLabel?: string;
  } | null>(null);

  const cleanRoomId = useMemo(() => {
    if (!room) return "";
    const raw = (room as any).rooms_id || (room as any).dbId || room.id || "";
    return String(raw).replace(/^room-/, "").trim();
  }, [room]);

  // Minimum check-out date is the day after check-in date
  const minCheckOutDate = useMemo(() => {
    if (!checkInDate) return new Date().toISOString().split("T")[0];
    const parts = checkInDate.split("-").map(Number);
    if (parts.length === 3) {
      const d = new Date(parts[0], parts[1] - 1, parts[2] + 1);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    }
    return checkInDate;
  }, [checkInDate]);

  // Check real-time room availability ONLY after BOTH date AND duration of stay are selected
  useEffect(() => {
    // If either check-in date or duration is not selected, do not perform availability check
    if (!checkInDate || !duration) {
      setAvailabilityResult(null);
      setIsCheckingAvailability(false);
      return;
    }

    // For Short Term stays, check-out date is also required
    if (duration === "Short Term" && !checkOutDate) {
      setAvailabilityResult(null);
      setIsCheckingAvailability(false);
      return;
    }

    let isCancelled = false;
    setIsCheckingAvailability(true);

    const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost/saiyoojyam";
    const baseUrl = rawApiUrl.replace(/\/+$/, "");

    const params = new URLSearchParams({
      check_in: checkInDate,
      ...(checkOutDate ? { check_out: checkOutDate } : {}),
      duration: duration,
      building: selectedBuildingSlug,
      ...(cleanRoomId ? { room_id: cleanRoomId } : {}),
    });

    const timer = setTimeout(() => {
      fetch(`${baseUrl}/api/rooms/check-availability?${params.toString()}`)
        .then((res) => res.json())
        .then((json) => {
          if (isCancelled) return;
          setIsCheckingAvailability(false);
          if (json) {
            setAvailabilityResult({
              isAvailable: !!json.is_available,
              message:
                json.message ||
                (json.is_available
                  ? "Room is available"
                  : "Room is not available for selected dates"),
              availableBeds: json.available_beds ?? json.total_available_beds,
              statusLabel: json.status_label,
            });
          }
        })
        .catch(() => {
          if (!isCancelled) setIsCheckingAvailability(false);
        });
    }, 250);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [checkInDate, checkOutDate, duration, selectedBuildingSlug, cleanRoomId]);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (isOpen) {
      const urlDate = searchParams?.get("checkIn") || searchParams?.get("date");
      const roomAvailDate = (room as any)?.availableFromDate;
      const targetDate = urlDate || roomAvailDate || "";
      if (targetDate && !checkInDate) {
        setCheckInDate(targetDate);
      }
      const urlDuration = searchParams?.get("duration");
      if ((urlDuration === "Long Term" || urlDuration === "Short Term") && !duration) {
        setDuration(urlDuration);
      }
    }
  }, [isOpen, room, searchParams, checkInDate, duration]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch dynamic buildings from API if not passed via props
  useEffect(() => {
    if (buildings && buildings.length > 0) return;
    const rawApiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost/saiyoojyam";
    const baseUrl = rawApiUrl.replace(/\/+$/, "");

    fetch(`${baseUrl}/api/building`, { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json && json.status && Array.isArray(json.data) && json.data.length > 0) {
          setFetchedBuildings(json.data);
        }
      })
      .catch(() => {});
  }, [buildings]);

  // Sync selected building when prop changes
  useEffect(() => {
    if (building?.slug) {
      setSelectedBuildingSlug(building.slug.toLowerCase().trim());
    }
  }, [building?.slug]);

  // Lock background scroll when drawer is open
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

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Build dynamic building options list
  const buildingOptions = useMemo(() => {
    const raw =
      buildings && buildings.length > 0
        ? buildings
        : fetchedBuildings && fetchedBuildings.length > 0
        ? fetchedBuildings
        : [];

    const seen = new Set<string>();
    const result: { slug: string; label: string }[] = [];

    // Ensure currently viewed building is present
    if (building?.slug) {
      const bSlug = (building.slug || "").toString().toLowerCase().trim();
      const bName = (building.name || `Saiyoojyam ${bSlug}`)
        .replace(/\s*\(?\s*sfsdfsd\s*\)?/gi, "")
        .trim();
      result.push({ slug: bSlug, label: bName });
      seen.add(bSlug);
    }

    for (const b of raw as any[]) {
      if (!b) continue;
      const slug = (b.slug || b.id || "").toString().toLowerCase().trim();
      if (!slug || seen.has(slug) || slug === "all") continue;
      seen.add(slug);
      const cleanName = (b.name || b.label || "Building")
        .replace(/\s*\(?\s*sfsdfsd\s*\)?/gi, "")
        .trim();
      result.push({ slug, label: cleanName });
    }

    return result.length > 0 ? result : (building.slug ? [{ slug: building.slug, label: building.name || building.slug }] : []);
  }, [buildings, fetchedBuildings, building]);

  if (!isOpen) return null;

  const currentBuilding =
    (fetchedBuildings.find((b) => (b.slug || "").toLowerCase() === selectedBuildingSlug)) ||
    (building.slug?.toLowerCase() === selectedBuildingSlug ? building : null) ||
    building;

  const handleBuildingChange = (newSlug: string) => {
    const cleanNew = newSlug.toLowerCase().trim();
    const currentClean = (building?.slug || "").toLowerCase().trim();

    setSelectedBuildingSlug(cleanNew);

    // If another building is selected, close the drawer and redirect to that building's room list page
    if (cleanNew && cleanNew !== currentClean) {
      onClose();
      router.push(`/search?location=${cleanNew}`);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!duration) {
      alert("Please select duration of stay.");
      return;
    }

    if (!checkInDate) {
      alert("Please select a check-in date.");
      return;
    }

    if (duration === "Short Term" && !checkOutDate) {
      alert("Please select a check-out date.");
      return;
    }

    if (
      duration === "Short Term" &&
      checkOutDate &&
      checkInDate &&
      checkOutDate <= checkInDate
    ) {
      alert("Check-out date must be after check-in date.");
      return;
    }

    if (availabilityResult && !availabilityResult.isAvailable) {
      alert(
        availabilityResult.message ||
          "This room is not available for the selected dates. Please choose different dates or select another room."
      );
      return;
    }

    const queryParams = new URLSearchParams({
      building: selectedBuildingSlug,
      ...(room ? { roomId: room.id } : {}),
      persons: numPersons || "1",
      duration: duration || "Long Term",
      ...(checkInDate ? { checkIn: checkInDate } : {}),
      ...(duration === "Short Term" && checkOutDate ? { checkOut: checkOutDate } : {}),
    });

    onClose();
    router.push(`/checkout?${queryParams.toString()}`);
  };

  const drawerContent = (
    <div className="fixed inset-0 z-[100] overflow-hidden font-sans-normal">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full transform transition ease-in-out duration-300">
          {/* Header */}
          <div className="px-6 py-5 bg-white border-b border-gray-100 flex items-center justify-between sticky top-0 z-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#FF561C] tracking-tight">
                Book Now
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Close booking drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
            {/* Room Details Card (if a room is active) */}
            {room ? (
              <div className="border border-gray-200 rounded-xl p-3.5 space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#FF561C] bg-[#FF561C]/10 px-2 py-0.5 rounded">
                      <BedDouble className="w-3 h-3 text-[#FF561C]" />
                      <span>
                        {room.capacity
                          ? `Capacity: ${room.capacity} Beds`
                          : room.rooms_capacity
                          ? `Capacity: ${room.rooms_capacity} Beds`
                          : room.bedsFreeText || "Available"}
                      </span>
                    </span>
                    <h3 className="text-sm font-semibold text-gray-900 mt-1">
                      Room {room.roomNumber} ·{" "}
                      {(room.title || room.roomTypeName || `${room.roomType}-Sharing`)
                        .replace(/\s*\(?\b(?:non[-\s]*ac)\b\)?\s*/gi, " ")
                        .replace(/\s{2,}/g, " ")
                        .trim()}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {room.subHeaderLocation} · {room.orientation}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-bold text-gray-950">
                      ₹{room.rentMonthly}
                    </div>
                    <span className="text-[11px] text-gray-500">/ month</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-gray-200/60 text-[11px] text-gray-600">
                  {room.rentPriceSub && (
                    <span className="bg-emerald-50 text-emerald-800 font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      <span>{room.rentPriceSub}</span>
                    </span>
                  )}
                  {/* AC Badge: Only shown if AC, Non-AC badge is removed */}
                  {(() => {
                    const isAc = Boolean(
                      room.isAc ||
                      (room.badgeCategory &&
                        room.badgeCategory.toLowerCase().includes("ac") &&
                        !room.badgeCategory.toLowerCase().includes("non-ac"))
                    );
                    if (isAc) {
                      return (
                        <span className="bg-blue-50 text-blue-700 border border-blue-200/80 font-medium px-2 py-0.5 rounded-full flex items-center gap-1 text-[11px]">
                          <Snowflake className="w-3 h-3 text-blue-600" />
                          <span>AC Room</span>
                        </span>
                      );
                    }
                    return null;
                  })()}
                </div>
              </div>
            ) : (
              <div className="bg-orange-50/60 border border-orange-100 rounded-xl p-3.5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#FF561C]/10 text-[#FF561C] flex items-center justify-center shrink-0">
                  <BuildingIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-gray-900">
                    {currentBuilding?.name}
                  </h3>
                  <p className="text-[11px] text-gray-600 mt-0.5">
                    {currentBuilding?.tagline}
                  </p>
                </div>
              </div>
            )}

            {/* Booking Form with Outlined Labels on the Border */}
            <form onSubmit={handleFormSubmit} className="space-y-6 pt-1">
              {/* Row 1: Building & No. Persons */}
              <div className="grid grid-cols-2 gap-4">
                {/* Dynamic Building Dropdown */}
                <div className="relative">
                  <label className="absolute -top-2.5 left-3 px-1.5 bg-white text-[11px] font-semibold text-gray-700 z-10 pointer-events-none">
                    Building
                  </label>
                  <select
                    value={selectedBuildingSlug}
                    onChange={(e) => handleBuildingChange(e.target.value)}
                    className="w-full h-11 px-3 pr-8 bg-white border border-gray-300 rounded-md text-xs sm:text-sm text-gray-950 shadow-xs focus:outline-none focus:ring-1 focus:ring-[#FF561C] focus:border-[#FF561C] appearance-none cursor-pointer"
                  >
                    {buildingOptions.map((opt) => (
                      <option key={opt.slug} value={opt.slug}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* No. of Person (Static) */}
                <div className="relative">
                  <label className="absolute -top-2.5 left-3 px-1.5 bg-white text-[11px] font-semibold text-gray-700 z-10 pointer-events-none">
                    No. of Person
                  </label>
                  <input
                    type="text"
                    value="1"
                    readOnly
                    tabIndex={-1}
                    className="w-full h-11 px-3 bg-gray-50 border border-gray-300 rounded-md text-xs sm:text-sm text-gray-900 shadow-xs cursor-default select-none focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 2: Duration of Stay & Check In Date */}
              <div className="grid grid-cols-2 gap-4">
                {/* Duration of Stay */}
                <div className="relative">
                  <label className="absolute -top-2.5 left-3 px-1.5 bg-white text-[11px] font-semibold text-gray-700 z-10 pointer-events-none">
                    Duration of Stay
                  </label>
                  <select
                    value={duration}
                    onChange={(e) => {
                      const newDur = e.target.value as "Long Term" | "Short Term";
                      setDuration(newDur);
                      if (newDur !== "Short Term") {
                        setCheckOutDate("");
                      }
                      if (!newDur || !checkInDate) {
                        setAvailabilityResult(null);
                      }
                    }}
                    required
                    className="w-full h-11 px-3 pr-8 bg-white border border-gray-300 rounded-md text-xs sm:text-sm text-gray-900 shadow-xs focus:outline-none focus:ring-1 focus:ring-[#FF561C] focus:border-[#FF561C] appearance-none cursor-pointer"
                  >
                    <option value="" disabled>
                      Select Duration
                    </option>
                    <option value="Long Term">Long Term</option>
                    <option value="Short Term">Short Term</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Check In Date */}
                <FancyDatePicker
                  label="Check In Date"
                  value={checkInDate}
                  onChange={(date) => {
                    setCheckInDate(date);
                    if (!date || !duration) {
                      setAvailabilityResult(null);
                    }
                    if (checkOutDate && date && checkOutDate <= date) {
                      setCheckOutDate("");
                    }
                  }}
                  minDate={new Date().toISOString().split("T")[0]}
                  placeholder="Select check-in"
                  align="right"
                  required
                />
              </div>

              {/* Upcoming Vacancy Hint */}
              {(room as any)?.isUpcomingVacancy && (
                <div className="px-3 py-2 rounded-md bg-amber-50 border border-amber-200 flex items-center gap-2 text-xs text-amber-800">
                  <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 animate-pulse"></span>
                  <span>{(room as any)?.availableFromDisplay || "Available soon"}</span>
                </div>
              )}

              {/* Conditional Row: Check Out Date for Short Term stay */}
              {duration === "Short Term" && (
                <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                  <FancyDatePicker
                    label="Check Out Date"
                    value={checkOutDate}
                    onChange={(date) => {
                      setCheckOutDate(date);
                      if (!date) {
                        setAvailabilityResult(null);
                      }
                    }}
                    minDate={minCheckOutDate}
                    placeholder="Select check-out"
                    align="right"
                    required
                  />
                </div>
              )}

              {/* Real-time Room Availability Feedback */}
              {isCheckingAvailability && (
                <div className="flex items-center gap-2 text-xs text-gray-500 py-1 px-1">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#FF561C]" />
                  <span>Checking room availability...</span>
                </div>
              )}

              {!isCheckingAvailability && availabilityResult && !availabilityResult.isAvailable && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs space-y-1.5 animate-in fade-in">
                  <div className="flex items-center gap-1.5 font-bold text-red-700">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>Room is Not Available</span>
                  </div>
                  <p className="text-red-700 text-[11px] leading-relaxed">
                    {availabilityResult.message ||
                      "This room is not available for the selected dates. Please choose different dates or select another room."}
                  </p>
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        router.push(`/search?location=${selectedBuildingSlug}`);
                      }}
                      className="text-[11px] font-semibold text-red-800 underline hover:text-red-950 cursor-pointer"
                    >
                      Browse other available rooms in {currentBuilding?.name || "this building"} &rarr;
                    </button>
                  </div>
                </div>
              )}

              {!isCheckingAvailability && availabilityResult && availabilityResult.isAvailable && (
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs flex items-center gap-2 text-emerald-800 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-medium">
                    {availabilityResult.availableBeds !== undefined
                      ? `Available (${availabilityResult.availableBeds} bed${availabilityResult.availableBeds > 1 ? "s" : ""} free)`
                      : "Room is available for selected dates"}
                  </span>
                </div>
              )}

              {/* Submit Button (Full Width Book Now with Price and Arrow) */}
              <div className="pt-2">
                {availabilityResult && !availabilityResult.isAvailable ? (
                  <button
                    type="submit"
                    disabled={true}
                    className="w-full py-3 px-4 bg-gray-200 text-gray-500 font-semibold rounded-md text-sm sm:text-base cursor-not-allowed flex items-center justify-center gap-2 shadow-none select-none"
                  >
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <span>Room Not Available for Dates</span>
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isCheckingAvailability}
                    className="w-full py-3 px-4 bg-[#FF561C] hover:bg-[#e0450d] text-white font-semibold rounded-md text-sm sm:text-base shadow-md shadow-orange-500/20 transition-all active:scale-[0.99] flex items-center justify-between cursor-pointer group disabled:opacity-50"
                  >
                    <span className="flex items-center gap-2">
                      <span>Book Now</span>
                      {room && (
                        <span className="text-xs font-normal text-white/90">
                          (Room {room.roomNumber})
                        </span>
                      )}
                    </span>
                    <span className="flex items-center gap-1.5 font-bold text-white text-sm sm:text-base">
                      <span>{room ? `₹${room.rentMonthly}/mo` : "Check Availability"}</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </button>
                )}
              </div>
            </form>

            {/* Homely Experience Assurance Note */}
            <div className="bg-orange-50/60 rounded-xl p-3 border border-orange-100/80 flex items-start gap-2.5 text-xs text-gray-700">
              <Heart className="w-4 h-4 text-[#FF561C] fill-[#FF561C]/20 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-gray-900">
                  Book now to experience the warmth of home:
                </span>{" "}
                Safe, caring living spaces paired with freshly prepared homely meals every day.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (isMounted && typeof document !== "undefined") {
    return createPortal(drawerContent, document.body);
  }

  return drawerContent;
}
