import { combineReducers } from 'redux';

import jkai from './jkai/reducers';
import common from './common/reducers';

const reducers = combineReducers({
  jkai,
  common
});

export default reducers;
