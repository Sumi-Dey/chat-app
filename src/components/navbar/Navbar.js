import React from 'react';
import './Navbar.css';
import logo from '../../assets/logo.png';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';

const Navbar = () => {
  
  return (
    <div className='nav'>
      <div className='nav-left'>
        <img src={logo} alt='...' className='nav-logo'/>
      </div>
      <div className='nav-right'>
        <button className='btn' onClick={()=>signOut(auth)}>Logout</button>
      </div>
    </div>
  )
}

export default Navbar
