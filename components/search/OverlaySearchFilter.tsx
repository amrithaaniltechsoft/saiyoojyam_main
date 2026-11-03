"use client";

import {
  SearchFilter,
  DynamicRoomTypeOption,
  DynamicBuildingOption,
  locationOptions,
  roomTypeOptions,
} from "@/components/ui/SearchFilter";

export { locationOptions, roomTypeOptions };
export type { DynamicRoomTypeOption, DynamicBuildingOption };

export interface OverlaySearchFilterProps {
  selectedLocation: string;
  selectedDate: string;
  selectedRoomType: string;
  onFilterChange: (newLocation: string, newRoomType: string) => void;
  onDateChange: (date: string) => void;
  onSearch?: (location: string, date: string, roomType: string) => void;
  className?: string;
  buildings?: any[];
  roomTypes?: DynamicRoomTypeOption[];
}

export function OverlaySearchFilter({
  selectedLocation,
  selectedDate,
  selectedRoomType,
  onFilterChange,
  onDateChange,
  onSearch,
  className = "",
  buildings,
  roomTypes,
}: OverlaySearchFilterProps) {
  return (
    <SearchFilter
      selectedLocation={selectedLocation}
      selectedDate={selectedDate}
      selectedRoomType={selectedRoomType}
      onFilterChange={onFilterChange}
      onDateChange={onDateChange}
      onSearch={onSearch}
      className={className}
      buildings={buildings}
      roomTypes={roomTypes}
      floatingOnScroll={true}
    />
  );
}
