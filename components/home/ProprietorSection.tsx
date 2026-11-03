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

  if (!proprietor || (!proprietor.title && !proprietor.description)) {
    return null;
  }
  const isFullBleedBanner =
    proprietor.image.includes("Corporate Portrait with Warm Orange Background");

  return (
    <section className="relative z-0 w-full overflow-hidden bg-[#c86228]">
      {/* ========================================================= */}
      {/* DESKTOP LAYOUT (lg:block)                                  */}
      {/* ========================================================= */}
      <div className="hidden lg:block relative w-full">
        {isFullBleedBanner ? (
          /* Full-bleed banner layout (used when default composite banner is active) */
          <>
            <div className="absolute inset-0 w-full h-full select-none pointer-events-none">
              <Image
                src={proprietor.image}
                alt={`${proprietor.title} - Proprietor of Saiyoojyam Ladies Hostels`}
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
                    {proprietor.title}
                  </p>
                </div>

                <div
                  className="text-white text-sm sm:text-base leading-relaxed space-y-3.5 font-normal [&>p]:leading-relaxed [&>p]:mb-3.5 [&>p:last-child]:mb-0"
                  dangerouslySetInnerHTML={{
                    __html:
                      proprietor.raw_desc || `<p>${proprietor.description}</p>`,
                  }}
                />
              </div>
            </div>
          </>
        ) : (
          /* 2-Column Split Layout (used when CMS photo is loaded from saiyoojyam_cms) */
          <div className="relative z-10 max-w-[1280px] mx-auto px-6 py-16 lg:py-20 flex flex-row items-center gap-12 xl:gap-16">
            {/* Left: Framed Executive Portrait */}
            <div className="w-5/12 xl:w-4/12 flex justify-center shrink-0">
              <div className="relative w-full max-w-[360px] aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 bg-white/10 group">
                <Image
                  src={proprietor.image}
                  alt={`${proprietor.title} - Proprietor of Saiyoojyam Ladies Hostels`}
                  fill
                  priority
                  unoptimized
                  sizes="(max-width: 1024px) 100vw, 400px"
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-white/20 backdrop-blur-md text-white border border-white/30">
                    Proprietor
                  </span>
                  <span className="text-white/95 text-sm font-medium drop-shadow-sm truncate max-w-[200px]">
                    {proprietor.title}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Content from CMS */}
            <div className="w-7/12 xl:w-8/12 flex flex-col justify-center space-y-5 text-white">
              <div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white tracking-tight leading-tight">
                  Meet Our <span className="text-orange-200">Proprietor</span>
                </h2>

                <p className="text-xl sm:text-2xl font-bold text-white mt-2">
                  {proprietor.title}
                </p>
              </div>

              <div
                className="text-white/95 text-sm sm:text-base leading-relaxed space-y-3.5 font-normal [&>p]:leading-relaxed [&>p]:mb-3.5 [&>p:last-child]:mb-0"
                dangerouslySetInnerHTML={{
                  __html:
                    proprietor.raw_desc || `<p>${proprietor.description}</p>`,
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* MOBILE & TABLET LAYOUT (lg:hidden): Portrait image on top, */}
      {/* content placed neatly below it with warm background        */}
      {/* ========================================================= */}
      <div className="block lg:hidden w-full flex flex-col">
        {/* Mobile & Tablet Image Container */}
        {proprietor.image && (
          <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] overflow-hidden bg-[#a64714]">
            <Image
              src={proprietor.image}
              alt={`${proprietor.title} - Proprietor of Saiyoojyam Ladies Hostels`}
              fill
              priority
              unoptimized
              sizes="100vw"
              className="object-cover object-top sm:object-center"
            />
          </div>
        )}

        {/* Content Section Below Image */}
        <div className="w-full px-6 pt-6 pb-12 sm:pb-16 flex flex-col space-y-4 text-white">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
              Meet Our <span className="text-orange-200">Proprietor</span>
            </h2>

            <p className="text-lg sm:text-xl font-bold text-white mt-1.5">
              {proprietor.title}
            </p>
          </div>

          <div
            className="text-white/95 text-sm sm:text-base leading-relaxed space-y-3 font-normal [&>p]:leading-relaxed [&>p]:mb-3 [&>p:last-child]:mb-0"
            dangerouslySetInnerHTML={{
              __html:
                proprietor.raw_desc || `<p>${proprietor.description}</p>`,
            }}
          />
        </div>
      </div>
    </section>
  );
}

