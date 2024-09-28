import React, { useContext, useEffect, useState } from "react";
import "./Leftsidebar.css";
import assets from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db,logout } from "../../config/firebase";
import { appcontext } from "../../context/appcontext";
import { toast } from "react-toastify";

const Leftsidebar = () => {
  const navigate = useNavigate();
  const {
    userdata,
    chatdata,
    chatuser,
    messagesId,
    setchatuser,
    setmessagesId,
    chatvisible,
    setchatvisible,
  } = useContext(appcontext);
  const [user, setuser] = useState(null);
  const [search, setsearch] = useState(false);

  const inputhandler = async (e) => {
    try {
      const input = e.target.value;
      if (input) {
        setsearch(true);
        const userref = collection(db, "users");
        const q = query(userref, where("name", "==", input.toLowerCase()));
        const querySnapshot = await getDocs(q);
        if (
          !querySnapshot.empty &&
          querySnapshot.docs[0].data().id !== userdata.id
        ) {
          // console.log(querySnapshot);
          let userExist = false;
          let firstDoc = querySnapshot.docs[0];
          chatdata.map((user) => {
            if (user.rId === querySnapshot.docs[0].data().id) {
              userExist = true;
            }
          });
          if (!userExist) {
            // Access the first document
            // console.log(firstDoc.data());
            setuser(firstDoc.data());
          }
        } else {
          setuser(null);
        }
      } else {
        setsearch(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const addChat = async () => {
    const messageref = collection(db, "messages");
    const chatref = collection(db, "chats");
    try {
      const newmessageref = doc(messageref);
      await setDoc(newmessageref, {
        createAt: serverTimestamp(),
        messages: [],
      });

      await updateDoc(doc(chatref, user.id), {
        chatData: arrayUnion({
          messageId: newmessageref.id,
          lastmessage: "",
          rId: userdata.id,
          updatedAt: Date.now(),
          messageSeen: true,
        }),
      });
      await updateDoc(doc(chatref, userdata.id), {
        chatData: arrayUnion({
          messageId: newmessageref.id,
          lastmessage: "",
          rId: user.id,
          updatedAt: Date.now(),
          messageSeen: true,
        }),
      });

      const userSnap = await getDoc(doc(db, "users", user.id));
      const userData = userSnap.data();
      setchat({
        messageId: newmessageref.id,
        lastmessage: "",
        rId: user.id,
        updatedAt: Date.now(),
        messageSeen: true,
        userData: userData,
      });
      setsearch(false);
      setchatvisible(true);
    } catch (error) {
      console.log(error.message);
    }
  };
  const setchat = async (item) => {
    try {
      console.log(item);
      setmessagesId(item.messageId);
      setchatuser(item);
      const userchatref = doc(db, "chats", userdata.id);
      const userchatsnapshot = await getDoc(userchatref);
      const userchatdata = userchatsnapshot.data();
      const chatindex = userchatdata.chatData.findIndex(
        (c) => c.messageId === item.messageId
      );
      userchatdata.chatData[chatindex].messageSeen = true;
      await updateDoc(userchatref, {
        chatData: userchatdata.chatData,
      });
      setchatvisible(true);
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const updatechatuserdata = async () => {
      if (chatuser) {
        const userchatref = doc(db, "chats", chatuser.userData.id);
        const userchatsnapshot = await getDoc(userchatref);
        const userchatdata = userchatsnapshot.data();
        setchatuser((prev) => ({ ...prev, userData: userdata }));
      }
    };
  }, [chatdata]);
  return (
    <div className={`ls ${chatvisible ? "hidden" : ""}`}>
      <div className="ls-top">
        <div className="ls-nav">
          <img src={assets.logo} alt="logo" className="logo" />
          <div className="menu">
            <img src={assets.menu_icon} alt="menu" />
            <div className="menu-edit">
              <p
                onClick={() => {
                  navigate("/profile");
                }}
              >
                Edit profile
              </p>
              <hr />
              <p onClick={() => {
                  logout();
                }}>Log out</p>
            </div>
          </div>
        </div>
        <div className="search-bar">
          <img src={assets.search_icon} alt="search" width={16} />
          <input
            onChange={inputhandler}
            type="text"
            name=""
            placeholder="Search here..."
          />
        </div>
      </div>
      <div className="ls-list">
        {search && user ? (
          <div onClick={addChat} className="friends add-user">
            <img src={user.avathar} alt="" />
            <div>
              <p>{user.name}</p>
              <span>Hey there! I am using chatapp</span>
            </div>
          </div>
        ) : (
          chatdata.map((item, index) => {
            return (
              <div
                onClick={() => {
                  setchat(item);
                }}
                key={index}
                className={`friends ${
                  item.messageSeen || item.messageId === messagesId
                    ? ""
                    : "border"
                }`}
              >
                <img src={item.userData.avathar} alt="" />
                <div>
                  <p>{item.userData.name}</p>
                  <span>{item.lastmessage}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Leftsidebar;
