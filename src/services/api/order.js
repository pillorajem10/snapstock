// utils
import * as methods from '../../utils/methods';

import { GET, POST } from '../request';

export async function fetchOrderByParams(payload) {
  const params = methods.convertQueryString(payload);
  return GET(`/order?${params}`);
}
