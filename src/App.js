import React from 'react';
import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';

import { AuthProvider } from './contexts/auth/auth-context';
import Routes from './routes';
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes />
      </Router>
    </AuthProvider>
  );
}

export default App;
