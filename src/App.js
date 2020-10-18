import React from 'react';
import './App.css';
import Layout from './Components/Layout';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LoginForm from './Components/login';
import Signup from './Components/login/signup';
import Seminar from './pages/seminar';
function App() {
  return (
    <Router>
      <Switch>
        <Route path='/' exact component={Seminar} />
        <Route path='/login' exact component={LoginForm} />
        <Route path='/sign-up' exact component={Signup} />
      </Switch>
    </Router>
  );
}

export default App;
