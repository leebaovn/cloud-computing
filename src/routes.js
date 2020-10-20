import React, { useContext } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import LoginForm from './Components/login';
import Signup from './Components/login/signup';
import Seminar from './pages/seminar';
import Users from './pages/users';
import authContext from './contexts/auth/auth-context';
function Routes(props) {
  const [authState, _] = useContext(authContext);
  const { token, role } = authState;

  return (
    <Switch>
      <Route path='/user-management'>
        {token ? <Users /> : <Redirect to='/login' />}
      </Route>

      <Route path='/seminar-management'>
        {token ? <Seminar /> : <Redirect to='/login' />}
      </Route>

      <Route path='/login' exact>
        {token ? <Redirect to='/' /> : <LoginForm />}
      </Route>
      <Route path='/sign-up' exact>
        {token ? <Redirect to='/' /> : <Signup />}
      </Route>
      {!token && <Redirect to='/login' />}
      <Route path='/' exact component={Seminar} />
    </Switch>
  );
}

export default Routes;
