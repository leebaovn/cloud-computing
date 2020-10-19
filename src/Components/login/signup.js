import React, { useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import './login.style.css';

function Signup() {
  const emailRef = useRef('');
  const pwdRef = useRef('');
  const nameRef = useRef('');
  const studentIdRef = useRef('');
  const [role, setRole] = useState('audience');
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
          <h1>Sign up</h1>
          <input type='email' placeholder='Email' ref={emailRef} />
          <input type='password' placeholder='Password' ref={pwdRef} />
          <input type='text' placeholder='Full name' ref={nameRef} />
          <input type='text' placeholder='Student ID' ref={studentIdRef} />
          <label htmlFor=''>Bạn muốn là </label>
          <input
            type='radio'
            name='role'
            value='speaker'
            id='speaker'
            checked
            onChange={(e) => setRole(e.target.value)}
          />
          <label htmlFor='speaker'>Speaker</label>
          <input
            type='radio'
            name='role'
            value='audience'
            onChange={(e) => setRole(e.target.value)}
            id='audience'
          />
          <label htmlFor='audience'>Audience</label>
          <input type='submit' value='Login' />
        </form>
        <p>
          Already have an account? <NavLink to='/login'>Log in now</NavLink>
        </p>
      </div>
    </>
  );
}

export default Signup;
