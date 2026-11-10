"use client";

import { useState } from "react";
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Receipt,
  ExternalLink,
  AlertCircle,
  Clock,
  Calendar,
  ArrowRight,
  Loader2,
  Sparkles,
} from "lucide-react";
import type { DashboardCurrentBill, DashboardInmate, DashboardPendingBill } from "./types";

interface MonthlyPaymentTabProps {
  currentBill?: DashboardCurrentBill | null;
  pendingBills?: DashboardPendingBill[];
  pendingCount?: number;
  totalPendingAmount?: string;
  isAllPaid?: boolean;
  inmate?: DashboardInmate | null;
  printUrl?: string;
  onPaymentSuccess?: () => void;
}

export function MonthlyPaymentTab({
  currentBill,
  pendingBills = [],
  pendingCount = 0,
  totalPendingAmount,
  isAllPaid = false,
  inmate,
  printUrl,
  onPaymentSuccess,
}: MonthlyPaymentTabProps) {
  const [payingMonthKey, setPayingMonthKey] = useState<string | null>(null);
  const [isProcessingAll, setIsProcessingAll] = useState(false);
  const [paidMonths, setPaidMonths] = useState<Record<string, boolean>>({});
  const [statusNotification, setStatusNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const hasPending = pendingBills.length > 0;
  const displayTotal = totalPendingAmount || "₹0.00";

  const getInmatePayload = () => {
    if (inmate?.id) {
      return {
        inmate_id: inmate.id,
        email: inmate.email,
        username: inmate.username,
      };
    }
    try {
      const stored = localStorage.getItem("saiyoojyam_user_data");
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          inmate_id: parsed.inmates_id || parsed.id,
          user_id: parsed.id,
          email: parsed.email,
          username: parsed.username,
        };
      }
    } catch {
      // ignore
    }
    return { inmate_id: 119 };
  };

  // 1-Click Pay for Individual Month
  const handlePaySingle = async (bill: DashboardPendingBill) => {
    setPayingMonthKey(bill.month_key);
    setStatusNotification(null);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost/saiyoojyam";
      const residentInfo = getInmatePayload();

      const payload = {
        ...residentInfo,
        month_key: bill.month_key,
        amount: bill.total_payable_num || bill.rent_amount_num,
        invoice_id: bill.invoice_id,
      };

      const res = await fetch(`${baseUrl}/api/inmates/pay-rent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => null);

      if (res.ok && json?.status) {
        setPaidMonths((prev) => ({ ...prev, [bill.month_key]: true }));
        setStatusNotification({
          type: "success",
          message: `✓ Updated as Paid! ${bill.period} (${bill.total_payable}) has been settled successfully.`,
        });

        setTimeout(() => {
          if (onPaymentSuccess) {
            onPaymentSuccess();
          }
        }, 900);
      } else {
        setStatusNotification({
          type: "error",
          message: json?.message || "Payment could not be updated. Please try again.",
        });
      }
    } catch (err: any) {
      setStatusNotification({
        type: "error",
        message: err?.message || "Network error while recording payment.",
      });
    } finally {
      setPayingMonthKey(null);
    }
  };

  // 1-Click Pay for All Pending Months
  const handlePayAll = async () => {
    setIsProcessingAll(true);
    setStatusNotification(null);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost/saiyoojyam";
      const residentInfo = getInmatePayload();

      const payload = {
        ...residentInfo,
        pay_all: true,
        months: pendingBills,
      };

      const res = await fetch(`${baseUrl}/api/inmates/pay-rent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => null);

      if (res.ok && json?.status) {
        const allKeys: Record<string, boolean> = {};
        pendingBills.forEach((b) => {
          allKeys[b.month_key] = true;
        });
        setPaidMonths(allKeys);
        setStatusNotification({
          type: "success",
          message: `✓ Updated as Paid! All ${pendingBills.length} pending months have been settled.`,
        });

        setTimeout(() => {
          if (onPaymentSuccess) {
            onPaymentSuccess();
          }
        }, 1100);
      } else {
        setStatusNotification({
          type: "error",
          message: json?.message || "Failed to update all payments.",
        });
      }
    } catch (err: any) {
      setStatusNotification({
        type: "error",
        message: err?.message || "Network error while updating payments.",
      });
    } finally {
      setIsProcessingAll(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-3xl mx-auto">
      {/* Title & Residency Header */}
      <div className="bg-white rounded-xl border border-gray-200/90 shadow-sm p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-950 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-[#FF561C]" />
            Monthly Rent Payment
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {inmate?.building_name ? `${inmate.building_name} · ` : ""}
            {inmate?.room_name ? `Room ${inmate.room_name} (${inmate.room_type_name || "Sharing"}) · ` : ""}
            Resident UID: <span className="font-semibold text-gray-800">{inmate?.uid || "-"}</span>
          </p>
        </div>

        {hasPending ? (
          <div className="text-left sm:text-right">
            <span className="text-[11px] uppercase tracking-wider font-bold text-gray-500 block">
              Total Outstanding
            </span>
            <span className="text-xl sm:text-2xl font-black text-[#FF561C] block">
              {displayTotal}
            </span>
            <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full inline-block border border-amber-200 mt-1">
              {pendingBills.length} Month{pendingBills.length > 1 ? "s" : ""} Pending
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg text-emerald-800 text-xs sm:text-sm font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>All Rent Settled Up to Date</span>
          </div>
        )}
      </div>

      {/* Live Status Toast Banner */}
      {statusNotification && (
        <div
          className={`p-3.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2.5 shadow-xs animate-in fade-in ${
            statusNotification.type === "success"
              ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
              : "bg-red-50 text-red-900 border border-red-200"
          }`}
        >
          {statusNotification.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          )}
          <span>{statusNotification.message}</span>
        </div>
      )}

      {/* Case 1: Pending Rent Available (Show Month by Month) */}
      {hasPending ? (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-gray-950 flex items-center gap-2">
                <span>Pending Months to Pay ({pendingBills.length})</span>
                <span className="text-[11px] font-normal text-gray-500 hidden sm:inline">
                  (Click any month to update as Paid)
                </span>
              </h3>
              <p className="text-xs text-gray-500">
                Click <span className="font-semibold text-gray-900">Pay</span> on any month to instantly mark it as Paid.
              </p>
            </div>

            {pendingBills.length > 1 && (
              <button
                type="button"
                onClick={handlePayAll}
                disabled={isProcessingAll || !!payingMonthKey}
                className="self-start sm:self-auto px-4 py-2 bg-gray-950 hover:bg-black text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-all flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-60"
              >
                {isProcessingAll ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Updating All as Paid...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Pay All {pendingBills.length} Months ({displayTotal})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            )}
          </div>

          {/* Month Cards - One by One */}
          <div className="space-y-3.5">
            {pendingBills.map((bill, index) => {
              const isOverdue = bill.is_overdue;
              const isPaidLive = paidMonths[bill.month_key];
              const isBeingPaid = payingMonthKey === bill.month_key;

              return (
                <div
                  key={bill.month_key || index}
                  className={`bg-white rounded-xl border p-4 sm:p-5 shadow-sm transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    isPaidLive
                      ? "border-emerald-300 bg-emerald-50/20"
                      : isOverdue
                      ? "border-red-200/90 hover:border-red-400 bg-gradient-to-r from-red-50/20 via-white to-white"
                      : "border-gray-200/90 hover:border-[#FF561C]/50"
                  }`}
                >
                  {/* Left Column: Month Info & Breakdown */}
                  <div className="space-y-2 flex-grow">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-sm sm:text-base text-gray-950 flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-[#FF561C]" />
                        {bill.period}
                      </span>

                      {isPaidLive ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-semibold flex items-center gap-1 border border-emerald-300 animate-in fade-in">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Paid
                        </span>
                      ) : isOverdue ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 text-[11px] font-semibold flex items-center gap-1 border border-red-200">
                          <AlertCircle className="w-3 h-3 text-red-600 shrink-0" />
                          Overdue (Due: {bill.due_date})
                        </span>
                      ) : bill.is_partial ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-semibold flex items-center gap-1 border border-amber-200">
                          <Clock className="w-3 h-3" />
                          Partially Paid · Balance Due
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[11px] font-semibold flex items-center gap-1 border border-amber-200">
                          <Clock className="w-3 h-3" />
                          Due Soon (Due: {bill.due_date})
                        </span>
                      )}
                    </div>

                    {/* Room Details */}
                    <div className="text-xs text-gray-600 pt-1">
                      <div>
                        <span className="text-gray-400 block text-[11px]">Room & Bed</span>
                        <span className="font-medium text-gray-900">{bill.room_label}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Amount & Pay Button */}
                  <div className="flex items-center md:flex-col md:items-end justify-between md:justify-center gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100 shrink-0">
                    <div>
                      <span className="text-[11px] text-gray-500 md:text-right block">Amount to Pay</span>
                      <span className="text-lg sm:text-xl font-bold text-[#FF561C] md:text-right block">
                        {bill.total_payable}
                      </span>
                    </div>

                    {isPaidLive ? (
                      <span className="px-3.5 py-2 bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-bold rounded-lg flex items-center gap-1.5 border border-emerald-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Paid</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handlePaySingle(bill)}
                        disabled={isBeingPaid || isProcessingAll}
                        className="px-4 py-2 bg-[#FF561C] hover:bg-[#e0450d] text-white text-xs sm:text-sm font-semibold rounded-lg shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 whitespace-nowrap disabled:opacity-60"
                      >
                        {isBeingPaid ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Updating as Paid...</span>
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="w-4 h-4" />
                            <span>Pay {bill.total_payable}</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Case 2: No Pending Payments - All Settled */
        <div className="bg-white rounded-xl border border-gray-200/90 shadow-sm p-6 sm:p-8 space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="text-lg sm:text-xl font-bold text-gray-950">
              Your Rent is Completely Paid & Up to Date!
            </h3>
            <p className="text-xs sm:text-sm text-gray-600">
              You have 0 pending monthly payments. All stay invoices have been settled in full.
            </p>
          </div>

          {/* Breakdown of Last Paid Month */}
          <div className="max-w-md mx-auto p-4 rounded-xl bg-gray-50 border border-gray-200/80 text-left text-xs sm:text-sm space-y-2.5">
            <div className="flex justify-between items-center pb-2 border-b border-gray-200 text-gray-500 font-semibold text-xs uppercase">
              <span>Last Settled Billing Cycle</span>
              <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
                Paid
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Period</span>
              <span className="font-semibold text-gray-950">{currentBill?.period || "Latest Rent"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Monthly Bed Rent</span>
              <span className="font-medium text-gray-900">{currentBill?.rent_amount || "₹0.00"}</span>
            </div>
            {currentBill?.last_paid_date && (
              <div className="flex justify-between pt-1 border-t border-gray-200">
                <span className="text-gray-600">Payment Date</span>
                <span className="font-medium text-gray-900">{currentBill.last_paid_date}</span>
              </div>
            )}
          </div>

          {printUrl && (
            <div className="pt-2">
              <a
                href={printUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <Receipt className="w-4 h-4" />
                <span>Download / Print Verified Receipt</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
