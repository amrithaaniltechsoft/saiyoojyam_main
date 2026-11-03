"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Building,
  Utensils,
  Lock,
  Zap,
  Car,
  Wifi,
  ShieldCheck,
  Tv,
  Coffee,
  Sparkles,
  Droplets,
  Shirt,
  Bed,
  CheckCircle2,
  MapPin,
  ArrowRight,
  MessageCircle,
  Clock,
  Sparkle,
} from "lucide-react";

export interface BuildingAmenityItem {
  title: string;
  subtitle: string;
  icon: string;
}

export interface BuildingData {
  id: number;
  building_id?: number;
  slug: string;
  name: string;
  building_name?: string;
  tagline: string;
  building_tagline?: string;
  address: string;
  building_address?: string;
  description?: string;
  building_description?: string;
  mainImage?: string;
  building_image?: string;
  moreImages?: string[];
  images?: string[];
  building_key_amenities?: BuildingAmenityItem[];
  amenitiesGrid?: BuildingAmenityItem[];
  building_living_facilities?: string[];
  featuresList?: string[];
  bookingFormWhatsappNumber?: string;
}

interface BuildingAmenitiesShowcaseProps {
  buildings: BuildingData[];
}

export function renderAmenityIcon(iconName: string, className?: string) {
  const iconClass = className || "w-6 h-6 text-[#FF561C]";
  const key = (iconName || "").toLowerCase().trim();

  switch (key) {
    case "building":
    case "apartment":
    case "tower":
      return <Building className={iconClass} />;
    case "utensils":
    case "food":
    case "dining":
    case "restaurant":
    case "meals":
      return <Utensils className={iconClass} />;
    case "lock":
    case "biometric":
    case "security":
      return <Lock className={iconClass} />;
    case "zap":
    case "power":
    case "electricity":
    case "generator":
      return <Zap className={iconClass} />;
    case "car":
    case "cab":
    case "parking":
    case "transport":
      return <Car className={iconClass} />;
    case "wifi":
    case "internet":
    case "network":
      return <Wifi className={iconClass} />;
    case "shield":
    case "shieldcheck":
      return <ShieldCheck className={iconClass} />;
    case "tv":
    case "television":
      return <Tv className={iconClass} />;
    case "coffee":
    case "tea":
      return <Coffee className={iconClass} />;
    case "droplet":
    case "droplets":
    case "water":
      return <Droplets className={iconClass} />;
    case "shirt":
    case "laundry":
    case "washing":
      return <Shirt className={iconClass} />;
    case "bed":
    case "room":
      return <Bed className={iconClass} />;
    default:
      return <Sparkles className={iconClass} />;
  }
}

export function BuildingAmenitiesShowcase({ buildings }: BuildingAmenitiesShowcaseProps) {
  const [selectedSlug, setSelectedSlug] = useState<string>("all");

  if (!buildings || buildings.length === 0) {
    return null;
  }

  const displayedBuildings =
    selectedSlug === "all"
      ? buildings
      : buildings.filter((b) => (b.slug || String(b.id)) === selectedSlug);

  return (
    <section className="w-full py-12 sm:py-16 bg-white" id="properties-amenities">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF561C]/10 text-[#FF561C] text-xs font-semibold tracking-wide uppercase mb-3">
            <Sparkle className="w-3.5 h-3.5" /> Property-Wise Amenities
          </div>
          <h2 className="text-2xl sm:text-4xl font-heading font-bold text-gray-950 tracking-tight mb-3">
            Amenities Across Our Hostels
          </h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-normal">
            Every Saiyoojyam building is equipped with modern living conveniences, robust safety
            protocols, and home-style hospitality. Select a property below to explore its specific
            amenities.
          </p>
        </div>

        {/* Property Selector Tabs */}
        {buildings.length > 1 && (
          <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-10">
            <button
              onClick={() => setSelectedSlug("all")}
              className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                selectedSlug === "all"
                  ? "bg-[#FF561C] text-white shadow-md shadow-[#FF561C]/25"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Properties ({buildings.length})
            </button>
            {buildings.map((b) => {
              const buildingKey = b.slug || String(b.id);
              const displayName = b.building_name || b.name;
              const isSelected = selectedSlug === buildingKey;
              return (
                <button
                  key={buildingKey}
                  onClick={() => setSelectedSlug(buildingKey)}
                  className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "bg-[#FF561C] text-white shadow-md shadow-[#FF561C]/25"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {displayName}
                </button>
              );
            })}
          </div>
        )}

        {/* Building List */}
        <div className="space-y-12 sm:space-y-16">
          {displayedBuildings.map((building) => {
            const buildingName = building.building_name || building.name;
            const buildingTagline = building.building_tagline || building.tagline;
            const buildingAddress = building.building_address || building.address;
            const buildingImage =
              building.building_image || building.mainImage || "/home-hero/h1.png";
            const keyAmenities =
              building.building_key_amenities && building.building_key_amenities.length > 0
                ? building.building_key_amenities
                : building.amenitiesGrid || [];
            const livingFacilities =
              building.building_living_facilities && building.building_living_facilities.length > 0
                ? building.building_living_facilities
                : building.featuresList || [];
            const whatsappNumber = building.bookingFormWhatsappNumber || "918129339122";
            const whatsappMessage = encodeURIComponent(
              `Hello! I am inquiring about amenities and room availability at ${buildingName}.`
            );

            return (
              <div
                key={building.slug || building.id}
                className="bg-white rounded-2xl border border-gray-200/90 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
              >
                {/* Building Header Card */}
                <div className="bg-gradient-to-r from-orange-50/80 via-white to-orange-50/40 p-5 sm:p-7 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-5">
                  <div className="flex items-start gap-4">
                    {/* Thumbnail */}
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-xl overflow-hidden bg-gray-100 border border-gray-200/80 shadow-xs">
                      <Image
                        src={buildingImage}
                        alt={buildingName}
                        fill
                        unoptimized
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>

                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF561C] bg-[#FF561C]/10 px-2 py-0.5 rounded">
                          Saiyoojyam Property
                        </span>
                        {keyAmenities.length > 0 && (
                          <span className="text-[11px] text-gray-500 font-medium">
                            • {keyAmenities.length} Key Amenities
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl sm:text-2xl font-heading font-bold text-gray-950 mt-1">
                        {buildingName}
                      </h3>
                      {buildingTagline && (
                        <p className="text-xs sm:text-sm text-gray-600 font-normal line-clamp-1">
                          {buildingTagline}
                        </p>
                      )}
                      {buildingAddress && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-[#FF561C] shrink-0" />
                          <span className="line-clamp-1">{buildingAddress}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 shrink-0 self-start md:self-center">
                    <a
                      href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 text-xs sm:text-sm font-semibold transition-colors"
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-600" />
                      <span>WhatsApp</span>
                    </a>
                    <Link
                      href={`/building/${building.slug}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#FF561C] hover:bg-[#e0440d] text-white text-xs sm:text-sm font-semibold transition-colors shadow-xs"
                    >
                      <span>Explore Rooms</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Building Content Grid */}
                <div className="p-5 sm:p-7 space-y-8">
                  {/* 1. Key Amenities Section (from building_key_amenities) */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-base sm:text-lg font-heading font-bold text-gray-950">
                          Key Facilities &amp; Amenities
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-500 font-normal">
                          Configured specifically for {buildingName}
                        </p>
                      </div>
                      <span className="text-xs font-semibold text-[#FF561C] bg-orange-50 px-2.5 py-1 rounded-md">
                        {keyAmenities.length} Facilities
                      </span>
                    </div>

                    {keyAmenities.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                        {keyAmenities.map((item, idx) => (
                          <div
                            key={`b-amenity-${item.title}-${idx}`}
                            className="group relative p-3.5 sm:p-4 rounded-xl bg-orange-50/30 hover:bg-orange-50/70 border border-orange-100/80 hover:border-orange-200 transition-all duration-200 flex flex-col items-start gap-2 shadow-2xs hover:shadow-xs"
                          >
                            <div className="w-10 h-10 rounded-lg bg-white border border-orange-100 flex items-center justify-center text-[#FF561C] group-hover:scale-105 transition-transform duration-200 shadow-2xs">
                              {renderAmenityIcon(item.icon, "w-5 h-5 text-[#FF561C]")}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-[#FF561C] transition-colors leading-snug">
                                {item.title}
                              </span>
                              {item.subtitle && (
                                <span className="text-[11px] sm:text-xs text-gray-600 font-normal leading-tight mt-0.5">
                                  {item.subtitle}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs sm:text-sm text-gray-500 italic bg-gray-50 p-4 rounded-lg">
                        Standard comprehensive Saiyoojyam amenities apply to this property.
                      </p>
                    )}
                  </div>

                  {/* 2. Living Facilities / Specifications List (if present) */}
                  {livingFacilities.length > 0 && (
                    <div className="pt-4 border-t border-gray-100">
                      <h4 className="text-base sm:text-lg font-heading font-bold text-gray-950 mb-3">
                        Living Specifications &amp; Features
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
                        {livingFacilities.map((feat, idx) => (
                          <div
                            key={`living-feat-${idx}`}
                            className="flex items-start gap-2 text-xs sm:text-sm text-gray-700 bg-gray-50/80 hover:bg-gray-50 p-2.5 rounded-lg border border-gray-100"
                          >
                            <CheckCircle2 className="w-4 h-4 text-[#FF561C] shrink-0 mt-0.5" />
                            <span className="font-normal leading-snug">{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Bottom property footer */}
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-gray-500 border-t border-gray-100">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      Hostel Gate timings: 6:00 AM – 10:00 PM for maximum resident safety
                    </span>
                    <Link
                      href={`/search?building=${building.slug}`}
                      className="text-[#FF561C] hover:underline font-semibold inline-flex items-center gap-1"
                    >
                      Check Room Availability in {buildingName} &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

