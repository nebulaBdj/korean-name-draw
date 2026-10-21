import type { MetadataRoute } from "next";
import { SITE } from "@/config/site";
import { names } from "@/lib/names";

// /, /names, /names/[id] 40개 (SPEC §16-5)
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: SITE.url, lastModified },
    { url: `${SITE.url}/names`, lastModified },
    ...names.map(({ id }) => ({ url: `${SITE.url}/names/${id}`, lastModified })),
  ];
}
