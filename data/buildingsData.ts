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

export const BUILDINGS_DATA: Record<string, BuildingDetailData> = {
  annex: {
    slug: "annex",
    name: "Saiyoojyam ANNEX Ladies Hostel",
    tagline: "Comfortable Stay & Good Food At Reasonable Rates Near Infopark Kochi",
    address: "Near Kuzhikkattumoola Petrol Pump, beside Excel Homes, Kakkanad, Kochi",
    sqftText: "Comfortable Residential Hostel",
    floorsText: "Each floor has 3 rooms with attached toilets",
    heroImages: {
      main: "/buildings/saiyoojyam-annex/s1.png",
      sub1: "/buildings/saiyoojyam-annex/s2.webp",
      sub2: "/buildings/saiyoojyam-annex/s3.webp",
      sub3: "/buildings/saiyoojyam-annex/s4.webp",
    },
    amenitiesGrid: [
      { title: "24/7 Wi-Fi", subtitle: "With inverter backup", icon: "Wifi" },
      { title: "Cleaning", subtitle: "2 days/week floor & toilet", icon: "Building" },
      { title: "Homely Food", subtitle: "North & South Indian combo", icon: "Utensils" },
      { title: "Tiffin Ready", subtitle: "B/F & Lunch by 7:30 AM", icon: "Utensils" },
      { title: "Bus Stop Walkable", subtitle: "Just 250 meters away", icon: "Car" },
    ],
    description: "Comfortable Stay and Good Food at reasonable rates near Infopark Kochi.",
    featuresList: [
      "24/7 Wi-Fi with inverter back up",
      "2 days/week floor & toilet cleaning",
      "Homely food; North & South Indian combo menu",
      "Each floor has 3 rooms with attached toilets",
      "4 beds, 1 table, 1 chair in each room",
      "Basement-1: Dining, wash area, pantry & staff accommodation",
      "Common refrigerator & ironing facility",
      "Covered terrace with washing machines, washing stone & cloth drying lines",
      "Breakfast & lunch tiffin ready by 7:30 AM",
      "Boiled water provided for drinking purpose",
      "Hot water for bathing can be fetched from terrace if needed",
      "Bus stop at walkable distance, just 250 meters",
      "Door locked from 10:00 PM to 6:00 AM (late entry/early exit not allowed)",
      "Photos and videos are uploaded to Google Maps",
      "Convenient access road behind Kuzhikkattumoola petrol pump beside Excel homes",
    ],
    bookingFormWhatsappNumber: "917034111368",
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3929.0296112684823!2d76.3551892!3d10.0144127!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b080ddf06400e79%3A0x18d8e9444f9094bb!2sSaiyoojyam%20Annex!5e0!3m2!1sen!2sin!4v1791888317353!5m2!1sen!2sin",
    mapDirectUrl:
      "https://www.google.com/maps/place/Saiyoojyam+Annex/@10.0144127,76.3551892,17z/data=!3m1!4b1!4m6!3m5!1s0x3b080ddf06400e79:0x18d8e9444f9094bb!8m2!3d10.0144127!4d76.3551892",
  },
  premier: {
    slug: "premier",
    name: "Saiyoojyam PREMIER Ladies Hostel",
    tagline: "5 Residential Floors · 35,000 Sq.ft Premier Living Near Infopark",
    address: "Opposite Solace Kids, Painakkil Junction, 1st left from Noel Palmdale Lane, Kakkanad, Kochi",
    sqftText: "35,000 Sq.Ft Building",
    floorsText: "5 Residential Floors + 2 Basements",
    heroImages: {
      main: "/buildings/saiyoojyam-premier/s1.png",
      sub1: "/buildings/saiyoojyam-premier/s2.webp",
      sub2: "/buildings/saiyoojyam-premier/s3.jpg",
      sub3: "/buildings/saiyoojyam-premier/s4.webp",
    },
    amenitiesGrid: [
      { title: "Elevator Facility", subtitle: "All floors & Basement-1", icon: "Building" },
      { title: "Biometric Door", subtitle: "Access with guardian consent", icon: "Lock" },
      { title: "Homely Food", subtitle: "North & South Indian combo", icon: "Utensils" },
      { title: "Cab Service", subtitle: "Available at fixed timings", icon: "Car" },
      { title: "Generator Backup", subtitle: "For emergency situations", icon: "Zap" },
    ],
    description: "The building has 5 residential floors measuring an area of 35,000 Sq.ft offering premium safety, comfort, and convenient facilities.",
    featuresList: [
      "The building has 5 residential floors measuring an area of 35,000 Sq.ft",
      "24/7 Wi-Fi with inverter backup",
      "2 days/week floor & toilet cleaning",
      "Homely food; North & South Indian combo menu",
      "Each apartment has 1 AC room, 1 Non-AC room & 1 toilet",
      "Separate study area & covered small balcony area in each apartment",
      "Each floor corridor has common study and sitting space",
      "Common refrigerator & ironing facility on each floor",
      "Basement-1: Dining, wash area, pantry, extra toilets & showers",
      "Two-wheeler free parking & staff accommodation in Basement-1",
      "Basement-2: Exclusively for car parking",
      "Covered terrace study area / open space",
      "Washing machines, washing stone & cloth drying lines on terrace",
      "Breakfast & lunch tiffin ready by 7:30 AM",
      "RO treated normal and boiled drinking water",
      "Hot water facility available in all bathrooms",
      "Cab service available at fixed timings",
      "Biometric door access for late entry (with guardian consent)",
      "Generator backup for emergency situations",
      "Elevator facility to all residential floors and Basement-1",
      "Photos and videos are uploaded to Google Maps",
      "Located Opposite Solace Kids, Painakkil Junction",
    ],
    bookingFormWhatsappNumber: "917034111368",
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3929.0549486153086!2d76.3566499!3d10.0123201!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b080d0057e2d5bb%3A0x3b2d558eacccde6e!2sSaiyoojyam%20Premier!5e0!3m2!1sen!2sin!4v1791888241388!5m2!1sen!2sin",
    mapDirectUrl:
      "https://www.google.com/maps/place/Saiyoojyam+Premier/@10.0123201,76.3566499,17z/data=!3m1!4b1!4m6!3m5!1s0x3b080d0057e2d5bb:0x3b2d558eacccde6e!8m2!3d10.0123201!4d76.3566499",
  },
  towers: {
    slug: "towers",
    name: "Saiyoojyam TOWERS 1 & 2 LADIES HOSTEL",
    tagline: "Prathibha Layout · Second Cross Road, Kakkanad",
    address: "Prathibha Layout, Second Cross Road, Block Panchayath Office Road, Kusumagiri P.O, Kakkanad, Kerala 682030",
    sqftText: "Twin Towers Campus",
    floorsText: "Tower 1 & Tower 2 Residential Blocks",
    heroImages: {
      main: "/buildings/saiyoojyam-towers/s1.png",
      sub1: "/buildings/saiyoojyam-towers/s2.webp",
      sub2: "/buildings/saiyoojyam-towers/s3.webp",
      sub3: "/buildings/saiyoojyam-towers/s4.webp",
    },
    amenitiesGrid: [
      { title: "Twin Elevators", subtitle: "Servicing both towers", icon: "Building" },
      { title: "Homely Dining", subtitle: "Nutritious homely meals", icon: "Utensils" },
      { title: "Wi-Fi & Lounges", subtitle: "High speed connectivity", icon: "Wifi" },
      { title: "CCTV & Security", subtitle: "Monitored premises", icon: "Lock" },
      { title: "Tech Park Cab", subtitle: "Convenient transit access", icon: "Car" },
    ],
    description: "Saiyoojyam TOWERS 1 & 2 located at Prathibha Layout, Kusumagiri, Kakkanad offer comfortable coliving spaces and modern amenities near Infopark.",
    featuresList: [
      "Twin tower residential complex in Prathibha Layout, Kusumagiri, Kakkanad",
      "High-speed 24/7 Wi-Fi connectivity throughout the property",
      "Twin elevator facility servicing residential floors",
      "Nutritious homely food menu for working professionals and students",
      "Regular housekeeping and sanitation maintenance",
      "Secure gate access timings from 6:00 AM to 10:00 PM",
      "Door access after 10:00 PM with written guardian consent for work shifts",
      "Convenient transit access to Infopark and Kakkanad bus stops",
      "Clean drinking water facilities and hot water availability",
      "Common refrigeration and clothes drying areas",
      "Photos and videos available on Google Maps",
    ],
    bookingFormWhatsappNumber: "917034111368",
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3929.0344879248346!2d76.34960057376456!3d10.01400997279611!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b080d42064f8335%3A0xda4cdedd9ad56ec7!2sSAIYOOJYAM%20-%20Ladies%20Hostel%20in%20Kakkanad%20%7C%20Women's%20Hostel%20near%20Infopark%20and%20CSEZ!5e0!3m2!1sen!2sin!4v1791888413434!5m2!1sen!2sin",
    mapDirectUrl:
      "https://www.google.com/maps/place/SAIYOOJYAM+-+Ladies+Hostel+in+Kakkanad+%7C+Women's+Hostel+near+Infopark+and+CSEZ/@10.0140099,76.3496005,17z/data=!3m1!4b1!4m6!3m5!1s0x3b080d42064f8335:0xda4cdedd9ad56ec7!8m2!3d10.0140099!4d76.3496005",
  },
};
