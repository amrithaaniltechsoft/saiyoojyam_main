import type { Metadata } from "next";

export interface SeoRecord {
  id?: number | string;
  page?: string;
  meta_title?: string;
  meta_desc?: string;
  meta_key_word?: string;
  updated_at?: string;
}

export async function getSeoByPage(
  pageName: string = "Home"
): Promise<SeoRecord> {
  const rawApiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost/saiyoojyam";
  const baseUrl = rawApiUrl.replace(/\/+$/, "");

  try {
    const res = await fetch(
      `${baseUrl}/api/seo/${encodeURIComponent(pageName)}`,
      {
        cache: "no-store",
      }
    );

    if (res.ok) {
      const json = await res.json();
      if (json && json.status && json.data) {
        return {
          id: json.data.id,
          page: json.data.page || pageName,
          meta_title: json.data.meta_title || "",
          meta_desc: json.data.meta_desc || "",
          meta_key_word: json.data.meta_key_word || "",
          updated_at: json.data.updated_at,
        };
      }
    }
  } catch (err) {
    console.warn(
      `Could not fetch SEO for ${pageName} from API:`,
      err
    );
  }

  return {
    page: pageName,
    meta_title: "",
    meta_desc: "",
    meta_key_word: "",
  };
}

export async function getSeoById(
  id: number | string = 2
): Promise<SeoRecord> {
  const rawApiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost/saiyoojyam";
  const baseUrl = rawApiUrl.replace(/\/+$/, "");

  try {
    const res = await fetch(`${baseUrl}/api/seo?id=${id}`, {
      cache: "no-store",
    });

    if (res.ok) {
      const json = await res.json();
      if (json && json.status && json.data) {
        return {
          id: json.data.id,
          page: json.data.page || "",
          meta_title: json.data.meta_title || "",
          meta_desc: json.data.meta_desc || "",
          meta_key_word: json.data.meta_key_word || "",
          updated_at: json.data.updated_at,
        };
      }
    }
  } catch (err) {
    console.warn(
      `Could not fetch SEO for id=${id} from API:`,
      err
    );
  }

  return {
    id,
    page: "",
    meta_title: "",
    meta_desc: "",
    meta_key_word: "",
  };
}

export async function constructMetadata(
  pageName: string = "Home"
): Promise<Metadata> {
  const seo = await getSeoByPage(pageName);
  const title = seo.meta_title?.trim() || "";
  const description = seo.meta_desc?.trim() || "";
  const keywords = seo.meta_key_word?.trim() || undefined;

  return {
    title: title || undefined,
    description: description || undefined,
    keywords: keywords || undefined,
    openGraph: {
      title: title || undefined,
      description: description || undefined,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: title || undefined,
      description: description || undefined,
    },
  };
}

export async function constructMetadataById(
  id: number | string = 2
): Promise<Metadata> {
  const seo = await getSeoById(id);
  const title = seo.meta_title?.trim() || "";
  const description = seo.meta_desc?.trim() || "";
  const keywords = seo.meta_key_word?.trim() || undefined;

  return {
    title: title || undefined,
    description: description || undefined,
    keywords: keywords || undefined,
    openGraph: {
      title: title || undefined,
      description: description || undefined,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: title || undefined,
      description: description || undefined,
    },
  };
}
