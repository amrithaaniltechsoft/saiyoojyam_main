import { Building, Utensils, Lock, Zap, Car, Wifi } from "lucide-react";

interface BuildingAmenitiesProps {
  amenities: { title: string; subtitle: string; icon: string }[];
}

export function BuildingAmenities({ amenities }: BuildingAmenitiesProps) {
  if (!amenities || amenities.length === 0) {
    return null;
  }

  const renderAmenityIcon = (iconName: string) => {
    switch (iconName) {
      case "Building":
        return <Building className="w-6 h-6 text-[#FF561C]" />;
      case "Utensils":
        return <Utensils className="w-6 h-6 text-[#FF561C]" />;
      case "Lock":
        return <Lock className="w-6 h-6 text-[#FF561C]" />;
      case "Zap":
        return <Zap className="w-6 h-6 text-[#FF561C]" />;
      case "Car":
        return <Car className="w-6 h-6 text-[#FF561C]" />;
      case "Wifi":
      default:
        return <Wifi className="w-6 h-6 text-[#FF561C]" />;
    }
  };

  return (
    <div id="facilities" className="pt-2 scroll-mt-24 pb-6">
      <h3 className="text-sm sm:text-base font-medium text-gray-900 mb-3">
        Key facilities &amp; amenities
      </h3>
      <div className="grid grid-cols-3 xs:grid-cols-3 sm:grid-cols-5 gap-3 sm:gap-4">
        {amenities.map((item, idx) => (
          <div key={`amenity-${item.title}-${idx}`} className="flex flex-col items-start gap-1">
            <div className="w-8 h-8 text-[#FF561C] flex items-center justify-center mb-1">
              {renderAmenityIcon(item.icon)}
            </div>
            <span className="text-xs sm:text-sm font-medium text-gray-950 leading-snug">
              {item.title}
            </span>
            <span className="text-xs text-gray-800 font-normal leading-tight">
              {item.subtitle}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
