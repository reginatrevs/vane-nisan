import type { MetadataRoute } from "next";

// A private invitation: keep the whole thing out of search engines.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", disallow: "/" },
  };
}
