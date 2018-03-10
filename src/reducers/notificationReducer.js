const NOTIFICATION_CREATE = 'NOTIFICATION_CREATE';
const NOTIFICATION_DESTROY = 'NOTIFICATION_DESTROY';

const initialState = { type: '', text: '' };

const reducer = (store = initialState, action) => {
  if (action.type === NOTIFICATION_CREATE) {
    return { type: action.message.type, text: action.message.text };
  }

  if (action.type === NOTIFICATION_DESTROY) {
    return { ...initialState };
  }

  return store;
};

export const showNotification = (type, text, delay) => {
  return async dispatch => {
    dispatch({
      type: NOTIFICATION_CREATE,
      message: { type, text },
    });

    setTimeout(() => {
      dispatch({
        type: NOTIFICATION_DESTROY,
      });
    }, delay * 1000);
  };
};

export default reducer;
