"use server";

import { config } from "@/lib/config";
import api from "./api";

import { IMeUser } from "@/providers/http/auth/interface";

export const me = async (): Promise<IResponse<IMeUser>> => {
  try {
    const response = await api.get(config.apiURL + "/auth/me");
    return response.data;
  } catch (error: any) {
    return error;
  }
};