import type { MetadataRoute } from "next";
import { isDemo, siteUrl } from "@/lib/site/demo";

export default function robots(): MetadataRoute.Robots {
  if (isDemo()) return { rules: { userAgent: "*", disallow: "/" } };
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${siteUrl()}/sitemap.xml` };
}
