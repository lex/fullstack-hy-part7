import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Blog from './components/Blog';
import BlogForm from './components/BlogForm';
import Notification from './components/Notification';
import Togglable from './components/Togglable';
import Users from './components/Users';
import User from './components/User';
import loginService from './services/login';
import { showNotification } from './reducers/notificationReducer';
import {
  initializeBlogs,
  addBlog,
  removeBlog,
  updateBlog,
  setToken,
} from './reducers/blogReducer';
import {
  setUserInformation,
  clearUserInformation,
} from './reducers/userInfoReducer';
import { initializeUsers } from './reducers/userReducer';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
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
      this.props.setUserInformation(user);
      this.props.setToken(user.token);
    }

    this.props.initializeBlogs();
    this.props.initializeUsers();
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
    this.props.clearUserInformation();
    this.props.showNotification('info', 'logged out', 3);
  };

  login = async event => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username: this.state.username,
        password: this.state.password,
      });

      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user));

      this.props.setUserInformation(user);
      this.props.setToken(user.token);

      this.props.showNotification('info', 'welcome back!', 3);

      this.setState({ username: '', password: '' });
    } catch (exception) {
      this.props.showNotification('error', 'invalid credentials', 3);
    }
  };

  handleLoginChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  renderLogin = () => (
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

  renderBlogs = () => (
    <div>
      <h2>blogs</h2>
      {this.props.blogs.map(blog => (
        <Blog
          key={blog.id}
          blog={blog}
          like={this.like(blog.id)}
          remove={this.remove(blog.id)}
          deletable={
            blog.user === undefined ||
            blog.user.username === this.props.user.username
          }
        />
      ))}
    </div>
  );

  renderUsers = () => (
    <div>
      <Users users={this.props.users} />
    </div>
  );

  renderUser = id => (
    <div>
      <User user={this.props.users.find(u => u.id === id)} />
    </div>
  );

  renderMain = () => (
    <div>
      <Router>
        <div>
          <h2>blog app</h2>
          <Notification />
          {this.props.user.name} logged in{' '}
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
          <Route exact path="/" render={() => this.renderBlogs()} />
          <Route exact path="/users" render={() => this.renderUsers()} />
          <Route
            exact
            path="/users/:id"
            render={({ match }) => this.renderUser(match.params.id)}
          />
        </div>
      </Router>
    </div>
  );

  render() {
    return !this.props.user.name ? this.renderLogin() : this.renderMain();
  }
}

const mapStateToProps = state => {
  return {
    blogs: state.blogs.blogs.sort((a, b) => b.likes - a.likes),
    user: state.user.user,
    users: state.users.users,
  };
};

export default connect(mapStateToProps, {
  showNotification,
  initializeBlogs,
  addBlog,
  removeBlog,
  updateBlog,
  setToken,
  setUserInformation,
  clearUserInformation,
  initializeUsers,
})(App);
