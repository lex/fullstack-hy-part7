const USERINFO_SET = 'USERINFO_SET';
const USERINFO_CLEAR = 'USERINFO_CLEAR';

const initialState = { user: { name: '', username: '', token: '' } };

const reducer = (store = initialState, action) => {
  if (action.type === USERINFO_SET) {
    return { user: action.user };
  }

  if (action.type === USERINFO_CLEAR) {
    return { ...initialState };
  }

  return store;
};

export const setUserInformation = user => {
  return async dispatch => {
    dispatch({
      type: USERINFO_SET,
      user,
    });
  };
};

export const clearUserInformation = () => {
  return async dispatch => {
    dispatch({
      type: USERINFO_CLEAR,
    });
  };
};

export default reducer;
