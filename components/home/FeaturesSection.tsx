import Image from "next/image";

interface FeatureItem {
  id?: number | string;
  title: string;
  image: string;
  alt: string;
  description: string;
}
async function getFeatures(): Promise<FeatureItem[]> {
  const rawApiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost/saiyoojyam";
  const baseUrl = rawApiUrl.replace(/\/+$/, "");

  try {
    const res = await fetch(`${baseUrl}/api/why-choose`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return [];
    }

    const json = await res.json();

    if (json && json.status && Array.isArray(json.data) && json.data.length > 0) {
      return json.data.map((item: any, idx: number) => ({
        id: item.id || idx,
        title: item.title || "",
        image: item.image || "",
        alt: item.title || "Saiyoojyam Feature",
        description: item.description || "",
      }));
    }
  } catch (err) {
    console.warn("Could not fetch Why Choose from API:", err);
  }

  return [];
}

export async function FeaturesSection() {
  const features = await getFeatures();

  if (!features || features.length === 0) {
    return null;
  }

  return (
    <section className="w-full pt-16 pb-16 bg-surface-container-lowest">
      <div className="max-w-[1280px] mx-auto px-6">
        <h2 className="text-2xl sm:text-5xl font-semibold text-on-surface mb-12 tracking-tight">
          Why Choose Saiyoojyam?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {features.map((feature, idx) => (
            <div
              key={feature.id ?? idx}
              className="flex flex-row md:flex-col items-start gap-4 sm:gap-5 group cursor-pointer"
            >
              {/* Image: left thumbnail on mobile, full width banner on md+ */}
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-full md:h-56 shrink-0 rounded-sm overflow-hidden md:mb-5 shadow-xs sm:shadow-sm bg-gray-100">
                <Image
                  src={feature.image}
                  alt={feature.alt}
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 140px, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Title & Description: right side on mobile, bottom on md+ */}
              <div className="flex flex-col flex-1 min-w-0">
                <h3 className="text-base sm:text-xl md:text-2xl font-bold text-gray-900 mb-1.5 md:mb-3 tracking-tight leading-snug">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed font-medium line-clamp-3 md:line-clamp-none">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
