import {
  Drawer,
  Form,
  Button,
  Col,
  Row,
  Input,
  DatePicker,
  TimePicker,
} from 'antd';
import moment from 'moment';
import { PlusOutlined } from '@ant-design/icons';
import React from 'react';
import Avatar from './upload.js';

const format = 'HH:mm';

class DrawerForm extends React.Component {
  state = { visible: false };

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };
  render() {
    return (
      <>
        <Button
          type='primary'
          style={{ lineHeight: 0.6 }}
          onClick={this.showDrawer}
        >
          <PlusOutlined />
          Tạo seminar
        </Button>
        <Drawer
          title='Tạo seminar'
          width={720}
          onClose={this.onClose}
          visible={this.state.visible}
          bodyStyle={{ paddingBottom: 50 }}
          footer={
            <div
              style={{
                textAlign: 'right',
              }}
            >
              <Button onClick={this.onClose} style={{ marginRight: 8 }}>
                Cancel
              </Button>
              <Button onClick={this.onClose} type='primary'>
                Submit
              </Button>
            </div>
          }
        >
          <Form layout='vertical' hideRequiredMark>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name='name'
                  label='Tên diễn giả'
                  rules={[{ required: true, message: 'Nhập tên diễn giả' }]}
                >
                  <Input placeholder='Nhập tên diễn giả' />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name='title'
                  label='Tên seminar'
                  rules={[{ required: true, message: 'Nhập tên seminar' }]}
                >
                  <Input placeholder='Nhập tên seminar' />
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
                    defaultValue={moment('12:08', format)}
                    format={format}
                  />
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
              <Col span={6}>
                <Form.Item
                  name='image'
                  label='Hình ảnh'
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Avatar />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Drawer>
      </>
    );
  }
}

export default DrawerForm;
