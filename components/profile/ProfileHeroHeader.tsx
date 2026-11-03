import { Sparkles, LogOut } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { DashboardInmate } from "./types";

export type ProfileTab = "dashboard" | "profile" | "monthly-payment" | "payment-history" | "terms";

export interface TabItem {
  id: ProfileTab;
  label: string;
  icon: LucideIcon;
}

interface ProfileHeroHeaderProps {
  userName: string;
  activeTab: ProfileTab;
  tabs: TabItem[];
  onTabChange: (tab: ProfileTab) => void;
  onLogout: () => void;
  inmate?: DashboardInmate | null;
}

export function ProfileHeroHeader({
  userName,
  activeTab,
  tabs,
  onTabChange,
  onLogout,
  inmate,
}: ProfileHeroHeaderProps) {
  const displayName = inmate?.name || userName;
  const initial = displayName.trim() ? displayName.trim().charAt(0).toUpperCase() : "U";

  return (
    <div className="w-full bg-[#FF561C] text-white pt-6 sm:pt-8 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 relative shadow-inner">
      <div className="max-w-[1240px] mx-auto flex flex-col gap-6">
        {/* User Profile Overview */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Circular Avatar */}
            <div className="w-14 h-14 sm:w-18 sm:h-18 lg:w-20 lg:h-20 rounded-full bg-white text-[#FF561C] flex items-center justify-center font-bold text-xl sm:text-2xl lg:text-3xl shrink-0 shadow-md">
              {initial}
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight">
                Hi, {displayName}
              </h1>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className="text-xs sm:text-sm md:text-base text-white/95 font-medium">
                  {inmate?.building_name ? `${inmate.building_name} · Room ${inmate.room_name || "-"}` : "Saiyoojyam Resident"}
                </span>
                {inmate?.uid && (
                  <span className="px-2 py-0.5 rounded bg-white/20 text-white font-semibold text-[11px] sm:text-xs tracking-wide">
                    {inmate.uid}
                  </span>
                )}
                {inmate?.status && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/80 text-white font-semibold text-[10px] sm:text-[11px] capitalize flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    {inmate.status}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Logout CTA */}
          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              type="button"
              onClick={onLogout}
              className="px-3.5 sm:px-4 py-1.5 sm:py-2 bg-white hover:bg-red-50 text-red-600 text-xs sm:text-sm font-semibold rounded-lg transition-colors flex items-center gap-1.5 sm:gap-2 cursor-pointer active:scale-95 shadow-xs"
            >
              <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Horizontal Nav Bar Tabs */}
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar pt-2 border-t border-white/20 -mx-4 px-4 sm:mx-0 sm:px-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${isActive
                  ? "bg-white text-[#FF561C] shadow-sm"
                  : "text-white/90 hover:text-white hover:bg-white/10"
                  }`}
              >
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
