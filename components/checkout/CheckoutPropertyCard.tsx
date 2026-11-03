import { useMemo } from "react";
import Image from "next/image";
import {
  Check,
  CheckCircle2,
  ShowerHead,
  Wind,
  BookOpen,
  Lock,
  Wifi,
  Utensils,
  Building as BuildingIcon,
  Sun,
  Bus,
  Car,
  Zap,
  MapPin,
} from "lucide-react";
import { BuildingDetailData } from "@/data/buildingsData";
import { RoomItem } from "@/data/roomsData";

interface CheckoutPropertyCardProps {
  building: BuildingDetailData;
  room?: RoomItem;
}

export function CheckoutPropertyCard({ building, room }: CheckoutPropertyCardProps) {
  const renderRoomFeatureIcon = (iconName: string, className = "w-3 h-3 text-[#FF561C]") => {
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
        return <BuildingIcon className={className} />;
      case "Sun":
        return <Sun className={className} />;
      case "Car":
        return <Car className={className} />;
      case "Bus":
        return <Bus className={className} />;
      case "Zap":
        return <Zap className={className} />;
      default:
        return <CheckCircle2 className={className} />;
    }
  };

  const imageSrc =
    (room?.image && room.image.trim()) ||
    (building.heroImages?.main && building.heroImages.main.trim()) ||
    "/buildings/saiyoojyam-towers/s1.png";

  const roomLocationDetails = [
    room?.subHeaderLocation,
    room?.orientation,
    room?.wingInfo,
    room?.floorLevel,
  ]
    .filter(Boolean)
    .join(" · ");

  const propertyAddress =
    building.address ||
    building.building_address ||
    room?.building_address ||
    room?.buildingAddress ||
    room?.address ||
    building.tagline ||
    "Kakkanad, Kochi";

  // Dynamic Room Features fetched directly from Table: saiyoojyam_building (building_key_amenities & building_living_facilities)
  const dynamicFeatures = useMemo(() => {
    const list: { name: string; icon: string }[] = [];
    const seen = new Set<string>();

    // 1. Key facilities & amenities from saiyoojyam_building.building_key_amenities
    if (Array.isArray(building?.amenitiesGrid) && building.amenitiesGrid.length > 0) {
      for (const a of building.amenitiesGrid) {
        const title = (a.title || (a as any).name || "").trim();
        if (title && !seen.has(title.toLowerCase())) {
          seen.add(title.toLowerCase());
          list.push({
            name: title,
            icon: a.icon || "Building",
          });
        }
      }
    }

    // 2. Hostel amenities & living facilities from saiyoojyam_building.building_living_facilities
    if (Array.isArray(building?.featuresList) && building.featuresList.length > 0) {
      for (const f of building.featuresList) {
        const text = (typeof f === "string" ? f : (f as any)?.name || (f as any)?.title || "").trim();
        if (text && !seen.has(text.toLowerCase())) {
          seen.add(text.toLowerCase());
          list.push({
            name: text,
            icon: "CheckCircle2",
          });
        }
      }
    }

    // 3. Fallback to room.features if no building amenities exist in saiyoojyam_building
    if (list.length === 0 && room?.features && room.features.length > 0) {
      return room.features;
    }

    return list;
  }, [building?.amenitiesGrid, building?.featuresList, room?.features]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-xs">
      {/* Property / Room Photo */}
      <div className="relative w-full h-44 bg-gray-100">
        <Image
          src={imageSrc}
          alt={building.name || "Hostel Room"}
          fill
          priority
          className="object-cover object-center"
        />
      </div>

      <div className="p-4 space-y-2.5">
        {/* Property Name */}
        <h3 className="text-lg font-semibold text-gray-950 leading-snug">
          {building.name}
        </h3>

        {/* Address & Location from saiyoojyam_building */}
        {propertyAddress && (
          <div className="flex items-start gap-1.5 text-xs sm:text-sm text-gray-700 font-normal">
            <MapPin className="w-4 h-4 text-[#FF561C] shrink-0 mt-0.5" />
            <span className="line-clamp-2 leading-relaxed">
              {propertyAddress}
            </span>
          </div>
        )}

        {/* Room Details Block from roomsData.ts */}
        {room && (
          <div className="pt-2.5 border-t border-gray-200 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-base font-semibold text-[#D43800]">
                Room {room.roomNumber} ({room.roomTypeName || `${room.roomType}-Sharing`})
              </span>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-950 leading-snug">
                {(room.title || room.roomTypeName || `${room.roomType}-Sharing`)
                  .replace(/\s*\(?\b(?:non[-\s]*ac)\b\)?\s*/gi, " ")
                  .replace(/\s{2,}/g, " ")
                  .trim()}
              </p>
              {roomLocationDetails && (
                <p className="text-xs text-gray-800 mt-0.5 font-medium">
                  {roomLocationDetails}
                </p>
              )}
            </div>

            {/* Dynamic Features fetched from Table: saiyoojyam_building */}
            {dynamicFeatures && dynamicFeatures.length > 0 && (
              <div className="pt-2 border-t border-gray-200">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-800 block mb-1.5">
                  Room Features
                </span>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-gray-950 font-medium">
                  {dynamicFeatures.map((feature, idx) => (
                    <span key={idx} className="flex items-center gap-1.5 text-xs">
                      {renderRoomFeatureIcon(feature.icon, "w-3.5 h-3.5 text-[#D43800]")}
                      <span className="text-gray-950">{feature.name}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Included Services & Meals text */}
            {room.includesText && (
              <div className="flex items-center gap-2 pt-1 text-xs font-semibold text-emerald-800">
                <Check className="w-4 h-4 text-emerald-600 stroke-[2.5] shrink-0" />
                <span>{room.includesText}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
