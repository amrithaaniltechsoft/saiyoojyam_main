"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  X,
  Mail,
  ShieldCheck,
  User,
  Phone,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  Lock,
  Eye,
  EyeOff,
  KeyRound,
} from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (username: string) => void;
  title?: string;
  subtitle?: string;
  redirectUrl?: string | false;
}

type LoginStep = "credentials" | "email" | "otp" | "register";

export function LoginModal({
  isOpen,
  onClose,
  onSuccess,
  title,
  subtitle,
  redirectUrl = "/profile?tab=dashboard",
}: LoginModalProps) {
  const router = useRouter();
  const [step, setStep] = useState<LoginStep>("credentials");

  // Credentials State
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // OTP Flow State
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [devOtpHint, setDevOtpHint] = useState<string | null>(null);

  // Resend countdown timer
  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [mounted, setMounted] = useState(false);
  const [isSuccessComplete, setIsSuccessComplete] = useState(false);
  const [verifiedCustomerName, setVerifiedCustomerName] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset modal state on open/close
  useEffect(() => {
    if (isOpen) {
      setStep("credentials");
      setLoginIdentifier("");
      setPassword("");
      setShowPassword(false);
      setEmail("");
      setOtp("");
      setFullName("");
      setPhone("");
      setErrorMessage(null);
      setInfoMessage(null);
      setDevOtpHint(null);
      setIsSuccessComplete(false);
      setIsLoading(false);
    }
  }, [isOpen]);

  // Resend OTP countdown ticker
  useEffect(() => {
    if (countdown > 0) {
      timerRef.current = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [countdown]);

  // Close on Escape & Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isLoading) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, isLoading]);

  if (!isOpen || !mounted) return null;

  const rawApiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost/saiyoojyam";
  const baseUrl = rawApiUrl.replace(/\/+$/, "");

  // 1. Password Login (Default & Recommended for Inmates)
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanLogin = loginIdentifier.trim();
    if (!cleanLogin) {
      setErrorMessage("Please enter your username or email address.");
      return;
    }
    if (!password) {
      setErrorMessage("Please enter your password.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setInfoMessage(null);

    try {
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          login: cleanLogin,
          password: password,
        }),
      });

      let json: any = null;
      try {
        json = await res.json();
      } catch {
        // fallback if response isn't JSON
      }

      if (res.ok && json && json.status && (json.user || json.customer)) {
        const u = json.user || json.customer;
        const displayName = u.name || u.username || cleanLogin;
        setVerifiedCustomerName(displayName);
        setIsSuccessComplete(true);

        try {
          localStorage.setItem("saiyoojyam_user", displayName);
          localStorage.setItem("saiyoojyam_user_data", JSON.stringify(u));
          window.dispatchEvent(new Event("user-login"));
        } catch {
          // ignore
        }

        if (onSuccess) onSuccess(displayName);

        setTimeout(() => {
          onClose();
          if (redirectUrl) {
            router.push(redirectUrl);
          }
        }, 700);
      } else {
        setErrorMessage(
          json?.message || "Invalid username/email or password. Please verify your credentials."
        );
      }
    } catch {
      setErrorMessage(
        "Network connection error. Please make sure the server is reachable."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Send OTP Request
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setErrorMessage("Please enter your email address.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setInfoMessage(null);
    setDevOtpHint(null);

    try {
      const res = await fetch(`${baseUrl}/api/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail }),
      });

      const json = await res.json();
      if (json && json.status) {
        setStep("otp");
        if (json.emailSent === false) {
          setErrorMessage(
            json.message || "Email could not be delivered to your inbox."
          );
        } else {
          setInfoMessage(`We've sent a 6-digit OTP to ${cleanEmail}. Please check your email inbox.`);
        }
        setCountdown(45); // 45 seconds before resend
        if (json.debugOtp) {
          setDevOtpHint(`Dev code: ${json.debugOtp}`);
        }
      } else {
        setErrorMessage(
          json?.message || "Could not send OTP. Please try again."
        );
      }
    } catch {
      setErrorMessage(
        "Network connection error. Please make sure the server is reachable."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Verify OTP & Check Customer Status
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanOtp = otp.trim();
    if (!cleanOtp || cleanOtp.length < 4) {
      setErrorMessage("Please enter the complete OTP code.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setInfoMessage(null);

    try {
      const res = await fetch(`${baseUrl}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          otp: cleanOtp,
        }),
      });

      const json = await res.json();
      if (json && json.status) {
        if (json.isNewCustomer) {
          // New customer: Ask for their name to complete registration
          setStep("register");
          setInfoMessage("Welcome! Please enter your name to finish your account setup.");
        } else {
          // Existing customer: Complete login immediately
          const cust = json.customer;
          const custName = cust?.name || email.split("@")[0];
          setVerifiedCustomerName(custName);
          setIsSuccessComplete(true);

          try {
            localStorage.setItem("saiyoojyam_user", custName);
            localStorage.setItem(
              "saiyoojyam_user_data",
              JSON.stringify(cust)
            );
            window.dispatchEvent(new Event("user-login"));
          } catch {
            // ignore
          }

          if (onSuccess) onSuccess(custName);

          setTimeout(() => {
            onClose();
            if (redirectUrl) {
              router.push(redirectUrl);
            }
          }, 700);
        }
      } else {
        setErrorMessage(
          json?.message || "Invalid or expired OTP. Please try again."
        );
      }
    } catch {
      setErrorMessage(
        "Verification failed due to a network error. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Register New Customer
  const handleRegisterCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = fullName.trim();
    if (!cleanName) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch(`${baseUrl}/api/auth/register-customer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          name: cleanName,
          phone: phone.trim(),
        }),
      });

      const json = await res.json();
      if (json && json.status) {
        const cust = json.customer;
        const custName = cust?.name || cleanName;
        setVerifiedCustomerName(custName);
        setIsSuccessComplete(true);

        try {
          localStorage.setItem("saiyoojyam_user", custName);
          localStorage.setItem(
            "saiyoojyam_user_data",
            JSON.stringify(cust)
          );
          window.dispatchEvent(new Event("user-login"));
        } catch {
          // ignore
        }

        if (onSuccess) onSuccess(custName);

        setTimeout(() => {
          onClose();
          if (redirectUrl) {
            router.push(redirectUrl);
          }
        }, 700);
      } else {
        setErrorMessage(
          json?.message || "Could not complete registration. Please try again."
        );
      }
    } catch {
      setErrorMessage("Registration failed due to a network error.");
    } finally {
      setIsLoading(false);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 font-sans-normal">
      {/* Dim Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-200"
        onClick={isLoading ? undefined : onClose}
        aria-hidden="true"
      />

      {/* Modal Card Centered */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row z-10 animate-in fade-in zoom-in-95 duration-200 my-auto border border-gray-100">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          aria-label="Close login dialog"
          className="absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 text-gray-600 hover:text-gray-950 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Side: Image Banner */}
        <div className="hidden md:block md:w-5/12 relative min-h-[420px] bg-gray-900">
          <Image
            src="/home-hero/h4.png"
            alt="Saiyoojyam Ladies Hostels"
            fill
            sizes="(max-width: 768px) 0vw, 320px"
            className="object-cover opacity-90"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-6 text-white">
            <span className="text-xs uppercase font-semibold tracking-wider text-[#FF561C]">
              Safe &amp; Premium Living
            </span>
            <h3 className="text-lg font-bold leading-snug mt-1">
              Saiyoojyam Hostels
            </h3>
            <p className="text-xs text-gray-300 mt-1">
              Coliving for women in Kakkanad, Kochi.
            </p>
          </div>
        </div>

        {/* Right Side: Flow Content */}
        <div className="flex-1 p-6 sm:p-8 flex flex-col justify-center">
          {/* Success Splash */}
          {isSuccessComplete ? (
            <div className="py-8 text-center space-y-3 animate-in fade-in zoom-in-95 duration-300">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-950">
                Welcome, {verifiedCustomerName}!
              </h3>
              <p className="text-sm text-gray-600">
                You are now logged in. Redirecting...
              </p>
            </div>
          ) : (
            <>
              {/* Header Title */}
              <div className="mb-5">
                {step === "credentials" && (
                  <>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-950 tracking-tight">
                      {title || "Login to Saiyoojyam"}
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                      {subtitle || "Enter your username/email and password to sign in"}
                    </p>
                  </>
                )}

                {step === "email" && (
                  <>
                    <div className="flex items-center gap-2 mb-1">
                      <button
                        type="button"
                        onClick={() => {
                          setStep("credentials");
                          setErrorMessage(null);
                        }}
                        className="text-gray-500 hover:text-gray-900 transition-colors p-1 -ml-1 rounded-full cursor-pointer"
                        title="Back to password login"
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-950 tracking-tight">
                        Login with Email OTP
                      </h2>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Enter your email address to receive a 6-digit login OTP
                    </p>
                  </>
                )}

                {step === "otp" && (
                  <>
                    <div className="flex items-center gap-2 mb-1">
                      <button
                        type="button"
                        onClick={() => {
                          setStep("email");
                          setErrorMessage(null);
                        }}
                        className="text-gray-500 hover:text-gray-900 transition-colors p-1 -ml-1 rounded-full cursor-pointer"
                        title="Change email"
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-950 tracking-tight">
                        Verify OTP
                      </h2>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600">
                      We sent a 6-digit verification code to{" "}
                      <strong className="text-gray-900 font-semibold">
                        {email}
                      </strong>
                    </p>
                  </>
                )}

                {step === "register" && (
                  <>
                    <span className="inline-block px-2.5 py-0.5 bg-orange-100 text-[#FF561C] rounded-full text-[11px] font-semibold mb-2">
                      New Customer Registration
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-950 tracking-tight">
                      Complete Your Profile
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                      Please enter your name to finalize your new account.
                    </p>
                  </>
                )}
              </div>

              {/* Error Alert */}
              {errorMessage && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2.5 text-xs text-red-700 animate-in fade-in duration-200">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                  <span className="leading-snug">{errorMessage}</span>
                </div>
              )}

              {/* Info Alert */}
              {infoMessage && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2.5 text-xs text-blue-700 animate-in fade-in duration-200">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-blue-600 mt-0.5" />
                  <span className="leading-snug">{infoMessage}</span>
                </div>
              )}

              {/* Dev OTP Hint Badge */}
              {devOtpHint && (
                <div className="mb-4 p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-center justify-between">
                  <span>{devOtpHint}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const match = devOtpHint.match(/\d{6}/);
                      if (match) setOtp(match[0]);
                    }}
                    className="text-[11px] text-amber-800 underline font-semibold cursor-pointer"
                  >
                    Auto Fill
                  </button>
                </div>
              )}

              {/* STEP 1: PASSWORD LOGIN (Default for Approved Inmates) */}
              {step === "credentials" && (
                <form onSubmit={handlePasswordLogin} className="space-y-4">
                  {/* Username or Email Input */}
                  <div className="relative">
                    <label className="absolute -top-2.5 left-3 px-1.5 bg-white text-xs font-semibold text-gray-950 z-10">
                      Username or Email Address <span className="text-red-600">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <User className="absolute left-3 w-4 h-4 text-gray-400 pointer-events-none" />
                      <input
                        type="text"
                        required
                        autoFocus
                        value={loginIdentifier}
                        onChange={(e) => setLoginIdentifier(e.target.value)}
                        placeholder="e.g. username or name@example.com"
                        className="w-full h-11 pl-9 pr-3 bg-white border border-gray-400 rounded-md text-sm text-gray-950 placeholder-gray-400 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#FF561C] focus:border-[#FF561C] font-normal"
                      />
                    </div>
                  </div>

                  {/* Password Input with Show/Hide Toggle */}
                  <div className="relative">
                    <label className="absolute -top-2.5 left-3 px-1.5 bg-white text-xs font-semibold text-gray-950 z-10">
                      Password <span className="text-red-600">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <Lock className="absolute left-3 w-4 h-4 text-gray-400 pointer-events-none" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your account password"
                        className="w-full h-11 pl-9 pr-10 bg-white border border-gray-400 rounded-md text-sm text-gray-950 placeholder-gray-400 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#FF561C] focus:border-[#FF561C] font-normal"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 text-gray-400 hover:text-gray-700 p-1 cursor-pointer"
                        title={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-11 bg-[#FF561C] hover:bg-[#e0450d] text-white text-sm font-semibold rounded-md shadow-sm transition-all active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Signing In...</span>
                      </>
                    ) : (
                      <>
                        <KeyRound className="w-4 h-4" />
                        <span>Sign In</span>
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-center text-gray-400 leading-relaxed pt-1">
                    Inmates receive their username &amp; password via email after booking approval.
                  </p>
                </form>
              )}

              {/* STEP 2: ENTER EMAIL FOR OTP */}
              {step === "email" && (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div className="relative">
                    <label className="absolute -top-2.5 left-3 px-1.5 bg-white text-xs font-semibold text-gray-950 z-10">
                      Email Address <span className="text-red-600">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <Mail className="absolute left-3 w-4 h-4 text-gray-400 pointer-events-none" />
                      <input
                        type="email"
                        required
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="yourname@example.com"
                        className="w-full h-11 pl-9 pr-3 bg-white border border-gray-400 rounded-md text-sm text-gray-950 placeholder-gray-400 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#FF561C] focus:border-[#FF561C] font-normal"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-11 bg-[#FF561C] hover:bg-[#e0450d] text-white text-sm font-semibold rounded-md shadow-sm transition-all active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Sending OTP...</span>
                      </>
                    ) : (
                      <span>Send OTP to Email</span>
                    )}
                  </button>

                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setStep("credentials");
                        setErrorMessage(null);
                        setInfoMessage(null);
                      }}
                      className="text-xs text-gray-600 hover:text-gray-950 font-medium hover:underline cursor-pointer"
                    >
                      ← Back to Password Login
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 3: ENTER OTP CODE */}
              {step === "otp" && (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="relative">
                    <label className="absolute -top-2.5 left-3 px-1.5 bg-white text-xs font-semibold text-gray-950 z-10">
                      6-Digit OTP <span className="text-red-600">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <ShieldCheck className="absolute left-3 w-4 h-4 text-gray-400 pointer-events-none" />
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={6}
                        required
                        autoFocus
                        value={otp}
                        onChange={(e) =>
                          setOtp(e.target.value.replace(/[^0-9]/g, ""))
                        }
                        placeholder="123456"
                        className="w-full h-12 pl-9 pr-3 bg-white border border-gray-400 rounded-md text-base tracking-widest text-gray-950 placeholder-gray-300 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#FF561C] focus:border-[#FF561C] font-semibold text-center"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || otp.length < 4}
                    className="w-full h-11 bg-[#FF561C] hover:bg-[#e0450d] text-white text-sm font-semibold rounded-md shadow-sm transition-all active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Verifying OTP...</span>
                      </>
                    ) : (
                      <span>Verify &amp; Continue</span>
                    )}
                  </button>

                  {/* Resend and change email options */}
                  <div className="flex items-center justify-between text-xs text-gray-600 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setStep("email");
                        setOtp("");
                        setErrorMessage(null);
                      }}
                      className="hover:text-gray-950 underline font-medium cursor-pointer"
                    >
                      Change Email
                    </button>

                    {countdown > 0 ? (
                      <span className="text-gray-400 font-medium">
                        Resend code in {countdown}s
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={isLoading}
                        className="text-[#FF561C] hover:text-[#e0450d] font-semibold flex items-center gap-1 cursor-pointer disabled:opacity-50"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Resend OTP</span>
                      </button>
                    )}
                  </div>
                </form>
              )}

              {/* STEP 4: REGISTER NEW CUSTOMER */}
              {step === "register" && (
                <form onSubmit={handleRegisterCustomer} className="space-y-4">
                  {/* Full Name */}
                  <div className="relative">
                    <label className="absolute -top-2.5 left-3 px-1.5 bg-white text-xs font-semibold text-gray-950 z-10">
                      Full Name <span className="text-red-600">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <User className="absolute left-3 w-4 h-4 text-gray-400 pointer-events-none" />
                      <input
                        type="text"
                        required
                        autoFocus
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Ananya Sharma"
                        className="w-full h-11 pl-9 pr-3 bg-white border border-gray-400 rounded-md text-sm text-gray-950 placeholder-gray-400 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#FF561C] focus:border-[#FF561C] font-normal"
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className="relative">
                    <label className="absolute -top-2.5 left-3 px-1.5 bg-white text-xs font-semibold text-gray-950 z-10">
                      Phone Number (Optional)
                    </label>
                    <div className="relative flex items-center">
                      <Phone className="absolute left-3 w-4 h-4 text-gray-400 pointer-events-none" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98470 XXXXX"
                        className="w-full h-11 pl-9 pr-3 bg-white border border-gray-400 rounded-md text-sm text-gray-950 placeholder-gray-400 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#FF561C] focus:border-[#FF561C] font-normal"
                      />
                    </div>
                  </div>

                  {/* Registered Email confirmation badge */}
                  <div className="p-2.5 bg-gray-50 border border-gray-200 rounded-md text-xs text-gray-600 flex items-center justify-between">
                    <span className="truncate">Email: {email}</span>
                    <span className="text-emerald-600 font-semibold text-[11px] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || !fullName.trim()}
                    className="w-full h-11 bg-[#FF561C] hover:bg-[#e0450d] text-white text-sm font-semibold rounded-md shadow-sm transition-all active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Saving Profile...</span>
                      </>
                    ) : (
                      <span>Complete Registration &amp; Login</span>
                    )}
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
