import React from 'react';
import './Home.css';
import Navbar from '../../components/navbar/Navbar';
import Sidebar from '../../components/sidebar/Sidebar';
import Chat from '../../components/chat/Chat';

const Home = () => {
  return (
    <div>
      <Navbar/>
      <div className='container'>
        <Sidebar/>
        <Chat/>
      </div>
    </div>
  )
}

export default Home
