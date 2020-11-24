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
  userId: window.localStorage.getItem('userId') || '',
};

function reducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      if (action.payload.token) {
        window.localStorage.setItem('token', action.payload.token);
        window.localStorage.setItem('role', action.payload.role);
        window.localStorage.setItem('name', action.payload.name);
        window.localStorage.setItem('userId', action.payload.userId);
      }
      return {
        ...state,
        token: action.payload.token,
        name: action.payload.name,
        role: action.payload.role,
        userId: action.payload.userId,
      };

    case 'LOGOUT':
      window.localStorage.removeItem('token');
      window.localStorage.removeItem('role');
      window.localStorage.removeItem('name');
      window.localStorage.removeItem('userId');
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
