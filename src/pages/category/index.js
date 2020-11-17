import { Input, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import Spinner from '../../Components/spinner';
import Layout from './../../Components/Layout';
import Toolbar from './../../Components/Toolbar';
import './../seminar/seminar.style.css';
import { Popconfirm, Button, Form, Modal } from 'antd';
import axios from './../../apis';
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import openNotification, {
  typeNotification,
} from './../../Components/notification';

function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [form] = Form.useForm();
  const [loading, setLoadding] = useState(false);
  const [visible, setVisible] = useState(false);
  const [categoryChosen, setCategoryChosen] = useState(null);
  const handleDeleteCategory = async (id) => {
    setLoadding(true);

    try {
      await axios.delete(`/category/${id}`);
      fetchCategories();
      openNotification(typeNotification.success, 'deleted');
      setLoadding(false);
    } catch (err) {
      openNotification(typeNotification.error, 'Error occurs');
      setLoadding(false);
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
      render: (item, record) => {
        return (
          <>
            <Button
              type='primary'
              style={{ marginRight: '1rem' }}
              icon={<EditOutlined />}
              onClick={() => {
                setCategoryChosen(record);
                setVisible(true);
              }}
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

  useEffect(() => {
    if (categoryChosen) {
      form.setFieldsValue({
        title: categoryChosen.title,
        description: categoryChosen.description,
      });
    }
  }, [visible]);

  const handleSubmit = async (data) => {
    setLoadding(true);
    try {
      const { title, description } = data;
      if (!categoryChosen) {
        await axios.post('/createcategory', {
          title,
          description,
        });
        openNotification(typeNotification.success, 'created');
        fetchCategories();
        setLoadding(false);
        setVisible(false);
        form.resetFields();
      } else {
        await axios.patch(`/category/${categoryChosen.id}`, {
          title,
          description,
        });
        openNotification(typeNotification.success, 'updated');
        fetchCategories();
        setLoadding(false);
        setVisible(false);
        form.resetFields();
        setCategoryChosen(null);
      }
    } catch (err) {
      openNotification(typeNotification.success, 'error occurs');
      setLoadding(false);
    }
  };
  return (
    <Layout>
      <Toolbar title='Category'></Toolbar>
      <div className='contentWrapper'>
        <Modal
          title='Tạo danh mục'
          visible={visible}
          onCancel={() => setVisible(false)}
          footer={null}
        >
          <Form onFinish={handleSubmit} form={form}>
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
            <div
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-end',
              }}
            >
              <Button key='close' onClick={() => setVisible(false)}>
                Hủy
              </Button>
              <Button
                htmlType='submit'
                type='primary'
                style={{ marginLeft: '1rem' }}
                loading={loading}
              >
                {categoryChosen ? 'Sửa' : 'Tạo'}
              </Button>
            </div>
          </Form>
        </Modal>
        <Button
          onClick={() => setVisible(true)}
          icon={<PlusCircleOutlined />}
          type='primary'
          style={{
            marginBottom: '1rem',
            marginTop: '1rem',
          }}
        >
          Tạo danh mục
        </Button>
        <Table
          columns={columnCategory}
          dataSource={categories}
          pagination={false}
          rowKey='id'
          loading={loading}
        />
      </div>
    </Layout>
  );
}

export default CategoryPage;
