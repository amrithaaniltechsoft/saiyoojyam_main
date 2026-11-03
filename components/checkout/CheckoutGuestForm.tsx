import { Lock, CreditCard, AlertCircle, LogIn } from "lucide-react";

interface CheckoutGuestFormProps {
  name: string;
  setName: (v: string) => void;
  age: string;
  setAge: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  whatsapp: string;
  setWhatsapp: (v: string) => void;
  guardianName: string;
  setGuardianName: (v: string) => void;
  relation: string;
  setRelation: (v: string) => void;
  contactNumber: string;
  setContactNumber: (v: string) => void;
  idProofFileName: string;
  setIdProofFileName: (v: string) => void;
  setIdProofFile?: (f: File | null) => void;
  photoFileName: string;
  setPhotoFileName: (v: string) => void;
  setPhotoFile?: (f: File | null) => void;
  agreed: boolean;
  setAgreed: (v: boolean) => void;
  isSubmitting: boolean;
  totalPrice: number;
  monthlyRent?: number;
  admissionFees?: number;
  cautionDeposit?: number;
  roomNumber?: string;
  roomTitle?: string;
  handlePhoneBlur: () => void;
  onSubmit: (e: React.FormEvent) => void;
  currentUser?: string | null;
  onOpenLogin?: () => void;
  loginError?: string | null;
  isCheckingAvailability?: boolean;
  isRoomAvailable?: boolean;
  availabilityMessage?: string;
}

export function CheckoutGuestForm({
  name,
  setName,
  age,
  setAge,
  email,
  setEmail,
  phone,
  setPhone,
  whatsapp,
  setWhatsapp,
  guardianName,
  setGuardianName,
  relation,
  setRelation,
  contactNumber,
  setContactNumber,
  idProofFileName,
  setIdProofFileName,
  setIdProofFile,
  photoFileName,
  setPhotoFileName,
  setPhotoFile,
  agreed,
  setAgreed,
  isSubmitting,
  totalPrice,
  monthlyRent,
  admissionFees = 0,
  cautionDeposit = 0,
  roomNumber,
  roomTitle,
  handlePhoneBlur,
  onSubmit,
  currentUser,
  onOpenLogin,
  loginError,
  isCheckingAvailability = false,
  isRoomAvailable = true,
  availabilityMessage,
}: CheckoutGuestFormProps) {
  return (
    <div id="guest-details-form" className="lg:col-span-8 bg-white rounded-lg border border-gray-200 shadow-xs p-5 sm:p-7 space-y-6 scroll-mt-20">
      <div className="pb-3 border-b border-gray-200">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-950 tracking-tight">
          Enter your details
        </h2>
      </div>

      

      <form onSubmit={onSubmit} className="space-y-7">
        {/* Group 1: Personal Details */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-900">
            Personal details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-5 pt-1">
            {/* Name */}
            <div className="relative">
              <label className="absolute -top-2.5 left-3 px-1.5 bg-white text-xs font-semibold text-gray-950 z-10">
                Full name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                className="w-full h-11 px-3 bg-white border border-gray-400 rounded-md text-sm text-gray-950 placeholder-gray-500 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#FF561C] focus:border-[#FF561C] font-normal"
              />
            </div>

            {/* Age */}
            <div className="relative">
              <label className="absolute -top-2.5 left-3 px-1.5 bg-white text-xs font-semibold text-gray-950 z-10">
                Age <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                required
                min="16"
                max="99"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Age"
                className="w-full h-11 px-3 bg-white border border-gray-400 rounded-md text-sm text-gray-950 placeholder-gray-500 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#FF561C] focus:border-[#FF561C] font-normal"
              />
            </div>
          </div>
        </div>

        {/* Group 2: Contact Information */}
        <div className="space-y-4 pt-3 border-t border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900 pt-1">
            Contact information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-5 pt-1">
            {/* Email */}
            <div className="relative">
              <label className="absolute -top-2.5 left-3 px-1.5 bg-white text-xs font-semibold text-gray-950 z-10">
                Email address <span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full h-11 px-3 bg-white border border-gray-400 rounded-md text-sm text-gray-950 placeholder-gray-500 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#FF561C] focus:border-[#FF561C] font-normal"
              />
            </div>

            {/* Phone */}
            <div className="relative">
              <label className="absolute -top-2.5 left-3 px-1.5 bg-white text-xs font-semibold text-gray-950 z-10">
                Phone number <span className="text-red-600">*</span>
              </label>
              <input
                type="tel"
                required
                value={phone}
                onBlur={handlePhoneBlur}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone number"
                className="w-full h-11 px-3 bg-white border border-gray-400 rounded-md text-sm text-gray-950 placeholder-gray-500 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#FF561C] focus:border-[#FF561C] font-normal"
              />
            </div>

            {/* WhatsApp */}
            <div className="relative sm:col-span-2">
              <label className="absolute -top-2.5 left-3 px-1.5 bg-white text-xs font-semibold text-gray-950 z-10">
                WhatsApp number <span className="text-red-600">*</span>
              </label>
              <input
                type="tel"
                required
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="WhatsApp number"
                className="w-full h-11 px-3 bg-white border border-gray-400 rounded-md text-sm text-gray-950 placeholder-gray-500 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#FF561C] focus:border-[#FF561C] font-normal"
              />
            </div>
          </div>
        </div>

        {/* Group 3: Guardian Details */}
        <div className="space-y-4 pt-3 border-t border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900 pt-1">
            Guardian details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-5 pt-1">
            {/* Guardian Name */}
            <div className="relative">
              <label className="absolute -top-2.5 left-3 px-1.5 bg-white text-xs font-semibold text-gray-950 z-10">
                Guardian name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                value={guardianName}
                onChange={(e) => setGuardianName(e.target.value)}
                placeholder="Guardian name"
                className="w-full h-11 px-3 bg-white border border-gray-400 rounded-md text-sm text-gray-950 placeholder-gray-500 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#FF561C] focus:border-[#FF561C] font-normal"
              />
            </div>

            {/* Relation */}
            <div className="relative">
              <label className="absolute -top-2.5 left-3 px-1.5 bg-white text-xs font-semibold text-gray-950 z-10">
                Relationship <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                value={relation}
                onChange={(e) => setRelation(e.target.value)}
                placeholder="Relationship"
                className="w-full h-11 px-3 bg-white border border-gray-400 rounded-md text-sm text-gray-950 placeholder-gray-500 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#FF561C] focus:border-[#FF561C] font-normal"
              />
            </div>

            {/* Guardian Contact Number */}
            <div className="relative sm:col-span-2">
              <label className="absolute -top-2.5 left-3 px-1.5 bg-white text-xs font-semibold text-gray-950 z-10">
                Emergency contact number <span className="text-red-600">*</span>
              </label>
              <input
                type="tel"
                required
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="Emergency contact number"
                className="w-full h-11 px-3 bg-white border border-gray-400 rounded-md text-sm text-gray-950 placeholder-gray-500 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#FF561C] focus:border-[#FF561C] font-normal"
              />
            </div>
          </div>
        </div>

        {/* Group 4: Document Uploads */}
        <div className="space-y-4 pt-3 border-t border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900 pt-1">
            Documents
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-5 pt-1">
            {/* ID Proof */}
            <div className="relative">
              <label className="absolute -top-2.5 left-3 px-1.5 bg-white text-xs font-semibold text-gray-950 z-10">
                ID proof
              </label>
              <div className="w-full h-11 flex items-center border border-gray-400 rounded-md overflow-hidden bg-white shadow-xs">
                <label className="h-full px-3.5 bg-gray-100 hover:bg-gray-200 border-r border-gray-400 text-xs font-semibold text-gray-900 flex items-center cursor-pointer shrink-0 transition-colors">
                  <span>Choose file</span>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setIdProofFileName(file.name);
                        if (setIdProofFile) setIdProofFile(file);
                      }
                    }}
                  />
                </label>
                <span className="px-3 text-xs text-gray-800 font-medium truncate">
                  {idProofFileName || "No file chosen"}
                </span>
              </div>
            </div>

            {/* Profile Photo */}
            <div className="relative">
              <label className="absolute -top-2.5 left-3 px-1.5 bg-white text-xs font-semibold text-gray-950 z-10">
                Profile Photo
              </label>
              <div className="w-full h-11 flex items-center border border-gray-400 rounded-md overflow-hidden bg-white shadow-xs">
                <label className="h-full px-3.5 bg-gray-100 hover:bg-gray-200 border-r border-gray-400 text-xs font-semibold text-gray-900 flex items-center cursor-pointer shrink-0 transition-colors">
                  <span>Choose file</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setPhotoFileName(file.name);
                        if (setPhotoFile) setPhotoFile(file);
                      }
                    }}
                  />
                </label>
                <span className="px-3 text-xs text-gray-800 font-medium truncate">
                  {photoFileName || "No file chosen"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Verification Checkbox */}
        <div className="pt-2">
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              required
              className="mt-1 w-4 h-4 text-[#FF561C] border-gray-400 rounded focus:ring-[#FF561C] cursor-pointer"
            />
            <span className="text-xs sm:text-sm text-gray-900 font-medium leading-snug">
              To verify your booking, and for the hostel to connect if needed
            </span>
          </label>
        </div>

        {/* Unavailable Room Warning Banner */}
        {isRoomAvailable === false && (
          <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-red-700">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>Room Not Available for Dates</span>
            </div>
            <p className="text-[11px] leading-relaxed text-red-700">
              {availabilityMessage ||
                "This room is not available for the selected stay dates. Please choose different dates or select another room."}
            </p>
          </div>
        )}

        {/* Price & Make Payment Row */}
        <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="text-left w-full sm:w-auto space-y-1">
            {(roomNumber || roomTitle) && (
              <div className="text-xs font-semibold text-gray-900 flex items-center gap-1.5">
                {roomNumber && <span>Room {roomNumber}</span>}
                {roomNumber && roomTitle && <span className="text-gray-400 font-normal">•</span>}
                {roomTitle && (
                  <span className="text-gray-800 line-clamp-1">{roomTitle}</span>
                )}
              </div>
            )}
            <div>
              <span className="text-xs text-gray-600 block font-medium">Total payable</span>
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <span className="text-xl sm:text-2xl font-bold text-gray-950">
                  ₹ {totalPrice.toLocaleString("en-IN")}
                </span>
                {admissionFees + cautionDeposit > 0 ? (
                  <span className="text-xs text-gray-600 font-medium">
                    (₹{(monthlyRent ?? (totalPrice - admissionFees - cautionDeposit)).toLocaleString("en-IN")} rent + ₹{(admissionFees + cautionDeposit).toLocaleString("en-IN")} AF &amp; CD)
                  </span>
                ) : (
                  <span className="text-xs text-emerald-700 font-medium">
                    No extra fees
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-stretch sm:items-end w-full sm:w-auto gap-1.5 self-end">
            {isRoomAvailable === false ? (
              <button
                type="button"
                disabled
                className="w-full sm:w-auto min-w-[200px] px-8 py-3 bg-gray-200 text-gray-500 font-semibold rounded-md text-sm sm:text-base cursor-not-allowed flex items-center justify-center gap-2 shrink-0 select-none shadow-none"
              >
                <AlertCircle className="w-4 h-4 text-red-500" />
                <span>Room Not Available</span>
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting || isCheckingAvailability}
                className="w-full sm:w-auto min-w-[200px] px-8 py-3 bg-[#FF561C] hover:bg-[#e0450d] text-white font-semibold rounded-md text-sm sm:text-base shadow-md shadow-orange-500/20 transition-all active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 shrink-0"
              >
                <Lock className="w-4 h-4 text-white" />
                <span>{isSubmitting ? "Processing..." : "Make payment"}</span>
              </button>
            )}
            <span className="text-[11px] text-gray-500 text-center sm:text-right font-medium">
              * Instant booking · No login required
            </span>
          </div>
        </div>
      </form>
    </div>
  );
}
