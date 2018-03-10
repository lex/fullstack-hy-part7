import React from 'react';
import { connect } from 'react-redux';
import Blog from './components/Blog';
import BlogForm from './components/BlogForm';
import Notification from './components/Notification';
import Togglable from './components/Togglable';
import blogService from './services/blogs';
import loginService from './services/login';
import { showNotification } from './reducers/notificationReducer';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      blogs: [],
      user: null,
      username: '',
      password: '',
      title: '',
      author: '',
      url: '',
    };
  }

  componentWillMount() {
    blogService.getAll().then(blogs => this.setState({ blogs }));

    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser');

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      this.setState({ user });
      blogService.setToken(user.token);
    }
  }

  like = id => async () => {
    const liked = this.state.blogs.find(b => b._id === id);
    const updated = { ...liked, likes: liked.likes + 1 };

    await blogService.update(id, updated);

    this.props.showNotification(
      'info',
      `you liked '${updated.title}' by ${updated.author}`,
      3,
    );

    this.setState({
      blogs: this.state.blogs.map(b => (b._id === id ? updated : b)),
    });
  };

  remove = id => async () => {
    const deleted = this.state.blogs.find(b => b._id === id);
    const ok = window.confirm(
      `remove blog '${deleted.title}' by ${deleted.author}?`,
    );

    if (!ok) {
      return;
    }

    await blogService.remove(id);

    this.props.showNotification(
      'info',
      `blog '${deleted.title}' by ${deleted.author} removed`,
      3,
    );

    this.setState({
      blogs: this.state.blogs.filter(b => b._id !== id),
    });
  };

  addBlog = async event => {
    event.preventDefault();
    const blog = {
      title: this.state.title,
      author: this.state.author,
      url: this.state.url,
    };

    const result = await blogService.create(blog);

    this.props.showNotification(
      'info',
      `blog '${blog.title}' by ${blog.author} added`,
      3,
    );

    this.setState({
      title: '',
      url: '',
      author: '',
      blogs: this.state.blogs.concat(result),
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
      blogService.setToken(user.token);

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

    const blogsInOrder = this.state.blogs.sort(byLikes);

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
            key={blog._id}
            blog={blog}
            like={this.like(blog._id)}
            remove={this.remove(blog._id)}
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

export default connect(null, { showNotification })(App);
