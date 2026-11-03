import Image from "next/image";
import { Sparkles } from "lucide-react";

export interface GalleryItem {
  image: string;
  title: string;
  caption: string;
}

export interface FoodGalleryData {
  subtitle?: string;
  title?: string;
  description?: string;
  items?: GalleryItem[];
}

interface KitchenGalleryProps {
  data?: FoodGalleryData;
}

const DEFAULT_GALLERY: GalleryItem[] = [
  {
    image: "/why-us/food-quality.png",
    title: "Nutritious Homely Cooking",
    caption:
      "Prepared with top-quality grains, fresh seasonal vegetables, and genuine home recipes.",
  },
  {
    image: "/why-us/dining.png",
    title: "Spacious & Clean Dining Hall",
    caption:
      "A bright, well-organized communal dining hall fostering friendly interactions among residents.",
  },
  {
    image: "/why-us/dining2.png",
    title: "Hygienic Modern Kitchen Facility",
    caption:
      "Clean countertops, separate wash area, food storage refrigerator, and strict daily maintenance.",
  },
  {
    image: "/home-hero/h1.png",
    title: "Pure Drinking Water & Refreshments",
    caption:
      "24/7 boiled herbal drinking water and advanced multi-stage RO water purification plant.",
  },
];

export function KitchenGallery({ data }: KitchenGalleryProps) {
  const subtitle = data?.subtitle || "Campus Dining Experience";
  const title = data?.title || "Glimpse of Our Dining & Kitchen Spaces";
  const description =
    data?.description ||
    "Take a look inside our clean dining environments and food preparation areas maintained daily across our Kakkanad hostel properties.";
  const allItems = data?.items && data.items.length > 0 ? data.items : DEFAULT_GALLERY;
  const items = allItems.slice(0, 3);

  return (
    <section className="w-full py-12 sm:py-16 bg-white">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          {subtitle && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF561C]/10 text-[#FF561C] text-xs font-semibold tracking-wide uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5" /> {subtitle}
            </div>
          )}
          <h2 className="text-2xl sm:text-4xl font-heading font-bold text-gray-950 tracking-tight mb-3">
            {title}
          </h2>
          {description && (
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-normal">
              {description}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {items.map((item, idx) => (
            <div
              key={`gallery-${idx}`}
              className="group rounded-2xl overflow-hidden border border-gray-200/90 bg-white shadow-xs hover:shadow-md transition-all duration-300 flex flex-col"
            >
              <div className="relative w-full h-56 sm:h-64 bg-gray-100 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  unoptimized={item.image.startsWith("http")}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-5 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-heading font-bold text-gray-950 mb-1.5 group-hover:text-[#FF561C] transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                    {item.caption}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
