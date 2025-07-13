import { config } from "@/lib/config";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   apiURL: config.apiURL,
};

export default nextConfig;
