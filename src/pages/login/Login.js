import React, { useState } from 'react';
import '../register/Register.css';
import logo from '../../assets/logo.png';
import { HiUserCircle } from 'react-icons/hi';
import { MdEmail } from 'react-icons/md';
import { RiLockPasswordFill } from 'react-icons/ri';
import { RxCrossCircled } from 'react-icons/rx';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [err, setErr] = useState(false);
  const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault();
    const displayName = e.target[0].value
    const email = e.target[1].value
    const password = e.target[2].value;

    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate("/")
    }
    catch (error) {
      setErr(true)
    }
  }

  return (
    <div className='main'>
      {err && <div className='err'>
        <h3>{err && ("Something went wrong please give valid information")} </h3>
        <RxCrossCircled size={19} className="cross" onClick={()=>setErr(false)} />
      </div>}
      <h1 className='reg-head'>Step into a world of endless conversations with Chatmosphere</h1>
      <p className='reg-tag'>Chatting just got better for you with us</p>
      <div className='register'>
        <div className='left-reg'>
          <img src={logo} alt='...' className='reg-logo' />
        </div>
        <div className='box' style={{ height: "425px" }}>
          <div className='right-reg'>
            <div className='head'>Login</div>
            <div className='logo'>Let's Chat</div>
            <form onSubmit={handleSubmit}>
              <div className='reg-form'>
                <div className='reg-input'><HiUserCircle size={26} className='icon' /><input type='text' placeholder='Your Name' /></div>
                <div className='reg-input'><MdEmail size={26} className='icon' /><input type='email' placeholder='Your Email' /></div>
                <div className='reg-input'><RiLockPasswordFill size={26} className='icon' /><input type='password' placeholder='Your Password' /></div>
                <button className='btn' style={{ marginTop: "15px" }}>Login</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login;
