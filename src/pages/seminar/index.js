<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import Toolbar from './../../Components/Toolbar';
import Layout from './../../Components/Layout';
import { Card } from 'antd';
import axiosClient from '../../apis';
=======
import React, { useEffect, useState } from "react";
import Toolbar from "./../../Components/Toolbar";
import Layout from "./../../Components/Layout";
import { Card } from "antd";
import axiosClient from "../../apis";
import DrawerForm from "./../../Components/addSeminar";

>>>>>>> addseminar_button
const { Meta } = Card;
function SeminarPage() {
  const [seminars, setSeminars] = useState([]);
  useEffect(() => {
    const fetchSeminar = async () => {
<<<<<<< HEAD
      const seminars = await axiosClient.get('/seminars');
=======
      const seminars = await axiosClient.get("/seminars");
>>>>>>> addseminar_button
      if (!seminars.empty) {
        setSeminars(seminars.data);
      }
    };
    fetchSeminar();
  }, []);
  return (
    <Layout>
<<<<<<< HEAD
      <Toolbar title='Seminar'>Filter</Toolbar>
      <div className='contentWrapper'>
=======
      <Toolbar title="Seminar">
        <DrawerForm />
      </Toolbar>
      <div className="contentWrapper">
>>>>>>> addseminar_button
        {/* <Card
          hoverable
          style={{ width: 240 }}
          cover={
            <img
              alt='example'
              src='https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png'
            />
          }
        >
          <Meta title='Europe Street beat' description='www.instagram.com' />
        </Card> */}
        {seminars &&
          seminars?.map((seminar) => (
            <p key={seminar.id}>
              {seminar.title}-{seminar.quantity}
            </p>
          ))}
      </div>
    </Layout>
  );
}

export default SeminarPage;
