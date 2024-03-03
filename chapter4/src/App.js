import { useEffect, useState } from 'react';
import './App.css';
import TaskForm from './TaskForm';

function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnlineStatusChange = () => {
      setIsOnline(navigator.onLine);
      if (navigator.onLine) {
        console.log('User is online');
        if ('serviceWorker' in navigator && 'SyncManager' in window) {
          navigator.serviceWorker.ready.then(registration => {
            // trigger background sync
            registration.sync.register('syncData')
              .then(() => console.log('background sync triggered'))
              .catch(error => console.error('background sync failed:', error));
          });
        }  
      } else {
        console.log('User is offline');
      }
    };

    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);

    return () => {
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
    };
  }, []);

  return (
    <div className="App">
      {isOnline ? 'Online' : 'Offline'}
      <TaskForm />
    </div>
  );
}

export default App;
