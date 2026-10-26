import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default {
  ...defineCloudflareConfig(),
  // `npm run build` runs OpenNext, so tell it to call Next directly (avoids recursion).
  buildCommand: "npx next build",
};
