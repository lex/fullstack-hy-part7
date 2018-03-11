import userService from '../services/users';

const USERS_INIT = 'USER_INIT';

const initialState = { users: [] };

const reducer = (store = initialState, action) => {
  if (action.type === USERS_INIT) {
    return { users: action.users };
  }

  return store;
};

export const initializeUsers = () => {
  return async dispatch => {
    const users = await userService.getAll();

    dispatch({
      type: USERS_INIT,
      users,
    });
  };
};

export default reducer;
