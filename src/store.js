import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import notificationReducer from './reducers/notificationReducer';
import blogReducer from './reducers/blogReducer';
import userInfoReducer from './reducers/userInfoReducer';
import userReducer from './reducers/userReducer';

const reducer = combineReducers({
  notification: notificationReducer,
  blogs: blogReducer,
  user: userInfoReducer,
  users: userReducer,
});

const store = createStore(reducer, applyMiddleware(thunk));

export default store;
