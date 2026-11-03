"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, LogIn, LogOut, CreditCard, Receipt, FileText, LayoutDashboard } from "lucide-react";
import { LoginModal } from "@/components/global/LoginModal";

interface ProfileDropdownProps {
  theme?: "orange" | "white";
}

export function ProfileDropdown({ theme = "orange" }: ProfileDropdownProps) {
  const router = useRouter();
  const isWhite = theme === "white";
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync user state from localStorage and listen to login events
  useEffect(() => {
    const syncUser = () => {
      try {
        const stored = localStorage.getItem("saiyoojyam_user");
        setUserName(stored || null);
      } catch {
        setUserName(null);
      }
    };

    syncUser();
    window.addEventListener("user-login", syncUser);
    window.addEventListener("storage", syncUser);

    return () => {
      window.removeEventListener("user-login", syncUser);
      window.removeEventListener("storage", syncUser);
    };
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem("saiyoojyam_user");
      localStorage.removeItem("saiyoojyam_user_data");
      window.dispatchEvent(new Event("user-login"));
    } catch {
      // ignore
    }
    setUserName(null);
    setIsDropdownOpen(false);
    if (typeof window !== "undefined" && window.location.pathname.startsWith("/profile")) {
      router.replace("/");
    }
  };

  // Extract first name (e.g. "Ananya Sharma" -> "Ananya")
  const firstName = userName ? userName.trim().split(" ")[0] : null;

  return (
    <>
      <div
        ref={dropdownRef}
        className="relative group/profile py-2"
        onMouseEnter={() => setIsDropdownOpen(true)}
        onMouseLeave={() => setIsDropdownOpen(false)}
      >
        <button
          type="button"
          onClick={() => {
            if (!userName) {
              setIsLoginModalOpen(true);
            } else {
              setIsDropdownOpen((prev) => !prev);
            }
          }}
          aria-label={userName ? `Logged in as ${firstName}` : "User Login"}
          aria-expanded={isDropdownOpen}
          className={`px-2 sm:px-2.5 py-1.5 rounded-lg flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-semibold transition-all active:scale-95 cursor-pointer max-w-[105px] xs:max-w-[135px] sm:max-w-[190px] truncate ${isWhite
            ? "text-white hover:text-orange-100 hover:bg-white/10"
            : "text-[#FF561C] hover:text-[#e0450d] hover:bg-orange-50/50"
            }`}
        >
          <User
            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2] shrink-0 ${isWhite ? "text-white" : "text-[#FF561C]"
              }`}
          />
          <span className="truncate text-xs sm:text-sm">{firstName ? `Hi, ${firstName}` : "Login"}</span>
        </button>

        {/* Dropdown Menu (Opens on hover and on click for mobile/touch) */}
        <div
          className={`absolute right-0 top-full pt-1.5 z-[100] transition-all duration-150 origin-top-right ${
            isDropdownOpen
              ? "block opacity-100 scale-100 translate-y-0"
              : "hidden opacity-0 scale-95 -translate-y-1 group-hover/profile:block group-hover/profile:opacity-100 group-hover/profile:scale-100 group-hover/profile:translate-y-0"
          }`}
        >
          <div className="w-52 xs:w-56 sm:w-64 max-w-[calc(100vw-24px)] bg-white rounded-xl shadow-2xl border border-gray-100 p-2 sm:p-2.5 flex flex-col text-left">
            {userName ? (
              <>
                {/* Welcoming Header */}
                <div className="px-2.5 sm:px-3 py-2 sm:py-2.5 border border-orange-100/80 rounded-lg mb-1.5 flex items-center gap-2 sm:gap-2.5 bg-orange-50/40">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#FF561C] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                    {firstName ? firstName.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] sm:text-[11px] font-medium text-gray-500 leading-none">
                      Welcome
                    </p>
                    <p className="text-xs sm:text-sm font-semibold text-gray-950 truncate mt-0.5">
                      {userName}
                    </p>
                  </div>
                </div>

                {/* Navigation Options */}
                <div className="flex flex-col py-0.5 sm:py-1 text-xs font-medium text-gray-700">
                  <Link
                    href="/profile?tab=dashboard"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2 sm:gap-2.5 px-2.5 sm:px-3 py-2 rounded-lg hover:bg-gray-100 hover:text-[#FF561C] transition-colors active:bg-orange-50"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 shrink-0" />
                    <span className="text-xs sm:text-[13px]">Dashboard</span>
                  </Link>

                  <Link
                    href="/profile?tab=profile"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2 sm:gap-2.5 px-2.5 sm:px-3 py-2 rounded-lg hover:bg-gray-100 hover:text-[#FF561C] transition-colors active:bg-orange-50"
                  >
                    <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 shrink-0" />
                    <span className="text-xs sm:text-[13px]">Profile</span>
                  </Link>

                  <Link
                    href="/profile?tab=monthly-payment"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2 sm:gap-2.5 px-2.5 sm:px-3 py-2 rounded-lg hover:bg-gray-100 hover:text-[#FF561C] transition-colors active:bg-orange-50"
                  >
                    <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 shrink-0" />
                    <span className="text-xs sm:text-[13px]">Monthly Payment</span>
                  </Link>

                  <Link
                    href="/profile?tab=payment-history"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2 sm:gap-2.5 px-2.5 sm:px-3 py-2 rounded-lg hover:bg-gray-100 hover:text-[#FF561C] transition-colors active:bg-orange-50"
                  >
                    <Receipt className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 shrink-0" />
                    <span className="text-xs sm:text-[13px]">Payment History</span>
                  </Link>

                  <Link
                    href="/profile?tab=terms"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2 sm:gap-2.5 px-2.5 sm:px-3 py-2 rounded-lg hover:bg-gray-100 hover:text-[#FF561C] transition-colors active:bg-orange-50"
                  >
                    <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 shrink-0" />
                    <span className="text-xs sm:text-[13px]">Terms and Conditions</span>
                  </Link>
                </div>

                {/* Logout Action */}
                <div className="pt-1.5 mt-1 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 sm:gap-2.5 px-2.5 sm:px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer text-left active:scale-[0.98]"
                  >
                    <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600 shrink-0" />
                    <span className="text-xs sm:text-[13px]">Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="p-2 sm:p-2.5 flex flex-col gap-2.5 sm:gap-3">
                <div className="flex flex-col">
                  <p className="text-xs sm:text-sm font-semibold text-gray-900 mt-0.5">
                    Welcome to Saiyoojyam
                  </p>
                  <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5 leading-relaxed">
                    Manage your hostel bookings, payments, and profile.
                  </p>
                </div>

                <div className="pt-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsLoginModalOpen(true)}
                    className="w-full py-2 px-3 sm:px-4 bg-[#FF561C] hover:bg-[#e0450d] text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm text-center cursor-pointer"
                  >
                    <LogIn className="w-3.5 h-3.5 text-white stroke-[2.5]" />
                    <span>Login</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
}
