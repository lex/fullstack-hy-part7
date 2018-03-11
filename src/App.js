import React from 'react';
import { connect } from 'react-redux';
import Blog from './components/Blog';
import BlogForm from './components/BlogForm';
import Notification from './components/Notification';
import Togglable from './components/Togglable';
import loginService from './services/login';
import { showNotification } from './reducers/notificationReducer';
import {
  initializeBlogs,
  addBlog,
  removeBlog,
  updateBlog,
  setToken,
} from './reducers/blogReducer';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      username: '',
      password: '',
      title: '',
      author: '',
      url: '',
    };
  }

  componentWillMount() {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser');

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      this.setState({ user });
      this.props.setToken(user.token);
    }

    this.props.initializeBlogs();
  }

  like = id => async () => {
    const liked = this.props.blogs.find(b => b.id === id);
    const updated = { ...liked, likes: liked.likes + 1 };

    await this.props.updateBlog(id, updated);

    this.props.showNotification(
      'info',
      `you liked '${liked.title}' by ${liked.author}`,
      3,
    );
  };

  remove = id => async () => {
    const deleted = this.props.blogs.find(b => b.id === id);
    const ok = window.confirm(
      `remove blog '${deleted.title}' by ${deleted.author}?`,
    );

    if (!ok) {
      return;
    }

    await this.props.removeBlog(id);

    this.props.showNotification(
      'info',
      `blog '${deleted.title}' by ${deleted.author} removed`,
      3,
    );
  };

  addBlog = async event => {
    event.preventDefault();

    const blog = {
      title: this.state.title,
      author: this.state.author,
      url: this.state.url,
    };

    await this.props.addBlog(blog);

    this.props.showNotification(
      'info',
      `blog '${blog.title}' by ${blog.author} added`,
      3,
    );

    this.setState({
      title: '',
      url: '',
      author: '',
    });
  };

  logout = async () => {
    window.localStorage.removeItem('loggedBlogAppUser');
    this.props.showNotification('info', 'logged out', 3);
    this.setState({ user: null });
  };

  login = async event => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username: this.state.username,
        password: this.state.password,
      });

      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user));
      this.props.setToken(user.token);

      this.props.showNotification('info', 'welcome back!', 3);

      this.setState({ username: '', password: '', user });
    } catch (exception) {
      this.props.showNotification('error', 'invalid credentials', 3);
    }
  };

  handleLoginChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    if (this.state.user === null) {
      return (
        <div>
          <Notification notification={this.state.notification} />
          <h2>Log in</h2>
          <form onSubmit={this.login}>
            <div>
              username
              <input
                type="text"
                name="username"
                value={this.state.username}
                onChange={this.handleLoginChange}
              />
            </div>
            <div>
              password
              <input
                type="password"
                name="password"
                value={this.state.password}
                onChange={this.handleLoginChange}
              />
            </div>
            <button type="submit">log in</button>
          </form>
        </div>
      );
    }

    const byLikes = (b1, b2) => b2.likes - b1.likes;

    const blogsInOrder = this.props.blogs.sort(byLikes);

    return (
      <div>
        <Notification />
        {this.state.user.name} logged in{' '}
        <button onClick={this.logout}>logout</button>
        <Togglable buttonLabel="add new blog">
          <BlogForm
            handleChange={this.handleLoginChange}
            title={this.state.title}
            author={this.state.author}
            url={this.state.url}
            handleSubmit={this.addBlog}
          />
        </Togglable>
        <h2>blogs</h2>
        {blogsInOrder.map(blog => (
          <Blog
            key={blog.id}
            blog={blog}
            like={this.like(blog.id)}
            remove={this.remove(blog.id)}
            deletable={
              blog.user === undefined ||
              blog.user.username === this.state.user.username
            }
          />
        ))}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    blogs: state.blogs.blogs,
  };
};

export default connect(mapStateToProps, {
  showNotification,
  initializeBlogs,
  addBlog,
  removeBlog,
  updateBlog,
  setToken,
})(App);
