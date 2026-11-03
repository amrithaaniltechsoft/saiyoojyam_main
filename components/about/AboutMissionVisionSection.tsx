import Image from "next/image";

interface MissionData {
  subtitle: string;
  mission_title: string;
  mission_desc: string;
  vision_title: string;
  vision_desc: string;
  image: string;
}

async function getMissionData(): Promise<MissionData | null> {
  const rawApiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost/saiyoojyam";
  const baseUrl = rawApiUrl.replace(/\/+$/, "");

  try {
    const res = await fetch(`${baseUrl}/api/about`, { cache: "no-store" });
    if (!res.ok) return null;

    const json = await res.json();
    if (json && json.status && json.data && json.data.mission) {
      const m = json.data.mission;
      let imageUrl = m.image || "";
      if (!imageUrl && m.image_name) {
        imageUrl = `${baseUrl}/uploads/about/${m.image_name}`;
      } else if (
        imageUrl &&
        !imageUrl.startsWith("http://") &&
        !imageUrl.startsWith("https://")
      ) {
        imageUrl = `${baseUrl}/${imageUrl.replace(/^\/+/, "")}`;
      }

      const subtitle = m.subtitle?.trim() || "";
      const missionTitle = m.mission_title?.trim() || "";
      const missionDesc = m.raw_mission_desc?.trim() || m.mission_desc?.trim() || "";
      const visionTitle = m.vision_title?.trim() || "";
      const visionDesc = m.raw_vision_desc?.trim() || m.vision_desc?.trim() || "";

      if (!subtitle && !missionTitle && !missionDesc && !visionTitle && !visionDesc && !imageUrl) {
        return null;
      }

      return {
        subtitle,
        mission_title: missionTitle,
        mission_desc: missionDesc,
        vision_title: visionTitle,
        vision_desc: visionDesc,
        image: imageUrl,
      };
    }
  } catch (err) {
    console.warn("Could not fetch mission data from API:", err);
  }

  return null;
}

export async function AboutMissionVisionSection() {
  const data = await getMissionData();

  if (!data) {
    return null;
  }

  const hasImage = Boolean(data.image);
  const hasMission = Boolean(data.mission_title || data.mission_desc);
  const hasVision = Boolean(data.vision_title || data.vision_desc);

  if (!hasMission && !hasVision && !hasImage) {
    return null;
  }

  return (
    <section className="w-full py-12 sm:py-20 bg-white">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          {/* Offset neutral background banner */}
          <div className="hidden lg:block absolute top-0 right-0 w-3/4 h-full bg-[#f8fafc] border border-gray-100 rounded-3xl -z-0" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center lg:py-10 lg:px-6">
            {/* Left Photo: only rendered if provided in database */}
            {hasImage && (
              <div className="lg:col-span-5 relative">
                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                  <Image
                    src={data.image}
                    alt="Saiyoojyam Community Dining and Living"
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                    unoptimized={data.image.startsWith("http")}
                  />
                </div>
              </div>
            )}

            {/* Right Text Block: Mission & Vision */}
            <div
              className={`${
                hasImage ? "lg:col-span-7 lg:pl-4" : "lg:col-span-12"
              } flex flex-col justify-center space-y-6`}
            >
              {data.subtitle && (
                <span className="text-xs sm:text-sm font-bold text-[#FF561C]">
                  {data.subtitle}
                </span>
              )}

              {/* Mission */}
              {hasMission && (
                <div className="space-y-2">
                  {data.mission_title && (
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold font-heading text-gray-950 uppercase flex items-center gap-2">
                      <span>{data.mission_title}</span>
                    </h3>
                  )}
                  {data.mission_desc && (
                    data.mission_desc.includes("<") ? (
                      <div
                        className="text-sm sm:text-base text-gray-700 leading-relaxed font-normal [&>p]:mb-2 [&>p:last-child]:mb-0"
                        dangerouslySetInnerHTML={{ __html: data.mission_desc }}
                      />
                    ) : (
                      <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-normal">
                        {data.mission_desc}
                      </p>
                    )
                  )}
                </div>
              )}

              {/* Vision */}
              {hasVision && (
                <div className={`space-y-2 ${hasMission ? "pt-2 border-t border-gray-200" : ""}`}>
                  {data.vision_title && (
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold font-heading text-gray-950 flex items-center gap-2">
                      <span>{data.vision_title}</span>
                    </h3>
                  )}
                  {data.vision_desc && (
                    data.vision_desc.includes("<") ? (
                      <div
                        className="text-sm sm:text-base text-gray-700 leading-relaxed font-normal [&>p]:mb-2 [&>p:last-child]:mb-0"
                        dangerouslySetInnerHTML={{ __html: data.vision_desc }}
                      />
                    ) : (
                      <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-normal">
                        {data.vision_desc}
                      </p>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
