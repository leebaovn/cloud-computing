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
        <Users />
      </Route>

      <Route path='/seminar-management'>
        <Seminar />
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
