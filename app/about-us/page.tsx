import type { Metadata } from "next";
import { Header } from "@/components/global/Header";
import { Footer } from "@/components/global/Footer";
import { ProprietorSection } from "@/components/home/ProprietorSection";
import {
  AboutHeroSection,
  AboutIntroSection,
  AboutPropertiesSection,
  AboutMissionVisionSection,
  AboutSpecialitiesSection,
  AboutNeighbourhoodSection,
  AboutCtaSection,
} from "@/components/about";
import { constructMetadataById } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  // Fetch meta title, meta description, and meta keyword from saiyoojyam_seo table where id = 2 (no fallback content)
  return constructMetadataById(2);
}

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 antialiased flex flex-col justify-between overflow-x-hidden">
      {/* Global Header */}
      <Header />

      <main className="w-full flex-grow pt-0">
        {/* 1. Hero Banner */}
        <AboutHeroSection />

        {/* 2. Role of Hostel Accommodation */}
        <AboutIntroSection />

        {/* 3. Saiyoojyam Properties Network */}
        <AboutPropertiesSection />

        {/* 4. Purpose & Commitment (Mission & Vision) */}
        <AboutMissionVisionSection />

        {/* 5. Specialities Grid */}
        <AboutSpecialitiesSection />

        {/* 6. Meet The Proprietor */}
        <ProprietorSection />

        {/* 7. Neighbourhood Facilities */}
        <AboutNeighbourhoodSection />

        {/* 8. Bottom Call to Action */}
        <AboutCtaSection />
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
