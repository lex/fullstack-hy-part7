import React from 'react';
import { connect } from 'react-redux';

const Notification = ({ notification }) => {
  if (notification === null) {
    return null;
  }

  return <div className={notification.type}>{notification.text}</div>;
};

const mapStateToProps = state => {
  return {
    notification: state.notification,
  };
};

export default connect(mapStateToProps)(Notification);
