import React, { useContext, useEffect, useState } from 'react';
import './Chat.css';
import { BsThreeDots } from 'react-icons/bs';
import { BsFillCameraVideoFill } from 'react-icons/bs';
import { MdCall } from 'react-icons/md';
import { ImAttachment } from 'react-icons/im';
import { BsFillEmojiSmileFill } from 'react-icons/bs';
import { IoMdDownload } from 'react-icons/io';
import { RiSendPlaneFill } from 'react-icons/ri';
import Messages from '../messages/Messages';
import { ChatContext } from '../../context/ChatContext';
import { doc, onSnapshot, updateDoc, arrayUnion, Timestamp, serverTimestamp } from 'firebase/firestore';
import { db, storage } from '../../firebase';
import { v4 as uuid } from 'uuid';
import { AuthContext } from '../../context/AuthContext';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

const Chat = () => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages)
    })
    return () => { unsub() }
  }, [data.chatId])
  const handleSend = async () => {
    if (img) {
      const storageRef = ref(storage, uuid());

      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        (error) => {
          //TODO:Handle Error
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL,
              }),
            });
          });
        }
      );
    } else {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
    }

    await updateDoc(doc(db, "UserChat", currentUser.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(db, "UserChat", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });
    setText("");
    setImg(null)
  };
  return (
    <>
      <div className='chat'>
        {data?.user.displayName?(<div className='chat-nav'>
          <div className='chat-nav-left'>
            <div><img src={data?.user?.photoURL} className='chat-img' alt='...' /></div>
            <div className='chat-name'><span>{data?.user?.displayName} </span></div>
          </div>
          <div className='chat-nav-right'>
            <MdCall className='chat-icon' size={25} />
            <BsFillCameraVideoFill className='chat-icon' size={25} />
            <BsThreeDots className='chat-icon' size={25} />
          </div>
        </div>):(<div className='no-chat-nav'></div>)}
        {data?.user.displayName?(<div className='main-chat'>
          {messages.map((m) => (<Messages message={m} key={m.id} />))}
        </div>):(<div className='no-msg'>Please select user for chat</div>)}
        {data?.user.displayName?(<div className='chat-box'>
          <input type='file' id='file' style={{ display: 'none' }} onChange={(e) => setImg(e.target.files[0])} />
          <label htmlFor="file" className='chat-icon'>
            <ImAttachment size={21} />
          </label>
          <input type='text' placeholder='Type a messege here...' className='text' onChange={(e) => setText(e.target.value)} value={text}
          />
          <BsFillEmojiSmileFill size={21} className='chat-icon' />
          <IoMdDownload size={21} className='chat-icon' />
          <RiSendPlaneFill size={45} className='chat-send' onClick={handleSend} />
        </div>):(<div className='no-chat-nav'></div>)}
      </div>
      {/* (<div className='no-msg'>Select user for chat</div>) */}
    </>
  )
}

export default Chat
