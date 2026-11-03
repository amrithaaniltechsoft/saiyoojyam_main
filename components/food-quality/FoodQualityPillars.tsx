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
  const items = data?.items && data.items.length > 0 ? data.items : [];

  if (!items || items.length === 0) {
    return null;
  }

  const subtitle = data?.subtitle || "Our Food Commitment";
  const title = data?.title || "Quality Food You Can Truly Trust Every Day";
  const description =
    data?.description ||
    "For working women living away from family, healthy food is the biggest concern. We take personal pride in serving home-style meals that bring energy, comfort, and peace of mind.";

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
