import React, { useEffect, useState } from 'react';
import Toolbar from './../../Components/Toolbar';
import Layout from './../../Components/Layout';
import axios from './../../apis';
import { Table, Tag } from 'antd';

const columnUser = [
  {
    title: 'Full Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Role',
    dataIndex: 'role',
    key: 'role',
    render: (role) => {
      let color = role === 'admin' ? 'red' : 'geekblue';
      return (
        <Tag color={color} key={role}>
          {role.toUpperCase()}
        </Tag>
      );
    },
  },
  {
    title: 'Action',
    dataIndex: '',
    key: 'action',
  },
];

function SeminarPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      const users = await axios.get('/users');
      if (!users.message) {
        setUsers(users.data);
      }
    };
    fetchUser();
  }, []);
  return (
    <Layout>
      <Toolbar title='Users'></Toolbar>
      <div className='contentWrapper'>
        <Table columns={columnUser} dataSource={users} pagination={false} />
      </div>
    </Layout>
  );
}

export default SeminarPage;
