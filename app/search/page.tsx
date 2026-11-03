import { Suspense } from "react";
import { Header } from "@/components/global/Header";
import { Footer } from "@/components/global/Footer";
import { SearchResultsView } from "@/components/search/SearchResultsView";

interface SearchPageProps {
  searchParams: Promise<{
    location?: string;
    date?: string;
    roomType?: string;
    filter?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedParams = await searchParams;

  return (
    <div className="min-h-screen bg-surface font-sans text-on-surface antialiased flex flex-col justify-between">
      <Header />
      <main className="w-full pt-0 bg-surface flex-grow">
        <Suspense
          fallback={
            <div className="p-12 text-center text-gray-600 font-semibold">
              Loading search results...
            </div>
          }
        >
          <SearchResultsView
            initialLocation={resolvedParams.location}
            initialDate={resolvedParams.date}
            initialRoomType={resolvedParams.roomType}
            initialFilter={resolvedParams.filter}
          />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
