"use client";

import { useState, useEffect } from "react";
import { CheckoutSuccessModal } from "@/components/checkout/CheckoutSuccessCard";

export function HomeBookingSuccessModal() {
  const [successData, setSuccessData] = useState<any>(null);

  useEffect(() => {
    const checkStored = () => {
      try {
        const stored = sessionStorage.getItem("saiyoojyam_payment_success");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && (parsed.name || parsed.bookingUid)) {
            setSuccessData(parsed);
          }
        }
      } catch (e) {
        console.error("Error reading stored booking success:", e);
      }
    };

    checkStored();
    window.addEventListener("storage", checkStored);
    window.addEventListener("booking-success", checkStored);

    return () => {
      window.removeEventListener("storage", checkStored);
      window.removeEventListener("booking-success", checkStored);
    };
  }, []);

  const handleClose = () => {
    try {
      sessionStorage.removeItem("saiyoojyam_payment_success");
    } catch {}
    setSuccessData(null);
  };

  if (!successData) return null;

  return (
    <CheckoutSuccessModal
      isOpen={true}
      onClose={handleClose}
      name={successData.name || "Guest"}
      building={successData.building || { name: "Saiyoojyam Hostel", slug: "premier" }}
      room={successData.room}
      checkInDate={successData.checkInDate}
      bookingUid={successData.bookingUid}
      invoiceData={successData.invoiceData}
    />
  );
}

