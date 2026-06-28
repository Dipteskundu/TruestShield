import type { ScanType } from "@/lib/constants";

export const scanTypeConfig: Record<
  Exclude<ScanType, "image">,
  { apiEndpoint: string; bodyKey: string }
> = {
  email: { apiEndpoint: "/api/scan/text", bodyKey: "content" },
  job: { apiEndpoint: "/api/scan/text", bodyKey: "content" },
  message: { apiEndpoint: "/api/scan/text", bodyKey: "content" },
  url: { apiEndpoint: "/api/scan/url", bodyKey: "url" },
};
