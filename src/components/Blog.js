import React from 'react';
import { Link } from 'react-router-dom';

const blogStyle = {
  paddingTop: 10,
  paddingLeft: 2,
  border: 'solid',
  borderWidth: 1,
  marginBottom: 5,
};

const Blog = props => (
  <div style={blogStyle}>
    <div className="name">
      <Link to={`/blogs/${props.blog ? props.blog.id : 'undefined'}`}>
        {props.blog ? props.blog.title : 'undefined'}{' '}
        {props.blog ? props.blog.author : 'undefined'}
      </Link>
    </div>
  </div>
);

export default Blog;
