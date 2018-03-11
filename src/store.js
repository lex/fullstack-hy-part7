import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import notificationReducer from './reducers/notificationReducer';
import blogReducer from './reducers/blogReducer';
import userInfoReducer from './reducers/userInfoReducer';

const reducer = combineReducers({
  notification: notificationReducer,
  blogs: blogReducer,
  user: userInfoReducer,
});

const store = createStore(reducer, applyMiddleware(thunk));

export default store;
