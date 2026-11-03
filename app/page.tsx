import type { Metadata } from "next";
import { Header } from "@/components/global/Header";
import { Footer } from "@/components/global/Footer";
import { HeroCarousel, HostelBuildingItem } from "@/components/home/HeroCarousel";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { ProprietorSection } from "@/components/home/ProprietorSection";
import { HomeBookingSuccessModal } from "@/components/home/HomeBookingSuccessModal";
import { constructMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return constructMetadata("Home");
}

async function getHomeBuildings(): Promise<HostelBuildingItem[]> {
  const rawApiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost/saiyoojyam";
  const baseUrl = rawApiUrl.replace(/\/+$/, "");

  try {
    const res = await fetch(`${baseUrl}/api/building`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return [];
    }

    const json = await res.json();
    if (json && json.status && Array.isArray(json.data) && json.data.length > 0) {
      return json.data.map((b: any) => ({
        id: b.id,
        name: b.name || "",
        slug: b.slug || "",
        location: b.location || b.address || "",
        images: Array.isArray(b.images) && b.images.length > 0 ? b.images : (b.mainImage ? [b.mainImage] : []),
      }));
    }
  } catch (err) {
    console.warn("Could not fetch buildings from API:", err);
  }

  return [];
}

export default async function Home() {
  const buildings = await getHomeBuildings();

  return (
    <div className="min-h-screen bg-surface font-sans text-on-surface antialiased flex flex-col justify-between overflow-x-hidden">
      {/* Global Header */}
      <Header />

      {/* Main Page Content */}
      <main className="w-full pt-0 bg-surface flex-grow overflow-x-hidden">
        <div className="flex flex-col w-full relative">
          <HeroCarousel initialBuildings={buildings} />
          <ProprietorSection />
          <FeaturesSection />
        </div>
      </main>

      {/* Booking Success Modal on Home page */}
      <HomeBookingSuccessModal />

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
