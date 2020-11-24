import React, { useEffect, useState, useContext } from 'react';
import Toolbar from './../../Components/Toolbar';
import Layout from './../../Components/Layout';
import { Button, Card, Modal, Select } from 'antd';
import axiosClient from '../../apis';
import DrawerForm from './../../Components/addSeminar';
import authContext from './../../contexts/auth/auth-context';
import './seminar.style.css';
import openNotification, {
  typeNotification,
} from './../../Components/notification';
const { Meta } = Card;
const { Option } = Select;

function translateStatus(status) {
  switch (status) {
    case 'accepted':
      return 'Chấp thuận';
    case 'pending':
      return 'Chờ đợi';
    case 'denied':
      return 'Đã hủy';
    default:
      return '';
  }
}

function SeminarPage() {
  const [seminars, setSeminars] = useState([]);
  const [categories, setCategories] = useState([]);

  const [authState, authDispatch] = useContext(authContext);
  const { role, userId } = authState;
  const [visible, setVisible] = useState(false);
  const [loading, setLoadding] = useState(false);
  const [currentSeminar, setCurrentSeminar] = useState(null);

  const fetchCategories = async () => {
    setLoadding(true);
    const cateList = await axiosClient.get('/categories');
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
  const fetchSeminar = async () => {
    const seminars = await axiosClient.get('/seminar');
    if (!seminars.empty) {
      setSeminars(seminars.data);
    }
  };
  useEffect(() => {
    fetchSeminar();
    fetchCategories();
  }, []);
  const handleDecision = async (status) => {
    setLoadding(true);
    try {
      await axiosClient.post('/seminarpermission', {
        status,
        seminarId: currentSeminar.id,
        authorId: currentSeminar.createdBy,
      });
      openNotification(typeNotification.success, 'Đã thực hiện thành công!');
      fetchSeminar();
      setVisible(false);
      setCurrentSeminar(null);
    } catch (err) {
      openNotification(typeNotification.error, 'Đã có lỗi xảy ra!');
    }
    setLoadding(false);
  };

  const handleChangeCategory = (cateId) => {};
  const handleJoinSeminar = async (seminar) => {
    console.log(seminar, 'zzz');
    setLoadding(true);
    const { members, id } = seminar;
    if (members?.includes(userId)) {
      //Unjoin
      await axiosClient.put(`/seminar/cancel/${id}`);
    } else {
      //Join
      await axiosClient.put(`/seminar/join/${id}`);
    }
    fetchSeminar();
    setLoadding(false);
  };
  return (
    <Layout>
      <Modal
        title='Permission'
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={[
          <Button key='close' onClick={() => setVisible(false)}>
            Cancel
          </Button>,
          <Button
            htmlType='submit'
            type='default'
            style={{ marginLeft: '1rem' }}
            loading={loading}
            danger
            onClick={() => handleDecision('denied')}
          >
            Deny
          </Button>,
          <Button
            htmlType='submit'
            type='primary'
            style={{ marginLeft: '1rem' }}
            loading={loading}
            onClick={() => handleDecision('accepted')}
          >
            Accept
          </Button>,
        ]}
      >
        <h3>Bạn muốn chấp nhận hay hủy buổi seminar này?</h3>
      </Modal>
      <Toolbar title='Seminar'>
        <Select
          style={{ width: 200 }}
          placeholder='Chọn danh mục'
          onChange={handleChangeCategory}
        >
          {categories?.map((cate) => (
            <Option key={cate.id}>{cate.title}</Option>
          ))}
        </Select>
        {role !== 'audience' && <DrawerForm fetchSeminar={fetchSeminar} />}
      </Toolbar>
      <div className='contentWrapper'>
        <div className='card-list'>
          {seminars &&
            seminars?.map((seminar) => (
              <Card
                key={seminar.id}
                hoverable
                style={{ width: 240, marginRight: '2rem', marginTop: '2rem' }}
                cover={
                  <img
                    alt='thumbnail'
                    src={seminar.image}
                    width='240'
                    height='200'
                  />
                }
              >
                <Meta title={seminar.title} description={seminar.description} />
                <div className='seminar__info'>
                  <div>{`30/${seminar.quantity}`}</div>
                  {role !== 'audience' && (
                    <Button
                      style={{
                        textTransform: 'uppercase',
                      }}
                      type={
                        seminar.status === 'accepted' ? 'primary' : 'default'
                      }
                      danger={seminar.status === 'denied'}
                      onClick={() => {
                        if (seminar.status === 'pending') {
                          setVisible(true);
                          setCurrentSeminar(seminar);
                        }
                      }}
                    >
                      {translateStatus(seminar.status)}
                    </Button>
                  )}
                  {role === 'audience' && (
                    <Button
                      loading={loading}
                      onClick={() => handleJoinSeminar(seminar)}
                    >
                      {seminar?.members?.includes(userId) ? 'Hủy' : 'Tham gia'}
                    </Button>
                  )}
                </div>
              </Card>
            ))}
        </div>
      </div>
    </Layout>
  );
}

export default SeminarPage;
