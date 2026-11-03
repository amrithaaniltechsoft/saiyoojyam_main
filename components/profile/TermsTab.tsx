import { Download } from "lucide-react";

export function TermsTab() {
  const termsList = [
    {
      id: "rent-schedule",
      title: "1. Rent Payment Schedule",
      desc: "Monthly rent must be paid on or before the 5th of every month. Late payments may attract a late fee of ₹100 per day after the due date.",
      fileName: "Saiyoojyam_Rent_Payment_Policy.pdf",
    },
    {
      id: "gate-timings",
      title: "2. Gate Timings & Safety",
      desc: "Main entrance gates close at 10:00 PM for safety and security. Prior notice to the resident warden is mandatory for late return due to academic or work commitments.",
      fileName: "Saiyoojyam_Gate_Timings_and_Security_Policy.pdf",
    },
    {
      id: "vacating-notice",
      title: "3. Notice Period for Vacating",
      desc: "A minimum of 30 days notice is required prior to vacating the room to ensure smooth security deposit refund settlement.",
      fileName: "Saiyoojyam_Vacating_and_Deposit_Policy.pdf",
    },
    {
      id: "cleanliness-maintenance",
      title: "4. Cleanliness and Maintenance",
      desc: "Hostel property and common spaces must be kept clean. Daily room cleaning is conducted by staff between 9:00 AM and 1:00 PM.",
      fileName: "Saiyoojyam_Hostel_Maintenance_Rules.pdf",
    },
  ];

  const handleDownload = (fileName: string) => {
    alert(`Downloading ${fileName}...`);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200/90 shadow-sm p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-lg sm:text-xl font-bold text-gray-950">Terms and Conditions of Stay</h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
          Official rules and guidelines for residents staying at Saiyoojyam Hostels.
        </p>
      </div>

      <div className="space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
        {termsList.map((term) => (
          <div
            key={term.id}
            className="p-4 sm:p-5 bg-gray-50 border border-gray-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="space-y-1 sm:max-w-[80%]">
              <h3 className="font-bold text-gray-950 text-sm sm:text-base">{term.title}</h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{term.desc}</p>
            </div>
            <button
              type="button"
              onClick={() => handleDownload(term.fileName)}
              className="px-3 sm:px-3.5 py-1.5 sm:py-2 bg-white hover:bg-orange-50 border border-gray-200 hover:border-[#FF561C]/50 text-gray-800 hover:text-[#FF561C] text-xs sm:text-sm font-semibold rounded-lg transition-colors flex items-center gap-1.5 self-start sm:self-center shrink-0 cursor-pointer shadow-xs active:scale-95"
            >
              <Download className="w-3.5 h-3.5 text-[#FF561C]" />
              <span>Download PDF</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
