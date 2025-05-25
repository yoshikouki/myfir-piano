import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "まいふぁーピアノ",
    short_name: "まいふぁー",
    description: "子供向けのオンラインピアノアプリケーション",
    start_url: "/",
    display: "standalone",
    background_color: "#FFF8F0",
    theme_color: "#4A90E2",
    orientation: "landscape",
    icons: [
      {
        src: "/icon",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
