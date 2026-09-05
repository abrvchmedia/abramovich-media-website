import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/admin/", "/proposals/", "/desk/", "/api/desk/"],
      },
    ],
    sitemap: "https://www.abramovichmedia.com/sitemap.xml",
  };
}
