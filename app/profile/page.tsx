import { Suspense } from "react";
import { Header } from "@/components/global/Header";
import { Footer } from "@/components/global/Footer";
import { ProfileView } from "@/components/profile/ProfileView";
import type { ProfileTab } from "@/components/profile/ProfileHeroHeader";

interface ProfilePageProps {
  searchParams: Promise<{
    tab?: string;
  }>;
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
