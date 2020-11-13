import { Input, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import Spinner from '../../Components/spinner';
import Layout from './../../Components/Layout';
import Toolbar from './../../Components/Toolbar';
import './../seminar/seminar.style.css';
import { Popconfirm, Button, Form } from 'antd';
import axios from './../../apis';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import openNotification, {
  typeNotification,
} from './../../Components/notification';
function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoadding] = useState(false);
  const handleDeleteCategory = (id) => {
    try {
      axios.delete(`/category/${id}`);
      fetchCategories();
      openNotification(typeNotification.success, 'deleted');
    } catch (err) {
      openNotification(typeNotification.error, 'Error occurs');
    }
  };
  const columnCategory = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'order',
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'id',
    },
    {
      title: 'Desciption',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Action',
      key: 'action',
      render: (item) => {
        return (
          <>
            <Button
              type='primary'
              style={{ marginRight: '1rem' }}
              icon={<EditOutlined />}
            >
              Chỉnh sửa
            </Button>
            <Popconfirm
              title='Bạn có muốn xóa danh mục này?'
              okText='Yes'
              cancelText='No'
              onConfirm={() => handleDeleteCategory(item.id)}
            >
              <Button type='primary' danger icon={<DeleteOutlined />}>
                Xóa
              </Button>
            </Popconfirm>
          </>
        );
      },
    },
  ];

  const fetchCategories = async () => {
    setLoadding(true);
    const cateList = await axios.get('/categories');
    setCategories(
      cateList.data.map((item, index) => {
        return {
          ...item,
          index: index + 1,
        };
      })
    );
    setLoadding(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = (data) => {
    try {
      const { title, description } = data;
      axios.post('/createcategory', {
        title,
        description,
      });
      openNotification(typeNotification.success, 'created');
      fetchCategories();
    } catch (err) {
      openNotification(typeNotification.success, 'error occurs');

      console.log(err);
    }
  };
  return (
    <Layout>
      <Toolbar title='Category'></Toolbar>
      <div className='contentWrapper'>
        <Form onFinish={handleSubmit}>
          <Form.Item
            name='title'
            label='title'
            rules={[{ type: 'required', message: 'Nhập tên danh mục' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name='description'
            label='description'
            rules={[{ type: 'required', message: 'Nhập mô tả' }]}
          >
            <Input />
          </Form.Item>
          <Button htmlType='submit'>Submit</Button>
        </Form>
        <Table
          columns={columnCategory}
          dataSource={categories}
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

export default CategoryPage;
