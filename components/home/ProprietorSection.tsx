import Image from "next/image";

interface ProprietorData {
  id?: number | string;
  title: string;
  description: string;
  raw_desc?: string;
  image: string;
  thumb?: string;
  image_name?: string;
}

const DEFAULT_DESKTOP_BANNER = "/Proprietor/Corporate Portrait with Warm Orange Background.png";
const DEFAULT_MOBILE_BANNER = "/Proprietor/Proprietor-mob.png";

async function getProprietor(): Promise<ProprietorData | null> {
  const rawApiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost/saiyoojyam";
  const baseUrl = rawApiUrl.replace(/\/+$/, "");

  try {
    const res = await fetch(`${baseUrl}/api/cms/proprietor`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    const json = await res.json();
    if (json && json.status && json.data) {
      const item = json.data;

      let imageUrl = item.image || "";
      if (!imageUrl && item.image_name) {
        imageUrl = `${baseUrl}/uploads/cms/${item.image_name}`;
      } else if (
        imageUrl &&
        !imageUrl.startsWith("http://") &&
        !imageUrl.startsWith("https://")
      ) {
        imageUrl = `${baseUrl}/${imageUrl.replace(/^\/+/, "")}`;
      }

      return {
        id: item.id,
        title: item.title?.trim() || "",
        description: item.description?.trim() || "",
        raw_desc:
          item.raw_desc?.trim() ||
          item.description?.trim() ||
          "",
        image: imageUrl || "",
        thumb: item.thumb,
        image_name: item.image_name,
      };
    }
  } catch (err) {
    console.warn("Could not fetch Proprietor from CMS API:", err);
  }

  return null;
}

export async function ProprietorSection() {
  const proprietor = await getProprietor();

  const title =
    proprietor?.title && proprietor.title.trim() !== ""
      ? proprietor.title
      : "Mr. Sasidharan Thettikuzhi";

  const rawHtml =
    proprietor?.raw_desc ||
    (proprietor?.description ? `<p>${proprietor.description}</p>` : "");

  const desc =
    rawHtml ||
    `<p>Mr. Sasidharan Thettikuzhi retired from the United Nations as the Deputy Chief of Human Resources. He has extensive experience having served in various geographical locations of the UN for 32 years, including peacekeeping missions. He also served as the elected President of the UN Staff Union. His wife Mrs. Bijo Sasidharan is also a UN retiree. Among their two children, the elder daughter Saranya is a gastroenterologist who is settled down with her husband and young son in California. Her husband, Rahul, is an Engineer (an IIT gold medallist who obtained his Masters and doctorate from MIT). The younger son, Abhay is an engineering graduate from Purdue University, and is currently working with Qualcomm, an American multinational corporation, in California. The hostel operations in the country is a disorganized sector, where no standard of operation has been regulated. Realising this fact, the Proprietor of Saiyoojyam introduced “Saiyoojyam” as a model of operation for others to follow. Currently he serves as the President of the Professional Hostel Owners Association (PHOA) consisting of 110 hostel owners.</p>`;

  // Check if a custom uploaded image exists and is valid (not the composite banner filename)
  const isCustomImage =
    proprietor?.image &&
    proprietor.image.trim() !== "" &&
    !proprietor.image.includes("Corporate Portrait with Warm Orange Background");

  const desktopImage = isCustomImage
    ? encodeURI(proprietor!.image)
    : DEFAULT_DESKTOP_BANNER;

  const mobileImage = isCustomImage
    ? encodeURI(proprietor!.image)
    : DEFAULT_MOBILE_BANNER;

  return (
    <section className="relative z-0 w-full overflow-hidden bg-[#c86228]">
      {/* ========================================================= */}
      {/* DESKTOP LAYOUT (lg:block)                                  */}
      {/* ========================================================= */}
      <div className="hidden lg:block relative w-full">
        <div className="absolute inset-0 w-full h-full select-none pointer-events-none">
          <Image
            src={desktopImage}
            alt={`${title} - Proprietor of Saiyoojyam Ladies Hostels`}
            fill
            priority
            unoptimized
            sizes="100vw"
            className="object-cover object-left md:object-[left_center]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/35 to-black/35" />
        </div>

        <div className="relative z-10 max-w-[1280px] mx-auto px-6 py-20 lg:py-24 min-h-[580px] flex items-center justify-end">
          <div className="w-full lg:w-7/12 xl:w-1/2 flex flex-col justify-center space-y-5 text-white lg:pl-6">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white tracking-tight leading-tight">
                Meet Our <span className="text-orange-200">Proprietor</span>
              </h2>

              <p className="text-xl sm:text-2xl font-bold text-white mt-2">
                {title}
              </p>
            </div>

            <div
              className="text-white text-sm sm:text-base leading-relaxed space-y-3.5 font-normal"
              dangerouslySetInnerHTML={{
                __html: desc,
              }}
            />
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MOBILE & TABLET LAYOUT (lg:hidden)                        */}
      {/* ========================================================= */}
      <div className="block lg:hidden w-full flex flex-col">
        {/* Mobile & Tablet Image Container */}
        <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] overflow-hidden bg-[#a64714]">
          <Image
            src={mobileImage}
            alt={`${title} - Proprietor of Saiyoojyam Ladies Hostels`}
            fill
            priority
            unoptimized
            sizes="100vw"
            className="object-cover object-top sm:object-center"
          />
        </div>

        {/* Content Section Below Image */}
        <div className="w-full px-6 pt-6 pb-12 sm:pb-16 flex flex-col space-y-4 text-white">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
              Meet Our <span className="text-orange-200">Proprietor</span>
            </h2>

            <p className="text-lg sm:text-xl font-bold text-white mt-1.5">
              {title}
            </p>
          </div>

          <div
            className="text-white/95 text-sm sm:text-base leading-relaxed space-y-3 font-normal"
            dangerouslySetInnerHTML={{
              __html: desc,
            }}
          />
        </div>
      </div>
    </section>
  );
}
