import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import './sidebar.style.css';
import { LogoutOutlined } from '@ant-design/icons';
import { Divider } from 'antd';
import authContext, { AuthAction } from './../../contexts/auth/auth-context';
export const SidebarMenu = [
  {
    name: 'My seminar',
    path: 'my-seminar',
    exact: true,
    roleAccess: ['speaker'],
  },
  {
    name: 'All seminar',
    path: 'seminar',
    exact: true,
    roleAccess: ['audience'],
  },
  {
    name: 'User Management',
    path: 'user-management',
    exact: true,
    roleAccess: ['admin'],
  },
  {
    name: 'Seminar Management',
    path: 'seminar-management',
    exact: true,
    roleAccess: ['admin'],
  },
];

function Sidebar(props) {
  const [authState, authDispatch] = useContext(authContext);
  const { role, name } = authState;
  const logout = () => {
    authDispatch({ type: AuthAction.LOGOUT });
  };
  return (
    <div className='header'>
      <div className='userInfo'>
        <div className='userInfo__avt'>
          <img
            src='https://lovicouple.com/wp-content/uploads/2019/12/avt-doi-cute.jpg'
            alt='avatar'
          />
        </div>
        <div className='userInfo__name'>{name}</div>
      </div>
      <Divider style={{ marginTop: 0 }} />
      <div className='sidebar'>
        <ul className='sidebar__container'>
          {SidebarMenu.filter((item) => item.roleAccess.indexOf(role) >= 0).map(
            (item, index) => (
              <li key={index} className='sidebar__item'>
                <NavLink to={item.path}>{item.name}</NavLink>
              </li>
            )
          )}
        </ul>
      </div>
      <div className='logout'>
        <LogoutOutlined />
        <span onClick={logout}>Logout</span>
      </div>
    </div>
  );
}

export default Sidebar;
