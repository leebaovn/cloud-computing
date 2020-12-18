import { PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Col,
  DatePicker,
  Drawer,
  Form,
  Input,
  Row,
  Select,
  TimePicker,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { storage } from './../../firebase/firebase';
import axios from './../../apis';
import openNotification, { typeNotification } from './../notification';

const format = 'HH:mm';

const { Option } = Select;

const DrawerForm = ({ fetchSeminar }) => {
  const [visible, setVisible] = useState(false);
  const [fileSelect, setFileSelect] = useState();
  const [loading, setLoading] = useState(false);
  const [imgUrl, setImgUrl] = useState('');
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const cateList = await axios.get('/categories');
      setCategories(cateList.data);
    };
    fetchCategories();
  }, []);

  const handleUpload = (e) => {
    setLoading(true);
    if (e.target.files) {
      const userId = window.localStorage.getItem('userId');
      const fileChoosen = e.target.files[0];
      setFileSelect(fileChoosen);
      const uploadTask = storage
        .ref(`/images/${userId}/${fileChoosen.name}`)
        .put(fileChoosen);
      uploadTask.on(
        'state_changed',
        (snapshot) => {},
        (err) => {},
        () => {
          storage
            .ref(`images/${userId}`)
            .child(fileChoosen.name)
            .getDownloadURL()
            .then((url) => {
              setImgUrl(url);
            });
        }
      );
    }
    setLoading(false);
  };

  const onCreateSeminar = async (e) => {
    setLoading(true);
    try {
      await axios.post('/createseminar', {
        title: e.title,
        imageUrl: imgUrl,
        description: e.description,
        quantity: e.quantity,
        authorName: e.name,
        location: e.location,
        date: new Date(e.date._d).toLocaleDateString(),
        time: new Date(e.time._d).toLocaleTimeString(),
        category_id: e.category,
      });
      onClose();
      fetchSeminar();
      form.resetFields();
      setFileSelect(null);
      setImgUrl('');
      openNotification(
        typeNotification.success,
        'Seminar đã được tạo thành công!'
      );
    } catch (err) {
      openNotification(typeNotification.error, 'Đã có lỗi xảy ra!');
    }
    setLoading(false);
  };
  return (
    <>
      <Button type='primary' style={{ lineHeight: 0.6 }} onClick={showDrawer}>
        <PlusOutlined />
        Tạo seminar
      </Button>
      <Drawer
        title='Tạo seminar'
        width={720}
        onClose={onClose}
        visible={visible}
        bodyStyle={{ paddingBottom: 50 }}
      >
        <Form layout='vertical' onFinish={onCreateSeminar} form={form}>
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item label='Hình ảnh'>
                <input type='file' onChange={handleUpload} />
                {loading && !imgUrl ? (
                  'Loading...'
                ) : imgUrl ? (
                  <img
                    src={imgUrl}
                    alt='thumbnail'
                    width='600'
                    height='250'
                    style={{ marginTop: 10, objectFit: 'contain' }}
                  />
                ) : null}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name='name'
                label='Tên diễn giả'
                rules={[{ required: true, message: 'Nhập tên diễn giả' }]}
              >
                <Input placeholder='Nhập tên diễn giả' id='name' />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name='title'
                label='Tên seminar'
                rules={[{ required: true, message: 'Nhập tên seminar' }]}
              >
                <Input placeholder='Nhập tên seminar' id='title' />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name='location'
                label='Địa điểm'
                rules={[{ required: true, message: 'Nhập địa điểm' }]}
              >
                <Input placeholder='Nhập địa điểm' />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name='quantity'
                label='Số lượng:'
                rules={[{ required: true, message: 'Nhập số lượng' }]}
              >
                <Input placeholder='Nhập số lượng' />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name='date'
                label='Ngày seminar'
                rules={[{ required: true, message: 'Nhập ngày seminar' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name='time'
                label='Giờ bắt đầu'
                rules={[{ required: true, message: 'Nhập giờ bắt đầu' }]}
              >
                <TimePicker
                  style={{ width: '100%' }}
                  // defaultValue={moment('12:08', format)}
                  format={format}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name='category' label='Danh mục'>
                <Select>
                  {categories?.map((cate) => (
                    <Option key={cate.id} value={cate.id}>
                      {cate.title}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name='description'
                label='Mô tả'
                rules={[
                  {
                    required: true,
                    message: 'Nhập mô tả',
                  },
                ]}
              >
                <Input.TextArea rows={4} placeholder='Nhập mô tả' />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item>
                <Button
                  type='default'
                  onClick={onClose}
                  style={{ marginRight: 8 }}
                >
                  Hủy bỏ
                </Button>
                <Button type='primary' htmlType='submit' loading={loading}>
                  Tạo
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </>
  );
};

export default DrawerForm;
