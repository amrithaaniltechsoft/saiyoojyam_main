import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BuildingBreadcrumbsProps {
  name: string;
}

export function BuildingBreadcrumbs({ name }: BuildingBreadcrumbsProps) {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-2.5 text-xs text-gray-700 font-normal flex items-center gap-2">
        <Link href="/" className="hover:text-[#FF561C] transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3 h-3 text-gray-400" />
        <Link href="/search" className="hover:text-[#FF561C] transition-colors">
          Hostels
        </Link>
        <ChevronRight className="w-3 h-3 text-gray-400" />
        <span className="text-gray-950 font-semibold">{name}</span>
      </div>
    </div>
  );
}
