import React, { useContext } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import LoginForm from './Components/login';
import Signup from './Components/login/signup';
import Seminar from './pages/seminar';
import Users from './pages/users';
import authContext from './contexts/auth/auth-context';
import Category from './pages/category';
function PrivateRoute({ component: Component, ...rest }) {
  const [authState, _] = useContext(authContext);
  const { token } = authState;
  return (
    <Route
      {...rest}
      render={(props) =>
        token ? <Component {...props} /> : <Redirect to='/login' />
      }
    />
  );
}

function Routes() {
  return (
    <Switch>
      <Route path='/login' exact component={LoginForm} />
      <Route path='/sign-up' exact component={Signup} />
      <PrivateRoute path='/user-management' component={Users} />

      <PrivateRoute path='/seminar-management' component={Seminar} />
      <PrivateRoute path='/categories' component={Category} />
      <PrivateRoute path='/seminar-joining' component={Seminar} />

      <PrivateRoute path='/' component={Seminar} />
    </Switch>
  );
}

export default Routes;
