import React, { useState } from 'react';

import './Task.css';
import Button from '../Button';
import Form from '../Form';

const Task = ({ task, onEdit, onDelete }) => {
  const [isEditing, setEditing] = useState(false);

  function onSubmit(fields) {
    onEdit(task, fields);
    setEditing(false);
  }

  function renderForm() {
    return <>
      <Form
        small
        title={task.title}
        description={task.description}
        onSubmit={onSubmit}
      />
      <Button small onClick={() => setEditing(false)}>Cancel</Button>
    </>;
  }

  function renderDetails() {
    return (
      <>
        <h4 className="Task-title">{task.title}</h4>
        <p className="Task-description">{task.description}</p>

        <div className="Task-action">
          <Button small onClick={() => setEditing(true)}>Edit</Button>
        </div>
        <div className="Task-action">
          <Button small onClick={() => onDelete(task)}>Delete</Button>
        </div>
      </>
    )
  }

  function renderData() {
    if (isEditing) {
      return renderForm();
    }
    return renderDetails();
  }

  return (
    <div className="Task">
      {renderData()}
    </div>
  );
};

export default Task;
