import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://clarivue.ai";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/institutions/roi/report/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
