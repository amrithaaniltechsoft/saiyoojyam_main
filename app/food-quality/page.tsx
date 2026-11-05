import type { Metadata } from "next";
import { Header } from "@/components/global/Header";
import { Footer } from "@/components/global/Footer";
import { constructMetadataById } from "@/lib/seo";
import {
  FoodQualityHero,
  type FoodHeroData,
  WeeklyMenuTimetable,
  type WeeklyDayMenu,
  DEFAULT_WEEKLY_MENU,
} from "@/components/food-quality";

interface FoodQualityPageData {
  hero?: FoodHeroData;
  weeklySchedule?: WeeklyDayMenu[];
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
        const schedule =
          json.data.menu?.weeklySchedule ||
          json.data.weeklySchedule ||
          [];
        return {
          hero: json.data.hero,
          weeklySchedule: schedule.length > 0 ? schedule : DEFAULT_WEEKLY_MENU,
        };
      }
    }
  } catch (err) {
    console.warn("Could not fetch food quality data from API:", err);
  }

  return {
    weeklySchedule: DEFAULT_WEEKLY_MENU,
  };
}

export async function generateMetadata(): Promise<Metadata> {
  // Fetch meta title, meta description, and meta keyword from saiyoojyam_seo table where id = 4
  const meta = await constructMetadataById(4);
  if (meta && (meta.title || meta.description || meta.keywords)) {
    return meta;
  }

  return {
    title: "Food Quality & Weekly Menu | Saiyoojyam Ladies Hostels",
    description:
      "Homely, hygienic, and nutritious 7-day meal menu timetable served punctually across Saiyoojyam Hostels Kakkanad.",
  };
}

export default async function FoodQualityPage() {
  const data = await getFoodQualityData();

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 antialiased flex flex-col justify-between overflow-x-hidden">
      {/* Global Header */}
      <Header />

      <main className="w-full flex-grow pt-0 pb-12 sm:pb-16">
        {/* 1. Hero Banner */}
        <FoodQualityHero data={{ ...data.hero, image: "/home-hero/h1.png" }} />

        {/* 2. Weekly Menu Timetable Matrix */}
        <WeeklyMenuTimetable schedule={data.weeklySchedule} />
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
