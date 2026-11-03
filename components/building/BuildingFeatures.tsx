"use client";

import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";

interface BuildingFeaturesProps {
  features: string[];
  title?: string;
  subtitle?: string;
}

export function BuildingFeatures({
  features,
  title = "Facilities & Features",
  subtitle = "Everything provided for a convenient and secure stay",
}: BuildingFeaturesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  if (!features || features.length === 0) {
    return null;
  }

  return (
    <div id="rooms" className="pt-6 space-y-4 scroll-mt-24 pb-6">
      <div>
        <h2 className="text-lg sm:text-xl font-medium text-gray-950">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs sm:text-sm text-gray-700 font-normal mt-0.5">
            {subtitle}
          </p>
        )}
      </div>

      <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 pt-2">
        {features.map((feature, idx) => {
          // In a 2-column grid, items (0 & 1, 2 & 3, etc.) are in the same row
          const rowIndex = Math.floor(idx / 2);
          const delayMs = rowIndex * 100 + 60;

          return (
            <div
              key={`feature-${idx}-${feature.slice(0, 15)}`}
              className={`flex items-start gap-2.5 ${
                isVisible ? "animate-row-fade-in" : "opacity-0"
              }`}
              style={isVisible ? { animationDelay: `${delayMs}ms` } : undefined}
            >
              <div className="mt-0.5 w-4 h-4 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-300">
                <Check className="w-3 h-3 stroke-[2.2]" />
              </div>
              <span className="text-xs sm:text-sm text-gray-900 font-normal leading-relaxed">
                {feature}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
