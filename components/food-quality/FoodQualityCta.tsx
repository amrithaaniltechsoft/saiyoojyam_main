import Link from "next/link";
import { MessageCircle, ArrowRight, Utensils } from "lucide-react";

export interface FoodCtaData {
  title?: string;
  description?: string;
  whatsapp_number?: string;
  whatsapp_button_text?: string;
  secondary_button_text?: string;
  secondary_button_link?: string;
}

interface FoodQualityCtaProps {
  data?: FoodCtaData;
}

export function FoodQualityCta({ data }: FoodQualityCtaProps) {
  const title = data?.title || "Have Special Dietary Questions?";
  const description =
    data?.description ||
    "Reach out to our hostel team anytime on WhatsApp. We are happy to walk you through our weekly menu, food hygiene standards, and room tariffs.";
  const whatsappNumber = data?.whatsapp_number || "918129339122";
  const whatsappButtonText = data?.whatsapp_button_text || "Chat on WhatsApp";
  const secondaryButtonText = data?.secondary_button_text || "Explore Rooms";
  const secondaryButtonLink = data?.secondary_button_link || "/search";

  const whatsappMessage = encodeURIComponent(
    "Hello Saiyoojyam! I would like to inquire about your hostel food quality, meal timings, and room availability."
  );

  return (
    <section className="w-full py-12 sm:py-16 bg-white border-t border-gray-100">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-gradient-to-r from-orange-50 via-white to-orange-50 p-6 sm:p-10 border border-orange-200/80 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="flex items-start gap-4 text-left">
            <div className="w-12 h-12 rounded-xl bg-[#FF561C] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Utensils className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-heading font-bold text-gray-950 mb-1">
                {title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 max-w-xl font-normal">
                {description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap sm:flex-nowrap w-full md:w-auto">
            <a
              href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm transition-colors shadow-xs w-full sm:w-auto"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{whatsappButtonText}</span>
            </a>
            <Link
              href={secondaryButtonLink}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#FF561C] hover:bg-[#e0440d] text-white font-semibold text-xs sm:text-sm transition-colors shadow-xs w-full sm:w-auto"
            >
              <span>{secondaryButtonText}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
