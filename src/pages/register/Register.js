import React, { useState } from 'react';
import './Register.css';
import { BsFillImageFill } from 'react-icons/bs';
import { HiUserCircle } from 'react-icons/hi';
import { MdEmail } from 'react-icons/md';
import { RiLockPasswordFill } from 'react-icons/ri';
import { RxCrossCircled } from 'react-icons/rx';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, storage, db } from '../../firebase'
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import logo from '../../assets/logo.png';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';


const Register = () => {
  const [err, setErr] = useState(false);
  const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault();
    const displayName = e.target[0].value
    const email = e.target[1].value
    const password = e.target[2].value
    const file = e.target[3].files[0];

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      const storageRef = ref(storage, displayName);

      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        (error) => {
          console.log(error)
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateProfile(res.user, {
              displayName: displayName,
              photoURL: downloadURL
            })
            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              displayName,
              email,
              photoURL: downloadURL
            });
            await setDoc(doc(db, "UserChat", res.user.uid), {});
            navigate('/')
          });
        }
      );
    } catch (error) {
      setErr(true)
    }
  }
  return (
    <div className='main'>
      {err && <div className='err'>
        <h3>{err && ("User already exist")} </h3>
        <RxCrossCircled size={19} className="cross" onClick={()=>setErr(false)} />
      </div>}
      <h1 className='reg-head'>Step into a world of endless conversations with Chatmosphere</h1>
      <p className='reg-tag'>Chatting just got better for you with us</p>
      <div className='register'>
        <div className='left-reg'>
          <img src={logo} alt='...' className='reg-logo' />
        </div>
        <div className='box'>
          <div className='right-reg'>
            <div className='head'>Create Account</div>
            <div className='logo'>Let's Chat</div>
            <form onSubmit={handleSubmit}>
              <div className='reg-form'>
                <div className='reg-input'><HiUserCircle size={26} className='icon' /><input type='text' placeholder='Your Name' /></div>
                <div className='reg-input'><MdEmail size={26} className='icon' /><input type='email' placeholder='Your Email' /></div>
                <div className='reg-input'><RiLockPasswordFill size={26} className='icon' /><input type='password' placeholder='Your Password' /></div>
                <input type='file' id='file' style={{ display: 'none' }} />
                <label htmlFor="file" className='r-label'>
                  <BsFillImageFill style={{ color: '#CE7777' }} size={23} />
                  <span>Add an avatar</span>
                </label>
                <button type='submit' className='btn'>Create Account</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register;
