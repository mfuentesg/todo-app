import React, { useEffect, useState } from 'react';
import fetch from 'isomorphic-unfetch';

import Task from '../Task';
import Form from '../Form';

import './Tasks.css';

async function doRequest(...args) {
  return fetch(...args);
}

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [deleted, setDeleted] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const options = {
          headers: { 'content-type': 'application/json' }
        };
        const response = await doRequest('http://localhost:3000/tasks', options);
        if (!response.ok) {
          alert('error: could not get tasks');
          return;
        }
        const { tasks } = await response.json();
        setTasks(tasks);
      } catch(err) {
        alert(`unexpected error: ${err.message()}`);
      }
    }
    fetchData();
  }, []);

  async function onDelete(task) {
    try {
      const options = {
        headers: { 'content-type': 'application/json' },
        method: 'DELETE'
      };
      const response = await doRequest(`http://localhost:3000/tasks/${task.id}`, options);
      if (!response.ok) {
        alert(`error: could not delete task "${task.id}". Please, try again.`);
        return;
      }
      setDeleted(deleted.concat(task.id));
      setTasks(tasks.filter(t => task.id !== t.id));
      alert(`task "${task.id}" has been deleted`);
    } catch(err) {
      alert(`unexpected error: ${err.message()}`);
    }
  }

  async function onEdit(task, fields) {
    try {
      const options = {
        headers: { 'content-type': 'application/json' },
        method: 'PUT',
        body: JSON.stringify(fields)
      };
      const response = await doRequest(`http://localhost:3000/tasks/${task.id}`, options);
      if (!response.ok) {
        alert(`error: could not update task "${task.id}". Please, try again.`);
        return;
      }
      setTasks(tasks.map(t => {
        if (task.id === t.id) {
          return {
            ...t,
            ...fields
          }
        }
        return t;
      }));
      alert(`task "${task.id}" has been updated`);
    } catch(err) {
      alert(`unexpected error: ${err.message()}`);
    }
  }

  async function onCreate(fields) {
    try {
      const options = {
        headers: { 'content-type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(fields)
      };
      const response = await doRequest(`http://localhost:3000/tasks`, options);
      if (!response.ok) {
        alert(`error: could not create task. Please, try again.`);
        return;
      }
      const task = await response.json();
      setTasks(tasks.concat(task));
      alert(`task "${task.id}" has been created`);
    } catch(err) {
      alert(`unexpected error: ${err.message()}`);
    }
  }

  function renderTasks() {
    const toShow = tasks.filter(task => !deleted.includes(task.id));
    if (!toShow.length) {
      return '¯\\_(ツ)_/¯ ... no tasks to show';
    }

    return (
      toShow.map((task) => (
        <Task
          key={task.id}
          task={task}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))
    );
  }

  return (
    <div className="Tasks">
      <Form onSubmit={onCreate}/>

      <h2>Task list</h2>
      {renderTasks()}
    </div>
  );
};

export default Tasks;
