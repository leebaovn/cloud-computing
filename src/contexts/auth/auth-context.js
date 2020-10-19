import React, { createContext, useReducer } from 'react';

const authContext = createContext();

export default authContext;

const INITIAL_STATE = {
  token: '',
  isAuth: false,
  name: '',
  role: '',
};

function reducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      if (action.payload.token) {
        window.localStorage.setItem('token', action.payload.token);
      }
      return {
        ...state,
        token: action.payload.token,
        name: action.payload.name,
        isAuth: true,
        role: action.payload.role,
      };

    case 'LOGOUT':
      return {
        ...INITIAL_STATE,
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
