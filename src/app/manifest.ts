import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Chroniva Photo Booth",
    short_name: "Chroniva",
    description: "Capture cinematic photo moments instantly",
    start_url: "/studio",
    display: "fullscreen",
    orientation: "portrait",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
