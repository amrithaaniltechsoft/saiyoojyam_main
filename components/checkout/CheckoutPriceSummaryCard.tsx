"use client";

import { useState } from "react";
import { RentCalculationResult } from "./rentCalculator";

interface CheckoutPriceSummaryCardProps {
  totalPrice: number;
  monthlyRent?: number;
  baseMonthlyRent?: number;
  rentCalculation?: RentCalculationResult;
  admissionFees?: number;
  cautionDeposit?: number;
  duration?: string;
}

export function CheckoutPriceSummaryCard({
  totalPrice,
  monthlyRent,
  baseMonthlyRent,
  rentCalculation,
  admissionFees = 0,
  cautionDeposit = 0,
  duration = "Long Term",
}: CheckoutPriceSummaryCardProps) {
  const [showPriceDetails, setShowPriceDetails] = useState(true);

  const chargedRent = monthlyRent || totalPrice;
  const af = admissionFees || 0;
  const cd = cautionDeposit || 0;
  const extraFees = af + cd;
  const totalPayable = chargedRent + extraFees;

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-xs">
      <div className="p-4 pb-3">
        <h3 className="text-sm font-semibold text-gray-950">
          Your price summary
        </h3>
      </div>

      {/* Price Highlight Row */}
      <div className="px-4 py-3.5 border-y border-gray-200 flex items-center justify-between">
        <div>
          <span className="text-base font-semibold text-gray-950 block">
            Price
          </span>
          {extraFees > 0 && (
            <span className="text-[11px] text-gray-500 font-normal">
              Rent + AF + CD
            </span>
          )}
        </div>
        <div className="text-right">
          <span className="text-xl sm:text-2xl font-bold text-gray-950 block">
            ₹ {totalPayable.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          {extraFees > 0 ? (
            <span className="text-xs font-medium text-gray-800">
              (₹{chargedRent.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} rent + ₹{extraFees.toLocaleString("en-IN")} fees)
            </span>
          ) : (
            <span className="text-xs font-medium text-emerald-700">
              No extra fees
            </span>
          )}
        </div>
      </div>

      {/* Price Breakdown Information */}
      <div className="p-4 space-y-2.5">
        <h4 className="text-xs font-semibold text-gray-950">
          Price information
        </h4>

        {showPriceDetails && (
          <div className="space-y-2.5 text-xs text-gray-900 animate-in fade-in duration-200">
            {/* Rent Section with Condition Explanation */}
            <div className="space-y-1">
              <div className="flex items-center justify-between font-medium">
                <span className="text-gray-700 font-semibold">
                  {duration === "Short Term" ? "Short Term Stay Rent" : "Initial Room Rent"}
                </span>
                <span className="font-semibold text-gray-950">
                  ₹ {chargedRent.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              {rentCalculation?.breakdownText && (
                <div className="text-[11px] text-gray-500 leading-snug pl-1 border-l-2 border-[#FF561C]/50">
                  {rentCalculation.breakdownText}
                  {rentCalculation.rentPerDay > 0 && (
                    <span className="block text-[10px] text-gray-400 mt-0.5">
                      Rate: ₹{rentCalculation.rentPerDay}/day (₹{baseMonthlyRent || rentCalculation.monthlyBaseRent} ÷ {rentCalculation.daysInMonth} days)
                    </span>
                  )}
                </div>
              )}
            </div>

            {af > 0 && (
              <div className="flex items-center justify-between font-medium pt-1">
                <span className="text-gray-700">Admission Fee (tariffs_admission_fees)</span>
                <span className="font-semibold text-gray-950">
                  ₹ {af.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            )}

            {cd > 0 && (
              <div className="flex items-center justify-between font-medium">
                <span className="text-gray-700">Caution Deposit (tariffs_caution_deposit)</span>
                <span className="font-semibold text-gray-950">
                  ₹ {cd.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            )}

            <div className="pt-2 border-t border-gray-200 flex items-center justify-between font-bold text-sm text-gray-950">
              <span>Total Payable</span>
              <span className="text-[#D43800]">
                ₹ {totalPayable.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        )}

        {/* Toggle Hide/Show details */}
        <div className="pt-2 border-t border-gray-200">
          <button
            type="button"
            onClick={() => setShowPriceDetails(!showPriceDetails)}
            className="text-xs font-semibold text-[#0057b8] hover:text-[#003b95] underline cursor-pointer"
          >
            {showPriceDetails ? "Hide details" : "Show details"}
          </button>
        </div>
      </div>
    </div>
  );
}
