"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
  Sparkles,
} from "lucide-react";

export interface FancyDatePickerCustomTriggerProps {
  displayLabel: string;
  isOpen: boolean;
  toggle: () => void;
  clear: () => void;
  value: string;
}

export interface FancyDatePickerProps {
  label: string;
  value: string; // Format: "YYYY-MM-DD"
  onChange: (date: string) => void;
  minDate?: string; // Format: "YYYY-MM-DD"
  maxDate?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  align?: "left" | "right" | "center";
  position?: "top" | "bottom";
  customTrigger?: (props: FancyDatePickerCustomTriggerProps) => React.ReactNode;
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKDAY_NAMES = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const padZero = (n: number) => String(n).padStart(2, "0");

const formatDateStr = (y: number, m: number, d: number) =>
  `${y}-${padZero(m + 1)}-${padZero(d)}`;

export function FancyDatePicker({
  label,
  value,
  onChange,
  minDate,
  maxDate,
  placeholder = "Select date",
  required = false,
  className = "",
  align = "left",
  position = "bottom",
  customTrigger,
}: FancyDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Today's date reference
  const today = useMemo(() => new Date(), []);
  const todayStr = useMemo(
    () => formatDateStr(today.getFullYear(), today.getMonth(), today.getDate()),
    [today]
  );

  // Determine initial calendar view month & year
  const initialDate = useMemo(() => {
    if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [y, m, d] = value.split("-").map(Number);
      return new Date(y, m - 1, d);
    }
    if (minDate && /^\d{4}-\d{2}-\d{2}$/.test(minDate)) {
      const [y, m, d] = minDate.split("-").map(Number);
      return new Date(y, m - 1, d);
    }
    return new Date();
  }, [value, minDate]);

  const [viewYear, setViewYear] = useState<number>(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(initialDate.getMonth());

  // Update view when value changes
  useEffect(() => {
    if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [y, m] = value.split("-").map(Number);
      setViewYear(y);
      setViewMonth(m - 1);
    }
  }, [value]);

  // Click outside listener to close calendar
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Format human-readable display string
  const displayLabel = useMemo(() => {
    if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return "";
    const [y, m, d] = value.split("-").map(Number);
    const dateObj = new Date(y, m - 1, d);
    return dateObj.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }, [value]);

  // Navigation handlers
  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((prev) => prev - 1);
    } else {
      setViewMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((prev) => prev + 1);
    } else {
      setViewMonth((prev) => prev + 1);
    }
  };

  // Calendar days grid calculations
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const prevMonthDays = new Date(viewYear, viewMonth, 0).getDate();

    const days: {
      day: number;
      dateStr: string;
      isCurrentMonth: boolean;
      isDisabled: boolean;
      isToday: boolean;
      isSelected: boolean;
    }[] = [];

    // Previous month filler days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const prevDay = prevMonthDays - i;
      const prevMonth = viewMonth === 0 ? 11 : viewMonth - 1;
      const prevYear = viewMonth === 0 ? viewYear - 1 : viewYear;
      const dateStr = formatDateStr(prevYear, prevMonth, prevDay);
      days.push({
        day: prevDay,
        dateStr,
        isCurrentMonth: false,
        isDisabled: true,
        isToday: dateStr === todayStr,
        isSelected: dateStr === value,
      });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = formatDateStr(viewYear, viewMonth, d);
      const isPastMin = minDate ? dateStr < minDate : false;
      const isAfterMax = maxDate ? dateStr > maxDate : false;
      const isDisabled = isPastMin || isAfterMax;

      days.push({
        day: d,
        dateStr,
        isCurrentMonth: true,
        isDisabled,
        isToday: dateStr === todayStr,
        isSelected: dateStr === value,
      });
    }

    // Next month filler days to complete grid rows
    const totalCells = Math.ceil(days.length / 7) * 7;
    const remaining = totalCells - days.length;
    for (let d = 1; d <= remaining; d++) {
      const nextMonth = viewMonth === 11 ? 0 : viewMonth + 1;
      const nextYear = viewMonth === 11 ? viewYear + 1 : viewYear;
      const dateStr = formatDateStr(nextYear, nextMonth, d);
      days.push({
        day: d,
        dateStr,
        isCurrentMonth: false,
        isDisabled: true,
        isToday: dateStr === todayStr,
        isSelected: dateStr === value,
      });
    }

    return days;
  }, [viewYear, viewMonth, minDate, maxDate, value, todayStr]);

  const handleSelectDate = (dateStr: string) => {
    onChange(dateStr);
    setIsOpen(false);
  };

  // Quick preset shortcuts
  const handleQuickSelect = (daysFromToday: number) => {
    const target = new Date();
    target.setDate(target.getDate() + daysFromToday);
    const dateStr = formatDateStr(
      target.getFullYear(),
      target.getMonth(),
      target.getDate()
    );
    if (minDate && dateStr < minDate) return;
    if (maxDate && dateStr > maxDate) return;
    onChange(dateStr);
    setViewYear(target.getFullYear());
    setViewMonth(target.getMonth());
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {customTrigger ? (
        customTrigger({
          displayLabel,
          isOpen,
          toggle: () => setIsOpen((prev) => !prev),
          clear: () => onChange(""),
          value,
        })
      ) : (
        <>
          {/* Floating Outline Label */}
          <label className="absolute -top-2.5 left-3 px-1.5 bg-white text-[11px] font-semibold text-gray-700 z-10 pointer-events-none">
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
          </label>

          {/* Fancy Trigger Button */}
          <div
            onClick={() => setIsOpen((prev) => !prev)}
            className={`w-full h-11 px-3 bg-white border rounded-md text-xs sm:text-sm shadow-xs flex items-center justify-between cursor-pointer select-none transition-all group ${
              isOpen
                ? "border-[#FF561C] ring-2 ring-[#FF561C]/20 shadow-sm"
                : "border-gray-300 hover:border-[#FF561C]/70"
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0 pr-1">
              <div
                className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 transition-all ${
                  value
                    ? "bg-orange-100/80 text-[#FF561C]"
                    : "bg-gray-100 text-gray-500 group-hover:text-[#FF561C] group-hover:bg-orange-50"
                }`}
              >
                <CalendarIcon className="w-3.5 h-3.5" />
              </div>
              {value ? (
                <span className="font-semibold text-gray-950 truncate text-xs sm:text-[13px]">
                  {displayLabel}
                </span>
              ) : (
                <span className="text-gray-400 font-normal truncate text-xs sm:text-[13px]">
                  {placeholder}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {value && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange("");
                  }}
                  className="w-5 h-5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 flex items-center justify-center transition-colors cursor-pointer"
                  title="Clear date"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                  isOpen ? "rotate-180 text-[#FF561C]" : ""
                }`}
              />
            </div>
          </div>
        </>
      )}

      {/* Fancy Popover Calendar */}
      {isOpen && (
        <div
          className={`absolute ${
            position === "top" ? "bottom-full mb-2" : "top-full mt-2"
          } ${
            align === "right"
              ? "right-0 left-auto"
              : align === "center"
              ? "left-1/2 -translate-x-1/2"
              : "left-0 right-auto"
          } w-[290px] sm:w-[320px] max-w-[calc(100vw-2.5rem)] bg-white rounded-2xl shadow-2xl border border-gray-200/90 p-4 z-[120] animate-in fade-in zoom-in-95 duration-150 font-sans-normal`}
        >
          {/* Header: Month & Year with Navigation Buttons */}
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h4 className="text-sm font-bold text-gray-950 tracking-tight">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </h4>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="w-7 h-7 rounded-lg hover:bg-gray-100 text-gray-700 flex items-center justify-center transition-colors cursor-pointer active:scale-95"
                aria-label="Previous month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="w-7 h-7 rounded-lg hover:bg-gray-100 text-gray-700 flex items-center justify-center transition-colors cursor-pointer active:scale-95"
                aria-label="Next month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Select Shortcut Badges */}
          <div className="flex items-center gap-1.5 pt-2.5 pb-2 border-b border-gray-100 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => handleQuickSelect(0)}
              className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-gray-100 hover:bg-orange-50 hover:text-[#C44610] text-gray-700 transition-all cursor-pointer whitespace-nowrap active:scale-95"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => handleQuickSelect(1)}
              className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-gray-100 hover:bg-orange-50 hover:text-[#C44610] text-gray-700 transition-all cursor-pointer whitespace-nowrap active:scale-95"
            >
              Tomorrow
            </button>
            <button
              type="button"
              onClick={() => handleQuickSelect(7)}
              className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-gray-100 hover:bg-orange-50 hover:text-[#C44610] text-gray-700 transition-all cursor-pointer whitespace-nowrap active:scale-95"
            >
              In 1 Week
            </button>
          </div>

          {/* Weekday Column Headers */}
          <div className="grid grid-cols-7 gap-1 pt-3 text-center">
            {WEEKDAY_NAMES.map((w, idx) => (
              <span
                key={idx}
                className="text-[11px] font-semibold text-gray-600 uppercase tracking-wider py-1"
              >
                {w}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 pt-1">
            {calendarDays.map((dItem, idx) => {
              if (!dItem.isCurrentMonth) {
                return (
                  <div
                    key={`filler-${idx}`}
                    className="h-8 flex items-center justify-center text-xs text-gray-300 pointer-events-none select-none font-normal"
                  >
                    {dItem.day}
                  </div>
                );
              }

              if (dItem.isDisabled) {
                return (
                  <div
                    key={`disabled-${idx}`}
                    className="h-8 flex items-center justify-center text-xs text-gray-300 font-normal cursor-not-allowed select-none line-through"
                  >
                    {dItem.day}
                  </div>
                );
              }

              const isSelected = dItem.isSelected;
              const isToday = dItem.isToday;

              return (
                <button
                  key={`day-${dItem.dateStr}`}
                  type="button"
                  onClick={() => handleSelectDate(dItem.dateStr)}
                  className={`h-8 rounded-xl text-xs font-semibold flex items-center justify-center transition-all cursor-pointer active:scale-95 relative ${
                    isSelected
                      ? "bg-gradient-to-br from-[#FF561C] to-[#E0450D] text-white shadow-md shadow-orange-500/30 font-bold scale-105"
                      : isToday
                      ? "border border-[#FF561C] bg-orange-50/70 text-[#C44610] hover:bg-[#FF561C] hover:text-white"
                      : "text-gray-800 hover:bg-orange-50 hover:text-[#FF561C]"
                  }`}
                >
                  <span>{dItem.day}</span>
                  {isToday && !isSelected && (
                    <span className="w-1 h-1 rounded-full bg-[#FF561C] absolute bottom-1" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Bottom Selected Indicator Helper */}
          {value && (
            <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
              <span className="flex items-center gap-1 text-[#C44610] font-medium">
                <Sparkles className="w-3 h-3 text-[#FF561C]" />
                <span>Selected:</span>
              </span>
              <span className="font-semibold text-gray-950">
                {displayLabel}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
