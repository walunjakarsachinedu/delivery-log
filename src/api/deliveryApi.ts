import type { Delivery } from '@/types/delivery';
import { deliveryRepository } from './deliveryRepository';

export const deliveryApi: DeliveryApi = deliveryRepository;

export interface DeliveryApi {
  uploadImage: (file: File, deliveryId: string) => Promise<string>;

  fetchDeliveries: (params?: {
    startDate?: string;
    endDate?: string;
  }) => Promise<Delivery[]>;

  fetchDeliveryById: (id: string) => Promise<Delivery>;

  createDelivery: (
    deliveryData: Omit<Delivery, "_id">
  ) => Promise<Delivery>;

  updateDelivery: (
    id: string,
    deliveryData: Partial<Omit<Delivery, "_id">>
  ) => Promise<Delivery>;

  deleteDelivery: (id: string) => Promise<boolean>;
}