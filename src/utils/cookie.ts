"use server";

import { config } from "@/lib/config";
import { cookies } from "next/headers";

const isProd = config.nodeENV === "production";

type SameSite = "strict" | "lax";

const sameSite: SameSite = isProd ? "strict" : "lax";

const configCookie = {
  maxAge: 60 * 60 * 24, // 1 day
  path: "/",
  httpOnly: true,
  secure: isProd,
  sameSite,
  domain: isProd ? "asset-manager-frontend-e9gg.onrender.com" : "localhost",
};


export const saveCookie = async (token: string) => {
  const cookieStore = await cookies();
  cookieStore.set("access_token", token, configCookie);
};

export const getCookie = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  return token;
};

export const deleteCookie = async (): Promise<void> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  token && cookieStore.delete("access_token");
};
