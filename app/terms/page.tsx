import type { Metadata } from "next";
import { Header } from "@/components/global/Header";
import { Footer } from "@/components/global/Footer";
import Link from "next/link";
import { ShieldCheck, CheckCircle2, ChevronRight, Home } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms and Conditions of Hostel Accommodation | Saiyoojyam Ladies Hostels",
  description: "Official rules of stay, code of conduct, payment terms, and policies for residents at Saiyoojyam Ladies Hostels.",
};

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

      <main className="w-full flex-grow pt-20 sm:pt-24 pb-16">
        {/* Breadcrumb & Header Banner */}
        <section className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 text-white py-12 sm:py-16 px-4 sm:px-6 shadow-md relative overflow-hidden">
          <div className="max-w-4xl mx-auto text-center relative z-10">
            {/* Breadcrumb */}
            <div className="flex items-center justify-center gap-2 text-xs text-white/80 mb-3 font-medium">
              <Link href="/" className="hover:text-white flex items-center gap-1 transition-colors">
                <Home className="w-3.5 h-3.5" />
                <span>Home</span>
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-white/60" />
              <span className="text-white font-semibold">Terms &amp; Conditions</span>
            </div>

            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 border border-white/25">
              <ShieldCheck className="w-4 h-4 text-white" />
              <span>Hostel Regulations &amp; Stay Policy</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-3">
              {terms.title}
            </h1>
            <p className="text-white/95 text-xs sm:text-base max-w-2xl mx-auto leading-relaxed font-medium">
              Official code of conduct, fee settlements, room guidelines, and stay regulations for all residents of Saiyoojyam Ladies Hostels.
            </p>

            {clauses.length > 0 && (
              <div className="mt-4 inline-block bg-white text-orange-600 text-xs font-bold px-3.5 py-1 rounded-full shadow-sm">
                {clauses.length} Accommodation Rules
              </div>
            )}
          </div>
        </section>

        {/* Content Section */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 -mt-8 relative z-20">
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
