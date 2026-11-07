import { CheckoutHeader } from "@/components/checkout/CheckoutHeader";
import { CheckoutSteps } from "@/components/checkout/CheckoutSteps";
import { Loader2 } from "lucide-react";

export default function CheckoutLoading() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans-normal text-gray-950 checkout-page-scope">
      {/* Top Header Banner */}
      <CheckoutHeader />

      {/* Steps Progress Bar */}
      <CheckoutSteps isSuccess={false} />

      {/* Main Skeleton Layout */}
      <main className="flex-grow max-w-6xl mx-auto w-full px-6 sm:px-10 lg:px-14 py-8 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (4 cols): Summary Skeleton Cards */}
          <div className="lg:col-span-4 space-y-4">
            {/* Property Card Skeleton */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 shadow-xs space-y-3 animate-pulse">
              <div className="h-44 bg-gray-200 rounded-lg w-full" />
              <div className="h-5 bg-gray-200 rounded-md w-3/4" />
              <div className="h-4 bg-gray-100 rounded-md w-1/2" />
            </div>

            {/* Booking Details Skeleton */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 shadow-xs space-y-3 animate-pulse">
              <div className="h-4 bg-gray-200 rounded-md w-1/3" />
              <div className="space-y-2 pt-2">
                <div className="h-3.5 bg-gray-100 rounded w-full" />
                <div className="h-3.5 bg-gray-100 rounded w-4/5" />
                <div className="h-3.5 bg-gray-100 rounded w-3/4" />
              </div>
            </div>

            {/* Price Summary Skeleton */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 shadow-xs space-y-3 animate-pulse">
              <div className="h-4 bg-gray-200 rounded-md w-1/3" />
              <div className="h-8 bg-gray-100 rounded-md w-full" />
              <div className="h-10 bg-orange-100 rounded-md w-full" />
            </div>
          </div>

          {/* Right Column (8 cols): Guest Details Form Skeleton with Center Loading Spinner */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 shadow-xs flex flex-col items-center justify-center min-h-[460px] text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center shadow-xs">
                <Loader2 className="w-7 h-7 text-[#FF561C] animate-spin" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-gray-900">
                  Preparing Checkout...
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 max-w-sm">
                  Loading room details and verifying tariff rates. You will be able to enter your details shortly.
                </p>
              </div>
              <div className="w-full max-w-md pt-4 space-y-3 animate-pulse">
                <div className="h-10 bg-gray-100 rounded-md w-full" />
                <div className="h-10 bg-gray-100 rounded-md w-full" />
                <div className="h-10 bg-gray-100 rounded-md w-full" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

