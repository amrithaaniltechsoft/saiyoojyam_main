import { Metadata } from "next";
import { Footer } from "@/components/global/Footer";
import { BuildingDetailData } from "@/data/buildingsData";
import { BuildingHeader } from "@/components/building/BuildingHeader";
import { BuildingHeroHeader } from "@/components/building/BuildingHeroHeader";
import { BuildingGallery } from "@/components/building/BuildingGallery";
import { BuildingAmenities } from "@/components/building/BuildingAmenities";
import { BuildingFeatures } from "@/components/building/BuildingFeatures";
import { BuildingInteractiveSections } from "@/components/building/BuildingInteractiveSections";
import { RoomItem } from "@/data/roomsData";

interface BuildingPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: BuildingPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const building = await getBuildingData(resolvedParams.slug);

  const title = building.metaTitle || `${building.name || "Building"} | Saiyoojyam Ladies Hostel`;
  const description =
    building.metaDescription ||
    building.tagline ||
    building.description ||
    "Safe and comfortable ladies hostel accommodation near Infopark Kakkanad, Kochi.";
  const keywords = building.metaKeywords || "ladies hostel, kakkanad, infopark, saiyoojyam";

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      ...(building.heroImages?.main ? { images: [building.heroImages.main] } : {}),
    },
  };
}

async function getBuildingData(slug: string): Promise<BuildingDetailData> {
  const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost/saiyoojyam";
  const baseUrl = rawApiUrl.replace(/\/+$/, "");

  try {
    const res = await fetch(`${baseUrl}/api/building/${slug}`, {
      cache: "no-store",
    });

    if (res.ok) {
      const json = await res.json();
      if (json && json.status && json.data) {
        const d = json.data;
        const moreImagesList: string[] = Array.isArray(d.moreImages) ? d.moreImages : [];
        return {
          slug: d.slug || slug,
          name: d.name || "",
          tagline: d.tagline || "",
          address: d.address || "",
          description: d.description || "",
          bookingFormWhatsappNumber: d.bookingFormWhatsappNumber || "918129339122",
          mapEmbedUrl: d.mapEmbedUrl || "",
          mapDirectUrl: d.mapDirectUrl || "",
          heroImages: {
            main: d.mainImage || "",
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
        };
      }
    }
  } catch (err) {
    // API request failed
  }

  return {
    slug,
    name: "",
    tagline: "",
    address: "",
    description: "",
    bookingFormWhatsappNumber: "918129339122",
    mapEmbedUrl: "",
    mapDirectUrl: "",
    heroImages: { main: "", sub1: "", sub2: "", sub3: "" },
    moreImages: [],
    amenitiesGrid: [],
    featuresList: [],
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
  };
}

async function getBuildingRooms(slug: string): Promise<RoomItem[]> {
  const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost/saiyoojyam";
  const baseUrl = rawApiUrl.replace(/\/+$/, "");

  try {
    const res = await fetch(`${baseUrl}/api/rooms?location=${slug}`, {
      cache: "no-store",
    });

    if (res.ok) {
      const json = await res.json();
      if (json && json.status && Array.isArray(json.data) && json.data.length > 0) {
        return json.data;
      }
    }
  } catch (err) {
    // Only show rooms with tariffs from API
    return [];
  }

  return [];
}

export default async function BuildingPage({ params }: BuildingPageProps) {
  const resolvedParams = await params;
  const building = await getBuildingData(resolvedParams.slug);
  const buildingRooms = await getBuildingRooms(resolvedParams.slug);

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between font-sans-normal building-page-scope">
      {/* Custom Orange Header with in-page anchor links */}
      <BuildingHeader
        buildingName={building.name}
        whatsappNumber={building.bookingFormWhatsappNumber}
        currentBuildingSlug={building.slug}
      />

      <main className="flex-grow pt-12 sm:pt-14 md:pt-12 pb-16 lg:pb-0">
        <div className="max-w-[1280px] mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
          <BuildingHeroHeader building={building} />

          {/* Main 2-Column Layout handled by BuildingInteractiveSections */}
          <BuildingInteractiveSections
            building={building}
            buildingRooms={buildingRooms}
            gallery={<BuildingGallery key="building-gallery" building={building} />}
            amenitiesAndFeatures={
              <div key="amenities-and-features" className="space-y-8 divide-y divide-gray-200">
                {/* Key Amenities (#facilities) */}
                <BuildingAmenities amenities={building.amenitiesGrid} />

                {/* Detailed Features & Room specifications (#rooms) */}
                <BuildingFeatures
                  features={building.featuresList}
                  title="Hostel Amenities & Living Facilities"
                  subtitle="Detailed specifications for this property"
                />
              </div>
            }
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
