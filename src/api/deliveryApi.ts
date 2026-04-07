import type { Delivery } from '@/types/delivery';
import { dummyRepository } from './dummyRepository';

export const deliveryApi: DeliveryApi = dummyRepository;

export interface DeliveryApi {
  uploadImage: (file: File, deliveryId: string) => Promise<string>;
  fetchDeliveries: () => Promise<Delivery[]>;
  createDelivery: (deliveryData: Delivery) => Promise<void>;
  updateDelivery: (
    id: string,
    deliveryData: Partial<Delivery>
  ) => Promise<void>;
  deleteDelivery: (id: string) => Promise<void>;
}