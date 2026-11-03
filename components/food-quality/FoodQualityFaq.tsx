import { HelpCircle } from "lucide-react";

export interface FaqItem {
  q: string;
  a: string;
}

export interface FoodFaqData {
  subtitle?: string;
  title?: string;
  description?: string;
  items?: FaqItem[];
}

interface FoodQualityFaqProps {
  data?: FoodFaqData;
}

export function FoodQualityFaq({ data }: FoodQualityFaqProps) {
  const items = data?.items && data.items.length > 0 ? data.items : [];

  if (!items || items.length === 0) {
    return null;
  }

  const subtitle = data?.subtitle || "Dining FAQ";
  const title = data?.title || "Frequently Asked Questions";
  const description =
    data?.description ||
    "Everything you need to know about dining routines, food quality, and kitchen facilities.";

  return (
    <section className="w-full py-12 sm:py-16 bg-[#fffaf8]">
      <div className="max-w-[960px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          {subtitle && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF561C]/10 text-[#FF561C] text-xs font-semibold tracking-wide uppercase mb-3">
              <HelpCircle className="w-3.5 h-3.5" /> {subtitle}
            </div>
          )}
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-gray-950 tracking-tight mb-2">
            {title}
          </h2>
          {description && (
            <p className="text-xs sm:text-sm text-gray-600 font-normal">
              {description}
            </p>
          )}
        </div>

        <div className="space-y-4">
          {items.map((faq, idx) => (
            <div
              key={`faq-${idx}`}
              className="bg-white rounded-xl p-5 sm:p-6 border border-orange-100 shadow-2xs hover:shadow-xs transition-shadow"
            >
              <h3 className="text-sm sm:text-base font-heading font-bold text-gray-950 mb-2 flex items-start gap-2">
                <span className="text-[#FF561C] font-bold">Q:</span>
                <span>{faq.q}</span>
              </h3>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-normal pl-5">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
