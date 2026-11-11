"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { BuildingDetailData } from "@/data/buildingsData";
import { RoomItem } from "@/data/roomsData";
import { CheckoutGuestForm } from "@/components/checkout/CheckoutGuestForm";
import { LoginModal } from "@/components/global/LoginModal";
import { CheckoutAlertModal } from "@/components/checkout/CheckoutAlertModal";
import { ArrowDown } from "lucide-react";

interface CheckoutBookingSectionProps {
  building: BuildingDetailData;
  room?: RoomItem;
  totalPrice: number;
  monthlyRent?: number;
  baseMonthlyRent?: number;
  admissionFees?: number;
  cautionDeposit?: number;
  checkInParam: string;
  checkOutParam?: string;
  durationParam?: string;
  roomIdParam?: string;
}

export function CheckoutBookingSection({
  building,
  room,
  totalPrice,
  monthlyRent,
  baseMonthlyRent,
  admissionFees = 0,
  cautionDeposit = 0,
  checkInParam,
  checkOutParam,
  durationParam,
  roomIdParam,
}: CheckoutBookingSectionProps) {
  const router = useRouter();

  // Form states
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [guardianName, setGuardianName] = useState("");
  const [relation, setRelation] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [idProofFileName, setIdProofFileName] = useState("");
  const [idProofFile, setIdProofFile] = useState<File | null>(null);
  const [photoFileName, setPhotoFileName] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const isSubmittingRef = useRef(false);

  // Authentication states
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Custom Alert / Notice Modal state
  const [alertModal, setAlertModal] = useState<{
    isOpen: boolean;
    title?: string;
    message: string;
    type?: "email_conflict" | "warning" | "error" | "info" | "id_proof" | "photo";
    primaryButtonText?: string;
    onPrimaryClick?: () => void;
    secondaryButtonText?: string;
    onSecondaryClick?: () => void;
  } | null>(null);

  // Availability checking state
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [availabilityResult, setAvailabilityResult] = useState<{
    isAvailable: boolean;
    message: string;
    availableBeds?: number;
  } | null>(null);

  const cleanRoomId = useMemo(() => {
    if (!room) return "";
    const raw = (room as any).rooms_id || (room as any).dbId || room.id || "";
    return String(raw).replace(/^room-/, "").trim();
  }, [room]);

  useEffect(() => {
    if (!checkInParam) return;

    let isCancelled = false;
    setIsCheckingAvailability(true);

    const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost/saiyoojyam";
    const baseUrl = rawApiUrl.replace(/\/+$/, "");

    const params = new URLSearchParams({
      check_in: checkInParam,
      ...(checkOutParam ? { check_out: checkOutParam } : {}),
      duration: durationParam || "Long Term",
      building: building?.slug || "",
      ...(cleanRoomId ? { room_id: cleanRoomId } : {}),
    });

    fetch(`${baseUrl}/api/rooms/check-availability?${params.toString()}`)
      .then((res) => res.json())
      .then((json) => {
        if (isCancelled) return;
        setIsCheckingAvailability(false);
        if (json) {
          setAvailabilityResult({
            isAvailable: !!json.is_available,
            message:
              json.message ||
              (json.is_available
                ? "Room is available"
                : "Room is not available for selected dates"),
            availableBeds: json.available_beds ?? json.total_available_beds,
          });
        }
      })
      .catch(() => {
        if (!isCancelled) setIsCheckingAvailability(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [checkInParam, checkOutParam, durationParam, building?.slug, cleanRoomId]);

  // Sync login status from localStorage and listen to events
  useEffect(() => {
    const syncUser = () => {
      try {
        const stored = localStorage.getItem("saiyoojyam_user");
        setCurrentUser(stored || null);
        const storedData = localStorage.getItem("saiyoojyam_user_data");
        if (storedData) {
          const parsed = JSON.parse(storedData);
          if (parsed.email) setEmail((prev) => (prev ? prev : parsed.email));
          if (parsed.phone) setPhone((prev) => (prev ? prev : parsed.phone));
        }
        if (stored) {
          setLoginError(null);
          setName((prev) => (prev ? prev : stored));
        }
      } catch {
        setCurrentUser(null);
      }
    };

    syncUser();
    window.addEventListener("user-login", syncUser);
    window.addEventListener("storage", syncUser);
    return () => {
      window.removeEventListener("user-login", syncUser);
      window.removeEventListener("storage", syncUser);
    };
  }, []);

  // Auto-sync WhatsApp with phone if left empty
  const handlePhoneBlur = () => {
    if (phone && !whatsapp) {
      setWhatsapp(phone);
    }
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Guard against double submission (synchronous ref check)
    if (isSubmittingRef.current || isSubmitting || isRedirecting) {
      return;
    }

    // 2. Check verification agreement
    if (!agreed) {
      setAlertModal({
        isOpen: true,
        title: "Verification Required",
        message: "Please confirm the verification checkbox to proceed with your booking.",
        type: "warning",
        primaryButtonText: "I Understand",
        onPrimaryClick: () => {
          setAlertModal(null);
          setTimeout(() => {
            const el = document.getElementById("verification-agreed-checkbox");
            if (el) {
              el.scrollIntoView({ behavior: "smooth", block: "center" });
              el.focus();
            }
          }, 150);
        },
      });
      return;
    }

    // 3. Check room availability
    if (availabilityResult && !availabilityResult.isAvailable) {
      setAlertModal({
        isOpen: true,
        title: "Room Unavailable",
        message:
          availabilityResult.message ||
          "This room is not available for the selected dates. Please choose different dates or select another room.",
        type: "warning",
        primaryButtonText: "Okay, Got It",
        onPrimaryClick: () => setAlertModal(null),
      });
      return;
    }

    // 4. Check mandatory ID proof
    if (!idProofFile && !idProofFileName) {
      setAlertModal({
        isOpen: true,
        title: "ID Proof Required",
        message:
          "Please upload your ID proof document (Aadhaar Card, Passport, Driving License, or Voter ID) to proceed with your booking.",
        type: "id_proof",
        primaryButtonText: "Upload ID Proof",
        onPrimaryClick: () => {
          setAlertModal(null);
          setTimeout(() => {
            const container = document.getElementById("inmates-id-proof-zone");
            if (container) {
              container.scrollIntoView({ behavior: "smooth", block: "center" });
              const input = container.querySelector("input[type='file']") as HTMLInputElement | null;
              input?.click();
            }
          }, 150);
        },
      });
      return;
    }

    // 5. Check mandatory Profile photo
    if (!photoFile && !photoFileName) {
      setAlertModal({
        isOpen: true,
        title: "Profile Photo Required",
        message: "Please upload your profile photo to proceed with your booking.",
        type: "photo",
        primaryButtonText: "Upload Profile Photo",
        onPrimaryClick: () => {
          setAlertModal(null);
          setTimeout(() => {
            const container = document.getElementById("inmates-photo-zone");
            if (container) {
              container.scrollIntoView({ behavior: "smooth", block: "center" });
              const input = container.querySelector("input[type='file']") as HTMLInputElement | null;
              input?.click();
            }
          }, 150);
        },
      });
      return;
    }

    // Immediately disable the button and set ref
    isSubmittingRef.current = true;
    setIsSubmitting(true);

    const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost/saiyoojyam";
    const baseUrl = rawApiUrl.replace(/\/+$/, "");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("age", age || "20");
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("whatsapp", whatsapp || phone);
    formData.append("guardianName", guardianName || name);
    formData.append("relation", relation || "Parent");
    formData.append("contactNumber", contactNumber || phone);
    formData.append("placeOfWork", "");
    const effectiveRoomId =
      room?.id
        ? room.id.replace(/^room-/, "")
        : ((room as any)?.dbId
        ? String((room as any).dbId)
        : (roomIdParam ? roomIdParam.replace(/^room-/, "") : ""));

    formData.append("building", building.slug || "");
    formData.append("roomId", effectiveRoomId);
    formData.append("roomType", room?.roomTypeId ? String(room.roomTypeId) : "");
    formData.append("checkIn", checkInParam || new Date().toISOString().slice(0, 10));
    formData.append("checkOut", checkOutParam || "0000-00-00");
    formData.append("duration", durationParam || "Long Term");
    formData.append("cautionDeposit", String(cautionDeposit || 0));
    formData.append("admissionFees", String(admissionFees || 0));
    const effectiveBaseRent = baseMonthlyRent || ((room as any)?.price ? Number(String((room as any).price).replace(/[^\d.]/g, "")) : 0);
    formData.append("monthlyRent", String(effectiveBaseRent || monthlyRent || 0));
    formData.append("baseMonthlyRent", String(effectiveBaseRent || 0));
    formData.append("calculatedRent", String(monthlyRent || 0));

    if (idProofFile) {
      formData.append("inmates_id_proof", idProofFile);
    } else if (idProofFileName) {
      formData.append("idProofFileName", idProofFileName);
    }

    if (photoFile) {
      formData.append("inmates_photo", photoFile);
    } else if (photoFileName) {
      formData.append("photoFileName", photoFileName);
    }

    fetch(`${baseUrl}/api/checkout`, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((json) => {
        if (json && json.status) {
          const uid = json.data?.inmates_uid || "";
          const inv = json.data?.invoice
            ? {
                ...json.data.invoice,
                inmates_id: json.data.inmates_id,
                print_url: json.data.api_print_url || json.data.print_url,
                receipt_url: json.data.receipt_url,
              }
            : null;

          const successPayload = {
            name,
            building,
            room,
            checkInDate: checkInParam,
            bookingUid: uid,
            invoiceData: inv,
          };

          try {
            sessionStorage.setItem("saiyoojyam_payment_success", JSON.stringify(successPayload));
            window.dispatchEvent(new Event("booking-success"));
          } catch (e) {
            console.error("Failed to store payment success in sessionStorage:", e);
          }

          // Keep button disabled and indicate redirect
          setIsRedirecting(true);

          // Redirect to home page where the success modal is presented
          router.push("/");
          setTimeout(() => {
            if (typeof window !== "undefined" && window.location.pathname !== "/") {
              window.location.href = "/";
            }
          }, 1200);
        } else {
          // Re-enable button on error so user can fix and retry
          isSubmittingRef.current = false;
          setIsSubmitting(false);
          setIsRedirecting(false);

          const errorMsg = json?.message || "Failed to submit booking. Please try again.";
          const isEmailConflict =
            typeof errorMsg === "string" &&
            errorMsg.toLowerCase().includes("email") &&
            (errorMsg.toLowerCase().includes("already registered") ||
              errorMsg.toLowerCase().includes("active resident") ||
              errorMsg.toLowerCase().includes("unique email"));

          const isIdProofMissing =
            typeof errorMsg === "string" &&
            errorMsg.toLowerCase().includes("id proof");

          const isPhotoMissing =
            typeof errorMsg === "string" &&
            (errorMsg.toLowerCase().includes("profile photo") || errorMsg.toLowerCase().includes("photo is mandatory"));

          if (isEmailConflict) {
            setAlertModal({
              isOpen: true,
              title: "Email Already Registered",
              message: errorMsg,
              type: "email_conflict",
              primaryButtonText: "Change Email Address",
              onPrimaryClick: () => {
                setAlertModal(null);
                setTimeout(() => {
                  const input = document.getElementById("guest-email-input") as HTMLInputElement | null;
                  if (input) {
                    input.scrollIntoView({ behavior: "smooth", block: "center" });
                    input.focus();
                    input.select?.();
                  }
                }, 150);
              },
              secondaryButtonText: "Log In Instead",
              onSecondaryClick: () => {
                setAlertModal(null);
                setIsLoginModalOpen(true);
              },
            });
          } else if (isIdProofMissing) {
            setAlertModal({
              isOpen: true,
              title: "ID Proof Required",
              message: errorMsg,
              type: "id_proof",
              primaryButtonText: "Upload ID Proof",
              onPrimaryClick: () => {
                setAlertModal(null);
                setTimeout(() => {
                  const container = document.getElementById("inmates-id-proof-zone");
                  if (container) {
                    container.scrollIntoView({ behavior: "smooth", block: "center" });
                    const input = container.querySelector("input[type='file']") as HTMLInputElement | null;
                    input?.click();
                  }
                }, 150);
              },
            });
          } else if (isPhotoMissing) {
            setAlertModal({
              isOpen: true,
              title: "Profile Photo Required",
              message: errorMsg,
              type: "photo",
              primaryButtonText: "Upload Profile Photo",
              onPrimaryClick: () => {
                setAlertModal(null);
                setTimeout(() => {
                  const container = document.getElementById("inmates-photo-zone");
                  if (container) {
                    container.scrollIntoView({ behavior: "smooth", block: "center" });
                    const input = container.querySelector("input[type='file']") as HTMLInputElement | null;
                    input?.click();
                  }
                }, 150);
              },
            });
          } else {
            setAlertModal({
              isOpen: true,
              title: "Booking Notice",
              message: errorMsg,
              type: "error",
              primaryButtonText: "Okay, Got It",
              onPrimaryClick: () => setAlertModal(null),
            });
          }
        }
      })
      .catch((err) => {
        console.error("Booking submission error:", err);
        // Re-enable button on error so user can retry
        isSubmittingRef.current = false;
        setIsSubmitting(false);
        setIsRedirecting(false);
        setAlertModal({
          isOpen: true,
          title: "Connection Error",
          message: "Unable to complete booking request. Please check your internet connection and try again.",
          type: "error",
          primaryButtonText: "Close",
          onPrimaryClick: () => setAlertModal(null),
        });
      });
  };

  // Track whether the form has reached the viewport
  const [isFormReached, setIsFormReached] = useState(false);

  useEffect(() => {
    const formEl = document.getElementById("guest-details-form");
    if (!formEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting || entry.boundingClientRect.top <= window.innerHeight * 0.75) {
          setIsFormReached(true);
        } else {
          setIsFormReached(false);
        }
      },
      {
        root: null,
        rootMargin: "0px 0px -100px 0px",
        threshold: [0, 0.1, 0.25],
      }
    );

    observer.observe(formEl);

    const handleScroll = () => {
      const rect = formEl.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.75) {
        setIsFormReached(true);
      } else {
        setIsFormReached(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {/* Right Column (8 cols): Enter Your Details Form */}
      <CheckoutGuestForm
        name={name}
        setName={setName}
        age={age}
        setAge={setAge}
        email={email}
        setEmail={setEmail}
        phone={phone}
        setPhone={setPhone}
        whatsapp={whatsapp}
        setWhatsapp={setWhatsapp}
        guardianName={guardianName}
        setGuardianName={setGuardianName}
        relation={relation}
        setRelation={setRelation}
        contactNumber={contactNumber}
        setContactNumber={setContactNumber}
        idProofFileName={idProofFileName}
        setIdProofFileName={setIdProofFileName}
        idProofFile={idProofFile}
        setIdProofFile={setIdProofFile}
        photoFileName={photoFileName}
        setPhotoFileName={setPhotoFileName}
        photoFile={photoFile}
        setPhotoFile={setPhotoFile}
        agreed={agreed}
        setAgreed={setAgreed}
        isSubmitting={isSubmitting}
        isRedirecting={isRedirecting}
        totalPrice={totalPrice}
        monthlyRent={monthlyRent}
        admissionFees={admissionFees}
        cautionDeposit={cautionDeposit}
        roomNumber={room?.roomNumber}
        roomTitle={room?.title}
        handlePhoneBlur={handlePhoneBlur}
        onSubmit={handlePaymentSubmit}
        currentUser={currentUser}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        loginError={loginError}
        isCheckingAvailability={isCheckingAvailability}
        isRoomAvailable={availabilityResult ? availabilityResult.isAvailable : true}
        availabilityMessage={availabilityResult?.message}
      />

      {/* Login Modal Prompt for Checkout */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        title="Login Required"
        subtitle="Please login to your account first to make payment and confirm your room booking."
        redirectUrl={false}
        onSuccess={(uname) => {
          setCurrentUser(uname);
          setName((prev) => (prev ? prev : uname));
          setLoginError(null);
          setIsLoginModalOpen(false);
        }}
      />

      {/* Custom Alert/Error Notice Modal */}
      {alertModal && (
        <CheckoutAlertModal
          isOpen={alertModal.isOpen}
          title={alertModal.title}
          message={alertModal.message}
          type={alertModal.type}
          primaryButtonText={alertModal.primaryButtonText}
          onPrimaryClick={alertModal.onPrimaryClick}
          secondaryButtonText={alertModal.secondaryButtonText}
          onSecondaryClick={alertModal.onSecondaryClick}
          onClose={() => setAlertModal(null)}
        />
      )}

      {/* Mobile/Tablet: Center Bottom Floating Redirect Button to "Enter Details" (hidden once user reaches form) */}
      <div
        className={`fixed bottom-4 left-0 right-0 z-40 lg:hidden flex justify-center px-4 pointer-events-none safe-area-inset-bottom transition-all duration-300 ${
          isFormReached ? "opacity-0 translate-y-4 pointer-events-none" : "opacity-100 translate-y-0"
        }`}
      >
        <button
          type="button"
          tabIndex={isFormReached ? -1 : 0}
          onClick={() => {
            const formEl = document.getElementById("guest-details-form");
            if (formEl) {
              formEl.scrollIntoView({ behavior: "smooth", block: "start" });
              const firstInput = formEl.querySelector<HTMLInputElement>("input");
              if (firstInput) firstInput.focus({ preventScroll: true });
            }
          }}
          className="pointer-events-auto bg-[#FF561C] hover:bg-[#e0450d] text-white font-semibold text-xs sm:text-sm py-2.5 px-5 rounded-full shadow-lg flex items-center gap-2 transition-all active:scale-95 cursor-pointer ring-4 ring-white/80 animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <span>Enter Details</span>
          <ArrowDown className="w-4 h-4 animate-bounce" />
        </button>
      </div>
    </>
  );
}
