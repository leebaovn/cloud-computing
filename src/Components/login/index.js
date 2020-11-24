import React, { useRef, useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';
import './login.style.css';
import axios from './../../apis';
import authContext, { AuthAction } from './../../contexts/auth/auth-context';
import jwt from 'jsonwebtoken';
import Spinner from '../spinner';
import openNotification, { typeNotification } from './../notification';
function LoginForm({ history }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const emailRef = useRef('');
  const pwdRef = useRef('');
  const [_, authDispatch] = useContext(authContext);
  const handleSubmit = async (e) => {
    e.preventDefault();
    //handle login here
    setIsLoading(true);
    const data = await axios.post('login', {
      email: emailRef.current.value,
      password: pwdRef.current.value,
    });
    if (data && !data.message) {
      const { token } = data;
      const tokenDecode = jwt.decode(token);
      authDispatch({
        type: AuthAction.LOGIN,
        payload: {
          token,
          name: tokenDecode.name,
          role: tokenDecode.role,
        },
      });
      setError(null);
      history.push('/');
      openNotification(
        typeNotification.success,
        'Bạn đã đăng nhập thành công!'
      );
    } else {
      // openNotification(typeNotification.warning, data.message);
      setError(data.message);
    }
    setIsLoading(false);
  };

  return (
    <>
      <div className='back-drop'></div>
      <div className='login-form'>
        <form onSubmit={handleSubmit}>
          <h1>ĐĂNG NHẬP</h1>
          {error && <div className='errorMessage'>{error}</div>}
          <input type='email' placeholder='Email' ref={emailRef} />
          <input type='password' placeholder='Mật khẩu' ref={pwdRef} />
          {isLoading ? <Spinner /> : <input type='submit' value='Đăng nhập' />}
        </form>
        <p>
          Bạn chưa có tài khoản? <NavLink to='/sign-up'>Đăng ký ngay!</NavLink>
        </p>
      </div>
    </>
  );
}

export default LoginForm;
