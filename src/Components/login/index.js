import React, { useRef } from 'react';
import { NavLink } from 'react-router-dom';
import './login.style.css';

function LoginForm() {
  const emailRef = useRef('');
  const pwdRef = useRef('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(emailRef.current.value, pwdRef.current.value, 'zzzz');
    //handle login here
  };
  return (
    <>
      <div className='back-drop'></div>
      <div className='login-form'>
        <form onSubmit={handleSubmit}>
          <h1>LOGIN</h1>
          <input type='email' placeholder='Email' ref={emailRef} />
          <input type='password' placeholder='Password' ref={pwdRef} />
          <input type='submit' value='Login' />
        </form>
        <p>
          Dont have an account? <NavLink to='/sign-up'>Sign up now</NavLink>
        </p>
      </div>
    </>
  );
}

export default LoginForm;
