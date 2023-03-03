import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Chats from '../chats/Chats';
import './Sidebar.css';

const Sidebar = () => {
  const {currentUser} = useContext(AuthContext)
  return (
    <div className='sidebar'>
      {currentUser?(<div className='side-nav'>
        <p className='user-name'>{currentUser?.displayName}</p>
        <img src={currentUser?.photoURL ? (currentUser?.photoURL) : ("https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8cHJvZmlsZXxlbnwwfHwwfHw%3D&w=1000&q=80")} className='user-img' alt='...'/>
      </div>):(<div>Please register or login</div>)}
      <Chats/>
    </div>
  )
}

export default Sidebar;
