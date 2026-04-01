import { create } from 'zustand';
import type { Delivery, FilterOptions } from '../types/delivery';

interface DeliveryState {
  deliveries: Delivery[];
  filters: FilterOptions;
  
  // CRUD Operations
  addDelivery: (delivery: Omit<Delivery, 'id'>) => void;
  updateDelivery: (id: string, updatedData: Partial<Delivery>) => void;
  deleteDelivery: (id: string) => void;
  
  // Filter Operations
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
  deliveries: [], // Would typically initialize from an API or localStorage
  filters: defaultFilters,

  addDelivery: (deliveryData) => 
    set((state) => ({
      deliveries: [
        ...state.deliveries, 
        { ...deliveryData, id: crypto.randomUUID() }
      ]
    })),

  updateDelivery: (id, updatedData) =>
    set((state) => ({
      deliveries: state.deliveries.map((delivery) =>
        delivery.id === id ? { ...delivery, ...updatedData } : delivery
      )
    })),

  deleteDelivery: (id) =>
    set((state) => ({
      deliveries: state.deliveries.filter((delivery) => delivery.id !== id)
    })),

  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters }
    })),

  clearFilters: () =>
    set(() => ({
      filters: defaultFilters
    })),
}));