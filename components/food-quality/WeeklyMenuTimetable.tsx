"use client";

import React, { useState, useEffect } from "react";
import {
  Sun,
  Utensils,
  Coffee,
  Moon,
  Calendar,
  Sparkles,
  LayoutGrid,
  Table as TableIcon,
  CheckCircle2,
  Clock,
} from "lucide-react";

export interface WeeklyDayMenu {
  day: string;
  breakfast: string;
  lunch: string;
  teaTime: string;
  dinner: string;
}

export const DEFAULT_WEEKLY_MENU: WeeklyDayMenu[] = [
  {
    day: "MONDAY",
    breakfast: "TEA, PUTTU & KADALA CURRY",
    lunch: "RICE & VEGGIES\n(Thoran/ Mezhukku Puratti & Curries)",
    teaTime:
      "TEA & ANY ONE SNACK\n(Uzhunnu Vada, Parippu Vada, Bread Baji, Pazham Pori, Bonda, Unniyappam, Kozhukatta)",
    dinner: "APPAM/ IDIYAPPAM & EGG/ VEG CURRY",
  },
  {
    day: "TUESDAY",
    breakfast: "TEA, DOSA, SAMBAR & CHUTNY",
    lunch: "RICE & VEGGIES",
    teaTime: "TEA & RUSK/ BISCUIT",
    dinner: "GHEE RICE & CHICKEN/ VEG CURRY",
  },
  {
    day: "WEDNESDAY",
    breakfast: "TEA, IDLY, SAMBAR & CHUTNY",
    lunch: "RICE, FISH FRY & VEGGIES",
    teaTime: "TEA & ONE SNACK",
    dinner: "CHAPATHI & EGG/ VEG CURRY",
  },
  {
    day: "THURSDAY",
    breakfast: "TEA, APPAM & STEW/ KURUMA",
    lunch: "RICE & VEGGIES",
    teaTime: "TEA & RUSK/ BISCUIT",
    dinner: "CHICKEN/ VEG BIRIYANI",
  },
  {
    day: "FRIDAY",
    breakfast: "TEA, PUTTU & KADALA CURRY",
    lunch: "RICE & VEGGIES",
    teaTime: "TEA & ONE SNACK",
    dinner: "CHAPATHI & VEG CURRY",
  },
  {
    day: "SATURDAY",
    breakfast: "TEA, DOSA, SAMBAR & CHUTNY",
    lunch: "RICE & VEGGIES",
    teaTime: "TEA & ONE SNACK",
    dinner: "POROTTA & CHICKEN/ VEG CURRY",
  },
  {
    day: "SUNDAY",
    breakfast: "TEA, PURI & POTATO CURRY",
    lunch: "RICE, FISH CURRY & VEGGIES",
    teaTime: "TEA & RUSK/ BISCUIT",
    dinner: "KANJI, THORAN & CHAMMANTHI/ PAPPAD",
  },
];

interface WeeklyMenuTimetableProps {
  schedule?: WeeklyDayMenu[];
}

function formatMealCell(content: string) {
  if (!content) {
    return <span className="text-gray-400 italic text-xs">—</span>;
  }

  // Check for parenthetical notes like (Thoran/ Mezhukku Puratti & Curries) or (Uzhunnu Vada...)
  const match = content.match(/^([\s\S]*?)\s*(\([^\)]+\))\s*$/);
  if (match) {
    const main = match[1].trim();
    const note = match[2].trim();
    return (
      <div className="space-y-1.5">
        <div className="font-semibold text-gray-950 text-xs sm:text-sm tracking-tight leading-snug">
          {main}
        </div>
        <div className="text-[11px] sm:text-xs text-orange-950/80 bg-orange-50/90 border border-orange-200/70 rounded-md px-2 py-1 leading-relaxed inline-block">
          {note}
        </div>
      </div>
    );
  }

  const lines = content.split("\n").map((l) => l.trim()).filter(Boolean);
  if (lines.length > 1) {
    return (
      <div className="space-y-1">
        {lines.map((line, idx) => (
          <div
            key={idx}
            className={
              idx === 0
                ? "font-semibold text-gray-950 text-xs sm:text-sm leading-snug"
                : "text-[11px] sm:text-xs text-orange-950/80 bg-orange-50/70 border border-orange-100 rounded px-1.5 py-0.5 inline-block"
            }
          >
            {line}
          </div>
        ))}
      </div>
    );
  }

  return (
    <span className="font-semibold text-gray-950 text-xs sm:text-sm tracking-tight leading-snug">
      {content}
    </span>
  );
}

export function WeeklyMenuTimetable({ schedule }: WeeklyMenuTimetableProps) {
  const menuData = schedule && schedule.length > 0 ? schedule : DEFAULT_WEEKLY_MENU;
  const [selectedDay, setSelectedDay] = useState<string>("ALL");
  const [todayName, setTodayName] = useState<string>("");
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  useEffect(() => {
    const days = [
      "SUNDAY",
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
    ];
    const currentDay = days[new Date().getDay()];
    setTodayName(currentDay);
  }, []);

  const displayedRows =
    selectedDay === "ALL"
      ? menuData
      : menuData.filter(
          (m) => m.day.toUpperCase() === selectedDay.toUpperCase()
        );

  return (
    <section className="w-full py-8 sm:py-12 bg-white">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Controls Bar: Day Pills Filter & View Switcher */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 sm:mb-8 pb-4 border-b border-gray-100">
          {/* Day selection tabs */}
          <div className="w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            <div className="flex items-center gap-1.5 min-w-max">
              <button
                type="button"
                onClick={() => setSelectedDay("ALL")}
                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                  selectedDay === "ALL"
                    ? "bg-[#FF561C] text-white shadow-xs"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All 7 Days
              </button>

              {menuData.map((item) => {
                const isSelected = selectedDay === item.day.toUpperCase();
                const isToday = todayName === item.day.toUpperCase();
                return (
                  <button
                    key={item.day}
                    type="button"
                    onClick={() => setSelectedDay(item.day.toUpperCase())}
                    className={`relative px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? "bg-[#FF561C] text-white shadow-xs"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <span>{item.day}</span>
                    {isToday && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                          isSelected
                            ? "bg-white text-[#FF561C]"
                            : "bg-[#FF561C] text-white"
                        }`}
                      >
                        Today
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* View Mode Switcher (Table vs Card view) */}
          <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
            <div className="inline-flex rounded-lg border border-gray-200 p-0.5 bg-gray-50 text-gray-600">
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                  viewMode === "table"
                    ? "bg-white text-gray-950 shadow-xs"
                    : "hover:text-gray-900"
                }`}
                title="Table View"
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Table View</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("cards")}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                  viewMode === "cards"
                    ? "bg-white text-gray-950 shadow-xs"
                    : "hover:text-gray-900"
                }`}
                title="Cards View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Cards View</span>
              </button>
            </div>
          </div>
        </div>

        {/* 1. TABLE VIEW */}
        {viewMode === "table" ? (
          <div className="relative">
            {/* Horizontal scroll hint on mobile */}
            <div className="block lg:hidden text-[11px] text-gray-500 mb-2 italic flex items-center gap-1">
              <span>👉 Swipe horizontally to view all meals</span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-orange-100 shadow-sm bg-white">
              <table className="w-full text-left border-collapse min-w-[860px]">
                <thead>
                  <tr className="bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 text-gray-900 border-b border-orange-200/80">
                    <th className="py-4 px-4 sm:px-6 font-heading font-bold text-xs sm:text-sm tracking-wider uppercase text-gray-950 w-[140px]">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-[#FF561C]" />
                        <span>DAYS</span>
                      </div>
                    </th>
                    <th className="py-4 px-4 sm:px-6 font-heading font-bold text-xs sm:text-sm tracking-wider uppercase text-gray-950 w-[22%]">
                      <div className="flex items-center gap-1.5">
                        <Sun className="w-4 h-4 text-[#FF561C]" />
                        <span>BREAKFAST</span>
                      </div>
                    </th>
                    <th className="py-4 px-4 sm:px-6 font-heading font-bold text-xs sm:text-sm tracking-wider uppercase text-gray-950 w-[26%]">
                      <div className="flex items-center gap-1.5">
                        <Utensils className="w-4 h-4 text-[#FF561C]" />
                        <span>LUNCH</span>
                      </div>
                    </th>
                    <th className="py-4 px-4 sm:px-6 font-heading font-bold text-xs sm:text-sm tracking-wider uppercase text-gray-950 w-[26%]">
                      <div className="flex items-center gap-1.5">
                        <Coffee className="w-4 h-4 text-[#FF561C]" />
                        <span>TEA TIME</span>
                      </div>
                    </th>
                    <th className="py-4 px-4 sm:px-6 font-heading font-bold text-xs sm:text-sm tracking-wider uppercase text-gray-950 w-[24%]">
                      <div className="flex items-center gap-1.5">
                        <Moon className="w-4 h-4 text-[#FF561C]" />
                        <span>DINNER</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-orange-100/70 text-gray-800">
                  {displayedRows.map((row, idx) => {
                    const isToday = todayName === row.day.toUpperCase();
                    return (
                      <tr
                        key={row.day}
                        className={`transition-colors duration-150 ${
                          isToday
                            ? "bg-orange-50/50 hover:bg-orange-50/80"
                            : idx % 2 === 0
                            ? "bg-white hover:bg-orange-50/20"
                            : "bg-[#fffcf9] hover:bg-orange-50/30"
                        }`}
                      >
                        {/* Day Column */}
                        <td className="py-4 px-4 sm:px-6 align-top">
                          <div className="flex flex-col items-start gap-1">
                            <span
                              className={`font-heading font-bold text-xs sm:text-sm tracking-wide px-2.5 py-1 rounded-md ${
                                isToday
                                  ? "bg-[#FF561C] text-white shadow-xs"
                                  : "bg-gray-100 text-gray-900 border border-gray-200/80"
                              }`}
                            >
                              {row.day}
                            </span>
                            {isToday && (
                              <span className="text-[10px] font-bold text-[#FF561C] flex items-center gap-1 mt-0.5">
                                <Sparkles className="w-3 h-3" /> Today&apos;s Menu
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Breakfast */}
                        <td className="py-4 px-4 sm:px-6 align-top">
                          {formatMealCell(row.breakfast)}
                        </td>

                        {/* Lunch */}
                        <td className="py-4 px-4 sm:px-6 align-top">
                          {formatMealCell(row.lunch)}
                        </td>

                        {/* Tea Time */}
                        <td className="py-4 px-4 sm:px-6 align-top">
                          {formatMealCell(row.teaTime)}
                        </td>

                        {/* Dinner */}
                        <td className="py-4 px-4 sm:px-6 align-top">
                          {formatMealCell(row.dinner)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* 2. CARDS VIEW (Clean responsive stacked cards for each day) */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedRows.map((row) => {
              const isToday = todayName === row.day.toUpperCase();
              return (
                <div
                  key={row.day}
                  className={`rounded-2xl border p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between ${
                    isToday
                      ? "bg-orange-50/40 border-orange-300 shadow-sm ring-1 ring-orange-200"
                      : "bg-white border-orange-100 shadow-xs hover:shadow-md hover:border-orange-200"
                  }`}
                >
                  <div>
                    {/* Day Header Badge */}
                    <div className="flex items-center justify-between gap-2 pb-4 mb-4 border-b border-orange-100">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#FF561C]" />
                        <h3 className="font-heading font-bold text-base sm:text-lg text-gray-950">
                          {row.day}
                        </h3>
                      </div>
                      {isToday ? (
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#FF561C] text-white">
                          Today
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold text-gray-500">
                          Weekly Menu
                        </span>
                      )}
                    </div>

                    {/* Meal 1: Breakfast */}
                    <div className="mb-4">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#FF561C] uppercase tracking-wider mb-1.5">
                        <Sun className="w-3.5 h-3.5" />
                        <span>Breakfast</span>
                      </div>
                      <div className="pl-5 text-gray-800">
                        {formatMealCell(row.breakfast)}
                      </div>
                    </div>

                    {/* Meal 2: Lunch */}
                    <div className="mb-4">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#FF561C] uppercase tracking-wider mb-1.5">
                        <Utensils className="w-3.5 h-3.5" />
                        <span>Lunch</span>
                      </div>
                      <div className="pl-5 text-gray-800">
                        {formatMealCell(row.lunch)}
                      </div>
                    </div>

                    {/* Meal 3: Tea Time */}
                    <div className="mb-4">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#FF561C] uppercase tracking-wider mb-1.5">
                        <Coffee className="w-3.5 h-3.5" />
                        <span>Tea Time</span>
                      </div>
                      <div className="pl-5 text-gray-800">
                        {formatMealCell(row.teaTime)}
                      </div>
                    </div>

                    {/* Meal 4: Dinner */}
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#FF561C] uppercase tracking-wider mb-1.5">
                        <Moon className="w-3.5 h-3.5" />
                        <span>Dinner</span>
                      </div>
                      <div className="pl-5 text-gray-800">
                        {formatMealCell(row.dinner)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

