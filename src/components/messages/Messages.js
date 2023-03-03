import React, {useContext, useEffect, useRef} from 'react';
import {AuthContext} from "../../context/AuthContext"
import {ChatContext} from "../../context/ChatContext"
import './Messages.css';

const Messages = ({message}) => {
  const {currentUser} = useContext(AuthContext)
  const {data} = useContext(ChatContext)
  const ref = useRef()
  useEffect(()=>{
    ref.current?.scrollIntoView({behavior: "smooth"})
  },[message])

  return (
    <div className='scroll'>
    <div className={message.senderId === currentUser.uid ? "messages " :"messages owner"} ref={ref} >
      <div className='msg-info'>
      {message?.text &&<div className={message.senderId === currentUser.uid ?"user-send-text receiver-text":"user-send-text owner-text"}>{message.text}</div>}
        <div className='user-send-msg'>
        {message?.img && <img src={message?.img} alt='...'/>}
        </div>
      </div>
      <div className='msg-user'>
        <img src={message.senderId === currentUser.uid?currentUser.photoURL:data?.user.photoURL} className='chat-img' alt='...'/>
        <p>Just now</p>
      </div>
    </div>
    </div>
  )
}

export default Messages
