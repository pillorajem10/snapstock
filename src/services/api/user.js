// utils
import * as methods from '../../utils/methods';

import { GET, POST, PUT } from '../request';


export async function loginFunc(payload) {
  return POST('/auth/login', payload);
}
