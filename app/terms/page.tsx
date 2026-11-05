import type { Metadata } from "next";
import Image from "next/image";
import { Header } from "@/components/global/Header";
import { Footer } from "@/components/global/Footer";
import { constructMetadata, constructMetadataById } from "@/lib/seo";
import Link from "next/link";
import { ShieldCheck, CheckCircle2, ChevronRight, Home } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  // Fetch meta_title, meta_desc, and meta_key_word from saiyoojyam_seo table (id = 15, page = 'Terms and condition')
  const meta = await constructMetadataById(15);
  if (meta && (meta.title || meta.description || meta.keywords)) {
    return meta;
  }

  const byPage = await constructMetadata("Terms and condition");
  if (byPage && (byPage.title || byPage.description || byPage.keywords)) {
    return byPage;
  }

  return {
    title: "Terms and Conditions of Hostel Accommodation | Saiyoojyam Ladies Hostels",
    description:
      "Official rules of stay, code of conduct, payment terms, and policies for residents at Saiyoojyam Ladies Hostels.",
    keywords: "terms and conditions, hostel rules, saiyoojyam accommodation policy, kakkanad hostel guidelines",
  };
}

interface TermsPayload {
  title: string;
  description: string;
  small_description: string;
  raw_desc?: string;
  content?: string;
  pdf_url?: string;
  download_url?: string;
}

async function getTermsData(): Promise<TermsPayload> {
  const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost/saiyoojyam";
  const baseUrl = rawApiUrl.replace(/\/+$/, "");

  try {
    // Common / public terms & conditions strictly fetches from saiyoojyam_cms table where id = 17
    const res = await fetch(`${baseUrl}/api/cms?id=17`, { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      const item = Array.isArray(json?.data) ? json.data[0] : json?.data;
      if (item) {
        return {
          title: item.title || "Terms and Conditions of Hostel Accommodation",
          description: item.description || "",
          small_description: item.description || "",
          raw_desc: item.raw_desc || item.description || "",
          content: item.raw_desc || item.description || "",
        };
      }
    }
  } catch (err) {
    console.error("Failed to load CMS terms (id=17) on server:", err);
  }

  return {
    title: "Terms and Conditions of Hostel Accommodation",
    description: "",
    small_description: "",
    raw_desc: "",
    content: "",
  };
}

function extractClauses(content: string, plainDesc: string): { index: number; text: string }[] {
  const raw = plainDesc || (content ? content.replace(/<[^>]+>/g, "\n") : "");
  if (!raw) return [];

  const regex = /(?:^|\n)\s*(\d+)[\.\)]\s*([\s\S]*?)(?=(?:\n\s*\d+[\.\)]|$))/g;
  const items: { index: number; text: string }[] = [];
  let match;
  while ((match = regex.exec(raw)) !== null) {
    const text = match[2].trim().replace(/\s+/g, " ");
    if (text) {
      items.push({ index: parseInt(match[1], 10), text });
    }
  }
  return items;
}

export default async function TermsPage() {
  const terms = await getTermsData();
  const clauses = extractClauses(terms.raw_desc || terms.content || "", terms.description || terms.small_description || "");

  return (
    <div className="min-h-screen bg-gray-50/70 font-sans text-gray-900 antialiased flex flex-col justify-between overflow-x-hidden">
      {/* Global Header */}
      <Header />

      <main className="w-full flex-grow pt-0 pb-16">
        {/* Photographic Hero Banner */}
        <section className="relative w-full min-h-[380px] sm:min-h-[440px] lg:min-h-[480px] flex items-end justify-start overflow-hidden bg-gray-950 text-white">
          {/* Background Banner Image */}
          <Image
            src="/home-hero/h1.png"
            alt="Saiyoojyam Ladies Hostels Terms and Conditions of Stay"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-40 scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />

          {/* Decorative Warm Ambient Glow */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#FF561C]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-4xl mx-auto w-full px-4 sm:px-6 pb-14 sm:pb-16 pt-28 text-left flex flex-col items-start justify-end gap-3 sm:gap-4">
            {/* Breadcrumb Navigation */}
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-300 font-medium"
            >
              <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
                <Home className="w-3.5 h-3.5" />
                <span>Home</span>
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-[#FF561C] font-semibold">Terms &amp; Conditions</span>
            </nav>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF561C]/20 border border-[#FF561C]/40 text-[#ffd7a8] text-xs sm:text-sm font-medium tracking-wide">
              <ShieldCheck className="w-4 h-4 text-[#FF561C]" />
              <span>Hostel Regulations &amp; Stay Policy</span>
            </div>

            {/* Heading */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-heading text-white font-semibold leading-[1.15] max-w-4xl tracking-tight">
              Terms &amp;{" "}
              <span className="relative inline-block mt-0.5">
                <span className="courgette-regular text-orange-200 font-normal tracking-wide text-[0.95em]">
                  Conditions
                </span>
                <svg
                  className="absolute left-0 -bottom-1.5 sm:-bottom-2 w-full h-2.5 sm:h-3.5 overflow-visible pointer-events-none"
                  viewBox="0 0 100 12"
                  preserveAspectRatio="none"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 9.5 C 25 2.5, 75 2, 98 8 C 80 11.5, 45 11, 28 9"
                    stroke="#ffd7a8"
                    strokeWidth="3"
                    strokeLinecap="round"
                    pathLength="100"
                  />
                </svg>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base lg:text-lg text-gray-200 max-w-2xl font-normal leading-relaxed">
              Official code of conduct, fee settlements, room guidelines, and stay regulations for all residents of Saiyoojyam Ladies Hostels.
            </p>

            {clauses.length > 0 && (
              <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/20 text-orange-200 text-xs font-semibold px-3 py-1 rounded-md mt-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#FF561C]" />
                <span>{clauses.length} Accommodation Rules</span>
              </div>
            )}
          </div>
        </section>

        {/* Content Section */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 -mt-8 sm:-mt-10 relative z-20">
          <div className="bg-white rounded-2xl shadow-xl p-5 sm:p-10 border border-gray-200/80 space-y-8">
            {/* Header intro */}
            <div className="border-b border-gray-100 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg sm:text-2xl font-bold text-gray-950">
                  Rules and Regulations of Stay
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Please read the terms thoroughly before registration or room check-in.
                </p>
              </div>
              <span className="self-start sm:self-auto px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200 flex items-center gap-1.5 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Legally Binding</span>
              </span>
            </div>

            {/* If clauses were extracted, render each clause card */}
            {clauses.length > 0 ? (
              <div className="space-y-3.5 sm:space-y-4">
                {clauses.map((clause) => (
                  <div
                    key={clause.index}
                    className="p-4 sm:p-5 rounded-xl bg-gray-50/80 hover:bg-orange-50/40 border border-gray-200/90 hover:border-orange-300 transition-all flex items-start gap-3.5 sm:gap-4 shadow-2xs"
                  >
                    <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-orange-500 to-[#FF561C] text-white font-black text-xs sm:text-sm flex items-center justify-center shrink-0 shadow-xs">
                      {clause.index}
                    </span>
                    <p className="text-gray-800 text-xs sm:text-sm leading-relaxed pt-0.5 sm:pt-1">
                      {clause.text}
                    </p>
                  </div>
                ))}
              </div>
            ) : terms.raw_desc ? (
              <div
                className="prose prose-orange max-w-none text-gray-800 text-sm sm:text-base leading-relaxed space-y-3 bg-gray-50/60 p-5 rounded-xl border border-gray-200"
                dangerouslySetInnerHTML={{ __html: terms.raw_desc }}
              />
            ) : terms.small_description ? (
              <div className="text-gray-800 leading-relaxed text-sm sm:text-base whitespace-pre-line bg-gray-50/60 p-5 rounded-xl border border-gray-200">
                {terms.small_description}
              </div>
            ) : null}

            {/* Contact Support Footer */}
            <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm text-gray-500 gap-3">
              <span>Have questions about our stay terms or caution deposit refund?</span>
              <Link
                href="/#contact"
                className="text-[#FF561C] hover:underline font-bold flex items-center gap-1"
              >
                <span>Contact Hostel Office</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
