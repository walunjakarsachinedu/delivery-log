import type { Delivery } from '../types/delivery';

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
  }
];

let nextId = 4;

export const dummyRepository = {
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
  createDelivery: async (deliveryData: Omit<Delivery, 'id'>): Promise<string> => {
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 300));
    const newId = (nextId++).toString();
    const newDelivery: Delivery = { ...deliveryData, id: newId };
    deliveries.push(newDelivery);
    return newId;
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