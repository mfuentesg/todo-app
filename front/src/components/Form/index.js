import React, { useState } from 'react';

import Button from '../Button';

import './Form.css';

const Form = (props) => {
  const classNames = {
    Form: true,
    'Form-small': props.small
  };
  const className = Object.keys(classNames).filter((c) => classNames[c]).join(' ');
  const [title, setTitle] = useState(props.title || '');
  const [description, setDescription] = useState(props.description || '');

  function onSubmit(evt) {
    evt.preventDefault();
    props.onSubmit({ title, description });
    setTitle('');
    setDescription('');
  }

  return (
    <form className={className} onSubmit={onSubmit}>
      <label className="Form-label">Title</label>
      <input
        type="text"
        id="title"
        value={title}
        required
        className="Form-field"
        placeholder="My task"
        onChange={(evt) => setTitle(evt.target.value)}
      />
      <label className="Form-label">Description</label>
      <textarea
        required
        id="description"
        className="Form-field"
        placeholder="My task description"
        value={description}
        onChange={(evt) => setDescription(evt.target.value)}
      />
      <Button type="submit">Submit</Button>
    </form>
  );
};

export default Form;
