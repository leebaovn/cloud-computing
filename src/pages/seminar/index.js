import React, { useEffect, useState, useContext } from 'react';
import Toolbar from './../../Components/Toolbar';
import Layout from './../../Components/Layout';
import { Button, Card } from 'antd';
import axiosClient from '../../apis';
import DrawerForm from './../../Components/addSeminar';
import authContext from './../../contexts/auth/auth-context';
import './seminar.style.css';
const { Meta } = Card;
function SeminarPage() {
  const [seminars, setSeminars] = useState([]);
  const [authState, authDispatch] = useContext(authContext);
  const { role } = authState;
  useEffect(() => {
    const fetchSeminar = async () => {
      const seminars = await axiosClient.get('/seminars');
      if (!seminars.empty) {
        setSeminars(seminars.data);
      }
    };
    fetchSeminar();
  }, []);
  return (
    <Layout>
      <Toolbar title='Seminar'>{role !== 'audience' && <DrawerForm />}</Toolbar>
      <div className='contentWrapper'>
        {seminars &&
          seminars?.map((seminar) => (
            <Card
              key={seminar.id}
              hoverable
              style={{ width: 240 }}
              cover={<img alt='example' src={seminar.image} />}
            >
              <Meta title={seminar.title} description={seminar.description} />
              <div className='seminar__info'>
                <div>{`30/${seminar.quantity}`}</div>
                {role !== 'audience' && <Button>{seminar.status}</Button>}
                {role === 'audience' && <Button>Join</Button>}
              </div>
            </Card>
          ))}
      </div>
    </Layout>
  );
}

export default SeminarPage;
