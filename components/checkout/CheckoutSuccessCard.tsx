import Link from "next/link";
import { Check, Calendar, X, MapPin, Printer, Receipt, ShieldCheck } from "lucide-react";
import { BuildingDetailData } from "@/data/buildingsData";
import { RoomItem } from "@/data/roomsData";

export interface InvoiceDetails {
  invoice_id?: number | string;
  invoice_payment_month?: string;
  payment_month_display?: string;
  invoice_paid_date?: string;
  invoice_rent?: number;
  invoice_caution_deposit?: number;
  invoice_admission_fee?: number;
  invoice_total?: number;
  invoice_paid_amount?: number;
  invoice_status?: string;
  inmates_id?: number | string;
  print_url?: string;
  receipt_url?: string;
}

interface CheckoutSuccessModalProps {
  isOpen: boolean;
  onClose?: () => void;
  name: string;
  building: BuildingDetailData;
  room?: RoomItem;
  checkInDate?: string;
  bookingUid?: string;
  invoiceData?: InvoiceDetails | null;
}

export function CheckoutSuccessModal({
  isOpen,
  onClose,
  name,
  building,
  room,
  checkInDate,
  bookingUid,
  invoiceData,
}: CheckoutSuccessModalProps) {
  if (!isOpen) return null;

  const formattedDate = checkInDate
    ? (() => {
      try {
        const d = new Date(checkInDate);
        return isNaN(d.getTime())
          ? checkInDate
          : d.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
          });
      } catch {
        return checkInDate;
      }
    })()
    : "Immediate";

  const formattedMonth = invoiceData?.payment_month_display || (invoiceData?.invoice_payment_month
    ? (() => {
      try {
        const d = new Date(invoiceData.invoice_payment_month);
        if (isNaN(d.getTime())) return invoiceData.invoice_payment_month;
        const payMonthStr = d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
        if (checkInDate) {
          const ci = new Date(checkInDate);
          if (!isNaN(ci.getTime()) && ci.getDate() >= 21) {
            const ciMonthStr = ci.toLocaleDateString("en-US", { month: "short", year: "numeric" });
            if (ciMonthStr !== payMonthStr) {
              return `${ciMonthStr} & ${payMonthStr}`;
            }
          }
        }
        return payMonthStr;
      } catch {
        return invoiceData.invoice_payment_month;
      }
    })()
    : "");

  const printUrl =
    invoiceData?.print_url ||
    (invoiceData?.inmates_id
      ? `${process.env.NEXT_PUBLIC_API_URL || "https://saiyoojyam.janamithrasociety.com"}/api/inmates/print/${invoiceData.inmates_id}${invoiceData?.invoice_id ? `?invoice_id=${invoiceData.invoice_id}` : ""}`
      : "");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/65 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200 my-auto text-left max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Animated Green Check Badge placed above title */}
        <div className="flex justify-center mb-4">
          <div className="relative inline-flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping opacity-40" />
            <div className="relative w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/25 transition-transform">
              <Check className="w-7 h-7 stroke-[2.75] animate-in zoom-in-75 duration-300" />
            </div>
          </div>
        </div>

        {/* Title & Tag */}
        <div className="mb-4 text-center">
          <span className="text-xs font-bold tracking-wider uppercase text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full inline-block mb-1">
            Payment Received · Request Submitted
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-950 tracking-tight">
            Booking Request Submitted!
          </h2>
        </div>

        {/* Primary Message */}
        <p className="text-sm sm:text-base text-gray-800 leading-relaxed mb-5 font-normal text-center">
          Thank you, <span className="font-semibold text-gray-950">{name}</span>. Your booking request for{" "}
          <span className="font-semibold text-gray-950">
            {room ? `Room ${room.roomNumber}` : building.name}
          </span>{" "}
          at <span className="font-semibold text-gray-950">{building.name}</span> has been submitted and initial payment recorded. Our admin team will review and approve your booking, and your inmate login credentials will be provided upon approval.
        </p>

        {/* Summary Details Card */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 divide-y divide-gray-200 mb-5 space-y-2.5 text-xs sm:text-sm">
          {bookingUid && (
            <div className="flex items-center justify-between pb-1">
              <span className="text-gray-600 font-medium">Booking ID</span>
              <span className="font-bold text-[#FF561C] tracking-wide font-mono text-sm sm:text-base">
                {bookingUid}
              </span>
            </div>
          )}

          {invoiceData?.invoice_id && (
            <div className="flex items-center justify-between py-1">
              <span className="text-gray-600 font-medium flex items-center gap-1.5">
                <Receipt className="w-3.5 h-3.5 text-gray-500" />
                Receipt #
              </span>
              <span className="font-semibold text-gray-900 font-mono">
                INV-{invoiceData.invoice_id}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between py-1">
            <span className="text-gray-600 flex items-center gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5 text-gray-500" />
              Check-in Date
            </span>
            <span className="font-bold text-gray-950">
              {formattedDate}
            </span>
          </div>

          {formattedMonth && (
            <div className="flex items-center justify-between py-1">
              <span className="text-gray-600 font-medium">Payment Month</span>
              <span className="font-semibold text-gray-900">
                {formattedMonth}
              </span>
            </div>
          )}

          {/* Payment Breakdown */}
          {invoiceData && (
            <div className="pt-2 space-y-1.5">
              <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                Payment Breakdown
              </div>
              {invoiceData.invoice_rent !== undefined && (
                <div className="flex items-center justify-between text-gray-700">
                  <span>Room Rent</span>
                  <span className="font-medium text-gray-950">
                    ₹{Number(invoiceData.invoice_rent).toFixed(2)}
                  </span>
                </div>
              )}
              {Boolean(invoiceData.invoice_caution_deposit) && (
                <div className="flex items-center justify-between text-gray-700">
                  <span>Caution Deposit</span>
                  <span className="font-medium text-gray-950">
                    ₹{Number(invoiceData.invoice_caution_deposit).toFixed(2)}
                  </span>
                </div>
              )}
              {Boolean(invoiceData.invoice_admission_fee) && (
                <div className="flex items-center justify-between text-gray-700">
                  <span>Admission Fee</span>
                  <span className="font-medium text-gray-950">
                    ₹{Number(invoiceData.invoice_admission_fee).toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between pt-1.5 border-t border-gray-200 text-sm font-bold text-gray-950">
                <span className="flex items-center gap-1.5 text-emerald-700">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Total Paid
                </span>
                <span className="text-emerald-700 text-base">
                  ₹{Number(invoiceData.invoice_paid_amount || invoiceData.invoice_total || 0).toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {(building.address || building.building_address || room?.building_address || room?.buildingAddress || room?.address) && (
            <div className="flex items-start justify-between pt-2.5 gap-2">
              <span className="text-gray-600 flex items-center gap-1.5 font-medium shrink-0">
                <MapPin className="w-3.5 h-3.5 text-gray-500" />
                Address
              </span>
              <span className="font-medium text-gray-950 text-xs text-right line-clamp-2">
                {building.address || building.building_address || room?.building_address || room?.buildingAddress || room?.address}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
          {printUrl && (
            <a
              href={printUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Download Receipt</span>
            </a>
          )}
          <Link
            href={`/building/${building.slug}`}
            onClick={() => onClose && onClose()}
            className="w-full sm:flex-1 py-3 px-4 bg-[#FF561C] hover:bg-[#e0450d] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm hover:shadow transition-all text-center"
          >
            View Property Details
          </Link>
          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto py-3 px-5 text-xs sm:text-sm font-semibold text-gray-700 hover:text-gray-950 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-xl transition-colors text-center cursor-pointer"
            >
              Close
            </button>
          ) : (
            <Link
              href="/"
              className="w-full sm:w-auto py-3 px-4 text-xs sm:text-sm font-semibold text-gray-700 hover:text-gray-950 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-xl transition-colors text-center"
            >
              Home
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
