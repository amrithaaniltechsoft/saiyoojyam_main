import Link from "next/link";
import { Building2, ArrowRight } from "lucide-react";
import { PropertiesCarousel, PropertySlide } from "./PropertiesCarousel";

export interface PropertyBuilding {
  id: number | string;
  name: string;
  building_name?: string;
  slug: string;
  tagline?: string;
  location?: string;
  image?: string;
}

interface NetworkData {
  subtitle: string;
  title: string;
  raw_desc: string;
  description: string;
  images: PropertySlide[];
  buildings: PropertyBuilding[];
}

async function getNetworkAndBuildings(): Promise<NetworkData | null> {
  const rawApiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost/saiyoojyam";
  const baseUrl = rawApiUrl.replace(/\/+$/, "");

  let aboutData: any = null;
  let buildingsList: PropertyBuilding[] = [];

  try {
    const [aboutRes, buildingRes] = await Promise.all([
      fetch(`${baseUrl}/api/about`, { cache: "no-store" }).catch(() => null),
      fetch(`${baseUrl}/api/building`, { cache: "no-store" }).catch(() => null),
    ]);

    if (aboutRes && aboutRes.ok) {
      const json = await aboutRes.json();
      if (json?.status && json?.data?.network) {
        aboutData = json.data.network;
      }
    }

    if (buildingRes && buildingRes.ok) {
      const bJson = await buildingRes.json();
      if (bJson?.status && Array.isArray(bJson.data)) {
        buildingsList = bJson.data.map((item: any) => ({
          id: item.id || item.building_id,
          name: item.name || item.building_name || "",
          building_name: item.building_name || item.name || "",
          slug: item.slug || `building-${item.id || item.building_id}`,
          tagline: item.tagline || item.building_tagline || "",
          location: item.location || item.address || "",
          image: item.mainImage || item.building_image || "",
        }));
      }
    }
  } catch (err) {
    console.warn("Could not fetch network data:", err);
  }

  // If aboutData returned buildings from saiyoojyam_building, use them or fallback
  const finalBuildings =
    Array.isArray(aboutData?.buildings) && aboutData.buildings.length > 0
      ? aboutData.buildings
      : buildingsList;

  let images: PropertySlide[] = Array.isArray(aboutData?.images) ? aboutData.images : [];
  if (images.length === 0 && finalBuildings.length > 0) {
    images = finalBuildings
      .filter((b: PropertyBuilding) => Boolean(b.image))
      .map((b: PropertyBuilding) => ({
        image: b.image!,
        name: b.building_name || b.name,
        tagline: b.tagline || b.location,
      }));
  }

  return {
    subtitle: aboutData?.subtitle?.trim() || "Our Properties",
    title: aboutData?.title?.trim() || "Saiyoojyam Hostels Network",
    raw_desc:
      aboutData?.raw_desc?.trim() ||
      aboutData?.description?.trim() ||
      "",
    description: aboutData?.description?.trim() || "",
    images,
    buildings: finalBuildings,
  };
}

export async function AboutPropertiesSection() {
  const data = await getNetworkAndBuildings();
  if (!data) return null;

  const hasContent =
    Boolean(data.title) ||
    Boolean(data.raw_desc) ||
    Boolean(data.description) ||
    data.buildings.length > 0 ||
    data.images.length > 0;

  if (!hasContent) {
    return null;
  }

  const hasImages = data.images.length > 0;

  return (
    <section className="w-full py-12 sm:py-20 bg-white">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          {/* Offset warm peach/orange background banner */}
          <div className="hidden lg:block absolute top-0 left-0 w-3/4 h-full bg-[#fff4ee] rounded-3xl -z-0" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center lg:py-10 lg:px-6">
            {/* Left Text Block */}
            <div
              className={`${
                hasImages ? "lg:col-span-7" : "lg:col-span-12"
              } flex flex-col justify-center space-y-4 sm:space-y-5 lg:pr-4 order-2 lg:order-1`}
            >
              {data.subtitle && (
                <span className="text-xs sm:text-sm font-bold text-[#FF561C]">
                  {data.subtitle}
                </span>
              )}
              {data.title && (
                <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold font-heading text-gray-950 leading-tight">
                  {data.title}
                </h2>
              )}
              {data.raw_desc ? (
                <div
                  className="space-y-4 text-sm sm:text-base text-gray-700 leading-relaxed font-normal [&>p]:mb-3 [&>p:last-child]:mb-0 [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5"
                  dangerouslySetInnerHTML={{ __html: data.raw_desc }}
                />
              ) : data.description ? (
                <div className="space-y-4 text-sm sm:text-base text-gray-700 leading-relaxed font-normal">
                  <p>{data.description}</p>
                </div>
              ) : null}

              {/* Property Quick Pills (dynamically fetched from saiyoojyam_building) */}
              {data.buildings.length > 0 && (
                <div className="pt-2 flex flex-wrap gap-2 sm:gap-3">
                  {data.buildings.map((building) => {
                    const displayName = building.building_name || building.name;
                    const slug = building.slug || `building-${building.id}`;
                    return (
                      <Link
                        key={building.id || slug}
                        href={`/building/${slug}`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-orange-200 text-xs sm:text-sm font-semibold text-gray-900 hover:border-[#FF561C] hover:text-[#FF561C] transition-colors shadow-2xs group"
                      >
                        <Building2 className="w-4 h-4 text-[#FF561C] group-hover:scale-110 transition-transform" />
                        <span>{displayName}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#FF561C] group-hover:translate-x-0.5 transition-all" />
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right Carousel: Only renders if images exist */}
            {hasImages && (
              <div className="lg:col-span-5 relative order-1 lg:order-2">
                <PropertiesCarousel slides={data.images} />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
