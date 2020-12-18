import React, { useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import './login.style.css';
import openNotification, { typeNotification } from './../notification';
import Spinner from './../spinner';
import axios from './../../apis';

function Signup({ history }) {
  const emailRef = useRef('');
  const pwdRef = useRef('');
  const nameRef = useRef('');
  const studentIdRef = useRef('');
  const [role, setRole] = useState('audience');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = await axios.post('/createuser', {
      email: emailRef.current.value,
      password: pwdRef.current.value,
      name: nameRef.current.value,
      studentId: studentIdRef.current.value,
      role: role,
    });
    if (data && !data.message) {
      openNotification(
        typeNotification.success,
        'Đăng ký tài khoản thành công!'
      );
      setTimeout(() => {
        history.push('/login');
      }, 500);
    } else {
      setError(data.message);
    }
    setLoading(false);
  };
  return (
    <>
      <div className='back-drop'></div>
      <div className='login-form'>
        <form onSubmit={handleSubmit}>
          <h1>Sign up</h1>
          {error && <div className='errorMessage'>{error}</div>}

          <input type='email' placeholder='Email' ref={emailRef} />
          <input type='password' placeholder='Mật khẩu' ref={pwdRef} />
          <input type='text' placeholder='Họ và tên' ref={nameRef} />
          <input type='text' placeholder='Mã số sinh viên' ref={studentIdRef} />
          <label htmlFor=''>Bạn muốn là </label>
          <input
            type='radio'
            name='role'
            value='speaker'
            id='speaker'
            onChange={(e) => setRole(e.target.value)}
          />
          <label htmlFor='speaker'>Diễn giả</label>
          <input
            type='radio'
            name='role'
            value='audience'
            checked
            onChange={(e) => setRole(e.target.value)}
            id='audience'
          />
          <label htmlFor='audience'>Khán giả</label>
          {loading ? <Spinner /> : <input type='submit' value='Đăng ký' />}
        </form>
        <p>
          Đã có tài khoản? <NavLink to='/login'>Đăng nhập ngay</NavLink>
        </p>
      </div>
    </>
  );
}

export default Signup;
