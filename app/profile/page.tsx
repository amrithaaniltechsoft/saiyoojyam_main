import type { Metadata } from "next";
import { Suspense } from "react";
import { Header } from "@/components/global/Header";
import { Footer } from "@/components/global/Footer";
import { ProfileView } from "@/components/profile/ProfileView";
import type { ProfileTab } from "@/components/profile/ProfileHeroHeader";
import { getSeoByPage } from "@/lib/seo";

interface ProfilePageProps {
  searchParams: Promise<{
    tab?: string;
  }>;
}

export async function generateMetadata({ searchParams }: ProfilePageProps): Promise<Metadata> {
  const resolvedParams = await searchParams;
  const tab = (resolvedParams.tab as ProfileTab) || "dashboard";

  // Fetch dynamic SEO record configured in Admin panel under 'Profile' or 'Dashboard'
  let seo = await getSeoByPage("Profile");
  if (!seo.meta_title) {
    seo = await getSeoByPage("Dashboard");
  }

  const baseTitle = seo.meta_title?.trim() || "Resident Profile & Dashboard | Saiyoojyam";
  const baseDescription =
    seo.meta_desc?.trim() ||
    "Manage your resident profile, view room details, download payment receipts, and stay updated at Saiyoojyam Ladies Hostel.";
  const baseKeywords =
    seo.meta_key_word?.trim() ||
    "Saiyoojyam profile, resident dashboard, inmate portal, hostel room details, payment receipt";

  // Tab-specific context formatting when tab is specified
  const tabTitles: Record<string, string> = {
    dashboard: "Dashboard",
    profile: "Profile Details",
    "monthly-payment": "Monthly Rent Payment",
    "payment-history": "Payment History & Receipts",
    terms: "Terms & Notices",
  };

  const tabTitle = tabTitles[tab];
  let finalTitle = baseTitle;
  if (tab && tab !== "dashboard" && tabTitle && !baseTitle.toLowerCase().includes(tabTitle.toLowerCase())) {
    finalTitle = `${tabTitle} | ${baseTitle}`;
  }

  return {
    title: finalTitle,
    description: baseDescription,
    keywords: baseKeywords,
    openGraph: {
      title: finalTitle,
      description: baseDescription,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: finalTitle,
      description: baseDescription,
    },
  };
}

export default async function ProfilePage({ searchParams }: ProfilePageProps) {
  const resolvedParams = await searchParams;
  const initialTab = (resolvedParams.tab as ProfileTab) || "dashboard";

  return (
    <div className="min-h-screen bg-[#F4F5F7] flex flex-col font-sans-normal">
      <Header />

      <Suspense fallback={<div className="p-12 text-center text-gray-500">Loading profile...</div>}>
        <ProfileView initialTab={initialTab} />
      </Suspense>

      <Footer />
    </div>
  );
}
