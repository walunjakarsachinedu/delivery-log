import { dummyRepository } from './dummyRepository';

export const deliveryApi = {
  uploadImage: dummyRepository.uploadImage,
  fetchDeliveries: dummyRepository.fetchDeliveries,
  createDelivery: dummyRepository.createDelivery,
  updateDelivery: dummyRepository.updateDelivery,
  deleteDelivery: dummyRepository.deleteDelivery,
};