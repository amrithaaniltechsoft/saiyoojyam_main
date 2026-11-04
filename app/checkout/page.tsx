import { Metadata } from "next";
import { BuildingDetailData } from "@/data/buildingsData";
import { RoomItem } from "@/data/roomsData";
import { Footer } from "@/components/global/Footer";
import { CheckoutHeader } from "@/components/checkout/CheckoutHeader";
import { CheckoutSteps } from "@/components/checkout/CheckoutSteps";
import { CheckoutPropertyCard } from "@/components/checkout/CheckoutPropertyCard";
import { CheckoutBookingDetailsCard } from "@/components/checkout/CheckoutBookingDetailsCard";
import { calculateInitialRent } from "@/components/checkout/rentCalculator";
import { CheckoutPriceSummaryCard } from "@/components/checkout/CheckoutPriceSummaryCard";
import { CheckoutBookingSection } from "@/components/checkout/CheckoutBookingSection";

export const metadata: Metadata = {
  title: "Checkout & Room Booking | Saiyoojyam Ladies Hostels",
  description: "Complete your room reservation at Saiyoojyam Ladies Hostels, Kakkanad Kochi.",
};

interface CheckoutPaymentPageProps {
  searchParams: Promise<{
    building?: string;
    roomId?: string;
    persons?: string;
    duration?: string;
    checkIn?: string;
    checkOut?: string;
  }>;
}

async function getBuildingData(slug: string): Promise<BuildingDetailData> {
  const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost/saiyoojyam";
  const baseUrl = rawApiUrl.replace(/\/+$/, "");

  try {
    const res = await fetch(`${baseUrl}/api/building/${encodeURIComponent(slug)}`, {
      cache: "no-store",
    });

    if (res.ok) {
      const json = await res.json();
      if (json && json.status && json.data) {
        const d = json.data;
        const moreImagesList: string[] = Array.isArray(d.moreImages) ? d.moreImages : [];
        const mainImg =
          d.mainImage ||
          (Array.isArray(d.images) && d.images[0]) ||
          "";

        return {
          slug: d.slug || slug,
          name: d.name || "Saiyoojyam Hostel",
          tagline: d.tagline || "",
          address: d.building_address || d.address || d.location || "",
          building_address: d.building_address || d.address || "",
          description: d.description || "",
          bookingFormWhatsappNumber: d.bookingFormWhatsappNumber || "918129339122",
          mapEmbedUrl: d.mapEmbedUrl || "",
          mapDirectUrl: d.mapDirectUrl || "",
          heroImages: {
            main: mainImg,
            sub1: moreImagesList[0] || "",
            sub2: moreImagesList[1] || "",
            sub3: moreImagesList[2] || "",
          },
          moreImages: moreImagesList,
          amenitiesGrid: Array.isArray(d.amenitiesGrid) ? d.amenitiesGrid : [],
          featuresList: Array.isArray(d.featuresList) ? d.featuresList : [],
          metaTitle: d.metaTitle || "",
          metaDescription: d.metaDescription || "",
          metaKeywords: d.metaKeywords || "",
          admission_fees:
            d.admission_fees !== undefined
              ? Number(d.admission_fees)
              : d.building_admission_fees !== undefined
              ? Number(d.building_admission_fees)
              : undefined,
          caution_deposit:
            d.caution_deposit !== undefined
              ? Number(d.caution_deposit)
              : d.building_caution_deposit !== undefined
              ? Number(d.building_caution_deposit)
              : undefined,
        };
      }
    }
  } catch {}

  return {
    slug,
    name: "",
    tagline: "",
    address: "",
    building_address: "",
    description: "",
    bookingFormWhatsappNumber: "918129339122",
    mapEmbedUrl: "",
    mapDirectUrl: "",
    heroImages: {
      main: "",
      sub1: "",
      sub2: "",
      sub3: "",
    },
    moreImages: [],
    amenitiesGrid: [],
    featuresList: [],
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
  };
}

async function getRoomData(
  roomIdParam?: string,
  buildingSlug?: string,
  checkInDate?: string
): Promise<RoomItem | undefined> {
  const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost/saiyoojyam";
  const baseUrl = rawApiUrl.replace(/\/+$/, "");

  const cleanId = (roomIdParam || "").trim().toLowerCase();
  const cleanNum = cleanId.replace(/^room-/, "");

  // 1. If buildingSlug is specified and not 'all', search building rooms FIRST
  if (buildingSlug && buildingSlug !== "all") {
    try {
      const res = await fetch(
        `${baseUrl}/api/rooms?location=${encodeURIComponent(buildingSlug)}`,
        { cache: "no-store" }
      );
      if (res.ok) {
        const json = await res.json();
        if (json && json.status && Array.isArray(json.data) && json.data.length > 0) {
          if (cleanId) {
            // First check exact match by id or dbId
            const foundExact = json.data.find(
              (r: any) =>
                (r.id && r.id.toLowerCase() === cleanId) ||
                (r.id && r.id.toLowerCase() === `room-${cleanNum}`) ||
                (r.dbId && String(r.dbId) === cleanNum)
            );
            if (foundExact) return foundExact;

            // Second check by roomNumber
            const foundRoomNum = json.data.find(
              (r: any) =>
                (r.roomNumber && r.roomNumber.toLowerCase() === cleanId) ||
                (r.roomNumber && r.roomNumber.toLowerCase() === cleanNum)
            );
            if (foundRoomNum) return foundRoomNum;
          }
          return json.data[0];
        }
      }
    } catch {}
  }

  // 2. Global search across all rooms
  if (cleanId) {
    try {
      const res = await fetch(`${baseUrl}/api/rooms?location=all`, {
        cache: "no-store",
      });
      if (res.ok) {
        const json = await res.json();
        if (json && json.status && Array.isArray(json.data) && json.data.length > 0) {
          // Check exact id or dbId first
          const foundExact = json.data.find(
            (r: any) =>
              (r.id && r.id.toLowerCase() === cleanId) ||
              (r.id && r.id.toLowerCase() === `room-${cleanNum}`) ||
              (r.dbId && String(r.dbId) === cleanNum)
          );
          if (foundExact) return foundExact;

          // Check roomNumber
          const foundRoomNum = json.data.find(
            (r: any) =>
              (r.roomNumber && r.roomNumber.toLowerCase() === cleanId) ||
              (r.roomNumber && r.roomNumber.toLowerCase() === cleanNum)
          );
          if (foundRoomNum) return foundRoomNum;
        }
      }
    } catch {}
  }

  return undefined;
}

export default async function CheckoutPaymentPage({ searchParams }: CheckoutPaymentPageProps) {
  const resolvedSearchParams = await searchParams;

  // Query parameters passed from the BookingDrawer
  const buildingSlugParam = (resolvedSearchParams.building || "premier").toLowerCase().trim();
  const roomIdParam = resolvedSearchParams.roomId?.trim();
  const personsParam = resolvedSearchParams.persons || "1";
  const durationParam = resolvedSearchParams.duration || "Long Term";
  const checkInParam = resolvedSearchParams.checkIn || "";
  const checkOutParam = resolvedSearchParams.checkOut || "";

  // 1. Resolve room dynamically from API
  const room = await getRoomData(roomIdParam, buildingSlugParam, checkInParam);

  // 2. Resolve building dynamically from API (or room's buildingKey if buildingSlug was generic)
  const effectiveBuildingSlug =
    buildingSlugParam || (room?.buildingKey ? room.buildingKey.toLowerCase().trim() : "premier");
  let building = await getBuildingData(effectiveBuildingSlug);

  // Synchronize building metadata with room data if building API had missing fields
  if (room) {
    if (!building.name || building.name === "Saiyoojyam Hostel") {
      if (room.apartmentName) building.name = room.apartmentName;
      else if (room.buildingName) building.name = room.buildingName;
    }
    const roomAddress = room.building_address || room.buildingAddress || room.address;
    if ((!building.address || building.address === "Kakkanad, Kochi") && roomAddress) {
      building.address = roomAddress;
    }
    if (!building.address && room.subHeaderLocation) {
      building.address = room.subHeaderLocation;
    }
    if ((!building.heroImages?.main || building.heroImages.main === "") && room.image) {
      building.heroImages = {
        main: room.image,
        sub1: "",
        sub2: "",
        sub3: "",
      };
    }
  }

  // Pricing calculation
  const numericMonthlyRent = room
    ? (room.rentPriceRaw ?? parseInt(String(room.rentMonthly || "0").replace(/[^0-9]/g, ""), 10) ?? 0)
    : 0;

  // Admission fees and Caution deposit from Room Tariff, or fallback to Building defaults
  let admissionFees = room?.admissionFees ?? room?.tariffsAdmissionFees ?? 0;
  let cautionDeposit = room?.cautionDeposit ?? room?.tariffsCautionDeposit ?? 0;

  if (admissionFees <= 0 && (building.admission_fees || (building as any).building_admission_fees)) {
    admissionFees = Number(building.admission_fees || (building as any).building_admission_fees) || 0;
  }
  if (cautionDeposit <= 0 && (building.caution_deposit || (building as any).building_caution_deposit)) {
    cautionDeposit = Number(building.caution_deposit || (building as any).building_caution_deposit) || 0;
  }

  // Rent Calculation Rules:
  // Short Term: (Days between Check-in & Check-out) * (Monthly Rent / Days in month)
  // Long Term:
  // 1. Until 20th: collect rent from joining date till end of month (Rent/day = monthly rent / days in month)
  // 2. From 21st: Rent = days left in current month + next month rent
  // 3. Before or on 5th: full month rent
  const rentCalc = calculateInitialRent(numericMonthlyRent, checkInParam, checkOutParam, durationParam);
  const calculatedRent = rentCalc.calculatedRent;

  // Total price = initial calculated rent + admission fees + caution deposit
  const totalPrice = calculatedRent + admissionFees + cautionDeposit;

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans-normal text-gray-950 checkout-page-scope">
      {/* Top Header Banner */}
      <CheckoutHeader />

      {/* Steps Progress Bar */}
      <CheckoutSteps isSuccess={false} />

      {/* Main Two-Column Layout */}
      <main className="flex-grow max-w-6xl mx-auto w-full px-6 sm:px-10 lg:px-14 py-8 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (4 cols): Summary Cards */}
          <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-4">
            <CheckoutPropertyCard building={building} room={room} />
            <CheckoutBookingDetailsCard
              building={building}
              room={room}
              checkInParam={checkInParam}
              checkOutParam={checkOutParam}
              durationParam={durationParam}
              personsParam={personsParam}
            />
            <CheckoutPriceSummaryCard
              totalPrice={totalPrice}
              monthlyRent={calculatedRent}
              baseMonthlyRent={numericMonthlyRent}
              rentCalculation={rentCalc}
              admissionFees={admissionFees}
              cautionDeposit={cautionDeposit}
              duration={durationParam}
            />
          </div>

          {/* Right Column (8 cols): Guest Details Form & Confirmation */}
          <div className="lg:col-span-8">
            <CheckoutBookingSection
              building={building}
              room={room}
              totalPrice={totalPrice}
              monthlyRent={calculatedRent}
              admissionFees={admissionFees}
              cautionDeposit={cautionDeposit}
              checkInParam={checkInParam}
              checkOutParam={checkOutParam}
              durationParam={durationParam}
              roomIdParam={roomIdParam}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
