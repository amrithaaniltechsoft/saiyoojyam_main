export interface RoomItem {
  id: string;
  roomNumber: string; // e.g. "20A", "10B", "30A", "20B"
  apartmentName: string; // e.g. "Saiyoojyam Premier"
  buildingKey: "premier" | "annex" | "towers" | string;
  subHeaderLocation: string; // e.g. "Elevator Access • Level 2"
  title: string; // e.g. "2-Bed Luxury AC Room with Private Balcony"
  roomType: string; // "1" | "2" | "3" | "4"
  roomTypeId?: number;
  roomTypeName?: string; // from saiyoojyam_room_type.room_type_name
  roomTypeSlug?: string;
  room_type_capacity?: number;
  isAc?: boolean;
  capacity?: number; // capacity from room type
  rooms_capacity?: number; // legacy room capacity
  totalBeds?: number;
  occupiedBeds?: number;
  buildingId?: number;
  buildingName?: string;
  buildingAddress?: string;
  building_address?: string;
  address?: string;
  badgeCategory: string; // e.g. "Premium AC", "Standard Non-AC", "Popular AC", "Executive AC"
  floorLevel: string; // e.g. "FLOOR 2", "FLOOR 1", "FLOOR 3"
  bedsFreeText: string; // e.g. "1 Bed Free", "2 Beds Free"
  bedsFreeCount: number;
  bedLayoutIcons: ("single" | "double")[]; // Array representing bed layout icons
  orientation: string; // e.g. "East Facing", "Courtyard View", "Dual Windows", "East Wing"
  wingInfo: string; // e.g. "Balcony Wing", "Quiet Wing", "Corner Unit", "Study Hub Wing"
  levelTag: string; // e.g. "LEVEL 2", "LEVEL 1", "LEVEL 3"
  features: {
    name: string;
    icon: string; // icon name key
  }[];
  includesText: string; // e.g. "Includes Breakfast, Lunch & Dinner"
  rentMonthly: string; // e.g. "15,000"
  rentPriceRange?: string; // e.g. "14,000 – 16,000"
  rentPriceSub: string; // e.g. "(AF ₹1k + CD ₹10k)"
  admissionFees?: number;
  cautionDeposit?: number;
  tariffsAdmissionFees?: number;
  tariffsCautionDeposit?: number;
  image?: string;
  whatsapp?: string;
  rentPriceRaw?: number;
  availableFromDate?: string;
  availableFromDisplay?: string;
  isUpcomingVacancy?: boolean;
  vacateDate?: string;
  description: string;
  includedServices: string[];
}

export const ROOMS_DATA: RoomItem[] = [];
