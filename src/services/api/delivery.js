// utils
import * as methods from '../../utils/methods';

import { GET, POST, PUT } from '../request';

export async function fetchDeliveriesByParams(payload) {
  const params = methods.convertQueryString(payload);
  return GET(`/delivery?${params}`);
}

export async function createDelivery(payload) {
  return POST(`/delivery`, payload);
}

export async function fetchDeliveryById(payload) {
  return GET(`/delivery/${payload}`);
}

export async function updateDeliveryById(payload) {
  const { id } = payload;
  return PUT(`/delivery/${id}`, payload);
}
