import React from 'react';

const User = props => (
  <div>
    <h2>{props.user ? props.user.name : 'undefined'}</h2>
    <h3>Added blogs</h3>
    <ul>
      {props.user &&
        props.user.blogs.map(b => (
          <li key={b.id}>
            <p>{`${b.title} by ${b.author}`}</p>
          </li>
        ))}
    </ul>
  </div>
);

export default User;
