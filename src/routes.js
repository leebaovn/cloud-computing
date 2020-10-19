import React from 'react';
import { Route, Switch } from 'react-router-dom';
import LoginForm from './Components/login';
import Signup from './Components/login/signup';
import Seminar from './pages/seminar';
function routes() {
  return (
    <Switch>
      <Route path='/' exact component={Seminar} />
      <Route path='/login' exact component={LoginForm} />
      <Route path='/sign-up' exact component={Signup} />
    </Switch>
  );
}

export default routes;
