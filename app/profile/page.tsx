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

  // Map each tab to its respective SEO page key
  const tabToSeoPage: Record<string, string> = {
    dashboard: "dashboard",
    profile: "profile",
    "monthly-payment": "monthly-payment",
    "payment-history": "payment-history",
    terms: "terms",
  };

  const seoPageKey = tabToSeoPage[tab] || tab || "profile";

  // Fetch dynamic SEO record configured in Admin panel for this specific tab
  let seo = await getSeoByPage(seoPageKey);

  // Fallback to general Profile if tab-specific record has empty title
  if (!seo.meta_title?.trim()) {
    seo = await getSeoByPage("Profile");
  }

  // Graceful fallback defaults if database values are empty
  const fallbackTitles: Record<string, string> = {
    dashboard: "Resident Dashboard | Saiyoojyam",
    profile: "Resident Profile | Saiyoojyam",
    "monthly-payment": "Monthly Rent Payment | Saiyoojyam",
    "payment-history": "Payment History & Receipts | Saiyoojyam",
    terms: "Hostel Rules & Terms | Saiyoojyam",
  };

  const fallbackDescriptions: Record<string, string> = {
    dashboard: "View your room details, bed allocation, stay summary, and announcements on your Saiyoojyam resident dashboard.",
    profile: "View and update your personal details, guardian contact, ID verification documents, and resident profile at Saiyoojyam.",
    "monthly-payment": "Pay your monthly hostel rent and room charges securely online with instant receipt generation at Saiyoojyam.",
    "payment-history": "Track all your past payments, rent receipts, transactions, and download official payment receipts at Saiyoojyam.",
    terms: "Read the official resident guidelines, hostel code of conduct, check-out policies, and terms at Saiyoojyam.",
  };

  const fallbackKeywords: Record<string, string> = {
    dashboard: "resident dashboard, saiyoojyam resident portal, room details, bed allocation, inmate dashboard",
    profile: "resident profile, personal details, inmate profile, saiyoojyam hostel profile, guardian contact",
    "monthly-payment": "monthly rent payment, pay hostel rent online, saiyoojyam payment, room rent, rent invoice",
    "payment-history": "payment history, download rent receipt, transaction history, hostel fee receipts, invoice history",
    terms: "hostel rules, resident guidelines, terms and conditions, code of conduct, saiyoojyam policies",
  };

  const title = seo.meta_title?.trim() || fallbackTitles[tab] || "Resident Profile & Dashboard | Saiyoojyam";
  const description = seo.meta_desc?.trim() || fallbackDescriptions[tab] || "Manage your resident profile and payments at Saiyoojyam.";
  const keywords = seo.meta_key_word?.trim() || fallbackKeywords[tab] || "Saiyoojyam profile, resident portal, room details, payment receipt";

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
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
