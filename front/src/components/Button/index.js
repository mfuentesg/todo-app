import React from 'react';

import './Button.css';

const Button = (props) => {
  const classNames = {
    Button: true,
    'Button-small': props.small
  };

  const className = Object.keys(classNames).filter((c) => classNames[c]).join(' ');
  return <button {...props} className={className} />
};

export default Button;
