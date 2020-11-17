import React, { useEffect, useState } from 'react';
import Toolbar from './../../Components/Toolbar';
import Layout from './../../Components/Layout';
import axios from './../../apis';
import { Table, Tag } from 'antd';
import Spinner from '../../Components/spinner';

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
      let color =
        role === 'admin' ? 'red' : role === 'speaker' ? 'green' : 'geekblue';
      return (
        <Tag color={color} key={role}>
          {role.toUpperCase()}
        </Tag>
      );
    },
  },
  {
    title: 'Number of seminar',
    dataIndex: '',
    key: 'join',
    render: (_, record) => {
      return <p>{record.join || 10}</p>;
    },
  },
];

function SeminarPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const users = await axios.get('/users');
      if (!users.message) {
        setUsers(users.data);
      }
      setLoading(false);
    };
    fetchUser();
  }, []);
  console.log(users);
  return (
    <Layout>
      <Toolbar title='Users'></Toolbar>
      <div className='contentWrapper'>
        <Table
          columns={columnUser}
          dataSource={users}
          pagination={false}
          loading={{
            spinning: loading,
            indicator: <Spinner />,
          }}
        />
      </div>
    </Layout>
  );
}

export default SeminarPage;
