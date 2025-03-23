import { hostname } from "os";

export default {
   images: {
      formats: ["image/avif", "image/webp"],
      remotePatterns: [
         {
            hostname: "elitefitness.com.mx",
         },
         {
            hostname: "i.imgur.com",
         },
      ],
   },
};
