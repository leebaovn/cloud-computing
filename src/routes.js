import React, { useContext } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import LoginForm from './Components/login';
import Signup from './Components/login/signup';
import Seminar from './pages/seminar';
import Users from './pages/users';
import authContext from './contexts/auth/auth-context';

function PrivateRoute({ component: Component, ...rest }) {
  const [authState, _] = useContext(authContext);
  const { token, role } = authState;
  return (
    <Route
      {...rest}
      render={(props) =>
        token ? <Component {...props} /> : <Redirect to='/login' />
      }
    />
  );
}

function Routes(props) {
  const [authState, _] = useContext(authContext);
  const { token, role } = authState;
  return (
    <Switch>
      {!token && <Route path='/login' exact component={LoginForm} />}
      {!token && <Route path='/sign-up' exact component={Signup} />}
      <PrivateRoute path='/user-management' component={Users} />
      {/* <Route path='/user-management'>
        {token ? <Users /> : <Redirect to='/login' />}
      </Route> */}
      <PrivateRoute path='/seminar-management' component={Seminar} />

      {/* <Route path='/seminar-management'>
        {token ? <Seminar /> : <Redirect to='/login' />}
      </Route> */}

      {/* <Route path='/login' exact>
        {token ? <Redirect to='/' /> : <LoginForm />}
      </Route> */}
      {/* <Route path='/sign-up' exact>
        {token ? <Redirect to='/' /> : <Signup />}
      </Route>
      {!token && <Redirect to='/login' />} */}
      {/* <Route path='/' exact component={Seminar} /> */}
      <PrivateRoute path='/' component={Seminar} />
    </Switch>
  );
}

export default Routes;
