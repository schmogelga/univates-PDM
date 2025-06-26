import React, { useEffect } from 'react';
import AppNavigator from './navigation';
import { initDB } from './storage/LeaderboardStorage';

const App = () => {
  useEffect(() => {
    initDB();
  }, []);

  return <AppNavigator />;
};

export default App;