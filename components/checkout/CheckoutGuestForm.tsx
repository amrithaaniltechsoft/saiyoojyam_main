"use client";

import { useState, useRef, useEffect } from "react";
import {
  Lock,
  CreditCard,
  AlertCircle,
  LogIn,
  UploadCloud,
  FileText,
  Image as ImageIcon,
  X,
  CheckCircle2,
} from "lucide-react";

interface DocumentDropzoneProps {
  id?: string;
  label: string;
  required?: boolean;
  accept: string;
  acceptText?: string;
  fileName: string;
  file?: File | null;
  allowPdf?: boolean;
  onFileChange: (file: File) => void;
  onClear: () => void;
}

function DocumentDropzone({
  id,
  label,
  required = false,
  accept,
  acceptText,
  fileName,
  file,
  allowPdf = false,
  onFileChange,
  onClear,
}: DocumentDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [file]);

  const handleSelectedFile = (f: File) => {
    onFileChange(f);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      handleSelectedFile(droppedFile);
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div id={id} className="relative flex flex-col gap-1.5 scroll-mt-24">
      <label className="text-xs font-semibold text-gray-950 flex items-center justify-between">
        <span>
          {label} {required && <span className="text-red-600">*</span>}
        </span>
      </label>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const selected = e.target.files?.[0];
          if (selected) {
            handleSelectedFile(selected);
          }
        }}
      />

      {fileName ? (
        /* File Selected / Uploaded State */
        <div className="w-full min-h-[96px] bg-orange-50/20 border border-orange-200 rounded-lg p-3 flex items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3 overflow-hidden">
            {previewUrl ? (
              <div className="relative w-12 h-12 rounded-md overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                <img
                  src={previewUrl}
                  alt={fileName}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-md bg-orange-100 text-[#FF561C] flex items-center justify-center shrink-0 border border-orange-200">
                {allowPdf && fileName.toLowerCase().endsWith(".pdf") ? (
                  <FileText className="w-6 h-6 text-[#FF561C]" />
                ) : (
                  <ImageIcon className="w-6 h-6 text-[#FF561C]" />
                )}
              </div>
            )}

            <div className="flex flex-col min-w-0">
              <span
                className="text-xs font-semibold text-gray-900 truncate max-w-[170px] sm:max-w-[200px]"
                title={fileName}
              >
                {fileName}
              </span>
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Ready {file?.size ? `(${formatFileSize(file.size)})` : ""}</span>
              </div>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="text-[11px] text-[#FF561C] hover:underline font-medium text-left mt-0.5 cursor-pointer"
              >
                Change file
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={onClear}
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors cursor-pointer shrink-0"
            title="Remove file"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* Dropzone / Empty State */
        <div
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`w-full min-h-[96px] border-2 border-dashed rounded-lg p-3.5 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 select-none ${
            isDragging
              ? "border-[#FF561C] bg-orange-50/80 scale-[1.01] shadow-xs"
              : "border-gray-300 bg-gray-50/50 hover:bg-orange-50/30 hover:border-orange-300"
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <UploadCloud
              className={`w-5 h-5 transition-colors ${
                isDragging ? "text-[#FF561C] animate-bounce" : "text-gray-400"
              }`}
            />
            <span className="text-xs font-semibold text-gray-800">
              {isDragging ? "Drop image here" : "Drag & drop image here"}
            </span>
          </div>

          <p className="text-[11px] text-gray-500 font-normal">
            or <span className="text-[#FF561C] font-semibold underline">browse from device</span>
          </p>

          <span className="text-[10px] text-gray-400 mt-1">
            {acceptText || "JPG, PNG, WEBP"} (max 10MB)
          </span>
        </div>
      )}
    </div>
  );
}

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
  idProofFile?: File | null;
  setIdProofFile?: (f: File | null) => void;
  photoFileName: string;
  setPhotoFileName: (v: string) => void;
  photoFile?: File | null;
  setPhotoFile?: (f: File | null) => void;
  agreed: boolean;
  setAgreed: (v: boolean) => void;
  isSubmitting: boolean;
  isRedirecting?: boolean;
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
  idProofFile,
  setIdProofFile,
  photoFileName,
  setPhotoFileName,
  photoFile,
  setPhotoFile,
  agreed,
  setAgreed,
  isSubmitting,
  isRedirecting = false,
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
                id="guest-email-input"
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
                type="number"
                inputMode="numeric"
                pattern="[0-9]*"
                required
                value={phone}
                onBlur={handlePhoneBlur}
                onWheel={(e) => (e.target as HTMLElement).blur()}
                onKeyDown={(e) => {
                  if (["e", "E", "+", "-", "."].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
                onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
                placeholder="Phone number"
                className="w-full h-11 px-3 bg-white border border-gray-400 rounded-md text-sm text-gray-950 placeholder-gray-500 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#FF561C] focus:border-[#FF561C] font-normal [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>

            {/* WhatsApp */}
            <div className="relative sm:col-span-2">
              <label className="absolute -top-2.5 left-3 px-1.5 bg-white text-xs font-semibold text-gray-950 z-10">
                WhatsApp number <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                inputMode="numeric"
                pattern="[0-9]*"
                required
                value={whatsapp}
                onWheel={(e) => (e.target as HTMLElement).blur()}
                onKeyDown={(e) => {
                  if (["e", "E", "+", "-", "."].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
                onChange={(e) => setWhatsapp(e.target.value.replace(/[^0-9]/g, ""))}
                placeholder="WhatsApp number"
                className="w-full h-11 px-3 bg-white border border-gray-400 rounded-md text-sm text-gray-950 placeholder-gray-500 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#FF561C] focus:border-[#FF561C] font-normal [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
                type="number"
                inputMode="numeric"
                pattern="[0-9]*"
                required
                value={contactNumber}
                onWheel={(e) => (e.target as HTMLElement).blur()}
                onKeyDown={(e) => {
                  if (["e", "E", "+", "-", "."].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
                onChange={(e) => setContactNumber(e.target.value.replace(/[^0-9]/g, ""))}
                placeholder="Emergency contact number"
                className="w-full h-11 px-3 bg-white border border-gray-400 rounded-md text-sm text-gray-950 placeholder-gray-500 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#FF561C] focus:border-[#FF561C] font-normal [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          </div>
        </div>

        {/* Group 4: Document Uploads with Drag & Drop */}
        <div className="space-y-4 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
            <h3 className="text-sm font-semibold text-gray-900">
              Documents &amp; Verification
            </h3>
            <span className="text-[11px] text-[#FF561C] font-semibold">
              Both documents required *
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {/* ID Proof Dropzone */}
            <DocumentDropzone
              id="inmates-id-proof-zone"
              label="ID proof"
              required={true}
              accept="image/*,.pdf"
              acceptText="JPG, PNG, WEBP, or PDF"
              fileName={idProofFileName}
              file={idProofFile}
              allowPdf={true}
              onFileChange={(f) => {
                setIdProofFileName(f.name);
                if (setIdProofFile) setIdProofFile(f);
              }}
              onClear={() => {
                setIdProofFileName("");
                if (setIdProofFile) setIdProofFile(null);
              }}
            />

            {/* Profile Photo Dropzone */}
            <DocumentDropzone
              id="inmates-photo-zone"
              label="Profile Photo"
              required={true}
              accept="image/*"
              acceptText="JPG, PNG, or WEBP"
              fileName={photoFileName}
              file={photoFile}
              allowPdf={false}
              onFileChange={(f) => {
                setPhotoFileName(f.name);
                if (setPhotoFile) setPhotoFile(f);
              }}
              onClear={() => {
                setPhotoFileName("");
                if (setPhotoFile) setPhotoFile(null);
              }}
            />
          </div>
        </div>

        {/* Verification Checkbox */}
        <div className="pt-2">
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              id="verification-agreed-checkbox"
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
                disabled={isSubmitting || isRedirecting || isCheckingAvailability}
                className={`w-full sm:w-auto min-w-[200px] px-8 py-3 font-semibold rounded-md text-sm sm:text-base shadow-md transition-all flex items-center justify-center gap-2 shrink-0 select-none ${
                  isSubmitting || isRedirecting || isCheckingAvailability
                    ? "bg-gray-400 text-white cursor-not-allowed pointer-events-none opacity-70 shadow-none"
                    : "bg-[#FF561C] hover:bg-[#e0450d] text-white shadow-orange-500/20 active:scale-95 cursor-pointer"
                }`}
              >
                {isRedirecting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Booking Confirmed! Redirecting...</span>
                  </>
                ) : isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Processing Payment...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-white" />
                    <span>{isCheckingAvailability ? "Checking..." : "Make payment"}</span>
                  </>
                )}
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
