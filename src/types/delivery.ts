export type DeliveryStatus = 'in-transit' | 'pending' | 'completed' | 'returned';

export interface Delivery {
  id: string;
  photoUrl: string | null;
  customerName: string;
  cost: number;
  materialName: string;
  siteName: string;
  trackingNumber: string;
  courierName: string;
  dispatchDate: string; // ISO string
  status: DeliveryStatus;
}

export interface FilterOptions {
  globalSearch: string;
  fromDate: string | null;
  toDate: string | null;
  status: DeliveryStatus[];
  courier: string | null;
}