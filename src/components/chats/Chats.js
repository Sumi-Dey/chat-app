import React, { useContext, useEffect, useState } from 'react';
import './Chats.css';
import { AiOutlineSearch } from 'react-icons/ai';
import { collection, doc, getDoc, getDocs, onSnapshot, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from '../../firebase';
import { AuthContext } from "../../context/AuthContext"
import { ChatContext } from '../../context/ChatContext';

const Chats = () => {
    const [username, setUsername] = useState("");
    const [user, setUser] = useState(null);
    const [err, setErr] = useState(false);
    const [chats, setChats] = useState([])
    const { currentUser } = useContext(AuthContext);
    const { dispatch } = useContext(ChatContext);

    const handleSearch = async () => {
        const q = query(collection(db, "users"), where("displayName", "==", username));

        try {
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                setUser(doc.data())
            });
        } catch (error) {
            setErr(true)
        }
    }

    const handleKey = (e) => {
        e.code === "Enter" && handleSearch();
    }

    const handleSelect = async (u) => {
        //Check the user is exist or not
        dispatch({ type: "CHANGE_USER", payload: u });
        const combinedId = currentUser.uid > user.uid ? currentUser.uid + user.uid : user.uid + currentUser.uid
        try {
            const res = await getDoc(doc(db, "chats", combinedId))
            if (!res.exists()) {

                //create new user chats collection
                await setDoc(doc(db, "chats", combinedId), { messages: [] })
                //create new user chat
                await updateDoc(doc(db, "UserChat", currentUser.uid), {
                    [combinedId + ".userInfo"]: {
                        uid: user.uid,
                        displayName: user.displayName,
                        photoURL: user.photoURL
                    },
                    [combinedId + ".date"]: serverTimestamp()
                })
                await updateDoc(doc(db, "UserChat", user.uid), {
                    [combinedId + ".userInfo"]: {
                        uid: currentUser.uid,
                        displayName: currentUser.displayName,
                        photoURL: currentUser.photoURL
                    },
                    [combinedId + ".date"]: serverTimestamp()
                })
            }
        } catch (error) { }
        setUser(null)
        setUsername("")
    }

    useEffect(() => {
        const getChats = () => {
            const unsub = onSnapshot(doc(db, "UserChat", currentUser.uid), (doc) => {
                setChats(doc.data());
            });

            return () => {
                unsub();
            };
        };

        currentUser.uid && getChats();
    }, [currentUser.uid]);

    const handleClick = (u) => {
        dispatch({ type: "CHANGE_USER", payload: u });
    };

    return (
        <div className='chats'>
            <h1>Chats</h1>
            <div className='search'>
                <AiOutlineSearch className='search-input' size={20} />
                <input type='search' className='search-field' placeholder='Search' onKeyDown={handleKey} onChange={(e) => setUsername(e.target.value)} value={username} />
            </div>

            {/* SEARCHED USER **********************************************************/}
            {err && "User Not Found"}
            {user && <div className='left-chat-view' onClick={()=>handleSelect(user)}>
                <div>
                    <img src={user?.photoURL} alt='...' className='user-img' />
                </div>
                <div className='msg-field'>
                    <h5>{user?.displayName}</h5>
                    <p >Lorem ipsum dolor sit amet, </p>
                </div>
                <div className='time-field'>
                    <div className='time'>3:45pm</div>
                    <div className='msg-count'>1</div>
                </div>
            </div>}
            <hr />

            {/* OTHER USERS *******************************************************************/}
            {chats?(Object.entries(chats)?.sort((a,b)=>b[1].date-a[1].date)?.map((chat) => (
                <div className='left-chat-view' key={chat[0]}
                onClick={() => handleClick(chat[1]?.userInfo)}  >
                    <div className='short-chat'>
                        <img src={chat[1]?.userInfo?.photoURL} alt='...' className='user-img' />
                        <div className='msg-field'>
                            <h5>{chat[1]?.userInfo?.displayName} </h5>
                            <p >{chat[1]?.lastMessage?.text} </p>
                        </div>
                    </div>
                    <div className='time-field'>
                        <div className='time'>3:45pm</div>
                        <div className='msg-count'>1</div>
                    </div>
                </div>))):(<div className='no-user'>Search the users</div>)}
        </div>
    )
}

export default Chats
