// utils
import * as methods from '../../utils/methods';

import { GET } from '../request';


export async function fetchNotificationByParams(payload) {
  const params = methods.convertQueryString(payload);
  return GET(`/notification?${params}`);
}
