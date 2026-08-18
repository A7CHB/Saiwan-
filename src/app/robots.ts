import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // The admin, the API and per-visitor pages have nothing to offer a
        // crawler and everything to lose from being indexed.
        disallow: ["/admin", "/api/", "/*/saved", "/*/compare", "/*/search"],
      },
    ],
    sitemap: `${siteUrl()}/sitemap.xml`,
    host: siteUrl(),
  };
}
