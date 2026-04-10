import type { Delivery } from "@/types/delivery";
import type { DeliveryApi } from "./deliveryApi";
import { apiClient } from "./apiClient";
import axios from "axios";

const BASE_URL = "/delivery";

export const deliveryRepository: DeliveryApi = {
  async fetchDeliveries(params) {
    const res = await apiClient.get<Delivery[]>(BASE_URL, {
      params,
    });
    return res.data;
  },

  async fetchDeliveryById(id) {
    try {
      const res = await apiClient.get<Delivery>(`${BASE_URL}/${id}`);
      return res.data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 404) {
          throw new Error("Delivery not found");
        }
      }
      throw err; // already handled by interceptor
    }
  },

  async createDelivery(deliveryData) {
    const res = await apiClient.post<Delivery>(
      BASE_URL,
      deliveryData
    );
    return res.data;
  },

  async updateDelivery(id, deliveryData) {
    const res = await apiClient.put<Delivery>(
      `${BASE_URL}/${id}`,
      deliveryData
    );
    return res.data;
  },

  async deleteDelivery(id) {
    const res = await apiClient.delete<{ success: boolean }>(
      `${BASE_URL}/${id}`
    );
    return res.data.success;
  },

  async uploadImage(file, deliveryId) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await apiClient.post<{ url: string }>(
      `${BASE_URL}/${deliveryId}/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return res.data.url;
  },
};