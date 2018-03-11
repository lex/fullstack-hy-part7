import React from 'react';
import { Link } from 'react-router-dom';

const Users = props => (
  <div>
    <h2>users</h2>
    <table>
      <thead>
        <tr>
          <th>user</th>
          <th>blogs added</th>
        </tr>
      </thead>
      <tbody>
        {props.users.map(u => (
          <tr key={u.id}>
            <td>
              <Link to={u.id}>{u.name}</Link>
            </td>
            <td>{u.blogs.length}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default Users;
