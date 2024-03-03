import React, { useState } from 'react';
import { openDB } from 'idb';

const TaskForm = () => {
  const [task, setTask] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Queue task for synchronization
    await queueTask(task);

    // Clear task input
    setTask('');
  };

  async function queueTask(task) {
    try {
      // Open a connection to IndexedDB
      const db = await openDB('taskQueue', 1, {
        upgrade(db) {
          // Create an object store for queued tasks
          db.createObjectStore('tasks', { keyPath: 'id', autoIncrement: true });
        },
      });
  
      // Add the task to the object store
      await db.add('tasks', { task });
      console.log('task added');
    } catch (error) {
      console.error('Error queuing task:', error);
    }
  }  

  const triggerBackgroundSync = () => {
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      navigator.serviceWorker.ready.then(registration => {
        // Manually trigger background sync
        registration.sync.register('syncData')
          .then(() => console.log('Manual background sync triggered'))
          .catch(error => console.error('Manual background sync failed:', error));
      });
    }    
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={task}
          onChange={(event) => setTask(event.target.value)}
          placeholder="Enter task"
        />
        <button type="submit">Add Task</button>
      </form>
      <button onClick={triggerBackgroundSync}>Sync data</button>
    </div>
  );
};

export default TaskForm;
