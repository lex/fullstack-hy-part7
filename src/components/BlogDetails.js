import React from 'react';

const BlogDetails = props => (
  <div>
    <h2>{props.blog ? props.blog.title : 'undefined'}</h2>
    <div>
      <a href={props.blog ? props.blog.url : ''}>
        {props.blog ? props.blog.url : ''}
      </a>
    </div>
    <div>
      {props.blog ? props.blog.likes : NaN} likes{' '}
      <button onClick={props.like}>like</button>
    </div>
    <div>added by {props.blog ? props.blog.user.name : 'undefined'}</div>
    {props.deletable && (
      <div>
        <button onClick={props.remove}>delete</button>
      </div>
    )}
  </div>
);

export default BlogDetails;
