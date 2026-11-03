export interface BuildingDetailData {
  slug: string;
  name: string;
  tagline: string;
  address: string;
  building_address?: string;
  sqftText?: string;
  floorsText?: string;
  heroImages: {
    main: string;
    sub1: string;
    sub2: string;
    sub3: string;
  };
  amenitiesGrid: { title: string; subtitle: string; icon: string }[];
  description: string;
  featuresList: string[];
  bookingFormWhatsappNumber: string;
  mapEmbedUrl?: string;
  mapDirectUrl?: string;
  moreImages?: string[];
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  admission_fees?: number;
  caution_deposit?: number;
}

export const BUILDINGS_DATA: Record<string, BuildingDetailData> = {};
