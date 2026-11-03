import type { Metadata } from "next";
import { Header } from "@/components/global/Header";
import { Footer } from "@/components/global/Footer";
import { constructMetadataById } from "@/lib/seo";
import {
  FoodQualityHero,
  FoodQualityPillars,
  DailyMealSchedule,
  KitchenGallery,
  FoodQualityFaq,
  FoodQualityCta,
  FoodHeroData,
  FoodPillarsData,
  FoodMenuData,
  FoodGalleryData,
  FoodFaqData,
  FoodCtaData,
} from "@/components/food-quality";

interface FoodQualityPageData {
  hero?: FoodHeroData;
  pillars?: FoodPillarsData;
  menu?: FoodMenuData;
  gallery?: FoodGalleryData;
  faqs?: FoodFaqData;
  cta?: FoodCtaData;
}

async function getFoodQualityData(): Promise<FoodQualityPageData> {
  const rawApiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost/saiyoojyam";
  const baseUrl = rawApiUrl.replace(/\/+$/, "");

  try {
    const res = await fetch(`${baseUrl}/api/food-quality`, {
      cache: "no-store",
    });

    if (res.ok) {
      const json = await res.json();
      if (json && json.status && json.data) {
        return json.data;
      }
    }
  } catch (err) {
    console.warn("Could not fetch food quality data from API:", err);
  }

  return {};
}

export async function generateMetadata(): Promise<Metadata> {
  // Fetch meta title, meta description, and meta keyword from saiyoojyam_seo table where id = 4
  return constructMetadataById(4);
}

export default async function FoodQualityPage() {
  const data = await getFoodQualityData();

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 antialiased flex flex-col justify-between overflow-x-hidden">
      {/* Global Header */}
      <Header />

      <main className="w-full flex-grow pt-0">
        {/* 1. Hero Banner */}
        <FoodQualityHero data={data.hero} />

        {/* 2. Four Quality Pillars */}
        <FoodQualityPillars data={data.pillars} />

        {/* 3. Daily Meal Timings & Sample Menu */}
        <DailyMealSchedule data={data.menu} />

        {/* 4. Dining & Kitchen Visual Gallery */}
        <KitchenGallery data={data.gallery} />

        {/* 5. Frequently Asked Questions */}
        <FoodQualityFaq data={data.faqs} />

        {/* 6. WhatsApp & Booking Call-to-Action */}
        <FoodQualityCta data={data.cta} />
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
