import { Coffee, Sun, Moon, Soup, Utensils, CheckCircle2 } from "lucide-react";

export interface MealScheduleItem {
  meal: string;
  time: string;
  readyNote: string;
  badge: string;
  icon?: string;
  menuItems: string[];
}

export interface FoodMenuData {
  subtitle?: string;
  title?: string;
  description?: string;
  schedule?: MealScheduleItem[];
}

interface DailyMealScheduleProps {
  data?: FoodMenuData;
}

function renderMealIcon(iconName?: string) {
  const iconProps = { className: "w-5 h-5 sm:w-6 sm:h-6 text-[#FF561C]" };
  switch ((iconName || "").toLowerCase()) {
    case "sun":
      return <Sun {...iconProps} />;
    case "soup":
      return <Soup {...iconProps} />;
    case "coffee":
      return <Coffee {...iconProps} />;
    case "moon":
      return <Moon {...iconProps} />;
    case "utensils":
    default:
      return <Utensils {...iconProps} />;
  }
}

export function DailyMealSchedule({ data }: DailyMealScheduleProps) {
  const schedule = data?.schedule && data.schedule.length > 0 ? data.schedule : [];

  if (!schedule || schedule.length === 0) {
    return null;
  }

  const subtitle = data?.subtitle || "Daily Routine";
  const title = data?.title || "Our Daily Meal Schedule & Menu";
  const description =
    data?.description ||
    "Enjoy a balanced combination of traditional Kerala home cooking and popular North Indian staples, thoughtfully portioned to provide clean, healthy fuel throughout the day.";

  return (
    <section className="w-full py-12 sm:py-16 bg-[#fffaf8]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          {subtitle && (
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#FF561C] mb-2 block">
              {subtitle}
            </span>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {schedule.map((meal, idx) => (
            <div
              key={`meal-${idx}`}
              className="bg-white rounded-2xl border border-orange-100 p-6 sm:p-7 shadow-xs hover:shadow-md transition-shadow duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#FF561C]">
                      {renderMealIcon(meal.icon)}
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-heading font-bold text-gray-950">
                        {meal.meal}
                      </h3>
                      {meal.time && (
                        <span className="text-xs sm:text-sm text-[#FF561C] font-semibold">
                          {meal.time}
                        </span>
                      )}
                    </div>
                  </div>
                  {meal.badge && (
                    <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-orange-50 text-[#FF561C] border border-orange-200/80 shrink-0">
                      {meal.badge}
                    </span>
                  )}
                </div>

                {meal.readyNote && (
                  <p className="text-xs text-gray-500 font-medium italic mb-4">
                    • {meal.readyNote}
                  </p>
                )}

                {meal.menuItems && meal.menuItems.length > 0 && (
                  <>
                    <h4 className="text-xs uppercase tracking-wider font-bold text-gray-900 mb-2.5">
                      Sample Daily Menu Offerings:
                    </h4>
                    <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
                      {meal.menuItems.map((item, mIdx) => (
                        <li key={`m-item-${mIdx}`} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#FF561C] shrink-0 mt-0.5" />
                          <span className="leading-snug font-normal">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
