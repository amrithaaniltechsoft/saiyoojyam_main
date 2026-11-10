import { useState, useEffect } from "react";
import {
  User,
  CreditCard,
  Receipt,
  FileText,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
} from "lucide-react";
import type { ProfileTab } from "./ProfileHeroHeader";
import type { DashboardData, DashboardTerm } from "./types";

interface DashboardTabProps {
  userName: string;
  email?: string;
  phone?: string;
  dashboardData?: DashboardData | null;
  loading?: boolean;
  onNavigateTab: (tab: ProfileTab) => void;
}

export function DashboardTab({
  userName,
  dashboardData,
  loading = false,
  onNavigateTab,
}: DashboardTabProps) {
  const inmate = dashboardData?.inmate;
  const currentBill = dashboardData?.current_bill;
  const pendingBills = dashboardData?.pending_bills || [];
  const pendingCount = dashboardData?.pending_count || pendingBills.length;
  const totalPendingAmount = dashboardData?.total_pending_amount || currentBill?.total_payable || "₹0.00";
  const isAllPaid = dashboardData?.is_all_paid ?? (pendingCount === 0);
  const invoices = dashboardData?.invoices || [];

  const [dynamicTerms, setDynamicTerms] = useState<DashboardTerm[]>([]);
  const [loadingTerms, setLoadingTerms] = useState<boolean>(false);

  useEffect(() => {
    // If dashboardData already contains terms from the API, use them
    if (dashboardData?.terms && dashboardData.terms.length > 0) {
      setDynamicTerms(dashboardData.terms);
      return;
    }

    // Otherwise, dynamically fetch the published terms from /api/terms
    let isMounted = true;
    async function fetchTerms() {
      try {
        setLoadingTerms(true);
        const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost/saiyoojyam";
        const baseUrl = rawApiUrl.replace(/\/+$/, "");
        const res = await fetch(`${baseUrl}/api/terms`, { cache: "no-store" });
        if (res.ok) {
          const json = await res.json();
          if (json?.status) {
            let list: DashboardTerm[] = [];
            if (Array.isArray(json.list) && json.list.length > 0) {
              list = json.list;
            } else if (json.data && json.data.title) {
              list = [json.data];
            }
            if (isMounted) {
              setDynamicTerms(list);
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch terms for dashboard:", err);
      } finally {
        if (isMounted) {
          setLoadingTerms(false);
        }
      }
    }

    fetchTerms();

    return () => {
      isMounted = false;
    };
  }, [dashboardData?.terms]);

  const termsToShow =
    dashboardData?.terms && dashboardData.terms.length > 0
      ? dashboardData.terms
      : dynamicTerms;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 4 Primary Navigation Cards (corresponding directly to the other 4 tabs) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
        {/* Card 1: Account Settings Summary */}
        <div className="bg-white rounded-xl border border-gray-200/90 shadow-sm p-4 sm:p-6 flex flex-col justify-between hover:border-[#FF561C]/40 hover:shadow-md transition-all">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-orange-50 text-[#FF561C] flex items-center justify-center shrink-0 border border-orange-100">
                  <User className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-gray-950">Account Information</h3>
                  <p className="text-[11px] sm:text-xs text-gray-500">Username & resident credentials</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab("profile")}
                className="text-xs sm:text-sm font-semibold text-[#FF561C] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Edit</span>
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>

            <div className="space-y-3 pt-4 text-xs sm:text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Resident Name</span>
                <span className="font-semibold text-gray-900">{inmate?.name || userName || "Resident"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Username</span>
                <span className="font-medium text-gray-900">{inmate?.username || userName || "resident"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Inmate UID</span>
                <span className="font-semibold text-gray-900">{inmate?.uid || "Assigned"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Assigned Room</span>
                <span className="font-medium text-gray-900">
                  {inmate?.room_name ? `Room ${inmate.room_name} (${inmate.room_type_name || "Sharing"})` : "Assigned Bed"}
                </span>
              </div>
              {inmate?.check_in_date && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Check-In Date</span>
                  <span className="font-medium text-gray-900">{inmate.check_in_date}</span>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 mt-5">
            <button
              type="button"
              onClick={() => onNavigateTab("profile")}
              className="w-full py-2 bg-gray-50 hover:bg-orange-50/70 hover:text-[#FF561C] text-gray-700 text-xs sm:text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Manage Account Settings</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>

        {/* Card 2: Monthly Payment Summary */}
        <div className="bg-white rounded-xl border border-gray-200/90 shadow-sm p-4 sm:p-6 flex flex-col justify-between hover:border-[#FF561C]/40 hover:shadow-md transition-all">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-orange-50 text-[#FF561C] flex items-center justify-center shrink-0 border border-orange-100">
                  <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-gray-950">Monthly Payment</h3>
                  <p className="text-[11px] sm:text-xs text-gray-500">Current rent & invoice status</p>
                </div>
              </div>

              {isAllPaid ? (
                <span className="px-2 sm:px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] sm:text-[11px] font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  All Paid Up
                </span>
              ) : (
                <span className="px-2 sm:px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 text-[10px] sm:text-[11px] font-semibold flex items-center gap-1 border border-red-200">
                  <AlertCircle className="w-3 h-3 text-red-600" />
                  {pendingCount} Month{pendingCount > 1 ? "s" : ""} Due
                </span>
              )}
            </div>

            <div className="space-y-2.5 pt-4 text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">
                  {isAllPaid ? "Latest Billing Period" : "Earliest Due Period"}
                </span>
                <span className="font-medium text-gray-900">{currentBill?.period || "Rent Period"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">{currentBill?.room_label || "Room Rent (Monthly)"}</span>
                <span className="font-medium text-gray-900">{currentBill?.rent_amount || "₹0.00"}</span>
              </div>
              <div className="flex justify-between items-baseline pt-1">
                <span className="text-gray-700 font-semibold text-xs sm:text-sm">
                  {isAllPaid ? "Balance Due" : "Total Outstanding"}
                </span>
                <span className="text-base sm:text-lg font-bold text-[#FF561C]">
                  {isAllPaid ? "₹0.00" : totalPendingAmount}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 mt-5">
            {isAllPaid ? (
              <button
                type="button"
                onClick={() => onNavigateTab("monthly-payment")}
                className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs sm:text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Rent Settled · View Receipts</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onNavigateTab("monthly-payment")}
                className="w-full py-2.5 bg-[#FF561C] hover:bg-[#e0450d] text-white text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
              >
                <span>Pay Pending Rent ({totalPendingAmount})</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Card 3: Payment History Summary */}
        <div className="bg-white rounded-xl border border-gray-200/90 shadow-sm p-4 sm:p-6 flex flex-col justify-between hover:border-[#FF561C]/40 hover:shadow-md transition-all">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-orange-50 text-[#FF561C] flex items-center justify-center shrink-0 border border-orange-100">
                  <Receipt className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-gray-950">Payment History</h3>
                  <p className="text-[11px] sm:text-xs text-gray-500">Previous invoices & receipts</p>
                </div>
              </div>
              <span className="text-[10px] sm:text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                {invoices.length > 0 ? `${invoices.length} Receipt(s)` : "Up to date"}
              </span>
            </div>

            <div className="space-y-3 pt-4 text-xs sm:text-sm">
              {invoices.length > 0 ? (
                invoices.slice(0, 2).map((inv) => (
                  <div
                    key={inv.id}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 border border-gray-150"
                  >
                    <div>
                      <span className="font-semibold text-gray-900 block text-xs sm:text-sm">
                        {inv.id} · {inv.period}
                      </span>
                      <span className="text-gray-500 text-[10px] sm:text-[11px]">Paid on {inv.date}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-gray-900 text-xs sm:text-sm block">{inv.amount}</span>
                      <span className="text-[10px] text-emerald-600 font-semibold">{inv.status}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-3 text-center text-xs text-gray-500 bg-gray-50 rounded-lg border border-gray-100">
                  No previous transactions recorded yet.
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 mt-5">
            <button
              type="button"
              onClick={() => onNavigateTab("payment-history")}
              className="w-full py-2 bg-gray-50 hover:bg-orange-50/70 hover:text-[#FF561C] text-gray-700 text-xs sm:text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>View All Past Receipts</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>

        {/* Card 4: Terms & Conditions Summary */}
        <div className="bg-white rounded-xl border border-gray-200/90 shadow-sm p-4 sm:p-6 flex flex-col justify-between hover:border-[#FF561C]/40 hover:shadow-md transition-all">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-orange-50 text-[#FF561C] flex items-center justify-center shrink-0 border border-orange-100">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-gray-950">Terms & Conditions</h3>
                  <p className="text-[11px] sm:text-xs text-gray-500">Stay rules, notice period & timings</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-[10px] sm:text-[11px] font-medium">
                {termsToShow.length > 0
                  ? `${termsToShow.length} Active ${termsToShow.length === 1 ? "Policy" : "Policies"}`
                  : "Active Policy"}
              </span>
            </div>

            <div className="space-y-2.5 pt-4 text-xs sm:text-sm text-gray-600">
              {loadingTerms && termsToShow.length === 0 ? (
                <div className="py-4 flex items-center justify-center gap-2 text-gray-400 text-xs">
                  <Loader2 className="w-4 h-4 animate-spin text-[#FF561C]" />
                  <span>Loading policies...</span>
                </div>
              ) : termsToShow.length > 0 ? (
                termsToShow.map((term, idx) => (
                  <div
                    key={term.id || idx}
                    onClick={() => onNavigateTab("terms")}
                    className="flex items-start gap-2.5 group cursor-pointer p-1.5 -mx-1.5 rounded-lg hover:bg-orange-50/60 transition-colors"
                    title={term.title}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-[#FF561C] mt-2 shrink-0 group-hover:scale-125 transition-transform" />
                    <div className="min-w-0 flex-1">
                      <span className="font-semibold text-gray-900 group-hover:text-[#FF561C] transition-colors line-clamp-1 block text-xs sm:text-sm">
                        {term.title}
                      </span>
                      {term.small_description && (
                        <p className="text-[11px] sm:text-xs text-gray-500 line-clamp-1 mt-0.5">
                          {term.small_description}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-4 text-center text-xs text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                  <span>Hostel policies will be published shortly.</span>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 mt-5">
            <button
              type="button"
              onClick={() => onNavigateTab("terms")}
              className="w-full py-2 bg-gray-50 hover:bg-orange-50/70 hover:text-[#FF561C] text-gray-700 text-xs sm:text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Read Full Terms</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
