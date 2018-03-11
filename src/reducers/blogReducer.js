import blogService from '../services/blogs';

const BLOG_ADD = 'BLOG_ADD';
const BLOG_UPDATE = 'BLOG_UPDATE';
const BLOG_REMOVE = 'BLOG_REMOVE';
const BLOG_INIT = 'BLOG_INIT';

const initialState = { blogs: [] };

const reducer = (store = initialState, action) => {
  if (action.type === BLOG_INIT) {
    return { blogs: action.blogs };
  }

  if (action.type === BLOG_ADD) {
    return { blogs: store.blogs.concat(action.blog) };
  }

  if (action.type === BLOG_UPDATE) {
    return {
      blogs: store.blogs.map(
        b => (b.id === action.id ? action.updatedBlog : b),
      ),
    };
  }

  if (action.type === BLOG_REMOVE) {
    return { blogs: store.blogs.filter(b => b.id !== action.id) };
  }

  return store;
};

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll();

    dispatch({
      type: BLOG_INIT,
      blogs,
    });
  };
};

export const addBlog = blog => {
  return async dispatch => {
    const result = await blogService.create(blog);

    dispatch({
      type: BLOG_ADD,
      blog: result,
    });
  };
};

export const removeBlog = id => {
  return async dispatch => {
    await blogService.remove(id);
    dispatch({
      type: BLOG_REMOVE,
      id,
    });
  };
};

export const updateBlog = (id, updatedBlog) => {
  return async dispatch => {
    await blogService.update(id, updatedBlog);

    dispatch({
      type: BLOG_UPDATE,
      id,
      updatedBlog,
    });
  };
};

export const setToken = token => {
  return async dispatch => {
    blogService.setToken(token);
  };
};

export default reducer;
