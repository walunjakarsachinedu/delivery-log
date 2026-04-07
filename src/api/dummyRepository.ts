import type { Delivery } from '../types/delivery';
import type { DeliveryApi } from './deliveryApi';

export const dummyRepository: DeliveryApi = {
  // Simulate image upload - return a fake URL
  uploadImage: async (file: File): Promise<string> => {
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 500));
    return `dummy-image-url-${Date.now()}-${file.name}`;
  },

  // Fetch all deliveries
  fetchDeliveries: async (): Promise<Delivery[]> => {
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...deliveries];
  },

  // Create a new delivery
  createDelivery: async (deliveryData: Delivery): Promise<void> => {
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 300));
    deliveries.push(deliveryData);
  },

  // Update an existing delivery
  updateDelivery: async (id: string, deliveryData: Partial<Delivery>): Promise<void> => {
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = deliveries.findIndex(d => d.id === id);
    if (index !== -1) {
      deliveries[index] = { ...deliveries[index], ...deliveryData };
    }
  },

  // Delete a delivery
  deleteDelivery: async (id: string): Promise<void> => {
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 300));
    deliveries = deliveries.filter(d => d.id !== id);
  }
};


let deliveries: Delivery[] = [
  {
    id: '1',
    customerName: 'John Doe',
    cost: 150.00,
    materialName: 'Electronics',
    siteName: 'Warehouse A',
    trackingNumber: 'TRK123456789',
    courierName: 'Global Logistics Inc.',
    dispatchDate: '2024-01-15T10:00:00Z',
    status: 'in-transit',
    photoUrl: null
  },
  {
    id: '2',
    customerName: 'Jane Smith',
    cost: 75.50,
    materialName: 'Books',
    siteName: 'Warehouse B',
    trackingNumber: 'TRK987654321',
    courierName: 'Quantum Express',
    dispatchDate: '2024-01-20T14:30:00Z',
    status: 'completed',
    photoUrl: null
  },
  {
    id: '3',
    customerName: 'Bob Johnson',
    cost: 200.00,
    materialName: 'Furniture',
    siteName: 'Warehouse C',
    trackingNumber: 'TRK555666777',
    courierName: 'Secured Logistics',
    dispatchDate: '2024-01-25T09:15:00Z',
    status: 'pending',
    photoUrl: null
  },
  {
    id: '4',
    customerName: 'Alice Brown',
    cost: 120.00,
    materialName: 'Clothing',
    siteName: 'Warehouse D',
    trackingNumber: 'TRK111222333',
    courierName: 'SpeedX Delivery',
    dispatchDate: '2024-02-01T11:45:00Z',
    status: 'in-transit',
    photoUrl: null
  },
  {
    id: '5',
    customerName: 'Michael Lee',
    cost: 89.99,
    materialName: 'Accessories',
    siteName: 'Warehouse A',
    trackingNumber: 'TRK444555666',
    courierName: 'Global Logistics Inc.',
    dispatchDate: '2024-02-05T08:20:00Z',
    status: 'completed',
    photoUrl: null
  },
  {
    id: '6',
    customerName: 'Emily Davis',
    cost: 300.00,
    materialName: 'Appliances',
    siteName: 'Warehouse E',
    trackingNumber: 'TRK777888999',
    courierName: 'Quantum Express',
    dispatchDate: '2024-02-10T16:10:00Z',
    status: 'pending',
    photoUrl: null
  },
  {
    id: '7',
    customerName: 'Chris Wilson',
    cost: 45.25,
    materialName: 'Stationery',
    siteName: 'Warehouse B',
    trackingNumber: 'TRK000111222',
    courierName: 'SpeedX Delivery',
    dispatchDate: '2024-02-12T13:00:00Z',
    status: 'returned',
    photoUrl: null
  },
  {
    id: '8',
    customerName: 'Sophia Martinez',
    cost: 220.75,
    materialName: 'Electronics',
    siteName: 'Warehouse C',
    trackingNumber: 'TRK333444555',
    courierName: 'Secured Logistics',
    dispatchDate: '2024-02-15T09:30:00Z',
    status: 'in-transit',
    photoUrl: null
  },
  {
    id: '9',
    customerName: 'David Anderson',
    cost: 60.00,
    materialName: 'Books',
    siteName: 'Warehouse D',
    trackingNumber: 'TRK666777888',
    courierName: 'Global Logistics Inc.',
    dispatchDate: '2024-02-18T15:45:00Z',
    status: 'completed',
    photoUrl: null
  },
  {
    id: '10',
    customerName: 'Olivia Taylor',
    cost: 500.00,
    materialName: 'Furniture',
    siteName: 'Warehouse F',
    trackingNumber: 'TRK999000111',
    courierName: 'Quantum Express',
    dispatchDate: '2024-02-20T07:25:00Z',
    status: 'returned',
    photoUrl: null
  }
];