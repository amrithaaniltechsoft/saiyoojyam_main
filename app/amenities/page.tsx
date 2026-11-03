import type { Metadata } from "next";
import { Header } from "@/components/global/Header";
import { Footer } from "@/components/global/Footer";
import { constructMetadataById } from "@/lib/seo";
import {
  AmenitiesHero,
  BuildingAmenitiesShowcase,
  BuildingData,
  BuildingAmenityItem,
} from "@/components/amenities";

export async function generateMetadata(): Promise<Metadata> {
  // Fetch meta title, meta description, and meta keywords from saiyoojyam_seo table where id = 3 (Facilities/Amenities)
  const meta = await constructMetadataById(3);
  if (meta && meta.title) {
    return meta;
  }

  return {
    title: "Hostel Amenities & Living Facilities | Saiyoojyam Ladies Hostel Kakkanad",
    description:
      "Explore comprehensive amenities at Saiyoojyam Ladies Hostels in Kakkanad near Infopark Kochi: high-speed Wi-Fi, homely meals, biometric security, elevator, power backup, and regular housekeeping.",
    keywords:
      "ladies hostel amenities kakkanad, infopark hostel facilities, saiyoojyam amenities, womens hostel kochi facilities",
    openGraph: {
      title: "Hostel Amenities & Living Facilities | Saiyoojyam Ladies Hostel",
      description:
        "Explore comprehensive amenities at Saiyoojyam Ladies Hostels in Kakkanad near Infopark Kochi.",
      type: "website",
    },
  };
}

async function getBuildings(): Promise<BuildingData[]> {
  const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost/saiyoojyam";
  const baseUrl = rawApiUrl.replace(/\/+$/, "");

  try {
    const res = await fetch(`${baseUrl}/api/building`, {
      cache: "no-store",
    });

    if (res.ok) {
      const json = await res.json();
      if (json && json.status && Array.isArray(json.data) && json.data.length > 0) {
        return json.data.map((item: any) => {
          // Normalize building_key_amenities from DB or amenitiesGrid
          let keyAmenities: BuildingAmenityItem[] = [];
          if (Array.isArray(item.building_key_amenities) && item.building_key_amenities.length > 0) {
            keyAmenities = item.building_key_amenities;
          } else if (Array.isArray(item.amenitiesGrid) && item.amenitiesGrid.length > 0) {
            keyAmenities = item.amenitiesGrid;
          }

          // Normalize building_living_facilities from DB or featuresList
          let livingFacilities: string[] = [];
          if (
            Array.isArray(item.building_living_facilities) &&
            item.building_living_facilities.length > 0
          ) {
            livingFacilities = item.building_living_facilities;
          } else if (Array.isArray(item.featuresList) && item.featuresList.length > 0) {
            livingFacilities = item.featuresList;
          }

          return {
            id: item.building_id || item.id,
            building_id: item.building_id || item.id,
            slug: item.slug || String(item.id),
            name: item.building_name || item.name || "Saiyoojyam Hostel",
            building_name: item.building_name || item.name || "Saiyoojyam Hostel",
            tagline: item.building_tagline || item.tagline || "",
            building_tagline: item.building_tagline || item.tagline || "",
            address: item.building_address || item.address || "",
            building_address: item.building_address || item.address || "",
            description: item.building_description || item.description || "",
            mainImage: item.building_image || item.mainImage || "",
            building_image: item.building_image || item.mainImage || "",
            moreImages: Array.isArray(item.moreImages) ? item.moreImages : [],
            images: Array.isArray(item.images) ? item.images : [],
            building_key_amenities: keyAmenities,
            amenitiesGrid: keyAmenities,
            building_living_facilities: livingFacilities,
            featuresList: livingFacilities,
            bookingFormWhatsappNumber: item.bookingFormWhatsappNumber || "918129339122",
          };
        });
      }
    }
  } catch (err) {
    console.warn("Could not fetch buildings from API:", err);
  }

  return [];
}

export default async function AmenitiesPage() {
  const buildings = await getBuildings();

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 antialiased flex flex-col justify-between overflow-x-hidden">
      {/* Global Header */}
      <Header />

      <main className="w-full flex-grow pt-0">
        {/* 1. Hero Banner */}
        <AmenitiesHero />

        {/* 2. Building-wise Key Amenities Section (fetching saiyoojyam_building.building_key_amenities) */}
        <BuildingAmenitiesShowcase buildings={buildings} />
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}

