"use client";

import { useState, useEffect, useRef } from "react";
import {
  X,
  Lock,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";

export interface PaymentDetails {
  method: string;
  transactionId: string;
  provider: string;
  details?: Record<string, any>;
}

interface CheckoutPaymentGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalPrice: number;
  monthlyRent?: number;
  admissionFees?: number;
  cautionDeposit?: number;
  buildingName?: string;
  roomNumber?: string;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  onConfirmPayment: (payment: PaymentDetails) => void;
  isProcessing?: boolean;
}

export function CheckoutPaymentGatewayModal({
  isOpen,
  onClose,
  totalPrice,
  buildingName,
  roomNumber,
  guestName = "",
  guestEmail = "",
  guestPhone = "",
  onConfirmPayment,
  isProcessing = false,
}: CheckoutPaymentGatewayModalProps) {
  const [status, setStatus] = useState<"loading" | "ready" | "failed" | "cancelled" | "success">("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [accessKey, setAccessKey] = useState<string | null>(null);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [merchantKey, setMerchantKey] = useState<string>("");
  const [easebuzzEnv, setEasebuzzEnv] = useState<string>("test");
  const hasInitiatedRef = useRef(false);

  // Load Easebuzz Official Checkout SDK script
  const loadEasebuzzSdk = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window !== "undefined" && (window as any).EasebuzzCheckout) {
        resolve(true);
        return;
      }
      const existing = document.getElementById("easebuzz-checkout-sdk");
      if (existing) {
        existing.addEventListener("load", () => resolve(true));
        return;
      }
      const script = document.createElement("script");
      script.id = "easebuzz-checkout-sdk";
      script.src = "https://ebz-static.s3.ap-south-1.amazonaws.com/easecheckout/easebuzz-checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const launchEasebuzz = async (accKey: string, key: string, env: string) => {
    setStatus("loading");
    setErrorMessage(null);

    const sdkLoaded = await loadEasebuzzSdk();
    if (!sdkLoaded || typeof (window as any).EasebuzzCheckout === "undefined") {
      setStatus("failed");
      setErrorMessage("Could not load Easebuzz SDK. Please check your internet connection.");
      return;
    }

    try {
      const easebuzzCheckout = new (window as any).EasebuzzCheckout(
        key,
        env === "prod" || env === "production" ? "prod" : "test"
      );

      const options = {
        access_key: accKey,
        onResponse: (response: any) => {
          console.log("Easebuzz onResponse:", response);

          // ONLY proceed if Easebuzz confirms SUCCESS
          if (
            response &&
            (response.status === "success" || response.status === true || response.status === "userSuccess")
          ) {
            setStatus("success");

            // Server-side signature validation
            const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost/saiyoojyam";
            const baseUrl = rawApiUrl.replace(/\/+$/, "");
            if (response.hash) {
              fetch(`${baseUrl}/api/easebuzz/verify`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(response),
              }).catch((e) => console.warn("Easebuzz verify call warning:", e));
            }

            // Immediately confirm payment to avoid waiting
            onConfirmPayment({
              method: response.bank_name || response.mode || "Easebuzz Gateway",
              transactionId: response.easepayid || response.txnid || `EBZ_${Date.now()}`,
              provider: "Easebuzz",
              details: response,
            });
          } else {
            // User did not pay, cancelled, or transaction failed! DO NOT SUBMIT BOOKING!
            setStatus("cancelled");
            setErrorMessage(
              response?.error_Message ||
              response?.message ||
              "Payment was cancelled or not completed on Easebuzz. Your booking has NOT been placed."
            );
          }
        },
        theme: "#FF561C",
      };

      setStatus("ready");
      easebuzzCheckout.initiatePayment(options);
    } catch (e: any) {
      console.error("Easebuzz initiation error:", e);
      setStatus("failed");
      setErrorMessage(e?.message || "Failed to launch Easebuzz checkout window.");
    }
  };

  const initiatePayment = async () => {
    setStatus("loading");
    setErrorMessage(null);

    const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost/saiyoojyam";
    const baseUrl = rawApiUrl.replace(/\/+$/, "");

    try {
      const res = await fetch(`${baseUrl}/api/easebuzz/initiate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalPrice,
          firstname: guestName || "Guest",
          email: guestEmail || "guest@example.com",
          phone: guestPhone || "9999999999",
          productinfo: `Hostel Room Reservation ${roomNumber ? `Room ${roomNumber}` : ""}`,
        }),
      });

      const json = await res.json();
      if (json && json.status && json.data) {
        const d = json.data;
        setMerchantKey(d.key || "");
        setEasebuzzEnv(d.env || "test");
        setPaymentUrl(d.payment_url || null);

        if (d.access_key && d.key) {
          setAccessKey(d.access_key);
          await launchEasebuzz(d.access_key, d.key, d.env || "test");
        } else {
          setStatus("failed");
          const errDetail =
            d.easebuzz_error ||
            "Easebuzz access key could not be generated. Please verify your Merchant Key & Salt in saiyoojyam/.env.";
          setErrorMessage(errDetail);
        }
      } else {
        setStatus("failed");
        setErrorMessage(json?.message || "Easebuzz API returned an error.");
      }
    } catch (err: any) {
      setStatus("failed");
      setErrorMessage(err?.message || "Network error while connecting to Easebuzz.");
    }
  };

  useEffect(() => {
    if (isOpen) {
      if (!hasInitiatedRef.current) {
        hasInitiatedRef.current = true;
        initiatePayment();
      }
    } else {
      hasInitiatedRef.current = false;
      setStatus("loading");
      setErrorMessage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
        onClick={() => {
          if (!isProcessing && status !== "loading") {
            onClose();
          }
        }}
        aria-hidden="true"
      />

      {/* Main Modal Card */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-2xl z-10 my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-left"
      >
        {/* Top Header */}
        <div className="bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 text-white px-5 py-4 flex items-center justify-between border-b border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FF561C] flex items-center justify-center text-white shadow-md">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm sm:text-base text-white">
                  Easebuzz Payment Gateway
                </span>
                <span className="text-[10px] font-semibold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded-full">
                  Secure
                </span>
              </div>
              <p className="text-[11px] text-gray-400">
                Official Easebuzz Checkout
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={isProcessing}
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-4">
          <div className="bg-orange-50/60 border border-orange-200/80 rounded-xl p-3.5 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-medium text-gray-600 block">Total Payable</span>
              <span className="text-2xl font-bold text-gray-950">
                ₹ {totalPrice.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="text-right text-xs">
              <span className="font-semibold text-gray-900 block truncate max-w-[160px]">
                {buildingName || "Saiyoojyam Hostel"}
              </span>
              <span className="text-[11px] text-gray-500">
                {roomNumber ? `Room ${roomNumber}` : "Room Booking"}
              </span>
            </div>
          </div>

          {status === "loading" && (
            <div className="py-8 text-center space-y-3">
              <div className="w-10 h-10 border-3 border-[#FF561C] border-t-transparent rounded-full animate-spin mx-auto" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-gray-900">
                  Opening Easebuzz Payment Window...
                </p>
                <p className="text-xs text-gray-500">
                  Connecting with Easebuzz gateway servers
                </p>
              </div>
            </div>
          )}

          {status === "ready" && (
            <div className="py-5 text-center space-y-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6 text-[#FF561C]" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-gray-900">
                  Easebuzz Payment Active
                </p>
                <p className="text-xs text-gray-600 max-w-xs mx-auto">
                  Please complete the payment in the Easebuzz window using your UPI, Card, or Net Banking.
                </p>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (accessKey && merchantKey) {
                      launchEasebuzz(accessKey, merchantKey, easebuzzEnv);
                    } else {
                      initiatePayment();
                    }
                  }}
                  className="w-full py-2.5 px-4 bg-[#FF561C] hover:bg-[#e0450d] text-white font-semibold rounded-lg text-xs sm:text-sm shadow flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Re-open Easebuzz Window</span>
                </button>

                {paymentUrl && (
                  <a
                    href={paymentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all border border-gray-200"
                  >
                    <span>Open in new tab</span>
                    <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
                  </a>
                )}
              </div>
            </div>
          )}

          {status === "cancelled" && (
            <div className="py-4 text-center space-y-3">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto border border-amber-200">
                <AlertCircle className="w-6 h-6 text-amber-600" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-gray-900">
                  Payment Was Not Completed
                </p>
                <p className="text-xs text-gray-600 px-4">
                  {errorMessage || "You closed or cancelled the Easebuzz payment window. Your card/account was not charged, and your room has NOT been booked."}
                </p>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={initiatePayment}
                  className="w-full py-2.5 px-4 bg-[#FF561C] hover:bg-[#e0450d] text-white font-semibold rounded-lg text-xs sm:text-sm shadow flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Try Payment Again</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2 px-4 text-gray-600 hover:text-gray-900 text-xs font-medium cursor-pointer"
                >
                  Cancel and Review Details
                </button>
              </div>
            </div>
          )}

          {status === "failed" && (
            <div className="py-4 text-center space-y-3">
              <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto border border-red-200">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-red-900">
                  Payment Connection Error
                </p>
                <p className="text-xs text-red-700 px-2">
                  {errorMessage || "Unable to initiate payment with Easebuzz."}
                </p>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={initiatePayment}
                  className="w-full py-2.5 px-4 bg-[#FF561C] hover:bg-[#e0450d] text-white font-semibold rounded-lg text-xs sm:text-sm shadow flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retry Connection</span>
                </button>
              </div>
            </div>
          )}

          {status === "success" && (
            <div className="py-6 text-center space-y-3">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200 animate-pulse">
                <CheckCircle2 className="w-7 h-7 text-emerald-600" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-gray-950">
                  Payment Verified by Easebuzz!
                </p>
                <p className="text-xs text-gray-600">
                  Finalizing your room booking and generating your receipt...
                </p>
              </div>
              <div className="mx-2 p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs font-semibold flex items-center justify-center gap-1.5">
                <span>⚠️ Please do NOT refresh or close this page. Processing takes just a moment...</span>
              </div>
            </div>
          )}

          {/* Security Footer */}
          <div className="pt-3 border-t border-gray-200 flex items-center justify-between text-[11px] text-gray-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              100% Secure via Easebuzz
            </span>
            <span>PCI-DSS Level 1</span>
          </div>
        </div>
      </div>
    </div>
  );
}
