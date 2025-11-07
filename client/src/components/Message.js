import React from 'react';

const Message = ({ variant, children }) => {
  const getClassName = () => {
    switch (variant) {
      case 'success':
        return 'alert alert-success';
      case 'info':
        return 'alert alert-info';
      case 'danger':
        return 'alert alert-danger';
      default:
        return 'alert alert-info';
    }
  };

  return <div className={getClassName()}>{children}</div>;
};

Message.defaultProps = {
  variant: 'info',
};

export default Message;