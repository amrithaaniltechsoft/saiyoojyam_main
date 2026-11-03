import { Check } from "lucide-react";

interface CheckoutStepsProps {
  isSuccess: boolean;
}

export function CheckoutSteps({ isSuccess }: CheckoutStepsProps) {
  return (
    <div className="bg-white">
      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-14 py-3.5">
        <div className="flex items-center justify-between max-w-2xl mx-auto text-xs sm:text-sm">
          {/* Step 1: Your Selection (Completed) */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-5 h-5 rounded-full bg-[#006CE4] text-white flex items-center justify-center text-[10px] font-bold">
              <Check className="w-3 h-3 stroke-[3]" />
            </span>
            <span className="font-semibold text-gray-950">Your Selection</span>
          </div>

          {/* Divider Line 1 */}
          <div className="flex-1 h-[1.5px] bg-gray-400 mx-3 sm:mx-5" />

          {/* Step 2: Your Details (Active) */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-5 h-5 rounded-full bg-[#006CE4] text-white flex items-center justify-center text-[11px] font-bold">
              {isSuccess ? <Check className="w-3 h-3 stroke-[3]" /> : "2"}
            </span>
            <span className="font-semibold text-gray-950">
              Your Details
            </span>
          </div>

          {/* Divider Line 2 */}
          <div className="flex-1 h-[1.5px] bg-gray-300 mx-3 sm:mx-5" />

          {/* Step 3: Finish booking */}
          <div className="flex items-center gap-2 shrink-0">
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-semibold ${
                isSuccess
                  ? "bg-[#006CE4] text-white font-bold"
                  : "border-2 border-gray-500 text-gray-800 bg-white"
              }`}
            >
              {isSuccess ? <Check className="w-3 h-3 stroke-[3]" /> : "3"}
            </span>
            <span
              className={`font-semibold ${
                isSuccess ? "text-gray-950" : "text-gray-700"
              }`}
            >
              Finish booking
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
