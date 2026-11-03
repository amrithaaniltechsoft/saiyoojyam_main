"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  LayoutDashboard,
  User,
  CreditCard,
  Receipt,
  FileText,
  Loader2,
} from "lucide-react";

import {
  ProfileHeroHeader,
  type ProfileTab,
  type TabItem,
} from "@/components/profile/ProfileHeroHeader";
import { DashboardTab } from "@/components/profile/DashboardTab";
import { ProfileDetailsTab } from "@/components/profile/ProfileDetailsTab";
import { MonthlyPaymentTab } from "@/components/profile/MonthlyPaymentTab";
import { PaymentHistoryTab } from "@/components/profile/PaymentHistoryTab";
import { TermsTab } from "@/components/profile/TermsTab";
import type { DashboardData } from "@/components/profile/types";

const TABS: TabItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "profile", label: "Profile", icon: User },
  { id: "monthly-payment", label: "Monthly Payment", icon: CreditCard },
  { id: "payment-history", label: "Payment History", icon: Receipt },
  { id: "terms", label: "Terms & Conditions", icon: FileText },
];

interface ProfileViewProps {
  initialTab?: ProfileTab;
}

export function ProfileView({ initialTab = "dashboard" }: ProfileViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState<ProfileTab>(initialTab);
  const [userName, setUserName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [userId, setUserId] = useState<number | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const fetchDashboard = useCallback(async (userData: any, fallbackName: string) => {
    try {
      setIsLoadingData(true);
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost/saiyoojyam";
      const params = new URLSearchParams();

      if (userData?.inmates_id) {
        params.append("inmate_id", String(userData.inmates_id));
      }
      if (userData?.id) {
        params.append("user_id", String(userData.id));
      }
      if (userData?.email) {
        params.append("email", userData.email);
      }
      if (userData?.username) {
        params.append("username", userData.username);
      } else if (fallbackName) {
        params.append("username", fallbackName);
      }

      const res = await fetch(`${baseUrl}/api/inmates/dashboard?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        if (json?.status && json?.data) {
          setDashboardData(json.data);
          if (json.data.inmate) {
            const inm = json.data.inmate;
            if (inm.username) setUserName(inm.username);
            else if (inm.name) setUserName(inm.name);
            if (inm.email) setEmail(inm.email);
            if (inm.phone) setPhone(inm.phone);
            if (inm.user_id) setUserId(inm.user_id);
          }
        }
      }
    } catch (err) {
      console.error("Failed to load resident dashboard data:", err);
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  const handleRefreshDashboard = useCallback(() => {
    try {
      const stored = localStorage.getItem("saiyoojyam_user");
      const storedData = localStorage.getItem("saiyoojyam_user_data");
      let parsed = null;
      if (storedData) {
        parsed = JSON.parse(storedData);
      }
      fetchDashboard(parsed, stored || "");
    } catch {
      // ignore
    }
  }, [fetchDashboard]);

  // Guard profile: Redirect if not authenticated, sync user state if logged in
  useEffect(() => {
    const checkAuthAndSync = () => {
      try {
        const stored = localStorage.getItem("saiyoojyam_user");
        const storedData = localStorage.getItem("saiyoojyam_user_data");

        if (!stored && !storedData) {
          setIsAuthenticated(false);
          setIsAuthChecked(true);
          router.replace("/");
          return;
        }

        setIsAuthenticated(true);
        setIsAuthChecked(true);

        let parsed: any = null;
        if (storedData) {
          try {
            parsed = JSON.parse(storedData);
            if (parsed.email) setEmail(parsed.email);
            if (parsed.phone) setPhone(parsed.phone);
            if (parsed.id) setUserId(Number(parsed.id));
            if (parsed.name) setUserName(parsed.name);
            else if (stored) setUserName(stored);
          } catch {
            if (stored) setUserName(stored);
          }
        } else if (stored) {
          setUserName(stored);
        }

        fetchDashboard(parsed, stored || "");
      } catch {
        setIsAuthenticated(false);
        setIsAuthChecked(true);
        router.replace("/");
      }
    };

    checkAuthAndSync();
    window.addEventListener("user-login", checkAuthAndSync);
    window.addEventListener("storage", checkAuthAndSync);

    return () => {
      window.removeEventListener("user-login", checkAuthAndSync);
      window.removeEventListener("storage", checkAuthAndSync);
    };
  }, [router, fetchDashboard]);

  useEffect(() => {
    const tabFromUrl = searchParams.get("tab") as ProfileTab;
    if (
      tabFromUrl &&
      ["dashboard", "profile", "monthly-payment", "payment-history", "terms"].includes(tabFromUrl)
    ) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  const handleTabChange = (tab: ProfileTab) => {
    setActiveTab(tab);
    router.replace(`/profile?tab=${tab}`, { scroll: false });
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem("saiyoojyam_user");
      localStorage.removeItem("saiyoojyam_user_data");
      window.dispatchEvent(new Event("user-login"));
    } catch {
      // ignore
    }
    setIsAuthenticated(false);
    router.replace("/");
  };

  const handleProfileSave = async (
    e: React.FormEvent,
    currentPassword?: string,
    newPassword?: string
  ) => {
    e.preventDefault();
    setSaveError("");
    setIsSavingProfile(true);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost/saiyoojyam";
      const payload: Record<string, any> = {
        username: userName,
        user_id: userId || dashboardData?.inmate?.user_id,
        inmate_id: dashboardData?.inmate?.id,
        email: email || dashboardData?.inmate?.email,
      };

      if (currentPassword && newPassword) {
        payload.current_password = currentPassword;
        payload.new_password = newPassword;
      }

      const res = await fetch(`${baseUrl}/api/auth/update-profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => null);

      if (!res.ok || (json && !json.status)) {
        setSaveError(json?.message || "Failed to update profile settings.");
        return;
      }

      localStorage.setItem("saiyoojyam_user", userName);
      const storedData = localStorage.getItem("saiyoojyam_user_data");
      if (storedData) {
        try {
          const parsed = JSON.parse(storedData);
          parsed.name = userName;
          parsed.username = userName;
          localStorage.setItem("saiyoojyam_user_data", JSON.stringify(parsed));
        } catch {
          // ignore
        }
      }
      window.dispatchEvent(new Event("user-login"));

      setDashboardData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          inmate: {
            ...prev.inmate,
            name: userName,
            username: userName,
          },
        };
      });

      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err: any) {
      setSaveError(err?.message || "Network error while saving profile.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordUpdate = async (
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost/saiyoojyam";
      const payload: Record<string, any> = {
        user_id: userId || dashboardData?.inmate?.user_id,
        inmate_id: dashboardData?.inmate?.id,
        email: email || dashboardData?.inmate?.email,
        username: userName,
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      };

      const res = await fetch(`${baseUrl}/api/auth/update-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => null);
      if (res.ok && json && json.status) {
        return {
          success: true,
          message: json.message || "Password updated successfully!",
        };
      }
      return {
        success: false,
        message: json?.message || "Failed to update password. Please check your credentials.",
      };
    } catch (err: any) {
      return {
        success: false,
        message: err?.message || "Network error while updating password. Please try again.",
      };
    }
  };

  // Block rendering unauthenticated content
  if (!isAuthChecked || !isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center font-sans-normal">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF561C] mb-3" />
        <p className="text-sm font-medium text-gray-500">
          {!isAuthChecked ? "Checking authorization..." : "Redirecting to home page..."}
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Hero Header with user info & navigation tabs */}
      <ProfileHeroHeader
        userName={userName}
        activeTab={activeTab}
        tabs={TABS}
        onTabChange={handleTabChange}
        onLogout={handleLogout}
        inmate={dashboardData?.inmate}
      />

      {/* Main Content Area - overlaps the extended orange banner */}
      <main className="flex-grow max-w-[1240px] w-full mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-14 relative z-10 pb-16">
        {activeTab === "dashboard" && (
          <DashboardTab
            userName={userName}
            email={email}
            phone={phone}
            dashboardData={dashboardData}
            loading={isLoadingData}
            onNavigateTab={handleTabChange}
          />
        )}

        {activeTab === "profile" && (
          <ProfileDetailsTab
            userName={userName}
            setUserName={setUserName}
            isSaved={isSaved}
            isSaving={isSavingProfile}
            onSave={handleProfileSave}
            inmate={dashboardData?.inmate}
            email={email}
            phone={phone}
            saveError={saveError}
            userId={userId || dashboardData?.inmate?.user_id}
            onUpdatePassword={handlePasswordUpdate}
          />
        )}

        {activeTab === "monthly-payment" && (
          <MonthlyPaymentTab
            currentBill={dashboardData?.current_bill}
            pendingBills={dashboardData?.pending_bills}
            pendingCount={dashboardData?.pending_count}
            totalPendingAmount={dashboardData?.total_pending_amount}
            isAllPaid={dashboardData?.is_all_paid}
            inmate={dashboardData?.inmate}
            printUrl={dashboardData?.print_url}
            onPaymentSuccess={handleRefreshDashboard}
          />
        )}

        {activeTab === "payment-history" && (
          <PaymentHistoryTab
            invoices={dashboardData?.invoices}
            loading={isLoadingData}
          />
        )}

        {activeTab === "terms" && <TermsTab />}
      </main>
    </>
  );
}
