import React from 'react';
import { connect } from 'react-redux';

const Users = props => (
  <div>
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
            <td>{u.name}</td>
            <td>{u.blogs.length}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const mapStateToProps = state => {
  return {
    users: state.users.users,
  };
};

export default connect(mapStateToProps)(Users);
