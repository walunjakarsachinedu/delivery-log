import { create } from 'zustand';
import type { Delivery, FilterOptions } from '../types/delivery';
import { deliveryApi } from '../api/deliveryApi';

interface DeliveryState {
  deliveries: Delivery[];
  filters: FilterOptions;
  isLoading: boolean;
  
  fetchDeliveries: () => Promise<void>;
  addDelivery: (delivery: Omit<Delivery, 'id'>, imageFile: File | null) => Promise<void>;
  updateDelivery: (id: string, updatedData: Partial<Delivery>, imageFile: File | null) => Promise<void>;
  deleteDelivery: (id: string) => Promise<void>;
  
  setFilters: (filters: Partial<FilterOptions>) => void;
  clearFilters: () => void;
}

const defaultFilters: FilterOptions = {
  globalSearch: '',
  fromDate: null,
  toDate: null,
  status: [],
  courier: null,
};

export const useDeliveryStore = create<DeliveryState>((set) => ({
  deliveries: [],
  filters: defaultFilters,
  isLoading: false,

  fetchDeliveries: async () => {
    set({ isLoading: true });
    try {
      const data = await deliveryApi.fetchDeliveries();
      set({ deliveries: data, isLoading: false });
    } catch (error) {
      console.error("Error fetching deliveries:", error);
      set({ isLoading: false });
    }
  },

  addDelivery: async (deliveryData, imageFile) => {
    set({ isLoading: true });
    try {
      let photoUrl = deliveryData.photoUrl;
      const deliveryId = new Date().toISOString();
      
      if (imageFile) {
        photoUrl = await deliveryApi.uploadImage(imageFile, deliveryId);
      }

      const newDeliveryData: Delivery = { ...deliveryData, photoUrl, id: deliveryId };
      await deliveryApi.createDelivery(newDeliveryData);
      
      set((state) => ({
        deliveries: [...state.deliveries, newDeliveryData] as Delivery[],
        isLoading: false
      }));
    } catch (error) {
      console.error("Error adding delivery:", error);
      set({ isLoading: false });
    }
  },

  updateDelivery: async (id, updatedData, imageFile) => {
    set({ isLoading: true });
    try {
      let photoUrl = updatedData.photoUrl;

      if (imageFile) {
        photoUrl = await deliveryApi.uploadImage(imageFile, id);
      }

      const finalUpdateData = { ...updatedData, photoUrl };
      await deliveryApi.updateDelivery(id, finalUpdateData);

      set((state) => ({
        deliveries: state.deliveries.map((delivery) =>
          delivery.id === id ? { ...delivery, ...finalUpdateData } : delivery
        ),
        isLoading: false
      }));
    } catch (error) {
      console.error("Error updating delivery:", error);
      set({ isLoading: false });
    }
  },

  deleteDelivery: async (id) => {
    set({ isLoading: true });
    try {
      await deliveryApi.deleteDelivery(id);
      set((state) => ({
        deliveries: state.deliveries.filter((delivery) => delivery.id !== id),
        isLoading: false
      }));
    } catch (error) {
      console.error("Error deleting delivery:", error);
      set({ isLoading: false });
    }
  },

  setFilters: (newFilters) =>
    set((state) => ({ filters: { ...state.filters, ...newFilters } })),

  clearFilters: () => set(() => ({ filters: defaultFilters })),
}));