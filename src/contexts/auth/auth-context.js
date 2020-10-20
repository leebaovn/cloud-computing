import React, { createContext, useReducer } from 'react';

const authContext = createContext();

export default authContext;

export const AuthAction = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
};

const INITIAL_STATE = {
  token: window.localStorage.getItem('token') || '',
  name: window.localStorage.getItem('name') || '',
  role: window.localStorage.getItem('role') || '',
};

function reducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      if (action.payload.token) {
        window.localStorage.setItem('token', action.payload.token);
        window.localStorage.setItem('role', action.payload.role);
        window.localStorage.setItem('name', action.payload.name);
      }
      return {
        ...state,
        token: action.payload.token,
        name: action.payload.name,
        role: action.payload.role,
      };

    case 'LOGOUT':
      window.localStorage.removeItem('token');
      return {
        ...INITIAL_STATE,
        token: '',
      };
    default:
      return state;
  }
}

export const AuthProvider = ({ children }) => {
  const [authState, authDispatch] = useReducer(reducer, INITIAL_STATE);

  return (
    <authContext.Provider value={[authState, authDispatch]}>
      {children}
    </authContext.Provider>
  );
};
