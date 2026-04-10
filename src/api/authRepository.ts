import axios from "axios";
import { apiClient } from "./apiClient";
import type { AuthApi } from "./authApi";

const BASE_URL = "/auth";

export const authRepository: AuthApi = {
  async login(payload) {
    const res = await apiClient.post<{ token: string }>(
      `${BASE_URL}/signin`,
      payload
    );

    const token = res.data.token;
    localStorage.setItem("token", token);

    return token;
  },

  async register(payload) {
    const res = await apiClient.post<{ token: string }>(
      `${BASE_URL}/signup`,
      payload
    );

    const token = res.data.token;
    localStorage.setItem("token", token);

    return token;
  },

  async logout() {
    localStorage.removeItem("token");
    return true;
  },
};