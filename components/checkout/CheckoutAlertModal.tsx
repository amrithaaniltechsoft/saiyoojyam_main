"use client";

import { useEffect } from "react";
import { X, MailWarning, AlertCircle, AlertTriangle, ArrowRight, LogIn, FileText, Camera } from "lucide-react";

export interface CheckoutAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  type?: "email_conflict" | "warning" | "error" | "info" | "id_proof" | "photo";
  primaryButtonText?: string;
  onPrimaryClick?: () => void;
  secondaryButtonText?: string;
  onSecondaryClick?: () => void;
}

export function CheckoutAlertModal({
  isOpen,
  onClose,
  title,
  message,
  type = "warning",
  primaryButtonText,
  onPrimaryClick,
  secondaryButtonText,
  onSecondaryClick,
}: CheckoutAlertModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Determine modal header icon and styles based on type
  const isEmailConflict = type === "email_conflict";
  const isError = type === "error";

  const resolvedTitle =
    title ||
    (isEmailConflict
      ? "Email Already Registered"
      : isError
      ? "Unable to Process Booking"
      : "Booking Notice");

  const resolvedPrimaryText =
    primaryButtonText ||
    (isEmailConflict
      ? "Update Email Address"
      : isError
      ? "Close"
      : "Understood");

  const handlePrimary = () => {
    if (onPrimaryClick) {
      onPrimaryClick();
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/65 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-modal-title"
        className="relative w-full max-w-md bg-white rounded-2xl p-6 sm:p-7 border border-gray-200 shadow-2xl z-10 my-auto text-center"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon Badge */}
        <div className="flex justify-center mb-4">
          {isEmailConflict ? (
            <div className="relative inline-flex items-center justify-center">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shadow-xs">
                <MailWarning className="w-7 h-7 stroke-[2.2]" />
              </div>
            </div>
          ) : type === "id_proof" ? (
            <div className="relative inline-flex items-center justify-center">
              <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-200 text-[#FF561C] flex items-center justify-center shadow-xs">
                <FileText className="w-7 h-7 stroke-[2.2]" />
              </div>
            </div>
          ) : type === "photo" ? (
            <div className="relative inline-flex items-center justify-center">
              <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-200 text-[#FF561C] flex items-center justify-center shadow-xs">
                <Camera className="w-7 h-7 stroke-[2.2]" />
              </div>
            </div>
          ) : isError ? (
            <div className="relative inline-flex items-center justify-center">
              <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center shadow-xs">
                <AlertCircle className="w-7 h-7 stroke-[2.2]" />
              </div>
            </div>
          ) : (
            <div className="relative inline-flex items-center justify-center">
              <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-200 text-[#FF561C] flex items-center justify-center shadow-xs">
                <AlertTriangle className="w-7 h-7 stroke-[2.2]" />
              </div>
            </div>
          )}
        </div>

        {/* Modal Title */}
        <h3
          id="checkout-modal-title"
          className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight mb-2"
        >
          {resolvedTitle}
        </h3>

        {/* Message content */}
        {isEmailConflict ? (
          <div className="mb-6 space-y-3">
            <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs sm:text-sm text-gray-800 leading-relaxed font-medium text-left">
              {message}
            </div>
            <p className="text-xs text-gray-500 text-center">
              Please change the email address above to proceed, or sign in if you already have an account.
            </p>
          </div>
        ) : (
          <p className="text-sm text-gray-600 leading-relaxed mb-6 font-normal">
            {message}
          </p>
        )}

        {/* Actions */}
        <div className="space-y-2.5">
          <button
            type="button"
            onClick={handlePrimary}
            className="w-full bg-[#FF561C] hover:bg-[#e0450d] text-white font-semibold py-3 px-5 rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer text-sm flex items-center justify-center gap-2"
          >
            <span>{resolvedPrimaryText}</span>
            {isEmailConflict && <ArrowRight className="w-4 h-4" />}
          </button>

          {secondaryButtonText && onSecondaryClick ? (
            <button
              type="button"
              onClick={onSecondaryClick}
              className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 font-semibold py-2.5 px-5 rounded-xl transition-all cursor-pointer text-sm flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4 text-gray-500" />
              <span>{secondaryButtonText}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="w-full py-1 text-xs text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
            >
              Dismiss
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

