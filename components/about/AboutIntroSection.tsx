import Image from "next/image";

interface AboutItem {
  id?: number | string;
  title: string;
  subtitle?: string;
  description: string;
  raw_desc?: string;
  image?: string;
}

async function getAboutData(): Promise<AboutItem[]> {
  const rawApiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost/saiyoojyam";
  const baseUrl = rawApiUrl.replace(/\/+$/, "");

  try {
    const res = await fetch(`${baseUrl}/api/about`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return [];
    }

    const json = await res.json();
    if (json && json.status && json.data) {
      const introItem = json.data.intro || (Array.isArray(json.data) ? json.data[0] : null);
      if (introItem) {
        let imageUrl = introItem.image || "";
        if (!imageUrl && introItem.image_name) {
          imageUrl = `${baseUrl}/uploads/about/${introItem.image_name}`;
        } else if (
          imageUrl &&
          !imageUrl.startsWith("http://") &&
          !imageUrl.startsWith("https://")
        ) {
          imageUrl = `${baseUrl}/${imageUrl.replace(/^\/+/, "")}`;
        }

        const title = introItem.title?.trim() || "";
        const subtitle = introItem.subtitle?.trim() || "";
        const rawDesc = introItem.raw_desc?.trim() || introItem.description?.trim() || "";
        const desc = introItem.description?.trim() || "";

        if (title || rawDesc || desc || imageUrl) {
          return [
            {
              id: 1,
              title,
              subtitle,
              description: desc,
              raw_desc: rawDesc,
              image: imageUrl,
            },
          ];
        }
      }
    }
  } catch (err) {
    console.warn("Could not fetch About Us from API:", err);
  }

  return [];
}

export async function AboutIntroSection() {
  const aboutList = await getAboutData();

  if (!aboutList || aboutList.length === 0) {
    return null;
  }

  return (
    <>
      {aboutList.map((item, index) => {
        const isReversed = index % 2 === 1;
        const hasImage = Boolean(item.image);

        return (
          <section
            key={item.id ?? index}
            className="w-full py-12 sm:py-20 bg-white"
          >
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="relative">
                {/* Offset muted background banner */}
                <div
                  className={`hidden lg:block absolute top-0 ${
                    isReversed ? "left-0" : "right-0"
                  } w-3/4 h-full bg-[#f3f4f6] rounded-3xl -z-0`}
                />

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center lg:py-10 lg:px-6">
                  {/* Photo (only if provided in database) */}
                  {hasImage && (
                    <div
                      className={`lg:col-span-5 relative ${
                        isReversed ? "lg:order-2" : ""
                      }`}
                    >
                      <div className="relative w-full aspect-[4/3] sm:aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                        <Image
                          src={item.image!}
                          alt={item.title || "Saiyoojyam hostel accommodation"}
                          fill
                          sizes="(max-width: 1024px) 100vw, 40vw"
                          className="object-cover"
                          unoptimized={item.image!.startsWith("http")}
                        />
                      </div>
                    </div>
                  )}

                  {/* Text Block */}
                  <div
                    className={`${
                      hasImage ? "lg:col-span-7" : "lg:col-span-12"
                    } flex flex-col justify-center space-y-4 sm:space-y-5 ${
                      hasImage && (isReversed ? "lg:pr-4 lg:order-1" : "lg:pl-4")
                    }`}
                  >
                    {item.subtitle && (
                      <span className="text-xs sm:text-sm font-bold text-[#FF561C]">
                        {item.subtitle}
                      </span>
                    )}
                    {item.title && (
                      <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold font-heading text-gray-950 leading-tight">
                        {item.title}
                      </h2>
                    )}
                    {item.raw_desc ? (
                      <div
                        className="space-y-4 text-sm sm:text-base text-gray-700 leading-relaxed font-normal [&>p]:mb-3 [&>p:last-child]:mb-0 [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5"
                        dangerouslySetInnerHTML={{ __html: item.raw_desc }}
                      />
                    ) : item.description ? (
                      <div className="space-y-4 text-sm sm:text-base text-gray-700 leading-relaxed font-normal">
                        <p>{item.description}</p>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}
