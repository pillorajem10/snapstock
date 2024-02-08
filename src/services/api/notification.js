// utils
import * as methods from '../../utils/methods';

import { GET, POST } from '../request';


export async function fetchNotificationByParams(payload) {
  const params = methods.convertQueryString(payload);
  return GET(`/notification?${params}`);
}

export async function updateNotification(payload) {
  return POST(`/notification`, payload);
}
