import React, { useEffect, useState } from 'react';
import Toolbar from './../../Components/Toolbar';
import Layout from './../../Components/Layout';
import axios from './../../apis';
import { Table, Tag } from 'antd';

const columnUser = [
  {
    title: 'Họ và tên',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Vai trò',
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
    title: 'Số seminar tham gia',
    dataIndex: '',
    key: 'join',
    render: (_, record) => {
      return <p>{record?.seminars?.length || 0}</p>;
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
  return (
    <Layout>
      <Toolbar title='Users'></Toolbar>
      <div className='contentWrapper'>
        <Table
          columns={columnUser}
          dataSource={users}
          pagination={{
            pageSize: 10,
            hideOnSinglePage: true,
          }}
          loading={loading}
        />
      </div>
    </Layout>
  );
}

export default SeminarPage;
