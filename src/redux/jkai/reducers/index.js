import { combineReducers } from 'redux';

import product from './product';
import category from './category';
import order from './order';
import delivery from './delivery';
import user from './user';

const reducer = combineReducers({
  product,
  order,
  delivery,
  user,
  category
});

export default reducer;
