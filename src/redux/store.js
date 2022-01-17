import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk'
import reducers from './combineReducers';

/*
const reducer = combineReducers({
  recipeList: recipeListReducer,
  recipeRate: recipeListRateReducer,
  recipeListAll: recipeListAllReducer,
  recipeSearch: recipeSearchReducer,
  recipeDetails: recipeDetailsReducer,
  userRegister: userRegisterReducer,
  userSignin: userLoginReducer,
  addCategory: categoryAddReducer,
  listCategories: categoryListReducer,
  addRecipe: recipeAddReducer,
  addReview: recipeAddReviewsReducer,
});
*/

const middleware =
  process.env.NODE_ENV === 'development' && window.__REDUX_DEVTOOLS_EXTENSION__
    ? compose(
        applyMiddleware(thunk),
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
      )
    : compose(applyMiddleware(thunk));

const store = createStore(reducers, {}, middleware);

export default store;
