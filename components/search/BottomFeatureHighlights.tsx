import { Utensils, MapPin, ShieldAlert } from "lucide-react";

export function BottomFeatureHighlights() {
  return (
    <div className="mt-12 pt-8 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
      {/* Feature 1 */}
      <div className="flex flex-row md:flex-col items-start gap-3.5 sm:gap-2.5">
        <Utensils className="w-6 h-6 sm:w-7 sm:h-7 text-[#FF561C] shrink-0 mt-0.5 md:mt-0" />
        <div className="flex flex-col gap-1">
          <h4 className="text-base font-semibold text-gray-900 font-sans-normal">
            Homely North & South Food
          </h4>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
            Ready by 7:30 am for tiffin packing. Hygienic cooking and wholesome Kerala and Indian food.
          </p>
        </div>
      </div>

      {/* Feature 2 */}
      <div className="flex flex-row md:flex-col items-start gap-3.5 sm:gap-2.5">
        <MapPin className="w-6 h-6 sm:w-7 sm:h-7 text-[#FF561C] shrink-0 mt-0.5 md:mt-0" />
        <div className="flex flex-col gap-1">
          <h4 className="text-base font-semibold text-gray-900 font-sans-normal">
            Prime Infopark Proximity
          </h4>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
            2 km to Infopark Phase 1, 1.5 km to Kakkanad, 250m to bus stop, scheduled morning/evening cabs.
          </p>
        </div>
      </div>

      {/* Feature 3 */}
      <div className="flex flex-row md:flex-col items-start gap-3.5 sm:gap-2.5">
        <ShieldAlert className="w-6 h-6 sm:w-7 sm:h-7 text-[#FF561C] shrink-0 mt-0.5 md:mt-0" />
        <div className="flex flex-col gap-1">
          <h4 className="text-base font-semibold text-gray-900 font-sans-normal">
            Women-Centric Safety
          </h4>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
            Entry till 10 PM for working ladies, biometric access, 24/7 CCTV surveillance, and live-in management.
          </p>
        </div>
      </div>
    </div>
  );
}
