"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { ProfileDropdown } from "@/components/global/ProfileDropdown";

interface CheckoutHeaderProps {
  onBack?: () => void;
}

export function CheckoutHeader({ onBack }: CheckoutHeaderProps) {
  const router = useRouter();
  const handleBack = onBack || (() => router.back());
  return (
    <header className="relative w-full bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-14 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/logo/logo.png"
            alt="Saiyoojyam Ladies Hostels"
            width={180}
            height={50}
            className="h-12 sm:h-14 w-auto object-contain group-hover:opacity-95 transition-opacity"
            priority
          />
        </Link>
        <div className="flex items-center gap-3">
          <ProfileDropdown theme="orange" />
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-800 hover:text-black bg-gray-100 hover:bg-gray-200 border border-gray-300 px-3.5 py-1.5 rounded-full transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>
        </div>
      </div>
    </header>
  );
}
