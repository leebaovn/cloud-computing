import React, { useEffect, useState, useContext } from 'react';
import Toolbar from './../../Components/Toolbar';
import Layout from './../../Components/Layout';
import { Button, Card, Modal } from 'antd';
import axiosClient from '../../apis';
import DrawerForm from './../../Components/addSeminar';
import authContext from './../../contexts/auth/auth-context';
import './seminar.style.css';
import openNotification, {
  typeNotification,
} from './../../Components/notification';
const { Meta } = Card;

function SeminarPage() {
  const [seminars, setSeminars] = useState([]);
  const [authState, authDispatch] = useContext(authContext);
  const { role } = authState;
  const [visible, setVisible] = useState(false);
  const [loading, setLoadding] = useState(false);
  const [currentSeminar, setCurrentSeminar] = useState(null);
  const fetchSeminar = async () => {
    const seminars = await axiosClient.get('/seminar');
    if (!seminars.empty) {
      setSeminars(seminars.data);
    }
  };
  useEffect(() => {
    fetchSeminar();
  }, []);

  const handleDecision = async (status) => {
    setLoadding(true);
    try {
      await axiosClient.post('/seminarpermission', {
        status,
        seminarId: currentSeminar.id,
        authorId: currentSeminar.createdBy,
      });
      openNotification(typeNotification.success, 'Operation succesfully!');
      fetchSeminar();
      setVisible(false);
      setCurrentSeminar(null);
    } catch (err) {
      openNotification(typeNotification.error, 'error occurs');
    }
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
        {role !== 'audience' && <DrawerForm fetchSeminar={fetchSeminar} />}
      </Toolbar>
      <div className='contentWrapper'>
        <div className='card-list'>
          {seminars &&
            seminars?.map((seminar) => (
              <Card
                key={seminar.authorName}
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
                      {seminar.status}
                    </Button>
                  )}
                  {role === 'audience' && <Button>Join</Button>}
                </div>
              </Card>
            ))}
        </div>
      </div>
    </Layout>
  );
}

export default SeminarPage;
