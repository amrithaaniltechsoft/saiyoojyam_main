import { UtensilsCrossed, Clock, Droplets, Sparkles, Heart, Apple, ShieldCheck, Utensils } from "lucide-react";

export interface PillarItem {
  title: string;
  subtitle: string;
  description: string;
  icon?: string;
}

export interface FoodPillarsData {
  subtitle?: string;
  title?: string;
  description?: string;
  items?: PillarItem[];
}

interface FoodQualityPillarsProps {
  data?: FoodPillarsData;
}

const DEFAULT_PILLARS: PillarItem[] = [
  {
    icon: "Heart",
    title: "100% Homely & Healthy Cooking",
    subtitle: "Just like home, never commercialized",
    description:
      "We prepare meals with fresh daily vegetables, high-grade spices, and optimal oil levels. We completely avoid MSG, tasting powders, or artificial food colorings, ensuring easy digestion and consistent well-being.",
  },
  {
    icon: "Clock",
    title: "Punctual Morning Routine (7:30 AM)",
    subtitle: "Hot breakfast & packed lunch ready early",
    description:
      "We understand corporate shifts at Infopark, SmartCity, and college lecture schedules. Both warm breakfast and packed tiffin lunchboxes are ready by 7:30 AM sharp, so you never rush on an empty stomach.",
  },
  {
    icon: "Droplets",
    title: "24/7 Pure Boiled Water & RO Plant",
    subtitle: "Zero compromise on hydration & purity",
    description:
      "Our hostels feature advanced multi-stage RO water treatment plants along with warm, boiled herbal drinking water available 24 hours a day, safeguarding residents against water-borne illnesses.",
  },
  {
    icon: "Sparkles",
    title: "Hygienic Dining & Clean Cookware",
    subtitle: "Sanitized preparation and dining halls",
    description:
      "Cooking areas and stainless-steel cookware are thoroughly sterilized after every meal session. Spacious, well-ventilated dining halls offer a clean, relaxed environment to dine with your fellow hostel mates.",
  },
];

function renderPillarIcon(iconName?: string) {
  const iconProps = { className: "w-6 h-6 text-[#FF561C]" };
  switch ((iconName || "").toLowerCase()) {
    case "heart":
      return <Heart {...iconProps} />;
    case "clock":
      return <Clock {...iconProps} />;
    case "droplets":
    case "water":
      return <Droplets {...iconProps} />;
    case "sparkles":
      return <Sparkles {...iconProps} />;
    case "shieldcheck":
      return <ShieldCheck {...iconProps} />;
    case "utensils":
    default:
      return <Utensils {...iconProps} />;
  }
}

export function FoodQualityPillars({ data }: FoodQualityPillarsProps) {
  const subtitle = data?.subtitle || "Our Food Commitment";
  const title = data?.title || "Quality Food You Can Truly Trust Every Day";
  const description =
    data?.description ||
    "For working women living away from family, healthy food is the biggest concern. We take personal pride in serving home-style meals that bring energy, comfort, and peace of mind.";
  const items = data?.items && data.items.length > 0 ? data.items : DEFAULT_PILLARS;

  return (
    <section className="w-full py-12 sm:py-16 bg-white">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          {subtitle && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF561C]/10 text-[#FF561C] text-xs font-semibold tracking-wide uppercase mb-3">
              <Apple className="w-3.5 h-3.5" /> {subtitle}
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((pillar, idx) => (
            <div
              key={`pillar-${idx}`}
              className="bg-orange-50/30 hover:bg-orange-50/70 border border-orange-100 rounded-2xl p-6 transition-all duration-200 flex flex-col items-start justify-between group shadow-2xs hover:shadow-xs"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-white border border-orange-200/80 text-[#FF561C] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-200 shadow-2xs">
                  {renderPillarIcon(pillar.icon)}
                </div>
                <h3 className="text-base sm:text-lg font-heading font-bold text-gray-950 mb-1">
                  {pillar.title}
                </h3>
                {pillar.subtitle && (
                  <span className="text-xs font-semibold text-[#FF561C] block mb-3">
                    {pillar.subtitle}
                  </span>
                )}
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-normal">
                  {pillar.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
