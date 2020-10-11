import React from 'react';
import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom';
import './sidebar.style.css';
import { LogoutOutlined } from '@ant-design/icons';
import { Divider } from 'antd';
function Sidebar() {
  return (
    <div className='header'>
      <div className='userInfo'>
        <div className='userInfo__avt'>
          <img
            src='https://lovicouple.com/wp-content/uploads/2019/12/avt-doi-cute.jpg'
            alt='avatar'
          />
        </div>
        <div className='userInfo__name'>Lee Bảo</div>
      </div>
      <Divider style={{ marginTop: 0 }} />
      <div className='sidebar'>
        <ul className='sidebar__container'>
          <li className='sidebar__item'>
            <NavLink to='/'>My seminar</NavLink>
          </li>
          <li className='sidebar__item'>
            <NavLink to='/'>User</NavLink>
          </li>
        </ul>
      </div>
      <div className='logout'>
        <LogoutOutlined />
        <span>Logout</span>
      </div>
    </div>
  );
}

export default Sidebar;
